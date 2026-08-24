/**
 * Shown on portal screens when this environment has no Firebase client config.
 *
 * This is a deployment-configuration state, not an error the visitor caused and
 * not something they can act on — so it stays calm and factual, and it does not
 * pretend the portal is merely "coming soon". The public site is unaffected;
 * only sign-in and the screens behind it need Firebase.
 */
export function PortalUnavailable() {
  return (
    <main className="section-shell py-24">
      <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-rose">Team portal</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
        The portal is not available in this environment.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">
        Sign-in needs Firebase configuration that has not been set for this deployment. The rest of
        the site works normally. If you are reviewing a preview build, this is expected — the portal
        is available on the live site.
      </p>
    </main>
  )
}
