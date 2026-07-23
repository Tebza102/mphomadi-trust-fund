import { Link } from 'react-router-dom'
import { STAGES, STAGE_LABELS } from '../lib/firebase'
import { useAuth } from '../lib/authContext'
import { usePipeline } from './usePipeline'
import { PipelineBoard } from './PipelineBoard'

/** Counts per stage plus the headline numbers the Trust actually tracks. */
function Reporting({ leads }) {
  const perStage = STAGES.map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.stage === stage).length,
  }))

  const recurring = leads.filter((lead) => lead.stage === 'recurring').length
  const donated = leads.filter((lead) => lead.stage === 'donated').length

  return (
    <section aria-labelledby="reporting" className="mt-10">
      <h2 id="reporting" className="font-display text-2xl leading-tight md:text-3xl">
        At a glance
      </h2>

      <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-6">
        {perStage.map(({ stage, count }) => (
          <div key={stage} className="rounded-2xl border border-brand-orchid/15 bg-white p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
              {STAGE_LABELS[stage]}
            </dt>
            <dd className="mt-1 font-display text-2xl text-ink">{count}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-brand-plum p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            Relationships giving
          </p>
          <p className="mt-1 font-display text-3xl">{donated + recurring}</p>
        </div>
        <div className="rounded-2xl border border-brand-orchid/15 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
            Recurring supporters
          </p>
          <p className="mt-1 font-display text-3xl text-ink">{recurring}</p>
        </div>
        <div className="rounded-2xl border border-dashed border-brand-orchid/30 bg-[#fcf8f6] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
            Total raised / run-rate
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Needs the /donations collection, which only fills once a payment gateway is wired in.
          </p>
        </div>
      </div>
    </section>
  )
}

export function PortalDashboard() {
  const { user, role, isAdmin, signOut } = useAuth()
  const { leads, error } = usePipeline()

  return (
    <main className="section-shell py-12 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-rose">Team portal</p>
          <h1 className="mt-2 font-display text-3xl leading-tight md:text-5xl">Donor pipeline</h1>
          <p className="mt-2 text-base text-ink/60">
            Signed in as {user?.email} &middot; role <strong>{role}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isAdmin ? (
            <Link
              to="/preview/portal/team"
              className="rounded-full border border-brand-orchid/40 px-5 py-2.5 text-sm font-semibold transition hover:border-brand-rose"
            >
              Team management
            </Link>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold transition hover:border-ink/40"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-10">
        <PipelineBoard />
      </div>

      {!error ? <Reporting leads={leads} /> : null}
    </main>
  )
}
