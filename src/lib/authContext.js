import { createContext, useContext } from 'react'

/**
 * Separated from AuthProvider.jsx so that file exports only a component —
 * mixing components and non-components in one module breaks React Fast Refresh.
 */
export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
