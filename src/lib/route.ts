const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Builds an internal URL that remains inside the /newsite preview route. */
export function withBase(path = '/') {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
