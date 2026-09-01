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
      {!isInternalRoute && <FinalCTA />}
      {!isInternalRoute && <SiteFooter />}
    </div>
  )
}
