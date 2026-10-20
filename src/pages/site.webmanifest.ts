import type { APIRoute } from 'astro';
import site from '../site.config.ts';
import { url } from '../lib/url.ts';
// Built as a route so start_url and icon paths follow the base path (GitHub Pages sub-path or domain root).
export const GET: APIRoute = () =>
  new Response(JSON.stringify({
    name: site.name,
    short_name: site.shortName,
    description: 'Rebar weight calculator for bar #3 to #18 in pounds, kilograms and tons.',
    start_url: url(),
    scope: url(),
    display: 'standalone',
    background_color: '#f7f6f2',
    theme_color: site.brand,
    icons: [
      { src: url('icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: url('icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: url('icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2), { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } });
