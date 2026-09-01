import { previewNavigation } from './config/navigation'

export const brandLogoPath = '/images/branding/mpho-madi-logo-horizontal.png'
export const brandLogoAlt = 'Mpho Madi Trust Fund logo'

export const siteNav = previewNavigation

// No payment provider is confirmed for the Trust yet, so there is no external
// donation URL to link to. Every visitor-facing "donate" affordance routes to
// the enquiry form on the Donate page instead. Do not reintroduce a placeholder
// URL here: a donate button that leads somewhere fake is worse than one that
// leads to a real conversation. When a provider IS confirmed, export the real
// URL and point the Donate CTAs at it.
export const donateEnquiryPath = '/preview/donate#enquiry-form'

export const trackCta = (eventName) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName })
  }
}
