import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/SiteLayout'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { DonatePage } from '../pages/DonatePage'
import { HerStoryPage } from '../pages/HerStoryPage'
import { HomePage } from '../pages/HomePage'
import { PreviewGate } from '../pages/PreviewGate'
import { UnderConstructionPage } from '../pages/UnderConstructionPage'
import { LeadDetailPage } from '../portal/LeadDetailPage'
import { PortalDashboard } from '../portal/PortalDashboard'
import { PortalLoginPage } from '../portal/PortalLoginPage'
import { RequireRole } from '../portal/RequireRole'
import { TeamManagementPage } from '../portal/TeamManagementPage'

function PreviewShell() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
}

/**
 * Dev-only legacy content-inventory page. Reads internal compliance/gap notes
 * from local content files — never meant for trustee eyes, and previously
 * reachable by anyone who had the shared preview password.
 *
 * The lazy(() => import(...)) call is deliberately INSIDE this conditional,
 * not assigned unconditionally and merely rendered conditionally. A static
 * top-level `import AdminPage from '../pages/AdminPage'` gated only at the JSX
 * usage site does not remove the module from a production bundle — Rollup only
 * elides an unused import if it can prove the module has no side effects, and
 * that proof is not guaranteed. Here, Vite replaces `import.meta.env.DEV` with
 * the literal `false` in production builds, so this whole block — including
 * the import() call — is dead code before the bundler ever chunks it. Nothing
 * from AdminPage.jsx reaches dist/. Verified by grepping the built output for
 * text unique to that page (see project notes).
 */
let AdminPage = null
if (import.meta.env.DEV) {
  // AdminPage.jsx uses a named export, not `export default` — lazy() requires
  // the resolved module to carry a .default, so that has to be mapped here.
  AdminPage = lazy(() => import('../pages/AdminPage').then((module) => ({ default: module.AdminPage })))
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UnderConstructionPage />} />

      <Route path="/preview" element={<PreviewGate />}>
        <Route element={<PreviewShell />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="her-story" element={<HerStoryPage />} />
          <Route path="donate" element={<DonatePage />} />
          {/* Archived 2026-07-21 — public application intake withdrawn at client
              request. Bookmarks and any indexed links land on the home page
              rather than a dead route. Component lives in
              src/_archived/apply-for-support/. */}
          <Route path="apply" element={<Navigate to="/preview" replace />} />
          <Route path="contact" element={<ContactPage />} />
          {/* Dev-only. Absent from production entirely — see the AdminPage
              comment above. Hitting /preview/admin in a production build falls
              through to the catch-all route below and redirects home, the same
              as any other unregistered path. */}
          {AdminPage ? (
            <Route
              path="admin"
              element={
                <Suspense fallback={null}>
                  <AdminPage />
                </Suspense>
              }
            />
          ) : null}

          {/* Team portal. RequireRole keeps the wrong people off these screens,
              but the real enforcement is firestore.rules and the server-side
              role check inside each callable — never this routing. */}
          <Route path="portal/login" element={<PortalLoginPage />} />
          <Route
            path="portal"
            element={
              <RequireRole allow={['admin', 'editor']}>
                <PortalDashboard />
              </RequireRole>
            }
          />
          <Route
            path="portal/lead/:leadId"
            element={
              <RequireRole allow={['admin', 'editor']}>
                <LeadDetailPage />
              </RequireRole>
            }
          />
          <Route
            path="portal/team"
            element={
              <RequireRole allow={['admin']}>
                <TeamManagementPage />
              </RequireRole>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
