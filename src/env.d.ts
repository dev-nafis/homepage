/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORMSPREE_ENDPOINT?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly QF_CLIENT_ID?: string;
  readonly QF_CLIENT_SECRET?: string;
  readonly QF_TRANSLATION_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
