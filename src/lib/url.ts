// Builds site paths that work at the domain root and under a sub-path (GitHub Pages: /<slug>/).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${BASE}/${path.replace(/^\//, '')}`;
// Path of the current page without the base, for canonical links.
export const stripBase = (pathname: string) => (BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname);
