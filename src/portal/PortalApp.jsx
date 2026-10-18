import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../lib/AuthProvider'
import { LeadDetailPage } from './LeadDetailPage'
import { PortalDashboard } from './PortalDashboard'
import { PortalLoginPage } from './PortalLoginPage'
import { RequireRole } from './RequireRole'
import { TeamManagementPage } from './TeamManagementPage'

/**
 * The team portal, as one lazily loaded chunk.
 *
 * Everything that needs Firebase Auth or Firestore lives behind this file, and
 * AppRoutes reaches it only through import() (see PortalGate). AuthProvider
 * moved here from App.jsx: public pages never read auth state, so mounting it
 * around them only made every visitor download and initialise Firebase.
 *
 * Paths are relative to /portal/*. RequireRole is unchanged and still fails
 * closed: no config -> PortalUnavailable, no user -> /portal/login, wrong role
 * -> access denied. As before, the real enforcement is firestore.rules and the
 * server-side role checks inside each callable, never this routing.
 */
export function PortalApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<PortalLoginPage />} />
        <Route
          index
          element={
            <RequireRole allow={['admin', 'editor']}>
              <PortalDashboard />
            </RequireRole>
          }
        />
        <Route
          path="lead/:leadId"
          element={
            <RequireRole allow={['admin', 'editor']}>
              <LeadDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="team"
          element={
            <RequireRole allow={['admin']}>
              <TeamManagementPage />
            </RequireRole>
          }
        />
        {/* Unknown portal paths went to the site-wide catch-all before; keep that. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
