/**
 * One-off: grant `admin` to a single named account.
 *
 *   node scripts/bootstrap-admin.mjs tebogo@example.co.za
 *
 * Why a script and not a Cloud Function
 * ------------------------------------
 * The obvious alternative — "the first user to sign up becomes admin" — is a
 * race. Between deploying that trigger and the client registering, any signup
 * (including a bot hitting the public sponsor form) would win and hold permanent
 * admin over the donor database, with nothing in the logs marking it as wrong.
 *
 * This runs from a trusted machine, targets one known address, and is reachable
 * from nowhere on the public internet.
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS pointing at a service-account key.
 * That key is equivalent to full project access and must never be committed —
 * .gitignore covers the usual filenames, but check before you stage.
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

const email = process.argv[2]?.trim().toLowerCase()

if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/bootstrap-admin.mjs <email>')
  process.exit(1)
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!keyPath) {
  console.error('GOOGLE_APPLICATION_CREDENTIALS is not set.')
  console.error('Point it at a service-account key downloaded from:')
  console.error('  Firebase Console → Project settings → Service accounts → Generate new private key')
  process.exit(1)
}

initializeApp({
  credential: keyPath ? cert(JSON.parse(readFileSync(keyPath, 'utf8'))) : applicationDefault(),
})

const auth = getAuth()
const db = getFirestore()

let user
try {
  user = await auth.getUserByEmail(email)
} catch {
  console.error(`No account exists for ${email}.`)
  console.error('Create it first (sign up through the site, or add it in the Auth console), then re-run.')
  process.exit(1)
}

const existingRole = user.customClaims?.role ?? null

if (existingRole === 'admin') {
  console.log(`${email} is already an admin. Nothing to do.`)
  process.exit(0)
}

// Surface how many admins already exist. Not a hard block — you may legitimately
// want a second — but a silent third admin is worth noticing.
const existingAdmins = await db.collection('team').where('role', '==', 'admin').get()
if (!existingAdmins.empty) {
  console.warn(`Note: ${existingAdmins.size} admin(s) already recorded in /team.`)
}

await auth.setCustomUserClaims(user.uid, { role: 'admin' })

await db.collection('team').doc(user.uid).set(
  {
    name: user.displayName ?? null,
    email: user.email,
    role: 'admin',
    dateAdded: FieldValue.serverTimestamp(),
    addedBy: 'bootstrap-script',
  },
  { merge: true },
)

await db.collection('auditLog').add({
  actorUid: 'bootstrap-script',
  actorEmail: null,
  action: 'role.assigned',
  targetUid: user.uid,
  details: { email, previousRole: existingRole, newRole: 'admin', via: 'bootstrap' },
  at: FieldValue.serverTimestamp(),
})

console.log(`✓ ${email} (${user.uid}) is now an admin.`)
console.log('  They must sign out and back in — the existing ID token still carries the old claim.')
process.exit(0)
