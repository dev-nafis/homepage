import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { QuranChapter, QuranVerse } from '../src/types';

const clientId = process.env.QF_CLIENT_ID;
const clientSecret = process.env.QF_CLIENT_SECRET;
const translationId = process.env.QF_TRANSLATION_ID;
const environment = process.env.QF_ENV === 'prelive' ? 'prelive' : 'production';

if (!clientId || !clientSecret || !translationId) {
  throw new Error('Set QF_CLIENT_ID, QF_CLIENT_SECRET, and QF_TRANSLATION_ID before refreshing the Qur’an snapshot. The existing checked-in snapshot remains buildable without credentials.');
}

const authBase = environment === 'production' ? 'https://oauth2.quran.foundation' : 'https://prelive-oauth2.quran.foundation';
const apiBase = environment === 'production' ? 'https://apis.quran.foundation' : 'https://apis-prelive.quran.foundation';

async function getToken() {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${authBase}/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'content' })
  });
  if (!response.ok) throw new Error(`Quran Foundation token request failed (${response.status}).`);
  return (await response.json() as { access_token: string }).access_token;
}

const token = await getToken();
async function qf(path: string) {
  const response = await fetch(`${apiBase}${path}`, { headers: { 'x-auth-token': token, 'x-client-id': clientId } });
  if (!response.ok) throw new Error(`Quran Foundation request failed (${response.status}) for ${path}.`);
  return response.json() as Promise<any>;
}

const chapterResponse = await qf('/content/api/v4/chapters?language=en');
const translationResponse = await qf('/content/api/v4/resources/translations?language=en');
const translationResource = translationResponse.translations?.find((item: any) => String(item.id) === String(translationId));
if (!translationResource) throw new Error(`Translation resource ${translationId} is unavailable. Refusing to silently substitute another translation.`);

const output: QuranChapter[] = [];
for (const item of chapterResponse.chapters) {
  const verses: QuranVerse[] = [];
  const pageSize = 50;
  for (let page = 1; verses.length < item.verses_count; page++) {
    const response = await qf(`/content/api/v4/verses/by_chapter/${item.id}?language=en&words=false&translations=${translationId}&fields=text_uthmani&per_page=${pageSize}&page=${page}`);
    for (const verse of response.verses) {
      verses.push({ id: verse.verse_number, text: verse.text_uthmani, translation: String(verse.translations?.[0]?.text || '').replace(/<[^>]+>/g, '') });
    }
  }
  output.push({
    id: item.id,
    name: item.name_arabic,
    transliteration: item.name_simple,
    translation: item.translated_name?.name || item.name_simple,
    type: item.revelation_place === 'madinah' ? 'medinan' : 'meccan',
    total_verses: item.verses_count,
    verses
  });
  console.log(`Fetched ${item.id}/114: ${item.name_simple}`);
}

const root = resolve(import.meta.dirname, '..');
await writeFile(resolve(root, 'src/data/quran.json'), `${JSON.stringify(output)}\n`, 'utf8');
await writeFile(resolve(root, 'src/data/quran-source.json'), `${JSON.stringify({
  provider: 'Quran Foundation Content API',
  providerUrl: 'https://api-docs.quran.foundation/',
  version: 'v4',
  license: 'Per Quran Foundation resource terms',
  arabicSource: 'Quran Foundation',
  translation: translationResource.name,
  translator: translationResource.author_name || translationResource.name,
  language: translationResource.language_name,
  resourceId: Number(translationId),
  syncedAt: new Date().toISOString(),
  environment
}, null, 2)}\n`, 'utf8');
console.log('Qur’an snapshot refreshed. Run npm run validate before committing it.');
