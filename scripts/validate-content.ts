import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateCueOrder } from '../src/lib/content';
import type { CharityCampaign, QuranChapter, Recitation, Video } from '../src/types';

const root = resolve(import.meta.dirname, '..');
const readJson = <T>(path: string): T => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const failures: string[] = [];
const warnings: string[] = [];
const fail = (message: string) => failures.push(message);

const quran = readJson<QuranChapter[]>('src/data/quran.json');
const recitations = readJson<Recitation[]>('src/content/recitations.json');
const videos = readJson<Video[]>('src/content/videos.json');
const charities = readJson<CharityCampaign[]>('src/content/charities.json');

if (quran.length !== 114) fail(`Expected 114 Surahs, found ${quran.length}.`);
const verseKeys = new Set<string>();
let verseTotal = 0;
quran.forEach((chapter, index) => {
  if (chapter.id !== index + 1) fail(`Surah order/id mismatch at index ${index}.`);
  if (!/[\u0600-\u06ff]/u.test(chapter.name)) fail(`Surah ${chapter.id} is missing an Arabic name.`);
  if (chapter.verses.length !== chapter.total_verses) fail(`Surah ${chapter.id} declares ${chapter.total_verses} verses but contains ${chapter.verses.length}.`);
  chapter.verses.forEach((verse) => {
    const key = `${chapter.id}:${verse.id}`;
    if (verseKeys.has(key)) fail(`Duplicate verse key ${key}.`);
    verseKeys.add(key);
    if (!/[\u0600-\u06ff]/u.test(verse.text)) fail(`${key} is missing Arabic text.`);
    if (!verse.translation.trim()) fail(`${key} is missing its English translation.`);
    verseTotal++;
  });
});
if (verseTotal !== 6236) fail(`Expected 6,236 verses, found ${verseTotal}.`);

const recitationIds = new Set<number>();
recitations.forEach((recitation) => {
  if (recitationIds.has(recitation.surahId)) fail(`Multiple recitations target Surah ${recitation.surahId}.`);
  recitationIds.add(recitation.surahId);
  const chapter = quran.find((item) => item.id === recitation.surahId);
  if (!chapter) return fail(`Recitation ${recitation.id} references an unknown Surah.`);
  if (!existsSync(resolve(root, `public${recitation.audio}`))) fail(`Missing audio file ${recitation.audio}.`);
  if (!validateCueOrder(recitation.cues, recitation.duration)) fail(`Cue order or duration is invalid for ${recitation.id}.`);
  if (recitation.cues.length && recitation.cues.length !== chapter.total_verses) fail(`${recitation.id} has ${recitation.cues.length} cues for ${chapter.total_verses} verses.`);
  if (!recitation.cues.length) warnings.push(`${recitation.id} has no editorially verified verse cue map yet.`);
});

videos.forEach((video) => {
  if (video.platform === 'youtube' && !video.embedId) fail(`YouTube video ${video.id} needs an embedId.`);
  try { new URL(video.url); } catch { fail(`Video ${video.id} has an invalid URL.`); }
});

charities.forEach((campaign) => {
  if (new Date(campaign.expiresAt) <= new Date(campaign.verifiedAt)) fail(`Charity ${campaign.id} expires before it was verified.`);
  try { new URL(campaign.url); } catch { fail(`Charity ${campaign.id} has an invalid destination URL.`); }
});

const publicFiles = ['.db', '.sqlite', '.log', '.pyc', '.docx'];
publicFiles.forEach((extension) => {
  if (existsSync(resolve(root, `public/site${extension}`))) fail(`Forbidden ${extension} artifact exists in public/.`);
});

if (process.env.REQUIRE_FORMSPREE === 'true' && !process.env.PUBLIC_FORMSPREE_ENDPOINT) fail('PUBLIC_FORMSPREE_ENDPOINT is required when contact submissions are enabled.');
warnings.forEach((warning) => console.warn(`Warning: ${warning}`));
if (failures.length) {
  failures.forEach((failure) => console.error(`Error: ${failure}`));
  process.exit(1);
}
console.log(`Validated 114 Surahs, ${verseTotal.toLocaleString()} verses, ${recitations.length} recitations, ${videos.length} videos, and ${charities.length} charity campaigns.`);
