import { BrowserRouter } from 'react-router-dom'
import { SiteWelcome } from './components/SiteWelcome'
import { AuthProvider } from './lib/AuthProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      {/* Outside AuthProvider on purpose: the arrival animation is the public
          site's front door and must not depend on - or delay - auth state. It
          is a sibling of the routes, so the page the visitor asked for mounts
          and renders underneath while it plays. */}
      <SiteWelcome />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
