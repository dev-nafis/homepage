const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Builds an internal URL using Astro's configured deployment base. */
export function withBase(path = '/') {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
