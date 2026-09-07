import { initializeApp } from 'firebase/app'
import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check'
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

/**
 * Whether Firebase is configured in this environment.
 *
 * This module used to `throw` when config was missing. That looked like failing
 * loudly, but the blast radius was the whole site: AuthProvider imports this
 * file and wraps every route, so one absent env var white-screened Home, About,
 * Her Story, Donate and Contact — pages that never touch Firebase at all. A
 * misconfigured deploy took down the public website, not just the portal.
 *
 * So: degrade instead. The public site renders regardless, and only the portal
 * — which genuinely cannot work without Firebase — reports itself unavailable.
 * Consumers must handle the null exports; `firebaseReady` says whether to try.
 */
export const firebaseReady = missing.length === 0

if (!firebaseReady) {
  // Still noisy in the console for whoever is deploying, just not fatal.
  console.error(
    `Firebase config incomplete — missing: ${missing.join(', ')}. ` +
      'The public site will render, but the team portal is unavailable until ' +
      'these environment variables are set for this environment.',
  )
}

export const app = firebaseReady ? initializeApp(firebaseConfig) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const functions = app
  ? getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'africa-south1')
  : null

/**
 * App Check.
 *
 * Every callable in functions/index.js is deployed with enforceAppCheck: true,
 * so a call without a valid App Check token is rejected with 401. That is the
 * correct posture — submitDonationEnquiry is an unauthenticated write into the
 * Trust's CRM, and without attestation it is a spam funnel.
 *
 * Registration is keyed off VITE_FIREBASE_APPCHECK_SITE_KEY. That variable is
 * not set in any environment yet, so App Check stays uninitialised and
 * appCheckReady is false. Consumers must check it BEFORE calling a callable:
 * firing a request we know will 401, purely to fall back afterwards, wastes the
 * visitor's time and fills the console with errors.
 *
 * The site key is a public value, intended to ship in the client. The secret
 * half never leaves Google. Nothing here is a credential.
 *
 * When the key is added this initialises on its own — no code change needed.
 */
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY

let appCheck = null
if (app && appCheckSiteKey) {
  // Debug tokens are for local work only and must never be committed. Vite
  // exposes this at build time, so it has to stay absent from every deployed
  // environment.
  if (import.meta.env.DEV && import.meta.env.VITE_APPCHECK_DEBUG_TOKEN) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN
  }
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  } catch (caught) {
    // A bad key must not white-screen the public site; the portal and the
    // enquiry form degrade instead.
    console.error('App Check failed to initialise:', caught?.message ?? caught)
    appCheck = null
  }
}

/** Whether callables can be reached. False => use the email fallback directly. */
export const appCheckReady = appCheck !== null

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
