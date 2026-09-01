import { useLocation } from 'react-router-dom'
import { FinalCTA } from './FinalCTA'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout({ children }) {
  const { pathname } = useLocation()
  const isInternalRoute = pathname.startsWith('/preview/portal') || pathname.startsWith('/preview/admin')

  return (
    <div className="min-h-screen font-body text-ink">
      <SiteHeader />
      {children}
      {/* Portal/admin routes keep the existing shared header but do not receive public fundraising or institutional footer content. */}
      {!isInternalRoute && <FinalCTA />}
      {!isInternalRoute && <SiteFooter />}
    </div>
  )
}
