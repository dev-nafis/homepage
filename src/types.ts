export type VerseCue = {
  verse: number;
  start: number;
  end?: number;
};

export type Recitation = {
  id: string;
  surahId: number;
  title: string;
  titleArabic: string;
  audio: string;
  duration: number;
  publishedAt: string;
  featured: boolean;
  downloadable: boolean;
  cues: VerseCue[];
};

export type QuranVerse = {
  id: number;
  text: string;
  translation: string;
};

export type QuranChapter = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  verses: QuranVerse[];
};

export type Video = {
  id: string;
  title: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  embedId?: string;
  url: string;
  thumbnail: string;
  category: string;
  publishedAt: string;
  duration?: string;
  featured: boolean;
};

export type CharityCampaign = {
  id: string;
  organisation: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  imageAlt: string;
  verifiedAt: string;
  expiresAt: string;
  active: boolean;
};
