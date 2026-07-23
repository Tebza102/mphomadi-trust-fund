import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

// Config comes from .env.local. These values are public by design — they
// identify the project, they do not authorise anything. Access control lives in
// firestore.rules and in the server-side role checks inside Cloud Functions.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  // Fail loudly at startup rather than with a cryptic Firebase error later.
  throw new Error(
    `Firebase config incomplete — missing: ${missing.join(', ')}. ` +
      'Copy .env.example to .env.local and fill in the values.',
  )
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'africa-south1')

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
