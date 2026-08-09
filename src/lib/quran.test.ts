import { describe, expect, it } from 'vitest';
import { chapters, getChapterBySlug, slugifyChapter } from './quran';

describe('Qur’an snapshot', () => {
  it('contains the complete ordered Qur’an', () => {
    expect(chapters).toHaveLength(114);
    expect(chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0)).toBe(6236);
  });

  it('creates stable Surah routes', () => {
    expect(slugifyChapter(chapters[0])).toBe('al-fatihah');
    expect(getChapterBySlug('al-alaq')?.id).toBe(96);
  });
});
