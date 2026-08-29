import type { Track } from '../types';
import { LINKS } from './links';

/**
 * The Operator's Guide, modelled from
 * `operators-guide-pixels-to-problem-solver.md` at the repo root.
 *
 * Nothing here is invented — every track, resource, person and action traces
 * back to a line in that file. URLs live in `links.ts`.
 */

export const GUIDE_TITLE = "The Operator's Guide: From Pixels to Problem-Solver";

export const GUIDE_PREMISE =
  "You're moving from execution (making the thing) to judgment (deciding what thing, for whom, and defending that call out loud). Craft you already have. What you're building now is the muscle to frame a problem, make a call on the spot, and change a mind in the room.";

export const GUIDE_CLOSER =
  'Consume less, apply more, and publish the applying. Reading about decisions doesn’t make you a decider — logged reps and defended calls do.';

/** Tracks in the order they appear in the guide. `month` is their rotation slot. */
export const TRACKS: Track[] = [
  {
    id: 'design-thinking',
    month: 11, // Nov
    title: 'Design Thinking & Problem Framing',
    premise:
      'The upstream skill. A perfect solution to the wrong problem scales the wrong thing.',
    action:
      'Before Figma opens, write the problem in one sentence — who, what job, what trigger. If you can’t, you’re not ready to design yet.',
    resources: [
      {
        kind: 'book',
        title: 'The Design of Everyday Things',
        by: 'Don Norman',
        url: LINKS.designOfEverydayThings,
        note: 'The foundation: affordances, mapping, why users fail and it’s not their fault.',
      },
      {
        kind: 'book',
        title: 'Change by Design',
        by: 'Tim Brown (IDEO)',
        url: LINKS.changeByDesign,
        note: 'Human-centered method from the people who named it.',
      },
      {
        kind: 'book',
        title: 'Sprint',
        by: 'Jake Knapp (GV)',
        url: LINKS.sprint,
        note: 'Problem → prototype → test in 5 days; teaches framing under hard constraint.',
      },
      {
        kind: 'watch',
        title: 'Stanford d.school design thinking crash courses',
        url: LINKS.dschoolYouTube,
        note: 'Free on YouTube — full workshops, not clips.',
      },
      {
        kind: 'watch',
        title: 'Juxtopposed',
        by: 'YouTube',
        url: LINKS.juxtopposedYouTube,
        note: 'Rebuilds real apps from the problem up. This is your weekly rep made visible.',
      },
      { kind: 'follow', title: 'Don Norman', url: LINKS.donNorman },
      { kind: 'follow', title: 'Juxtopposed', url: LINKS.juxtopposedYouTube },
    ],
  },
  {
    id: 'decision-making',
    month: 12, // Dec
    title: 'Decision-Making & Mental Models',
    premise: 'Becoming the person who can decide on the spot without flinching.',
    action:
      'Keep a decision log. Each real decision: the options, the one you picked, why, and what you’d check later to know if you were right. Review monthly. This is how “on the spot” gets earned — reps, not talent.',
    resources: [
      {
        kind: 'book',
        title: 'Thinking, Fast and Slow',
        by: 'Daniel Kahneman',
        url: LINKS.thinkingFastAndSlow,
        note: 'System 1 vs 2, and the biases quietly steering your calls.',
      },
      {
        kind: 'book',
        title: 'The Great Mental Models, Vol. 1',
        by: 'Shane Parrish / Farnam Street',
        url: LINKS.greatMentalModelsVol1,
        note: 'A toolkit of thinking lenses.',
      },
      {
        kind: 'read',
        title: 'Farnam Street blog + newsletter',
        by: 'fs.blog',
        url: LINKS.farnamStreet,
        note: 'Free and ongoing — mental models, decision quality.',
      },
      { kind: 'follow', title: 'Shane Parrish', url: LINKS.shaneParrish },
    ],
  },
  {
    id: 'communication',
    month: 9, // Sept
    title: 'Communication & Defending Design Decisions',
    premise:
      'The exact skill you named: talk to clients, change minds. This is the highest-leverage track for you.',
    action:
      'Before every client presentation, write one paragraph: the problem + why this solves it. Present that first, the visuals second. Stop leading with the pixels.',
    resources: [
      {
        kind: 'book',
        title: 'Articulating Design Decisions',
        by: 'Tom Greever',
        url: LINKS.articulatingDesignDecisions,
        note: 'Literally the book on presenting and defending your work to stakeholders. Read this first of the whole list.',
      },
      {
        kind: 'book',
        title: 'The Coaching Habit',
        by: 'Michael Bungay Stanier',
        url: LINKS.coachingHabit,
        note: 'Ask instead of tell; seven questions that change conversations.',
      },
      {
        kind: 'book',
        title: 'Crucial Conversations',
        by: 'Patterson et al.',
        url: LINKS.crucialConversations,
        note: 'High-stakes talks without losing the room.',
      },
      {
        kind: 'watch',
        title: 'The Futur — advanced communication / present one concept',
        by: 'Chris Do',
        url: LINKS.futurYouTube,
        note: 'Professionals do the thinking upfront with the client and present one fully-realized concept, not ten half-baked options.',
      },
      { kind: 'follow', title: 'Chris Do', url: LINKS.chrisDo },
    ],
  },
  {
    id: 'sales',
    month: 10, // Oct
    title: 'Sales, Pitching & Negotiation',
    premise:
      'Where most designers stay poor and stuck. The frameworks here are proven and un-sleazy.',
    action:
      'Kill the reflex to say “here’s what I’d do.” Replace it with three diagnostic questions before you propose anything. The one asking the questions runs the room.',
    resources: [
      {
        kind: 'book',
        title: 'Never Split the Difference',
        by: 'Chris Voss',
        url: LINKS.neverSplitTheDifference,
        note: 'Tactical empathy, calibrated questions, labeling. Negotiation without being a shark.',
      },
      {
        kind: 'book',
        title: 'The Win Without Pitching Manifesto',
        by: 'Blair Enns',
        url: LINKS.winWithoutPitchingManifesto,
        note: 'Stop free-pitching; position yourself as the expert who diagnoses before prescribing.',
      },
      {
        kind: 'book',
        title: 'Pricing Creativity',
        by: 'Blair Enns',
        url: LINKS.pricingCreativity,
        note: 'When you’re ready to raise rates. Value-based pricing over hourly.',
      },
      {
        kind: 'watch',
        title: 'The Futur podcast + YouTube',
        by: 'Chris Do',
        url: LINKS.futurNegotiation,
        note: 'Socratic selling and negotiation — search his “How to Negotiate” material.',
      },
      { kind: 'follow', title: 'Chris Voss', url: LINKS.chrisVoss },
      { kind: 'follow', title: 'Blair Enns', url: LINKS.blairEnns },
      { kind: 'follow', title: 'Chris Do', url: LINKS.chrisDo },
    ],
  },
  {
    id: 'networking',
    month: 2, // Feb
    title: 'Networking & Personal Brand',
    premise:
      'You already have the machine for this — your Learning-in-Public calendar. This track feeds it.',
    action:
      '3 meaningful comments or DMs a day beats 30 likes. Route every weekly design rep into a Learning-in-Public post. One rep = one artifact = one piece of network surface area.',
    resources: [
      {
        kind: 'book',
        title: 'Never Eat Alone',
        by: 'Keith Ferrazzi',
        url: LINKS.neverEatAlone,
        note: 'Generosity-first relationship building.',
      },
      {
        kind: 'book',
        title: 'How to Win Friends and Influence People',
        by: 'Dale Carnegie',
        url: LINKS.howToWinFriends,
        note: 'Old, still undefeated.',
      },
      {
        kind: 'book',
        title: 'Show Your Work!',
        by: 'Austin Kleon',
        url: LINKS.showYourWork,
        note: 'The case and method for building in public — your calendar’s operating manual.',
      },
      {
        kind: 'follow',
        title: 'The people already in this guide — then engage, don’t lurk',
        url: LINKS.austinKleon,
        note: 'Start with the consolidated follow list below.',
      },
    ],
  },
  {
    id: 'business',
    month: 1, // Jan
    title: 'Business & Product Sense',
    premise:
      'The “infrastructure secrets” — how top companies actually make products and money. This is what separates a designer from a strategist.',
    action:
      'Each month, pick one company and dissect its actual product/design system. Write one page: what I’d steal.',
    resources: [
      {
        kind: 'book',
        title: 'Inspired',
        by: 'Marty Cagan',
        url: LINKS.inspired,
        note: 'How strong product organizations actually operate.',
      },
      {
        kind: 'book',
        title: 'Made to Stick',
        by: 'Chip & Dan Heath',
        url: LINKS.madeToStick,
        note: 'Why some ideas (and pitches) survive and others die.',
      },
      {
        kind: 'read',
        title: "Lenny's Newsletter",
        by: 'Lenny Rachitsky',
        url: LINKS.lennysNewsletter,
        note: 'Product, growth, strategy from operators at the best companies. The single best current source for this track.',
      },
      {
        kind: 'read',
        title: 'First Round Review',
        url: LINKS.firstRoundReview,
        note: 'Operator essays on building companies.',
      },
      {
        kind: 'read',
        title: 'Design in Tech reports',
        by: 'John Maeda',
        url: LINKS.designInTechReport,
        note: 'Where design, business, and technology actually intersect.',
      },
      {
        kind: 'read',
        title: 'Airbnb Design',
        url: LINKS.airbnbDesign,
        note: 'Study how they embed design into decisions.',
      },
      {
        kind: 'read',
        title: 'Stripe blog',
        url: LINKS.stripeBlog,
        note: 'Study how they embed design into decisions.',
      },
      {
        kind: 'read',
        title: 'Linear blog',
        url: LINKS.linearBlog,
        note: 'Study how they embed design into decisions.',
      },
      { kind: 'follow', title: 'Lenny Rachitsky', url: LINKS.lennyRachitsky },
      { kind: 'follow', title: 'John Maeda', url: LINKS.johnMaeda },
      {
        kind: 'follow',
        title: 'Julie Zhuo',
        url: LINKS.julieZhuo,
        note: 'Product design leadership.',
      },
      { kind: 'follow', title: 'Jared Spool', url: LINKS.jaredSpool, note: 'UX strategy.' },
    ],
  },
];

/** Bonus — pitching a deck specifically. */
export const BONUS = {
  title: 'Bonus — Pitching a deck specifically',
  resources: [
    {
      kind: 'book' as const,
      title: 'Resonate',
      by: 'Nancy Duarte',
      url: LINKS.resonate,
      note: 'The definitive work on presentation as persuasion.',
    },
    {
      kind: 'book' as const,
      title: 'slide:ology',
      by: 'Nancy Duarte',
      url: LINKS.slideology,
      note: 'The definitive work on presentation as persuasion.',
    },
    {
      kind: 'book' as const,
      title: 'Talk Like TED',
      by: 'Carmine Gallo',
      url: LINKS.talkLikeTed,
      note: 'Structure and delivery for high-stakes talks.',
    },
    { kind: 'follow' as const, title: 'Nancy Duarte', url: LINKS.nancyDuarte },
  ],
};

/** The three checkable daily actions, keyed to fields on `DailyEntry`. */
export type CadenceId = 'read' | 'input' | 'applied';

interface CadenceSlot {
  id: CadenceId;
  slot: string;
  time: string;
  what: string;
  /** Key into `CADENCE_ICONS`, so every surface draws the slot the same way. */
  icon: 'book' | 'play' | 'spark';
}

/** The daily cadence, ~30–45 min. Drives the three checkable actions. */
export const CADENCE: CadenceSlot[] = [
  {
    id: 'read',
    slot: 'Read',
    time: '10 min',
    what: 'The book of the month (one per track, in order)',
    icon: 'book',
  },
  {
    id: 'input',
    slot: 'Input',
    time: '10 min',
    what: 'One creator: a Futur/Juxtopposed video, or one newsletter',
    icon: 'play',
  },
  {
    id: 'applied',
    slot: 'Apply',
    time: '10–15 min',
    what: 'One decision-log entry or 3 real engagements on X/LinkedIn',
    icon: 'spark',
  },
];

export const WEEKLY_REP =
  'One design rep a week — redesign one flow, not one screen — then publish it. That single motion serves upskilling, portfolio, and network at once.';

/** The consolidated follow list, grouped as in the guide. */
export const FOLLOW_LIST = [
  {
    group: 'Business / sales / pitching',
    people: [
      {
        name: 'Chris Do',
        note: 'The Futur — business of design, sales, communication',
        url: LINKS.chrisDo,
      },
      {
        name: 'Blair Enns',
        note: 'Win Without Pitching — positioning, pricing',
        url: LINKS.blairEnns,
      },
      { name: 'Chris Voss', note: 'Negotiation', url: LINKS.chrisVoss },
    ],
  },
  {
    group: 'Product / strategy / leadership',
    people: [
      { name: 'Lenny Rachitsky', note: 'Product & growth', url: LINKS.lennyRachitsky },
      { name: 'Julie Zhuo', note: 'Product design leadership', url: LINKS.julieZhuo },
      { name: 'Jared Spool', note: 'UX strategy', url: LINKS.jaredSpool },
      { name: 'John Maeda', note: 'Design + tech + business', url: LINKS.johnMaeda },
    ],
  },
  {
    group: 'Craft / thinking / practice',
    people: [
      { name: 'Don Norman', note: 'Foundations', url: LINKS.donNorman },
      { name: 'Ioana Teleanu', note: 'AI × design', url: LINKS.ioanaTeleanu },
      {
        name: 'Tommy Geoco',
        note: 'Practical product design & careers',
        url: LINKS.tommyGeoco,
      },
      {
        name: 'Juxtopposed',
        note: 'YouTube — redesign teardowns',
        url: LINKS.juxtopposedYouTube,
      },
      {
        name: 'Shane Parrish / Farnam Street',
        note: 'Mental models',
        url: LINKS.shaneParrish,
      },
      { name: 'Nancy Duarte', note: 'Presentation & pitch', url: LINKS.nancyDuarte },
    ],
  },
];

export const FOLLOW_LIST_CAVEAT =
  'Search the name to confirm the current handle before following — accounts move.';

export const RESOURCE_GROUPS: { kind: 'book' | 'watch' | 'read' | 'follow'; label: string }[] = [
  { kind: 'book', label: 'Books' },
  { kind: 'watch', label: 'Watch' },
  { kind: 'read', label: 'Read' },
  { kind: 'follow', label: 'Follow' },
];

export function trackById(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}
