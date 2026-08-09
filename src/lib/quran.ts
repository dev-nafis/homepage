import quran from '../data/quran.json';
import type { QuranChapter } from '../types';

export const chapters = quran as QuranChapter[];

export function slugifyChapter(chapter: QuranChapter) {
  return chapter.transliteration
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getChapterBySlug(slug: string) {
  return chapters.find((chapter) => slugifyChapter(chapter) === slug);
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}
