// Timeline shown on the Mpho's Story page.
//
// Every `date`, `heading` and `body` below is placeholder copy pending real
// details from the Trust. Each node carries its own TODO — fill these in and the
// component needs no changes. `image` is a filename stem in /public/images/photos
// (omit the key entirely for a text-only node).
//
// Order in this array is the order rendered, top to bottom.
export const storyTimeline = [
  {
    id: 'the-beginning',
    // TODO(client): real founding year + why the Trust was started, in the Trust's own words.
    date: 'TBD_VERIFIED',
    heading: 'The Beginning',
    body: 'Placeholder — how the Trust came to be founded, and the need its founders set out to address. Replace with approved copy from the Trust.',
  },
  {
    id: 'early-support',
    // TODO(client): year of first assistance; who the first sponsors were; what was provided.
    date: 'TBD_VERIFIED',
    heading: 'Early Support',
    body: 'Placeholder — the first sponsors to back the Trust and the first families to receive mobility assistance. Replace with approved copy.',
    image: '05_impact_wheelchairs',
    imageAlt: 'Wheelchairs prepared for distribution to children supported by the Trust',
  },
  {
    id: 'mphos-journey',
    // TODO(client): Mpho's personal milestones — dates and details to be confirmed with the family.
    date: 'TBD_VERIFIED',
    heading: "Mpho's Journey",
    body: 'Placeholder — personal milestones along Mpho\'s own path, and how lived experience shapes how the Trust supports families today. Replace with approved copy.',
    image: '03_fulllength_portrait',
    imageAlt: 'A child supported by the Trust standing with the aid of crutches at a Trust event',
    // Portrait source (821x1200) in a 4:3 box shows only the top ~51% of the frame.
    // 5% keeps the crop starting just above the head; higher values clip it.
    imageFocus: 'object-[50%_5%]',
  },
  {
    id: 'turning-point',
    // TODO(client): what the turning point actually was — award, partnership, funding milestone?
    date: 'TBD_VERIFIED',
    heading: 'A Turning Point',
    body: 'Placeholder — the moment the Trust\'s work was recognised more widely, and what changed as a result. Replace with approved copy.',
    image: '06_award_presentation',
    imageAlt: 'A Trust representative receiving a partnership document at an Ekurhuleni Metropolitan Municipality presentation',
  },
  {
    id: 'today',
    // TODO(client): current reach — children supported to date, active programmes, partners.
    date: 'Today',
    heading: 'Where We Are Now',
    body: 'Placeholder — the Trust\'s current reach and the work underway. Replace with approved copy and verified impact figures.',
  },
]

// Video appeal that closes the timeline.
//
// TODO(client): confirm hosting before this ships — `provider: 'file'` expects a
// self-hosted MP4 in /public/media and is the only option that supports the
// <track> captions the brief requires; 'youtube' / 'vimeo' swap to an iframe and
// captions then have to be managed on the platform instead.
export const storyVideo = {
  // Flip to true once a real video + caption file exist. While false the section
  // renders a labelled placeholder in the player's aspect ratio instead of a
  // <video> pointing at a missing file (which would 404 and show a broken player).
  ready: false,
  provider: 'file', // 'file' | 'youtube' | 'vimeo'
  src: '/media/mpho-appeal.mp4', // TODO(client): supply the real file (or an embed id if provider changes)
  poster: '/images/photos/01_hero_portrait_speaking.jpg',
  captions: '/media/mpho-appeal.en.vtt', // TODO(client): supply a WebVTT caption track
  title: 'Mpho Madi shares why the Trust needs partners',
  heading: 'Hear From Mpho',
  standfirst:
    'Placeholder — a short line introducing the appeal and what a partner makes possible. Replace with approved copy.',
  cta: { label: 'Partner With Us', to: '/preview/donate#corporate-sponsorship' },
}
