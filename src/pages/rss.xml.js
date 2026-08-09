import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { chapters, slugifyChapter } from '../lib/quran';
import { withBase } from '../lib/route';

export async function GET(context) {
  const recitations = await getCollection('recitations');
  return rss({
    title: 'Nafis Al-Muhsin Qur’an Recitations',
    description: 'New original Qur’an recitations by Nafis Al-Muhsin.',
    site: context.site,
    items: recitations
      .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
      .map((entry) => {
        const chapter = chapters.find((item) => item.id === entry.data.surahId);
        return {
          title: entry.data.title,
          description: `Listen to ${entry.data.title} and follow the Arabic with English translation.`,
          pubDate: entry.data.publishedAt,
          link: withBase(`/quran/${chapter ? slugifyChapter(chapter) : entry.id}/`)
        };
      })
  });
}
