# Nafis Al-Muhsin — official website

A static Astro/TypeScript website for Nafis Al-Muhsin: Qur’an reader, recitation player, video collection, creator story, and privacy-conscious contact journey.

## Local development

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run validate       # validate Qur’an, recitations, videos, and campaigns
npm test               # unit tests
npm run build          # validated production build into dist/
npm run preview        # preview the generated site
npm run sync:quran     # credentialed Quran Foundation snapshot refresh
npm run sync:youtube   # refresh the curated YouTube playlist snapshot
```

Normal builds are fully static and never call the Quran Foundation API. The checked-in snapshot is validated before every production build.

## Production configuration

Copy `.env.example` to `.env` for local work. Do not commit `.env` files.

- `PUBLIC_FORMSPREE_ENDPOINT`: optional complete Formspree form URL. Until it is configured, the contact form remains visibly disabled and visitors are directed to social channels.
- `PUBLIC_PLAUSIBLE_DOMAIN`: Plausible domain, normally `nafisalmuhsin.com`.
- `QF_CLIENT_ID`, `QF_CLIENT_SECRET`, `QF_TRANSLATION_ID`: server-side sync credentials only; never exposed to browser code.
- `QF_ENV`: optional `production` (default) or `prelive`.
- `YOUTUBE_PLAYLIST_ID`: the public playlist used by the live privacy-enhanced playlist player. It defaults to Nafis's Popular Videos playlist.
- `YOUTUBE_MAX_VIDEOS`: optional synchronization limit, defaulting to 12.

When you are ready to enable contact submissions, add the Formspree URL as an Actions secret named `PUBLIC_FORMSPREE_ENDPOINT` and set `REQUIRE_FORMSPREE=true` in the deployment environment. Add `PUBLIC_PLAUSIBLE_DOMAIN` as a repository variable when analytics is ready. The playlist ID is checked into the deployment workflow.

## Content workflow

### Add a recitation

1. Place the MP3 in `public/media/audio/`.
2. Add a unique record to `src/content/recitations.json` with its Surah ID, measured duration, publication date, and download permission.
3. Add one ordered cue per ayah when timings have been verified by listening. Use seconds from the beginning of the file. Do not publish silence-detection guesses as verified cues.
4. Run `npm run validate`, `npm test`, and `npm run build`.

The player and Surah reader automatically discover the recording and cue data.

### Add a video

Maintain the public Popular Videos playlist at YouTube; the live playlist player reads it directly, so additions and ordering changes do not require a website edit. It loads only after visitor interaction. `npm run sync:youtube` also refreshes the local fallback cards when YouTube exposes an XML feed for the playlist; otherwise it safely keeps the last validated snapshot.

Videos can still be added manually in `src/content/videos.json`. YouTube entries use the video ID in `embedId`; privacy-enhanced embeds load only after a visitor clicks the preview.

### Reflections (deferred)

Reflection drafts remain in `src/content/blog/` for future development, but the journal is not currently published or linked from the website.

### Add a charity campaign

Add an entry to `src/content/charities.json` with organization, destination URL, local or trusted image, verification date, expiry date, and `active: true`. The validator rejects unsafe URLs and invalid date ranges. Expired or inactive campaigns disappear automatically. The website links to the vetted organization and never processes donations.

### Refresh the Qur’an snapshot

Set the Quran Foundation credentials in the shell, then run:

```bash
npm run sync:quran
npm run validate
```

The sync script verifies the configured translation resource still exists and refuses to silently swap translations. Review the generated attribution in `src/data/quran-source.json` before committing.

## Deployment

The GitHub Pages workflow tests and builds the site, audits the artifact, and uploads only `dist/`. `CNAME` lives in `public/` and is copied into the artifact. Configure Pages to use **GitHub Actions**, not branch-folder deployment.

Legacy files and the unrelated `WebDesign/` projects are intentionally not part of Astro’s source tree and never enter the deployment artifact. See `SECURITY_AUDIT.md` for the repository exposure review.

## Pre-launch editorial checklist

- Supply and test the Formspree endpoint and provider spam controls.
- Supply the Plausible domain.
- Listen through all three recordings and enter/verify every verse cue.
- Review Qur’anic Arabic and English text against the attributed source.
- Confirm social destinations, biography, dates, and download permissions with Nafis.
- Add an active charity only after verifying the organization, URL, dates, and image rights.
- Review keyboard navigation, screen-reader output, mobile layouts, and audio behavior on real devices.
