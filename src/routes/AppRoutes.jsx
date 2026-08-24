import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/SiteLayout'
import { AboutPage } from '../pages/AboutPage'
import { AdminPage } from '../pages/AdminPage'
import { ContactPage } from '../pages/ContactPage'
import { DonatePage } from '../pages/DonatePage'
import { HerStoryPage } from '../pages/HerStoryPage'
import { HomePage } from '../pages/HomePage'
import { PreviewGate } from '../pages/PreviewGate'
import { UnderConstructionPage } from '../pages/UnderConstructionPage'

function PreviewShell() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
}

function DevOnlyAdminGate() {
  if (!import.meta.env.DEV) {
    return <Navigate to="/preview" replace />
  }
  return <AdminPage />
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
          <Route path="admin" element={<DevOnlyAdminGate />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
