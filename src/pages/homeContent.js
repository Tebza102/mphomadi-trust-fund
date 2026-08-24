export const homepageContent = {
  // Unused — the live nav is src/config/navigation.js. 'Apply for Support' removed
  // here 2026-07-21 to keep it from being reintroduced by a copy-paste.
  nav: ['Home', 'About', "Mpho's Story", 'How We Help', 'Sponsor', 'Donate', 'Contact'],
  hero: {
    eyebrow: 'Mpho Madi Trust Fund | South Africa',
    title: 'Every Child Deserves Mobility, Dignity, and Opportunity.',
    mission:
      'We support children born without limbs with prosthetics, wheelchairs, assistive devices, and family-centered guidance that helps them move forward with confidence. Sponsors, donors, and partners can support the journey in ways that are transparent and practical.',
    ctas: [
      { label: 'Donate Now', href: '/donate', event: 'donate_click' },
      { label: 'Become a Sponsor', href: '/donate#sponsor-pathway', event: 'sponsor_click' },
    ],
  },
  founderStory: {
    title: 'Why This Trust Exists',
    copy:
      'Mpho Madi Trust Fund was established to close the gap between need and access. Too many children and families face long delays, high costs, and limited support options for mobility equipment. We are building a practical pathway from referral to real support, so children can participate more fully in school, family life, and community life.',
  },
  challenge: {
    title: 'The Challenge Is More Than Equipment.',
    paragraphs: [
      'Children born without limbs can face barriers to movement, education, social participation, and confidence.',
      'For many families, the cost of prosthetics, wheelchairs, and assistive devices is difficult to sustain, especially when a child needs ongoing adjustments as they grow.',
    ],
  },
  journey: [
    // Archived 2026-07-21 — was 'Referral or application'; public intake withdrawn.
    'Referral',
    'Needs assessment',
    'Personal support planning',
    'Mobility or assistive device support',
    'Family guidance and practical coaching',
    'Follow-up care focused on dignity and long-term progress',
  ],
  waysToHelp: [
    'Sponsor a prosthetic or mobility device',
    'Make a once-off donation',
    'Become a monthly supporter',
    'Partner as a company or foundation',
    'Support a child, school, or community programme',
    'Volunteer professional support',
  ],
}
