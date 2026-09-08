import { useLocation } from 'react-router-dom'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/**
 * FinalCTA was removed from every page on 8 September 2026. It sat directly
 * above the footer repeating the same two actions the footer already carried,
 * so the bottom of every page asked twice. Its buttons moved into the footer's
 * Get involved block, which now carries the full-strength labels.
 */
export function SiteLayout({ children }) {
  const { pathname } = useLocation()
  const isInternalRoute = pathname.startsWith('/portal') || pathname.startsWith('/admin')

  return (
    <div className="min-h-screen font-body text-ink">
      <SiteHeader />
      {children}
      {!isInternalRoute && <SiteFooter />}
    </div>
  )
}
