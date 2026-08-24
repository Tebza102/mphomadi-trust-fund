// Board of Trustees. Array order is display order: chairperson, administrator,
// then the remaining trustees.
//
// NOTE: Mpumi Madi's and Ntombi Mekgwe's titles are still unconfirmed and carry
// the neutral "Trustee" — donationSponsorshipContent.js likewise still shows
// 'Board / leadership details: TBD_VERIFIED'. Update `role` here when the Trust
// supplies them; the card label and the alt text both read from this field.
//
// `image` is the filename stem in /public/images/trustees and deliberately does
// not track `name` (the file is hilary-smith.jpg, the person is Hilary Keenan
// Smith) — the supplied filenames are not to be renamed.
export const trustees = [
  { name: 'Pule Malefane', role: 'Chairperson', image: 'pule-malefane' },
  { name: 'Hilary Keenan Smith', role: 'Administrator', image: 'hilary-smith' },
  { name: 'Mpumi Madi', role: 'Trustee', image: 'mpumi-madi' },
  { name: 'Ntombi Mekgwe', role: 'Trustee', image: 'ntombi-mekgwe' },
]
