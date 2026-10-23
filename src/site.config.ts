// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
// SITE_MODE=bingemind builds the public copy at bingemind.com/<slug>/.
const bingemind = process.env.SITE_MODE === 'bingemind';
export default {
  name: 'Rebar Weight Calculator',    // shown in footer, title, legal pages
  shortName: 'Rebar Weight',          // shown in the header next to the logo
  domain: 'bingemind.com/rebar-weight-calculator',   // canonical host + path, no https://. Sites live at bingemind.com/<slug>/
  cloudflareProject: 'rebar-weight-calculator',
  keyword: 'rebar weight calculator', // main keyword: goes in the H1 and title
  keywords: ['rebar weight', 'rebar weight chart', 'rebar weight per foot', 'rebar weight per foot table', 'rebar sizes', '#4 rebar weight', 'rebar takeoff', 'ASTM A615 rebar weight', 'rebar weight per meter'],
  tagline: 'Bar #3 to #18 in lb, kg and tons',
  homeTitle: 'Rebar Weight Calculator and Chart: Weight Per Foot', // under 60 characters
  description:
    'Free rebar weight calculator and rebar weight chart. Enter bar size, length and quantity for total lb, kg and tons. ASTM A615 weight per foot, #3 to #18.',
  email: 'hello@rebarweightcalculator.com',
  // Bingemind build (SITE_MODE=bingemind): owner is Bingemind, contact goes to the Bingemind contact section (no invented email).
  bingemind,
  contactHref: bingemind ? 'https://bingemind.com/#contact' : 'mailto:' + 'hello@rebarweightcalculator.com',
  contactLabel: bingemind ? 'bingemind.com/#contact' : 'hello@rebarweightcalculator.com',
  contactLead: bingemind ? 'Contact:' : 'Email:',
  ga4: '',
  adsense: '',
  brand: '#b91c1c',
  skin: 'swiss',                      // visual skin: minimal, swiss, clay or retro
  locale: 'en-US',
  ogImage: '/og.png',
  category: 'UtilitiesApplication',
  owner: bingemind ? 'Bingemind (Abhishek Mishra)' : 'Rebar Weight Calculator',
};
