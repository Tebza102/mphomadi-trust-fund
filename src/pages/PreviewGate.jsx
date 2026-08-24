import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const PREVIEW_PASSWORD = 'MphoMadiPreview26!'
const STORAGE_KEY = 'mphomadi-preview-access'

export function PreviewGate() {
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(STORAGE_KEY) === 'unlocked'
  })
  const [error, setError] = useState('')

  // No effect needed to re-read localStorage: the useState initializer above
  // already does it on first render, and this is a client-only SPA, so an
  // effect could never observe a different value — it only cost a second render.

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password === PREVIEW_PASSWORD) {
      window.localStorage.setItem(STORAGE_KEY, 'unlocked')
      setIsUnlocked(true)
      setError('')
      return
    }

    setError('That password is not correct. Please try again.')
  }

  if (isUnlocked) {
    return <Outlet />
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f6effa_0%,#fffaf7_44%,#ffffff_100%)] px-6 py-10">
      <Helmet>
        <title>Mpho Madi Trust Fund | Preview Access</title>
        <meta name="description" content="Client review preview for the Mpho Madi Trust Fund website." />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="googlebot" content="noindex,nofollow,noarchive" />
      </Helmet>
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center">
        <div className="w-full rounded-[2rem] border border-brand-orchid/15 bg-white/90 p-6 shadow-[0_30px_90px_-55px_rgba(47,22,71,0.45)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-rose">Website Development Preview</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">Website Development Preview</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/75">
            This area is reserved for client review while the website is being updated.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
              Preview password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base normal-case text-ink outline-none transition focus:border-brand-rose"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm font-medium text-brand-rose">{error}</p> : null}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-plum"
              >
                Enter Preview
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm leading-6 text-ink/60">
            This preview is lightweight and stored in your browser on this device only.
          </p>
        </div>
      </div>
    </main>
  )
}
