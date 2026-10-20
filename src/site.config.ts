// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Rebar Weight Calculator',    // shown in footer, title, legal pages
  shortName: 'Rebar Weight',          // shown in the header next to the logo
  domain: 'rebarweightcalculator.com',
  cloudflareProject: 'rebar-weight-calculator',
  keyword: 'rebar weight calculator', // main keyword: goes in the H1 and title
  keywords: ['rebar weight', 'rebar weight chart', 'rebar weight per foot', 'rebar weight per foot table', 'rebar sizes', '#4 rebar weight', 'rebar takeoff', 'ASTM A615 rebar weight', 'rebar weight per meter'],
  tagline: 'Bar #3 to #18 in lb, kg and tons',
  homeTitle: 'Rebar Weight Calculator: #3 to #18 in lb, kg, tons', // under 60 characters
  description:
    'Free rebar weight calculator. Enter bar size, length and quantity to get total lb, kg and tons. ASTM A615 weights, metric bars, copy or print the list.',
  email: 'hello@rebarweightcalculator.com',
  ga4: '',
  adsense: '',
  brand: '#b91c1c',
  skin: 'swiss',                      // visual skin: minimal, swiss, clay or retro
  locale: 'en-US',
  ogImage: '/og.png',
  category: 'UtilitiesApplication',
  owner: 'Rebar Weight Calculator',
};
