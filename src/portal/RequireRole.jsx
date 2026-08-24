import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { PortalUnavailable } from './PortalUnavailable'

/**
 * Route guard.
 *
 * This keeps people out of screens they have no business seeing, which is a
 * usability and discretion measure - NOT a security boundary. A user who edits
 * their own JavaScript can render any component they want. What actually stops
 * them reading the pipeline is firestore.rules refusing the query.
 *
 * Treat this as "don't show them a broken screen", not "they cannot get in".
 */
export function RequireRole({ allow, children }) {
  const { configured, user, role, loading } = useAuth()
  const location = useLocation()

  // No Firebase config in this environment (typically a preview deploy that has
  // not had the client env vars set). Say so plainly — a portal screen that
  // silently redirects to a login that also cannot work is worse than an
  // explanation.
  if (!configured) {
    return <PortalUnavailable />
  }

  if (loading) {
    return (
      <div className="section-shell py-24 text-center text-ink/60">
        <p>Checking access...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/preview/portal/login" replace state={{ from: location.pathname }} />
  }

  if (!allow.includes(role)) {
    return (
      <main className="section-shell py-24">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Access denied</p>
        <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
          This area is for Trust staff.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
          Your account is signed in{role ? ` as "${role}"` : ''}, which does not have access here. If
          you believe this is wrong, ask an administrator to review your role.
        </p>
      </main>
    )
  }

  return children
}
