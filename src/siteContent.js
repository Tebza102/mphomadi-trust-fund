import { previewNavigation } from './config/navigation'

export const brandLogoPath = '/images/branding/mpho-madi-logo.png'
export const brandLogoAlt = 'Mpho Madi Trust Fund logo'

export const siteNav = previewNavigation

export const donateUrl = 'https://example-donation-provider.org/TBD_VERIFIED'

export const trackCta = (eventName) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName })
  }
}
