import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db, STAGES, STAGE_LABELS } from '../lib/firebase'
import { useAuth } from '../lib/authContext'
import { moveStage } from './usePipeline'

const formatWhen = (value) => {
  if (!value?.toDate) return '-'
  return value.toDate().toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })
}

/** Full moves-management history for one relationship. */
export function LeadDetailPage() {
  const { leadId } = useParams()
  const { user } = useAuth()

  const [lead, setLead] = useState(null)
  const [activity, setActivity] = useState([])
  const [error, setError] = useState(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const unsubLead = onSnapshot(
      doc(db, 'pipeline', leadId),
      (snap) => setLead(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (caught) => setError(caught),
    )

    const unsubActivity = onSnapshot(
      query(collection(db, 'pipeline', leadId, 'activity'), orderBy('timestamp', 'desc')),
      (snap) => setActivity(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (caught) => setError(caught),
    )

    return () => {
      unsubLead()
      unsubActivity()
    }
  }, [leadId])

  const handleAddNote = async (event) => {
    event.preventDefault()
    if (!note.trim()) return
    setBusy(true)

    try {
      // Written directly rather than via a callable: the rules already enforce
      // that loggedBy is the caller and that entries can never be edited or
      // deleted, so an append is safe from the client.
      await addDoc(collection(db, 'pipeline', leadId, 'activity'), {
        type: 'note',
        note: note.trim(),
        stageAtTimeOfEntry: lead?.stage ?? null,
        loggedBy: user.uid,
        timestamp: serverTimestamp(),
      })
      setNote('')
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(false)
    }
  }

  const handleStageChange = async (toStage) => {
    setBusy(true)
    try {
      await moveStage({ leadId, toStage })
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <main className="section-shell py-16">
        <p className="text-brand-rose">
          {error.code === 'permission-denied'
            ? 'Access denied by security rules - this account does not have staff access.'
            : error.message}
        </p>
      </main>
    )
  }

  return (
    <main className="section-shell py-12 md:py-16">
      <Link to="/preview/portal" className="text-sm font-semibold text-brand-rose hover:underline">
        &larr; Back to pipeline
      </Link>

      <h1 className="mt-4 font-display text-3xl leading-tight md:text-5xl">{lead?.name ?? leadId}</h1>
      {lead?.orgName ? <p className="mt-2 text-lg text-ink/70">{lead.orgName}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/55">Stage</span>
        <select
          value={lead?.stage ?? 'lead'}
          disabled={busy || !lead}
          onChange={(event) => handleStageChange(event.target.value)}
          className="rounded-full border border-brand-orchid/30 bg-white px-4 py-2 text-base"
        >
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {STAGE_LABELS[stage]}
            </option>
          ))}
        </select>
        {lead?.source ? <span className="text-sm text-ink/55">Source: {lead.source}</span> : null}
      </div>

      <form onSubmit={handleAddNote} className="mt-10 grid max-w-2xl gap-3">
        <label className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/70" htmlFor="note">
          Log an interaction
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={5000}
          placeholder="Called the donor, agreed to send a proposal..."
          className="rounded-2xl border border-ink/10 bg-[#fafafa] px-4 py-3 text-base text-ink outline-none focus:border-brand-rose"
        />
        <button
          type="submit"
          disabled={busy || !note.trim()}
          className="justify-self-start rounded-full bg-brand-rose px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-plum disabled:opacity-60"
        >
          Add to history
        </button>
      </form>

      <h2 className="mt-12 font-display text-2xl leading-tight md:text-3xl">Activity history</h2>
      <p className="mt-2 text-sm text-ink/55">
        Append-only. Entries cannot be edited or deleted, by anyone.
      </p>

      <ol className="mt-6 space-y-4">
        {activity.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-brand-orchid/15 bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-plum/80">
                {entry.type === 'stage-change' ? 'Stage change' : 'Note'}
              </p>
              <p className="text-sm text-ink/50">{formatWhen(entry.timestamp)}</p>
            </div>
            <p className="mt-2 text-base leading-7 text-ink/80">{entry.note}</p>
            {entry.stageAtTimeOfEntry ? (
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink/45">
                Stage at the time: {STAGE_LABELS[entry.stageAtTimeOfEntry] ?? entry.stageAtTimeOfEntry}
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      {activity.length === 0 ? (
        <p className="mt-4 text-base text-ink/55">No activity logged yet.</p>
      ) : null}
    </main>
  )
}
