import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth'
import { auth, firebaseReady } from './firebase'
import { AuthContext } from './authContext'

/**
 * Auth state, including the role claim.
 *
 * IMPORTANT: the `role` here comes from the Firebase ID token's custom claims,
 * which are signed by Google and set only by the Admin SDK inside Cloud
 * Functions. It is not read from Firestore, because a document the user can
 * write must never decide what that user may do.
 *
 * Even so, everything this exposes is a UI convenience only. Hiding a button
 * is not access control. Every privileged action is re-verified server-side —
 * in firestore.rules for reads/writes, and against request.auth.token.role
 * inside each callable. Assume a determined user can call anything they like.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [emailVerified, setEmailVerified] = useState(false)
  // When Firebase is not configured there is no auth state to wait for, so this
  // must not start in a loading state — otherwise every portal screen would sit
  // on "Checking access..." forever instead of saying what is actually wrong.
  const [loading, setLoading] = useState(firebaseReady)

  useEffect(() => {
    if (!firebaseReady) return undefined

    return onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null)
        setRole(null)
        setEmailVerified(false)
        setLoading(false)
        return
      }

      // force-refresh so a role assigned moments ago is picked up rather than
      // waiting up to an hour for the cached token to expire.
      const token = await nextUser.getIdTokenResult(true)

      setUser(nextUser)
      setRole(token.claims.role ?? null)
      setEmailVerified(nextUser.emailVerified)
      setLoading(false)
    })
  }, [])

  const value = useMemo(() => {
    /** Re-read claims after a role change, without making the user sign out. */
    const refreshClaims = async () => {
      if (!auth?.currentUser) return null
      const token = await auth.currentUser.getIdTokenResult(true)
      setRole(token.claims.role ?? null)
      return token.claims.role ?? null
    }

    return {
      // False when this environment has no Firebase config. Portal screens use
      // it to explain themselves rather than appearing broken.
      configured: firebaseReady,
      user,
      role,
      emailVerified,
      loading,
      isAdmin: role === 'admin',
      isStaff: role === 'admin' || role === 'editor',
      isSponsor: role === 'sponsor',
      refreshClaims,
      signOut: () => (auth ? fbSignOut(auth) : Promise.resolve()),
    }
  }, [user, role, emailVerified, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
