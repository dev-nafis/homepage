import { withBase } from '../lib/route';

export const site = {
  name: 'Nafis Al-Muhsin',
  domain: 'nafisalmuhsin.com',
  url: 'https://nafisalmuhsin.com',
  title: 'Nafis Al-Muhsin — Qur’an Reciter',
  description: 'Listen to Qur’an recitations by Nafis Al-Muhsin, follow every ayah with English translation, and discover his latest visual Qur’an videos.',
  email: '',
  socials: [
    { name: 'Instagram', handle: '@nafisalmuhsin', url: 'https://www.instagram.com/nafisalmuhsin', icon: 'instagram' },
    { name: 'YouTube', handle: '@nafis_almuhsin', url: 'https://www.youtube.com/@nafis_almuhsin', icon: 'youtube' },
    { name: 'TikTok', handle: '@nafis_almuhsin', url: 'https://www.tiktok.com/@nafis_almuhsin', icon: 'tiktok' },
    { name: 'Spotify', handle: 'Nafis Al-Muhsin', url: 'https://open.spotify.com/artist/7tboStjFJ0EZRaPlQeJLVa', icon: 'spotify' }
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Listen', href: withBase('/quran/') },
    { label: 'Videos', href: withBase('/videos/') },
    { label: 'About', href: withBase('/about/') },
    { label: 'Contact', href: withBase('/contact/') }
  ]
} as const;
