// Narrative progression shown on the Mpho's Story page.
//
// This is deliberately NOT a dated timeline. The Trust has not supplied verified
// dates, founding details, sponsor names or impact figures, and none may be
// invented here. What it is instead: the approved outcome model —
// Mobility -> Participation -> Dignity -> Opportunity — which states the Trust's
// purpose without asserting any unverified historical fact.
//
// If the Trust later supplies verified milestones, this can become a dated
// timeline again: add a `date` to each node and render it above the heading.
//
// `image` is a filename stem in /public/images/photos (omit the key entirely for
// a text-only node). Order in this array is the order rendered, top to bottom.
export const storyTimeline = [
  {
    id: 'mobility',
    eyebrow: 'Mobility',
    heading: 'It starts with being able to move',
    body: 'A prosthetic limb, a wheelchair, or the right assistive device removes the most immediate barrier a child faces. Getting that device fitted, and adjusted again as a child grows, is where the Trust’s support begins.',
    image: '05_impact_wheelchairs',
    imageAlt: 'A row of wheelchairs prepared for distribution',
  },
  {
    id: 'participation',
    eyebrow: 'Participation',
    heading: 'Then it becomes taking part',
    body: 'Mobility matters because of what it makes possible: getting to school, keeping up with classmates, joining in at home and in the community. The device is the means, not the outcome.',
    image: '03_fulllength_portrait',
    imageAlt: 'A smiling child standing with the support of crutches at an event',
    // Portrait source (821x1200) in a 4:3 box shows only the top ~51% of the frame.
    // 5% keeps the crop starting just above the head; higher values clip it.
    imageFocus: 'object-[50%_5%]',
  },
  {
    id: 'dignity',
    eyebrow: 'Dignity',
    heading: 'Support that respects the person',
    body: 'Families are guided through the process rather than processed by it. The Trust works with parents and carers directly, so support arrives in a way that treats a child as a child first.',
  },
  {
    id: 'opportunity',
    eyebrow: 'Opportunity',
    heading: 'And what becomes possible after',
    body: 'A child who can move, take part and be treated with dignity has the same horizon as any other child. Widening that horizon — not simply supplying equipment — is what the Trust exists to do.',
    image: '06_award_presentation',
    imageAlt: 'A Trust representative receiving a partnership document at an Ekurhuleni Metropolitan Municipality presentation',
  },
]

// Appeal that closes the Mpho's Story page.
//
// `videoReady` stays false until the Trust supplies a real video file AND its
// WebVTT caption track. While false the section renders as a text appeal with its
// call to action — no player, no "coming soon" note. A visitor should never be
// shown the production status of an asset they were never promised.
export const storyVideo = {
  videoReady: false,
  provider: 'file', // 'file' | 'youtube' | 'vimeo'
  src: '/media/mpho-appeal.mp4',
  poster: '/images/photos/01_hero_portrait_speaking.jpg',
  captions: '/media/mpho-appeal.en.vtt',
  title: 'Mpho Madi shares why the Trust needs partners',
  heading: 'Partner With the Trust',
  standfirst:
    'The Trust works with donors, sponsors and partners who want a child’s mobility to lead somewhere. If that is the kind of support you are looking for, the next step is a conversation.',
  cta: { label: 'Partner With Us', to: '/preview/donate#corporate-sponsorship' },
}
