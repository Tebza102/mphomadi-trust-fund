/**
 * Firebase client configuration, read from build-time env vars.
 *
 * Deliberately imports nothing from the Firebase SDK. Public pages read this to
 * know whether direct capture is possible without downloading or initialising
 * Firebase; the SDK itself is loaded only by the team portal and by the Donate
 * form once a visitor starts filling it in.
 *
 * These values are public by design - they identify the project, they do not
 * authorise anything. Access control lives in firestore.rules and in the
 * server-side role checks inside Cloud Functions.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const missingFirebaseConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

/** Whether this environment has Firebase client config at all. */
export const firebaseConfigured = missingFirebaseConfig.length === 0

/** App Check site key. Public, same as the config above. */
export const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY

/**
 * Whether the Donate form can attempt direct capture. Every callable enforces
 * App Check, so without a site key the form is an email-composition flow.
 * (If App Check is configured but fails to initialise at runtime, the submit
 * path still falls back to email - see donationCapture.js.)
 */
export const directCaptureConfigured = firebaseConfigured && Boolean(appCheckSiteKey)
