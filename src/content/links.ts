/**
 * Single source of truth for every outbound URL in the app.
 *
 * Link policy:
 *  - Books point at the publisher's or the author's own page for that book.
 *  - Creators point at their primary platform (YouTube channel, newsletter,
 *    personal site).
 *  - Where a current social handle could not be verified, the link is a search
 *    fallback rather than a guessed @handle. Accounts move; searches don't.
 *
 * If a link ever goes stale, fix it here and every route picks up the change.
 */

/** Search fallback for anyone whose current handle we can't verify. */
export function searchFor(name: string, platform = ''): string {
  const q = [name, platform].filter(Boolean).join(' ');
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export const LINKS = {
  // ---------------------------------------------------------------- books --
  designOfEverydayThings:
    'https://www.hachettebookgroup.com/titles/don-norman/the-design-of-everyday-things/9780465050659/?lens=basic-books',
  changeByDesign: 'https://designthinking.ideo.com/resources/change-by-design',
  sprint: 'https://www.simonandschuster.com/books/Sprint/Jake-Knapp/9781501121746',

  thinkingFastAndSlow: 'https://us.macmillan.com/books/9780374533557/thinkingfastandslow/',
  greatMentalModelsVol1: 'https://fs.blog/books/mental-models-vol1/',

  articulatingDesignDecisions: 'https://tomgreever.com/articulating-design-decisions-book/',
  coachingHabit:
    'https://www.mbs.works/best-books-training-for-coaches-leaders-and-mentors/the-coaching-habit/',
  crucialConversations: 'https://cruciallearning.com/books/crucial-conversations-book/',

  neverSplitTheDifference:
    'https://www.amazon.com/Never-Split-Difference-Negotiating-Depended/dp/0062407805',
  winWithoutPitchingManifesto: 'https://www.winwithoutpitching.com/books',
  pricingCreativity: 'https://www.winwithoutpitching.com/books',

  neverEatAlone:
    'https://www.penguinrandomhouse.com/books/227558/never-eat-alone-expanded-and-updated-by-keith-ferrazzi-and-tahl-raz/',
  howToWinFriends:
    'https://www.simonandschuster.com/books/How-to-Win-Friends-and-Influence-People/Dale-Carnegie/9781982171452',
  showYourWork: 'https://austinkleon.com/show-your-work/',

  inspired: 'https://www.svpg.com/inspired-v2/',
  madeToStick: 'https://heathbrothers.com/books/made-to-stick/',

  resonate: 'https://www.duarte.com/resources/books/resonate/',
  slideology: 'https://www.duarte.com/resources/books/slideology/',
  talkLikeTed: 'https://www.carminegallo.com/books/talk-like-ted/',

  // ---------------------------------------------------------------- watch --
  dschoolYouTube: 'https://www.youtube.com/@thestanforddschool',
  juxtopposedYouTube: 'https://www.youtube.com/@juxtopposed',
  futurYouTube: 'https://www.youtube.com/@thefutur',
  futurSite: 'https://thefutur.com/',
  /** The guide says to search his negotiation material rather than one video. */
  futurNegotiation: searchFor('Chris Do The Futur', 'how to negotiate'),

  // ----------------------------------------------------------------- read --
  farnamStreet: 'https://fs.blog/',
  lennysNewsletter: 'https://www.lennysnewsletter.com/',
  firstRoundReview: 'https://review.firstround.com/',
  designInTechReport: 'https://designintech.report/',
  airbnbDesign: 'https://airbnb.design/',
  stripeBlog: 'https://stripe.com/blog',
  linearBlog: 'https://linear.app/blog',

  // --------------------------------------------------------------- follow --
  donNorman: 'https://jnd.org/',
  shaneParrish: 'https://fs.blog/',
  chrisDo: 'https://thefutur.com/',
  chrisVoss: 'https://www.blackswanltd.com/',
  blairEnns: 'https://www.winwithoutpitching.com/',
  lennyRachitsky: 'https://www.lennysnewsletter.com/',
  johnMaeda: 'https://maeda.pm/',
  nancyDuarte: 'https://www.duarte.com/',
  martyCagan: 'https://www.svpg.com/',
  austinKleon: 'https://austinkleon.com/',

  // Handles not verified as current — search rather than guess.
  julieZhuo: searchFor('Julie Zhuo', 'product design'),
  jaredSpool: searchFor('Jared Spool', 'UX strategy'),
  ioanaTeleanu: searchFor('Ioana Teleanu', 'AI design'),
  tommyGeoco: searchFor('Tommy Geoco', 'product design'),
} as const;

export type LinkKey = keyof typeof LINKS;
