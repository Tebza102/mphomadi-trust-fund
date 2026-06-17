export const brandLogoPath = '/images/branding/mpho-madi-logo.png'
export const brandLogoAlt = 'Mpho Madi Trust Fund logo'

export const siteNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: "Mpho's Story", href: '/her-story' },
  { label: 'How We Help', href: '/#how-we-help' },
  { label: 'Children We Support', href: '/#children-we-support' },
  { label: 'Sponsor', href: '/donate' },
  { label: 'Donate', href: '/donate' },
  { label: 'Apply for Support', href: '/apply' },
  { label: 'Contact', href: '/contact' },
]

export const donateUrl = 'https://example-donation-provider.org/TBD_VERIFIED'

export const trackCta = (eventName) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName })
  }
}
