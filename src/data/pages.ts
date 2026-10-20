// The 10 extra pages. Each one answers one search question and opens the calculator on that case.
// Numbers on each page come from src/lib/rebar.js; only the hand-written parts live here.
export type SizePage = {
  kind: 'size';
  slug: string;
  mode: 'imperial' | 'metric';
  bar: string; // bar id in rebar.js
  h1: string;
  title: string;
  description: string;
  uses: string[];
  faq: { q: string; a: string };
};
export type OtherPage = { kind: 'chart' | 'tons'; slug: string; h1: string; title: string; description: string };
export type PageDef = SizePage | OtherPage;

export const pages: PageDef[] = [
  {
    kind: 'size', slug: '3-rebar-weight-per-foot', mode: 'imperial', bar: '3',
    h1: '#3 rebar weight per foot', title: '#3 Rebar Weight Per Foot: 0.376 lb/ft, Calculator',
    description: 'A #3 rebar weighs 0.376 lb per foot. See weight by length, bars per ton and a calculator set to #3 bars.',
    uses: [
      'The #3 bar is the smallest size in common structural use. It is light and easy to bend, so it goes where the steel is thin and the loads are small. Typical jobs are stirrups and ties in beams and columns, light patio and walkway slabs, and vertical bars in masonry cells.',
      'Many builders buy #3 bars already bent to shape. Weigh each bent shape by its unfolded length, not by the box it fits in. The calculator above works from the unfolded length.',
    ],
    faq: { q: 'What is #3 rebar used for?', a: 'The #3 bar is used for stirrups, ties, light slabs, walkways and masonry cells. It is the lightest standard size, at 3/8 inch. Its metric name is M10.' },
  },
  {
    kind: 'size', slug: '4-rebar-weight-per-foot', mode: 'imperial', bar: '4',
    h1: '#4 rebar weight per foot', title: '#4 Rebar Weight Per Foot: 0.668 lb/ft, Calculator',
    description: 'A #4 rebar weighs 0.668 lb per foot, or 13.36 lb for a 20 ft bar. Weight by length, bars per ton and a #4 calculator.',
    uses: [
      'The #4 bar, at 1/2 inch, is one of the most common sizes on houses and small commercial work. Slabs on grade, driveways, footings, masonry walls and small retaining walls often call for it. The plans set the spacing.',
      'Because #4 is so common, yards stock it in many lengths and often sell it by the bundle. Ask the yard how many pieces are in a bundle before you convert a count to tons.',
    ],
    faq: { q: 'What is #4 rebar used for?', a: 'The #4 bar is used in slabs on grade, driveways, footings, masonry walls and stirrups. It is 1/2 inch in diameter. Its metric name is M13.' },
  },
  {
    kind: 'size', slug: '5-rebar-weight-per-foot', mode: 'imperial', bar: '5',
    h1: '#5 rebar weight per foot', title: '#5 Rebar Weight Per Foot: 1.043 lb/ft, Calculator',
    description: 'A #5 rebar weighs 1.043 lb per foot, or 20.86 lb for a 20 ft bar. Weight by length, bars per ton and a #5 calculator.',
    uses: [
      'The #5 bar, at 5/8 inch, steps up from the slab bars to the bars that carry load in beams, footings and foundation walls. It is a usual choice for grade beams, strip footings and lintels.',
      'A crew can still cut and bend this size with a hand bender or a small bar bender. A long piece is awkward to carry alone, so plan two people for 40 ft and 60 ft lengths.',
    ],
    faq: { q: 'What is #5 rebar used for?', a: 'The #5 bar is used in grade beams, strip footings, foundation walls and lintels. It is 5/8 inch in diameter. Its metric name is M16.' },
  },
  {
    kind: 'size', slug: '6-rebar-weight-per-foot', mode: 'imperial', bar: '6',
    h1: '#6 rebar weight per foot', title: '#6 Rebar Weight Per Foot: 1.502 lb/ft, Calculator',
    description: 'A #6 rebar weighs 1.502 lb per foot, or 30.04 lb for a 20 ft bar. Weight by length, bars per ton and a #6 calculator.',
    uses: [
      'The #6 bar, at 3/4 inch, is a main bar in beams, columns, retaining walls and thick slabs. An engineer picks #6 when a #5 would need too many bars to fit in the member. Fewer, larger bars save labor and leave more room for concrete to flow.',
      'Hand bending gets hard at this size. Many crews use a power bender, or order the bars bent by the supplier.',
    ],
    faq: { q: 'What is #6 rebar used for?', a: 'The #6 bar is used as a main bar in beams, columns, retaining walls and thick slabs. It is 3/4 inch in diameter. Its metric name is M19.' },
  },
  {
    kind: 'size', slug: '7-rebar-weight-per-foot', mode: 'imperial', bar: '7',
    h1: '#7 rebar weight per foot', title: '#7 Rebar Weight Per Foot: 2.044 lb/ft, Calculator',
    description: 'A #7 rebar weighs 2.044 lb per foot, or 40.88 lb for a 20 ft bar. Weight by length, bars per ton and a #7 calculator.',
    uses: [
      'The #7 bar, at 7/8 inch, shows up in heavy beams, columns, pile caps and thick mat foundations. Sizes from #7 up are more common on commercial and civil jobs than on houses.',
      'Check what the yard has in stock before you detail around a #7 bar. Some yards carry fewer lengths of it than of #5 or #6.',
    ],
    faq: { q: 'What is #7 rebar used for?', a: 'The #7 bar is used in heavy beams, columns, pile caps and mat foundations. It is 7/8 inch in diameter. Its metric name is M22.' },
  },
  {
    kind: 'size', slug: '8-rebar-weight-per-foot', mode: 'imperial', bar: '8',
    h1: '#8 rebar weight per foot', title: '#8 Rebar Weight Per Foot: 2.670 lb/ft, Calculator',
    description: 'A #8 rebar weighs 2.670 lb per foot, or 53.4 lb for a 20 ft bar. Weight by length, bars per ton and a #8 calculator.',
    uses: [
      'The #8 bar is exactly 1 inch in nominal diameter. It carries large loads in columns, pier caps, heavy beams and bridge parts.',
      'A 20 ft piece weighs 53.4 lb and a 60 ft piece weighs 160.2 lb. Plan the lifting before the bars arrive. Long pieces need two people, a lift or a crane.',
    ],
    faq: { q: 'What is #8 rebar used for?', a: 'The #8 bar is used in columns, pier caps, heavy beams and bridge elements. It is 1 inch in diameter. Its metric name is M25.' },
  },
  {
    kind: 'size', slug: '12mm-rebar-weight-per-meter', mode: 'metric', bar: 'D12',
    h1: '12 mm rebar weight per meter', title: '12 mm Rebar Weight Per Meter: 0.888 kg/m',
    description: 'A 12 mm rebar weighs 0.888 kg per meter, or 10.65 kg for a 12 m bar. Weight by length, bars per tonne and a 12 mm calculator.',
    uses: [
      'A 12 mm bar is one of the most used sizes in countries that buy rebar by diameter. Slabs, beams, stirrups and small columns often use it.',
      'In the US, no standard bar is exactly 12 mm. The nearest ASTM bar is M13, the same steel as a US #4, at 12.7 mm. It weighs 0.994 kg/m, about 12 percent more than a 12 mm bar. Do not swap the two without the engineer.',
      'Weight depends on the diameter, not on the steel grade. A 12 mm bar weighs the same in any grade.',
    ],
    faq: { q: 'What is the nearest US bar to 12 mm rebar?', a: 'The nearest ASTM bar is M13, which is a US #4 bar at 12.7 mm. It weighs 0.994 kg/m, while a 12 mm bar weighs 0.888 kg/m.' },
  },
  {
    kind: 'size', slug: '16mm-rebar-weight-per-meter', mode: 'metric', bar: 'D16',
    h1: '16 mm rebar weight per meter', title: '16 mm Rebar Weight Per Meter: 1.579 kg/m',
    description: 'A 16 mm rebar weighs 1.579 kg per meter, or 18.94 kg for a 12 m bar. Weight by length, bars per tonne and a 16 mm calculator.',
    uses: [
      'A 16 mm bar is a main bar in beams, columns and thick slabs in metric designs. It is a step up from the 12 mm bars used in lighter members.',
      'The nearest ASTM bar is M16, the same steel as a US #5, at 15.9 mm. It weighs 1.552 kg/m, about 2 percent less than a 16 mm bar. The difference is small, but a supplier quote should name the exact bar.',
      'Weight depends on the diameter, not on the steel grade. A 16 mm bar weighs the same in any grade.',
    ],
    faq: { q: 'What is the nearest US bar to 16 mm rebar?', a: 'The nearest ASTM bar is M16, which is a US #5 bar at 15.9 mm. It weighs 1.552 kg/m, while a 16 mm bar weighs 1.579 kg/m.' },
  },
  {
    kind: 'chart', slug: 'rebar-weight-chart', h1: 'Rebar weight chart',
    title: 'Rebar Weight Chart: #3 to #18, lb/ft and kg/m',
    description: 'Rebar weight chart for US bars #3 to #18 and metric bars. Diameter, area, lb per foot, kg per meter and weight per 20 ft bar. Print it.',
  },
  {
    kind: 'tons', slug: 'how-many-pieces-of-rebar-in-a-ton', h1: 'How many pieces of rebar in a ton',
    title: 'How Many Pieces of Rebar in a Ton: Chart by Size',
    description: 'How many rebar bars make a ton, by size and length. Chart for 20, 40 and 60 ft bars, short tons and metric tonnes, with the formula.',
  },
];
