import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { app, appCheckReady, firebaseReady, functions, useEmulators } from './firebaseCore'

/**
 * Firebase for the team portal: the shared core (app, App Check, Functions)
 * plus Auth and Firestore.
 *
 * Only the lazily loaded portal chunk imports this module, so Auth, Firestore
 * (and Firestore's re2js dependency) never reach a public page. Config and App
 * Check now live in firebaseEnv.js and firebaseCore.js.
 *
 * When this environment has no Firebase config every export below is null and
 * `firebaseReady` is false; the portal says so instead of breaking (see
 * PortalUnavailable). The public site never loads this file at all.
 */
export { app, appCheckReady, firebaseReady, functions }
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

// Local emulator suite only; dead code in deployed builds (see firebaseCore.js).
if (useEmulators && auth && db) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

// 'lapsed' added 21 July 2026 — a terminal stage for a relationship that stops
// giving (most often a recurring donor). Without it there was nowhere for that
// to go: leaving it at 'recurring' overstates the run-rate, and no other stage
// fits a relationship that existed and ended.
export const STAGES = ['lead', 'contacted', 'interested', 'pledged', 'donated', 'recurring', 'lapsed']

export const STAGE_LABELS = {
  lead: 'Lead',
  contacted: 'Contacted',
  interested: 'Interested',
  pledged: 'Pledged',
  donated: 'Donated',
  recurring: 'Recurring',
  lapsed: 'Lapsed',
}
