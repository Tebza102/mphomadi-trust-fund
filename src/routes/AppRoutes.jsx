import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/SiteLayout'
import { AboutPage } from '../pages/AboutPage'
import { AdminPage } from '../pages/AdminPage'
import { ApplyPage } from '../pages/ApplyPage'
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
          <Route path="apply" element={<ApplyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
