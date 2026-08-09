import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Video } from '../src/types';

const playlistId = process.env.YOUTUBE_PLAYLIST_ID || 'PLSw26XuZVejA';
const maximum = Math.min(50, Math.max(1, Number(process.env.YOUTUBE_MAX_VIDEOS || 12)));

function decodeXml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function match(entry: string, expression: RegExp) {
  return decodeXml(entry.match(expression)?.[1]?.trim() || '');
}

const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`);
if (!response.ok) {
  console.warn(`YouTube's public XML feed returned ${response.status}; keeping the existing card snapshot. The live privacy-enhanced playlist embed still updates directly from YouTube.`);
  process.exit(0);
}

const xml = await response.text();
const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, maximum);
if (!entries.length) {
  throw new Error('The configured playlist did not return any public videos. The existing snapshot was not changed.');
}

const synchronized: Video[] = entries.flatMap(([, entry], index) => {
  const videoId = match(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
  const title = match(entry, /<title>([\s\S]*?)<\/title>/);
  const publishedAt = match(entry, /<published>([^<]+)<\/published>/);
  if (!videoId || !title || !publishedAt) return [];

  return [{
    id: `youtube-${videoId}`,
    title,
    platform: 'youtube' as const,
    embedId: videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    category: 'Popular on YouTube',
    publishedAt,
    featured: index < 6
  }];
});

if (!synchronized.length) {
  throw new Error('No usable public videos were found. The existing snapshot was not changed.');
}

const root = resolve(import.meta.dirname, '..');
const target = resolve(root, 'src/content/videos.json');
const existing = JSON.parse(await readFile(target, 'utf8')) as Video[];
const nonYouTube = existing.filter((video) => video.platform !== 'youtube');
await writeFile(target, `${JSON.stringify([...synchronized, ...nonYouTube], null, 2)}\n`, 'utf8');
console.log(`Synchronized ${synchronized.length} videos from YouTube playlist ${playlistId}.`);
