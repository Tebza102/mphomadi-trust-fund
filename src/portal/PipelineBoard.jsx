import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STAGES, STAGE_LABELS } from '../lib/firebase'
import { moveStage, usePipeline } from './usePipeline'

/**
 * Kanban view of the donor pipeline, one column per stage.
 *
 * Drag-and-drop uses the native HTML5 drag API rather than a library — the
 * interaction is simple enough that a dependency would be more surface area
 * than it saves. Each drop calls the server, which owns the write.
 */
function LeadCard({ lead, onDragStart }) {
  return (
    <li
      draggable
      onDragStart={(event) => onDragStart(event, lead)}
      className="cursor-grab rounded-2xl border border-brand-orchid/15 bg-white p-4 shadow-sm transition hover:border-brand-rose/40 active:cursor-grabbing"
    >
      <Link to={`/preview/portal/lead/${lead.id}`} className="block">
        <p className="font-display text-base leading-tight text-ink">{lead.name ?? lead.id}</p>
        {lead.orgName ? <p className="mt-1 text-sm text-ink/60">{lead.orgName}</p> : null}
        {lead.source ? (
          <p className="mt-2 inline-flex rounded-full bg-brand-orchid/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-plum/80">
            {lead.source}
          </p>
        ) : null}
      </Link>
    </li>
  )
}

export function PipelineBoard() {
  const { leads, loading, error } = usePipeline()
  const [dragging, setDragging] = useState(null)
  const [overStage, setOverStage] = useState(null)
  const [moveError, setMoveError] = useState('')

  const handleDragStart = (event, lead) => {
    setDragging(lead)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = async (stage) => {
    setOverStage(null)
    if (!dragging || dragging.stage === stage) {
      setDragging(null)
      return
    }

    const lead = dragging
    setDragging(null)
    setMoveError('')

    try {
      await moveStage({ leadId: lead.id, toStage: stage })
    } catch (caught) {
      // The most likely cause right now is App Check: the callables are deployed
      // with enforceAppCheck: true and App Check is not registered yet.
      setMoveError(
        caught?.code === 'functions/unauthenticated'
          ? 'The server rejected the move. App Check is not registered yet, so pipeline changes are blocked.'
          : `Could not move that lead: ${caught?.message ?? 'unknown error'}`,
      )
    }
  }

  if (loading) {
    return <p className="py-12 text-center text-ink/60">Loading pipeline…</p>
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-rose/30 bg-brand-rose/5 p-6">
        <p className="font-semibold text-brand-rose">Could not load the pipeline.</p>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          {error.code === 'permission-denied'
            ? 'Firestore refused the read. That means the security rules are working — this account does not have staff access.'
            : error.message}
        </p>
      </div>
    )
  }

  return (
    <div>
      {moveError ? (
        <p className="mb-4 rounded-2xl border border-brand-rose/30 bg-brand-rose/5 p-4 text-sm text-brand-rose">
          {moveError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {STAGES.map((stage) => {
          const inStage = leads.filter((lead) => lead.stage === stage)

          return (
            <section
              key={stage}
              onDragOver={(event) => {
                event.preventDefault()
                setOverStage(stage)
              }}
              onDragLeave={() => setOverStage((current) => (current === stage ? null : current))}
              onDrop={() => handleDrop(stage)}
              className={`rounded-[1.5rem] border p-3 transition ${
                overStage === stage
                  ? 'border-brand-rose bg-brand-rose/5'
                  : 'border-brand-orchid/15 bg-[#fafafa]'
              }`}
            >
              <header className="flex items-baseline justify-between px-1 pb-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-plum/80">
                  {STAGE_LABELS[stage]}
                </h3>
                <span className="text-sm font-semibold text-ink/50">{inStage.length}</span>
              </header>

              <ul className="space-y-3">
                {inStage.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
                ))}
              </ul>

              {inStage.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-ink/40">Nothing here yet</p>
              ) : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
