# Repository exposure audit

Reviewed during the Astro migration on 2026-08-05.

## Findings

The previous root website is retained only in `legacy-site-backup/` for rollback. The unrelated `WebDesign/` projects, including their server-side data and development artifacts, have been removed from this repository and are not part of the website.

They were not deleted because they may belong to separate user projects. They must never be deployed publicly.

## Controls implemented

- GitHub Pages uploads only the generated `dist/` directory.
- The build reads only `src/` and `public/`; `WebDesign/` is not copied.
- The deployment workflow fails if `dist/` contains `WebDesign` or database, log, cache, compiled Python, or environment files.
- `.gitignore` excludes databases, logs, caches, environment files, build output, editor artifacts, and test reports from future additions.
- Quran Foundation credentials are read only by the server-side sync script and are never included in browser bundles.
- Contact messages go directly to Formspree; Plausible receives aggregate event names only.

## Maintainer follow-up

Repository history can still contain files even after they are ignored or removed. Before making the repository public, inspect the full Git history for credentials, personal data, databases, logs, and documents. Rotate any credential ever committed. If history must be rewritten, coordinate it as a separate, explicitly approved operation because it affects every clone and contributor.

The safest long-term boundary is to move unrelated applications into separate private repositories, then remove their tracked copies here in a dedicated reviewed change.
