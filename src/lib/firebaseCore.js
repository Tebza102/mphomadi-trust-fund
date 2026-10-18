import { initializeApp } from 'firebase/app'
import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { appCheckSiteKey, firebaseConfig, firebaseConfigured, missingFirebaseConfig } from './firebaseEnv'

/**
 * The parts of Firebase both the Donate form and the team portal need: the app,
 * App Check and Cloud Functions. Auth and Firestore live in firebase.js, which
 * only the portal loads.
 *
 * This module is never in the main bundle. It is reached only through dynamic
 * import() - from the portal chunk, or from donationCapture.js once a visitor
 * starts filling in the Donate form - so public pages never initialise Firebase.
 */
export const firebaseReady = firebaseConfigured

if (!firebaseReady) {
  // Still noisy in the console for whoever is deploying, just not fatal. The
  // public site never reaches this module, so this only appears on the portal
  // or the Donate form of a misconfigured deploy.
  console.error(
    `Firebase config incomplete — missing: ${missingFirebaseConfig.join(', ')}. ` +
      'The public site will render, but the team portal is unavailable until ' +
      'these environment variables are set for this environment.',
  )
}

export const app = firebaseReady ? initializeApp(firebaseConfig) : null
export const functions = app
  ? getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'africa-south1')
  : null

/**
 * Local emulator suite, for builds made with VITE_USE_FIREBASE_EMULATORS=true
 * and a demo-* project id. Vite replaces the flag at build time, so in every
 * deployed build this block is dead code and is removed.
 */
export const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
if (useEmulators && functions) connectFunctionsEmulator(functions, '127.0.0.1', 5001)

/**
 * App Check.
 *
 * Every callable in functions/index.js is deployed with enforceAppCheck: true,
 * so a call without a valid App Check token is rejected with 401. That is the
 * correct posture — submitDonationEnquiry is an unauthenticated write into the
 * Trust's CRM, and without attestation it is a spam funnel.
 *
 * Registration is keyed off VITE_FIREBASE_APPCHECK_SITE_KEY. When it is not set,
 * App Check stays uninitialised and appCheckReady is false. Consumers must check
 * it BEFORE calling a callable: firing a request we know will 401, purely to
 * fall back afterwards, wastes the visitor's time and fills the console with
 * errors.
 *
 * The site key is a public value, intended to ship in the client. The secret
 * half never leaves Google. Nothing here is a credential.
 */
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
    // A bad key must not break the page; the portal and the enquiry form
    // degrade instead.
    console.error('App Check failed to initialise:', caught?.message ?? caught)
    appCheck = null
  }
}

/** Whether callables can be reached. False => use the email fallback directly. */
export const appCheckReady = appCheck !== null
