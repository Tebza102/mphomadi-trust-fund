// Board of Trustees. Array order is display order.
//
// `image` is the filename stem in /public/images/trustees and deliberately does
// not track `name` (the file is hilary-smith.jpg, the person is Hilary
// Keenan-Smith) — the supplied filenames are not to be renamed.
//
// `bio` is an array of paragraphs, reproduced exactly as supplied by the Trust
// (editorial drafts pending client approval — do not rewrite, shorten,
// paraphrase or embellish).
export const sectionIntro = {
  eyebrow: 'Governance',
  title: 'The People Behind Our Purpose',
  paragraphs: [
    'The Mpho Madi Trust Fund is guided by individuals whose different life journeys, professional experiences and personal commitments are united by a shared belief in the potential of every child.',
    "From founding leadership and compassionate administration to community advocacy, psychological understanding and lived family experience, our trustees bring complementary strengths to the Trust's work.",
    "Together, they are committed to honouring Mpho's journey by creating opportunities, strengthening family support and helping children with disabilities live with dignity, confidence and possibility.",
  ],
}

export const trustees = [
  {
    name: 'Hilary Keenan-Smith',
    role: 'Administrative Trustee | Co-Founder',
    image: 'hilary-smith',
    bio: [
      "Hilary Keenan-Smith has been part of the Mpho Madi Trust Fund since its establishment in 2006, providing almost two decades of administrative continuity and careful stewardship as the Trust has developed.",
      "Known for her meticulous attention to detail and compassionate approach, Hilary brings an important combination of organisation and empathy to the work of the Trust. She is particularly passionate about ensuring that disadvantaged children are treated with dignity, understanding and genuine care.",
      "Beyond the Trust, Hilary has spent approximately 20 years working in veterinary retail and reception environments. This experience has further shaped her service-oriented nature, patience and sensitivity to the needs of both people and animals.",
      "As the Trust enters its next chapter, Hilary brings institutional memory, administrative discipline and a deeply rooted commitment to compassionate service — helping ensure that the organisation remains both caring in its purpose and dependable in its execution.",
    ],
  },
  {
    name: 'Pule Malefane',
    role: 'Chairperson | Co-Founder, Mpho Madi Trust Fund',
    image: 'pule-malefane',
    bio: [
      "Pule's journey with the Mpho Madi Trust Fund began in 2003, when Kutlwano Social Organization first met Mpho during its Winter Warmers Campaign in partnership with Kaya FM. That encounter helped inspire a lasting commitment to supporting vulnerable children and families and ultimately contributed to the establishment of the Trust.",
      'A lifelong community activist, former Member of the Provincial Legislature and experienced diplomat, Pule brings a wealth of leadership, public service and relationship-building experience to the Trust. His journey has been shaped by a commitment to uplifting marginalised communities and creating opportunities for those too often left behind.',
      'As a founding member and Chairperson, Pule provides leadership to the Board, supports fundraising efforts and helps ensure that the Trust remains accountable to its mission and the communities it serves.',
      "His vision is to see the Trust provide meaningful emotional and practical support to children and families while helping young people recognise and develop their God-given talents, inspired by Mpho's own journey.",
      "For Pule, the Trust is more than an organisation. It is an opportunity to honour Mpho's legacy and contribute to a lasting legacy of compassion, dignity and opportunity for future generations.",
    ],
  },
  {
    name: 'Lentheng Helen Mekgwe (Ntombi)',
    role: 'Trustee | Mpho Madi Trust Fund',
    image: 'ntombi-mekgwe',
    bio: [
      'Lentheng Helen Mekgwe, affectionately known as Ntombi, is a dedicated community activist and public servant whose commitment to social development began during her school years in Duduza, Nigel.',
      'Her journey from grassroots activism and NGO facilitation to senior leadership in government reflects a longstanding commitment to improving the lives of vulnerable communities. She served for 17 years as a local government councillor, later holding provincial executive portfolios in Health and Social Development, Cooperative Governance, Traditional Affairs and Human Settlements. She also served as Speaker of the Gauteng Provincial Legislature for eight years.',
      "Throughout her career, Ntombi has championed the interests of women, children and people with disabilities. As a trustee of the Mpho Madi Trust Fund, she brings extensive experience in community engagement, public leadership and social advocacy, strengthening the Trust's commitment to supporting disadvantaged children and families.",
      'A mother of two, Ntombi also serves on the board of the Bertha Gxowa Foundation, continuing her dedication to community upliftment and meaningful social change.',
    ],
  },
  {
    name: 'Mpumi Madi',
    role: 'Trustee | Mpho Madi Trust Fund',
    image: 'mpumi-madi',
    bio: [
      'As the proud mother of Mpho, whose remarkable journey inspired the Mpho Madi Trust Fund, Mpumi brings a deeply personal understanding of the challenges and possibilities facing children born without limbs and their families.',
      "Raising Mpho, who was born without upper or lower limbs, taught her that a child's potential should never be defined by physical limitations. Through experiences of closed doors, uncertain classrooms and the determination to find opportunities for her daughter, Mpumi developed a lasting belief in the power of encouragement, inclusion and meaningful support.",
      "With a background in psychology, Mpumi worked with children with disabilities and their parents during her counselling psychology master's internship, helping families better understand and respond to their children's needs. She now serves as a Human Performance Manager at an international technology company, where she specialises in understanding human behaviour and helping people adapt to change.",
      "As a trustee, Mpumi combines lived experience, psychological understanding and professional expertise to support the Trust's advocacy, partnerships and commitment to families.",
      'Her vision is rooted in the belief that every child deserves the opportunity to develop their abilities, pursue their dreams and live a fulfilling life without unnecessary barriers.',
    ],
  },
]
