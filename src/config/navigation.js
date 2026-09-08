export const previewNavigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: "Mpho's Story", href: '/her-story' },
  // Removed with the homepage section it pointed at: those "children we support"
  // cards were invented beneficiary stories, not real cases, so the section went
  // and this dead anchor went with it. Restore both together if the Trust
  // supplies real, consented case studies.
  //
  // Removed 2026-09-08 — 'How We Help' (/#how-we-help) and 'Sponsor'
  // (/donate#corporate-sponsorship) were anchor links, not pages, so the nav
  // offered Home and Donate twice each under different names. Both sections are
  // untouched: 'How we help' still sits on the home page, and corporate
  // sponsorship is still a full pathway on Donate, reached from the 'Become a
  // Sponsor' calls to action in the hero, the closing CTA and the footer.
  { label: 'Donate', href: '/donate' },
  // Archived 2026-07-21 — 'Apply for Support' (/apply) removed at client
  // request; the Trust identifies beneficiaries directly. Restore this entry to
  // reinstate. See src/_archived/apply-for-support/.
  { label: 'Contact', href: '/contact' },
]
