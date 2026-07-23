import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '../lib/firebase'

/**
 * Admin-only team management.
 *
 * Every mutation goes through a Cloud Function. /team is `allow write: if false`
 * in the rules, so there is no client path to it at all — the function re-checks
 * the caller's admin claim server-side before touching anything, and writes an
 * audit entry. The admin-only routing on this page is presentation; the function
 * is the actual gate.
 */
export function TeamManagementPage() {
  const [team, setTeam] = useState([])
  const [loadError, setLoadError] = useState(null)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('editor')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    return onSnapshot(
      collection(db, 'team'),
      (snapshot) => {
        setTeam(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoadError(null)
      },
      (caught) => setLoadError(caught),
    )
  }, [])

  const handleAssign = async (event) => {
    event.preventDefault()
    setBusy(true)
    setMessage(null)

    try {
      const call = httpsCallable(functions, 'setUserRole')
      const result = await call({ email: email.trim(), role, name: name.trim() })
      setMessage({
        tone: 'ok',
        text: `${email} is now ${result.data.role}. They must sign out and back in for it to take effect.`,
      })
      setEmail('')
      setName('')
    } catch (caught) {
      setMessage({ tone: 'error', text: describeCallableError(caught) })
    } finally {
      setBusy(false)
    }
  }

  const handleDeactivate = async (uid) => {
    setBusy(true)
    setMessage(null)

    try {
      const call = httpsCallable(functions, 'deactivateTeamMember')
      await call({ uid })
      setMessage({ tone: 'ok', text: 'Access revoked and active sessions ended.' })
    } catch (caught) {
      setMessage({ tone: 'error', text: describeCallableError(caught) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="section-shell py-12 md:py-16">
      <Link to="/preview/portal" className="text-sm font-semibold text-brand-rose hover:underline">
        ← Back to pipeline
      </Link>

      <h1 className="mt-4 font-display text-3xl leading-tight md:text-5xl">Team management</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink/75">
        Grant staff access to an account that already exists. There is no self-service sign-up for
        team roles — the person must first register, then be assigned a role here.
      </p>

      <form onSubmit={handleAssign} className="mt-8 grid max-w-2xl gap-4 rounded-[1.5rem] border border-brand-orchid/15 bg-white p-6">
        <label className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">
          Name (optional)
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none focus:border-brand-rose"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">Role</legend>
          <div className="mt-1 flex gap-4">
            {['editor', 'admin'].map((option) => (
              <label key={option} className="flex items-center gap-2 text-base">
                <input
                  type="radio"
                  name="role"
                  value={option}
                  checked={role === option}
                  onChange={(event) => setRole(event.target.value)}
                />
                {option === 'admin' ? 'Admin (full access)' : 'Editor (pipeline, no team management)'}
              </label>
            ))}
          </div>
        </fieldset>

        {message ? (
          <p className={`text-sm ${message.tone === 'ok' ? 'text-brand-plum' : 'text-brand-rose'}`}>
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 justify-self-start rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-plum disabled:opacity-60"
        >
          {busy ? 'Working…' : 'Assign role'}
        </button>
      </form>

      <h2 className="mt-12 font-display text-2xl leading-tight md:text-3xl">Current team</h2>

      {loadError ? (
        <p className="mt-4 text-sm text-brand-rose">
          Could not load the team list: {loadError.code === 'permission-denied' ? 'access denied by security rules.' : loadError.message}
        </p>
      ) : null}

      <ul className="mt-5 grid gap-3">
        {team.map((member) => (
          <li
            key={member.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-orchid/15 bg-white p-4"
          >
            <div>
              <p className="font-display text-lg leading-tight">{member.name ?? member.email}</p>
              <p className="text-sm text-ink/60">
                {member.email} · {member.role}
                {member.active === false ? ' · deactivated' : ''}
              </p>
            </div>
            {member.active === false ? null : (
              <button
                type="button"
                disabled={busy}
                onClick={() => handleDeactivate(member.id)}
                className="rounded-full border border-brand-rose/40 px-4 py-2 text-sm font-semibold text-brand-rose transition hover:bg-brand-rose/5 disabled:opacity-60"
              >
                Revoke access
              </button>
            )}
          </li>
        ))}
      </ul>

      {team.length === 0 && !loadError ? (
        <p className="mt-4 text-base text-ink/55">
          No team records yet. The bootstrap admin appears here once
          <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-sm">npm run bootstrap:admin</code>
          has been run.
        </p>
      ) : null}
    </main>
  )
}

function describeCallableError(caught) {
  const code = caught?.code ?? ''
  if (code === 'functions/unauthenticated') {
    return 'The server rejected the request. App Check is not registered yet, so these actions are blocked.'
  }
  if (code === 'functions/permission-denied') {
    return 'The server refused: this account is not an admin.'
  }
  if (code === 'functions/not-found') {
    return 'No account exists for that email address. They must register first.'
  }
  return caught?.message ?? 'Something went wrong.'
}
