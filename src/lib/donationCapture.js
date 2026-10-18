import { httpsCallable } from 'firebase/functions'
import { appCheckReady, functions } from './firebaseCore'

/**
 * Direct capture for the Donate form, loaded on demand.
 *
 * DonatePage imports this with import() the first time a visitor interacts with
 * the form, so the Firebase SDK (app, App Check, Functions - never Auth or
 * Firestore) is downloaded and initialised only for someone actually writing an
 * enquiry. Nothing else on the public site touches Firebase.
 */

/** Whether the callable can be reached right now. False => email fallback. */
export const captureReady = Boolean(functions) && appCheckReady

/**
 * Sends the enquiry to the submitDonationEnquiry callable. Throws
 * 'direct-capture-unavailable' when it cannot be attempted, so the caller
 * falls through to email exactly as before.
 */
export async function submitDonationEnquiry(payload) {
  if (!captureReady) throw new Error('direct-capture-unavailable')
  const submitEnquiry = httpsCallable(functions, 'submitDonationEnquiry')
  return submitEnquiry(payload)
}
