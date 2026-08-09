import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const legacyFiles = [
  'CNAME', 'Donate.jpeg', 'IMG_3443.jpeg', 'Size.css', 'darkmode.css', 'index.html', 'indexold.html',
  'instagram_logo.png', 'instagram_logo2.png', 'mobilefriendly.css', 'profile-picture.JPG', 'profile_picture.JPG',
  'spotify_logo.png', 'style.scss', 'surah_alaq.mp3', 'surah_balad.mp3', 'surah_fajr.mp3', 'tiktok_logo.png',
  'youtube_logo.png', 'youtube_logo2.png'
];

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

await rm(dist, { recursive: true, force: true });
run(process.execPath, [resolve(root, 'node_modules/astro/bin/astro.mjs'), 'build']);
await mkdir(dist, { recursive: true });
await Promise.all(legacyFiles.map((file) => cp(resolve(root, file), resolve(dist, file))));

console.log('Built the new Astro site at /newsite/ and retained the legacy root site at /.');
