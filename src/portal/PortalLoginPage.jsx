import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../lib/authContext'
import { PortalUnavailable } from './PortalUnavailable'
import { PasswordField } from '../components/PasswordField'

/**
 * Team sign-in. Deliberately separate from the (future) sponsor sign-in so it is
 * obvious which door you are at - a shared login that silently routes by role
 * invites people to try the wrong one and makes support harder.
 */
export function PortalLoginPage() {
  const { configured, user, isStaff, loading } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Offering a sign-in form that cannot possibly succeed just wastes the
  // visitor's credentials and their time.
  if (!configured) {
    return <PortalUnavailable />
  }

  if (!loading && user && isStaff) {
    return <Navigate to={location.state?.from ?? '/preview/portal'} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (caught) {
      // Deliberately generic: distinguishing "no such user" from "wrong password"
      // tells an attacker which addresses have accounts.
      const code = caught?.code ?? ''
      setError(
        code === 'auth/too-many-requests'
          ? 'Too many attempts. Wait a few minutes and try again.'
          : 'Those details were not recognised.',
      )
      setBusy(false)
    }
  }

  return (
    <main className="section-shell flex min-h-[70vh] items-center py-16">
      <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-brand-orchid/15 bg-white p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-rose">Trust staff</p>
        <h1 className="mt-3 font-display text-3xl leading-tight md:text-4xl">Team portal sign-in</h1>
        <p className="mt-3 text-base leading-7 text-ink/70">
          For Trust administrators and staff. Sponsors should use the sponsor account area instead.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
          <label className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              className="rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none transition focus:border-brand-rose"
            />
          </label>

          <PasswordField
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />

          {error ? <p className="text-sm font-medium text-brand-rose">{error}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-plum disabled:opacity-60"
          >
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm leading-6 text-ink/55">
          Staff accounts are created by an administrator. There is no self-service sign-up for team
          access.
        </p>
      </div>
    </main>
  )
}
