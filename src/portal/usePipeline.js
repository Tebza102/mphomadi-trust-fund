import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '../lib/firebase'

/**
 * Live pipeline subscription.
 *
 * Reads are subject to firestore.rules, so a non-staff user gets a
 * permission-denied here rather than an empty list — surfaced as `error` so the
 * UI can say something honest instead of pretending the pipeline is empty.
 */
export function usePipeline() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'pipeline'), orderBy('lastActivityAt', 'desc'))

    return onSnapshot(
      q,
      (snapshot) => {
        setLeads(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
        setError(null)
      },
      (caught) => {
        setError(caught)
        setLoading(false)
      },
    )
  }, [])

  return { leads, loading, error }
}

/**
 * Move a lead to a new stage.
 *
 * Routed through the movePipelineStage callable rather than written directly,
 * so the stage change and its activity-log entry land in one transaction. A
 * drag that updated the stage but failed to log who did it would quietly break
 * the accountability trail the audit requirement exists to protect.
 */
export async function moveStage({ leadId, toStage, note }) {
  const call = httpsCallable(functions, 'movePipelineStage')
  const result = await call({ leadId, toStage, note })
  return result.data
}
