import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const cueSchema = z.object({
  verse: z.number().int().positive(),
  start: z.number().nonnegative(),
  end: z.number().positive().optional()
});

const recitations = defineCollection({
  loader: file('src/content/recitations.json'),
  schema: z.object({
    surahId: z.number().int().min(1).max(114),
    title: z.string(),
    titleArabic: z.string(),
    audio: z.string(),
    duration: z.number().positive(),
    publishedAt: z.coerce.date(),
    featured: z.boolean(),
    downloadable: z.boolean(),
    cues: z.array(cueSchema)
  })
});

const videos = defineCollection({
  loader: file('src/content/videos.json'),
  schema: z.object({
    title: z.string(),
    platform: z.enum(['youtube', 'instagram', 'tiktok']),
    embedId: z.string().optional(),
    url: z.string().url(),
    thumbnail: z.string(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    duration: z.string().optional(),
    featured: z.boolean()
  })
});

const charities = defineCollection({
  loader: file('src/content/charities.json'),
  schema: z.object({
    organisation: z.string(),
    title: z.string(),
    summary: z.string(),
    url: z.string().url(),
    image: z.string(),
    imageAlt: z.string(),
    verifiedAt: z.coerce.date(),
    expiresAt: z.coerce.date(),
    active: z.boolean()
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string().min(3),
    description: z.string().min(20),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    topic: z.enum(['Qur’an reflection', 'Hadith', 'Faith today', 'From Nafis']),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { recitations, videos, charities, blog };
