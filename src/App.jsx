import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './lib/AuthProvider'
import { AppRoutes } from './routes/AppRoutes'
import { PortalWelcome } from './portal/PortalWelcome'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/* Sibling of the routes, not a wrapper: the portal mounts and renders
            normally and this paints over it briefly after a successful team
            sign-in. It renders nothing at all for everyone else. */}
        <PortalWelcome />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
