export const donationSponsorshipContent = {
  hero: {
    eyebrow: 'Give Help',
    title: 'Help children move forward with practical support, trusted giving, and clear sponsorship pathways.',
    copy:
      'You can support the Trust as an individual donor, a monthly supporter, or a corporate sponsor. Where a detail has not yet been confirmed by the Trust, we say so plainly rather than publish it.',
    primaryCta: 'Support the Mission',
    secondaryCta: 'Become a Sponsor',
    tertiaryCta: 'Request Sponsorship Information',
  },
  pathways: [
    { label: 'Make a once-off donation', href: '#individual-giving' },
    { label: 'Become a monthly supporter', href: '#individual-giving' },
    { label: 'Sponsor as a company', href: '#corporate-sponsorship' },
    // Parked 2026-09-03 — the Trust is running with once-off and monthly
    // giving only until after the fundraiser. Kept in data, filtered out of
    // the rendered pathways list in DonatePage.jsx. Restore by dropping the
    // status field once the Trust decides to reopen this pathway.
    { label: 'Donate goods or services', href: '#ways-to-support', status: 'parked' },
    { label: 'Request verification before giving', href: '#verification' },
    { label: 'Speak to the team', href: '#enquiry-form' },
  ],
  trust: {
    title: 'Before you give, we want you to feel confident.',
    copy:
      'Mpho Madi Trust Fund welcomes donors and sponsors who want to understand the work, verify details, and support responsibly.',
    benefits: [
      'Organisation purpose and support focus',
      'Who benefits from the work',
      'How funds are used',
      'Verification note for unresolved details',
      'Contact option for legitimacy checks',
    ],
    checklist: [
      'Confirm banking details',
      'Confirm organisation details',
      'Ask for programme information',
      'Request sponsorship proposal if donating as a company',
      'Keep proof of payment',
    ],
    // Phrased as "available on request", not as a status marker. A donor needs
    // to know how to obtain a document, not how far along its internal
    // verification is. Registration, banking and governance details are all
    // still pending confirmation by the Trust, so none are published here.
    verification: [
      'Registration and compliance details: available on request',
      'Banking details: shared directly by the team once your enquiry is received',
      'Board and governance details: available on request',
      'Supporting documents: request from the team',
    ],
  },
  donationAmounts: [
    { amount: 'R100', impact: 'Can contribute toward essential support items, depending on current programme needs.', cta: 'Choose R100' },
    { amount: 'R250', impact: 'Can contribute toward essential support items, depending on current programme needs.', cta: 'Choose R250' },
    { amount: 'R500', impact: 'Can contribute toward practical help such as food, clothing, transport, or follow-up support.', cta: 'Choose R500' },
    { amount: 'R1,000', impact: 'Can contribute toward a larger support step, subject to what the Trust needs most right now.', cta: 'Choose R1,000' },
    { amount: 'Custom', impact: 'Choose a custom amount that fits your giving capacity and preferred support pattern.', cta: 'Choose custom' },
  ],
  // Only the first two options render publicly on the Donations page while the
  // fundraiser is running (decided 2026-09-03) — DonatePage.jsx filters out any
  // entry with status: 'parked'. The Trust will decide on the remaining
  // formats after the fundraiser; the data stays intact here for that review,
  // it is just not shown or offered as a call to action until then.
  givingOptions: [
    {
      title: 'Once-off donation',
      amount: 'Any amount',
      copy: 'Make a single contribution that supports urgent needs, practical follow-up, and active family cases.',
      cta: 'Donate once',
      status: 'active',
    },
    {
      title: 'Monthly supporter',
      amount: 'From your chosen amount',
      copy: 'Become a steady supporter and help the Trust plan support with more confidence across the year.',
      cta: 'Become monthly',
      status: 'active',
    },
    {
      title: 'In-kind donation',
      amount: 'Goods or services',
      copy: 'Donate groceries, clothes, stationery, equipment, or professional services that reduce pressure on the Trust.',
      cta: 'Offer in-kind support',
      status: 'parked',
    },
    {
      title: 'Volunteer / professional support',
      amount: 'Skills-based support',
      copy: 'Offer volunteer help or professional expertise if you want to contribute time or specialised services.',
      cta: 'Offer your skills',
      status: 'parked',
    },
  ],
  sponsorBenefits: [
    'CSI / CSR alignment',
    'Community impact story',
    'Brand visibility opportunities',
    'Programme support options',
    'A clear contact path for meetings',
  ],
  sponsorTiers: [
    {
      title: 'Bronze Sponsor',
      fit: 'Good for smaller companies or first-time partners',
      focus: 'Visible community support with a simple entry point',
      recognition: 'Recognition can be added once approved',
    },
    {
      title: 'Silver Sponsor',
      fit: 'Good for growing businesses looking for CSI / CSR alignment',
      focus: 'A stronger partnership with more visible support',
      recognition: 'Recognition can be added once approved',
    },
    {
      title: 'Gold Sponsor',
      fit: 'Good for established partners wanting broader visibility',
      focus: 'Greater partnership depth and community impact',
      recognition: 'Recognition can be added once approved',
    },
    {
      title: 'Programme Sponsor',
      fit: 'Good for companies backing a named programme',
      focus: 'School supplies, food support, clothing, or community programmes',
      recognition: 'Recognition can be added once approved',
    },
    {
      title: 'Strategic Partner',
      fit: 'Good for long-term collaborators and anchor partners',
      focus: 'Deeper relationship, planning, and support visibility',
      recognition: 'Recognition can be added once approved',
    },
  ],
  // Same parking as givingOptions above — entries with status: 'parked' are
  // filtered out of the rendered "Ways to support" list in DonatePage.jsx.
  supportWays: [
    { label: 'EFT donation', status: 'active' },
    { label: 'Sponsor a programme', status: 'active' },
    { label: 'In-kind donation', status: 'parked' },
    { label: 'Monthly giving', status: 'active' },
    { label: 'Corporate partnership', status: 'active' },
    { label: 'Volunteer / professional services', status: 'parked' },
    { label: 'Share the cause', status: 'active' },
  ],
  ctas: {
    support: 'Support the Mission',
    sponsor: 'Become a Sponsor',
    requestSponsorInfo: 'Request Sponsorship Information',
    requestVerification: 'Request verification documents',
    speakToTeam: 'Speak to the team',
    submitEnquiry: 'Submit enquiry',
    downloadProposal: 'Download Sponsorship Proposal',
  },
  sponsorProposal: {
    available: false,
    href: '/documents/mpho-madi-sponsorship-proposal.pdf',
    label: 'A written sponsorship proposal can be sent to you directly — request it below and the team will follow up.',
  },
  faq: [
    {
      q: 'How do I donate?',
      a: 'Use the support buttons on this page, then contact the team for the verified donation method or next step.',
    },
    {
      q: 'Can my company sponsor a programme?',
      a: 'Yes. Use the sponsor section to request information or arrange a meeting about programme support.',
    },
    // Parked alongside the in-kind giving option above (status: 'parked') —
    // answering "yes" here would contradict a page that no longer offers it
    // as a visible path. Restore together once the Trust reopens in-kind giving.
    {
      q: 'Can I donate goods instead of money?',
      a: 'Yes. In-kind support such as groceries, clothing, stationery, equipment, or services can be requested.',
      status: 'parked',
    },
    {
      q: 'Can I request verification documents?',
      a: 'Yes. The page keeps unverified items visible and gives you a direct way to request documents.',
    },
    {
      q: 'Can I become a monthly supporter?',
      a: 'Yes. Monthly support is one of the main giving paths on the page.',
    },
    {
      q: 'Will I receive feedback after supporting?',
      a: 'The Trust should follow up through the enquiry process and later admin flow once it is connected.',
    },
    {
      q: 'Can I request a meeting before committing?',
      a: 'Yes. The sponsor section includes a meeting request path.',
    },
    {
      q: 'How do I get the Trust’s banking details?',
      a: 'The team shares banking details directly once your enquiry is received, so you can confirm them against the Trust rather than against a web page.',
    },
  ],
  form: {
    supportTypes: [
      'Individual donor',
      'Monthly supporter',
      'Corporate sponsor',
      'In-kind donor',
      'Volunteer / professional supporter',
      'I need more information first',
    ],
    interests: [
      'Once-off donation',
      'Monthly support',
      'Sponsor tier',
      'Programme sponsorship',
      'Goods / services donation',
      'Request verification documents',
      'Request meeting',
    ],
  },
  leadShape: `donationSponsorLead = {
  id,
  leadType,
  fullName,
  email,
  phone,
  companyName,
  donationAmount,
  donationFrequency,
  sponsorTierInterest,
  supportType,
  message,
  wantsVerificationDocuments,
  wantsMeeting,
  proofOfPaymentUrl,
  status,
  assignedTo,
  internalNotes,
  createdAt,
  updatedAt
}`,
  statuses: ['new', 'contacted', 'awaiting_payment', 'awaiting_documents', 'verified', 'converted', 'closed', 'archived'],
}
