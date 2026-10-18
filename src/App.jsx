import { BrowserRouter } from 'react-router-dom'
import { SiteWelcome } from './components/SiteWelcome'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      {/* The arrival animation is the public site's front door and must not
          depend on - or delay - auth state. It is a sibling of the routes, so
          the page the visitor asked for mounts and renders underneath while it
          plays. Auth state now lives only inside the lazily loaded team portal
          (see portal/PortalApp.jsx). */}
      <SiteWelcome />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
