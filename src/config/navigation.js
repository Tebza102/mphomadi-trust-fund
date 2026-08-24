export const previewNavigation = [
  { label: 'Home', href: '/preview' },
  { label: 'About', href: '/preview/about' },
  { label: "Mpho's Story", href: '/preview/her-story' },
  { label: 'How We Help', href: '/preview#how-we-help' },
  // Removed with the homepage section it pointed at: those "children we support"
  // cards were invented beneficiary stories, not real cases, so the section went
  // and this dead anchor went with it. Restore both together if the Trust
  // supplies real, consented case studies.
  { label: 'Sponsor', href: '/preview/donate#corporate-sponsorship' },
  { label: 'Donate', href: '/preview/donate' },
  // Archived 2026-07-21 — 'Apply for Support' (/preview/apply) removed at client
  // request; the Trust identifies beneficiaries directly. Restore this entry to
  // reinstate. See src/_archived/apply-for-support/.
  { label: 'Contact', href: '/preview/contact' },
]
