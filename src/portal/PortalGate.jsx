import { Component, Suspense, lazy } from 'react'

/**
 * Loads the team portal on demand.
 *
 * This file is part of the main bundle, so it must import nothing that needs
 * Firebase - only React. The portal itself (PortalApp and everything under it)
 * is a separate chunk fetched the first time someone opens a /portal URL.
 *
 * While the chunk downloads the visitor sees an intentional, branded holding
 * state rather than a blank area. If the download fails (offline, or a deploy
 * replaced the chunk) they get a plain explanation and a Try again button.
 *
 * Try again reloads the page rather than re-running import(): browsers keep a
 * failed module fetch in their module map, so a second import() of the same
 * chunk in the same page fails instantly without touching the network (verified
 * in Chromium). A reload keeps the URL, fetches fresh, and also recovers from a
 * deploy that replaced the chunk.
 */
const Portal = lazy(() => import('./PortalApp').then((module) => ({ default: module.PortalApp })))

function PortalLoading() {
  return (
    <main className="section-shell py-24" aria-busy="true">
      <div role="status" aria-live="polite">
        <p className="flex items-center gap-3 text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">
          <span aria-hidden="true" className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-green motion-reduce:animate-none" />
          Team portal
        </p>
        {/* Not an h1: the portal's own heading is the page heading once it loads. */}
        <p className="mt-3 max-w-3xl font-display text-3xl leading-tight text-ink md:text-5xl">Opening the team portal…</p>
      </div>
    </main>
  )
}

function PortalLoadError() {
  return (
    <main className="section-shell py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Team portal</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-5xl">The team portal didn’t load.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
        This is usually a dropped connection or a site update that happened while the page was open. Nothing was
        lost.
      </p>
      <div className="mt-8">
        <button type="button" onClick={() => window.location.reload()} className="btn-primary">
          Try again
        </button>
      </div>
    </main>
  )
}

class PortalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('Team portal failed to load:', error)
  }

  render() {
    return this.state.failed ? <PortalLoadError /> : this.props.children
  }
}

export function PortalGate() {
  return (
    <PortalErrorBoundary>
      <Suspense fallback={<PortalLoading />}>
        <Portal />
      </Suspense>
    </PortalErrorBoundary>
  )
}
