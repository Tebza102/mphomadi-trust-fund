/**
 * Cloud Functions — Mpho Madi Trust Fund admin layer.
 *
 * Role model
 * ----------
 * Roles live exclusively in Firebase Auth custom claims and are written only by
 * the Admin SDK, here. There is no client-reachable path that sets a caller's
 * own role. The bootstrap admin is created out-of-band by
 * scripts/bootstrap-admin.mjs — deliberately NOT by a "first user wins" trigger,
 * which would let anyone who signs up before the client claim permanent admin.
 */

const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
const functionsV1 = require('firebase-functions/v1')
const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')

admin.initializeApp()

// Co-located with the Firestore database (africa-south1 / Johannesburg) so calls
// don't cross continents and incur egress on every write.
//
// maxInstances keeps the Trust's costs predictable: a runaway loop or an attack
// cannot scale this to thousands of billable instances.
setGlobalOptions({ region: 'africa-south1', maxInstances: 10 })

const ASSIGNABLE_ROLES = ['admin', 'editor']
const ALL_ROLES = ['admin', 'editor', 'sponsor']

/** Append to the audit log. Server-side only — clients cannot write here. */
async function recordAudit({ actorUid, actorEmail, action, targetUid, details }) {
  await admin.firestore().collection('auditLog').add({
    actorUid,
    actorEmail: actorEmail ?? null,
    action,
    targetUid: targetUid ?? null,
    details: details ?? {},
    at: admin.firestore.FieldValue.serverTimestamp(),
  })
}

/**
 * Every new account defaults to `sponsor` — the lowest privilege level.
 *
 * A brief window exists between account creation and this claim landing, during
 * which the user has no role and the rules deny them. That is the correct
 * failure direction: they get less access, never more.
 */
// Confirmed at deploy: the 1st-gen Cloud Functions API rejects africa-south1
// ("Permission denied on 'locations/africa-south1'"), so this trigger sits in
// europe-west1 while the 2nd-gen callables stay co-located with the database.
// It fires once per signup and writes a single claim, so the cross-region hop is
// negligible — unlike the request-path functions, which are called repeatedly.
exports.onUserCreated = functionsV1
  .region('europe-west1')
  .auth.user()
  .onCreate(async (user) => {
    await admin.auth().setCustomUserClaims(user.uid, { role: 'sponsor' })

    logger.info('Assigned default sponsor role', { uid: user.uid })

    await recordAudit({
      actorUid: 'system',
      actorEmail: null,
      action: 'user.created',
      targetUid: user.uid,
      details: { email: user.email ?? null, defaultRole: 'sponsor' },
    })
  })

/**
 * Admin-only: grant `admin` or `editor` to an existing user, by email.
 *
 * Guards, in order: App Check (blocks scripted callers), authentication,
 * admin claim re-verified server-side from the token (never trusted from the
 * request body), then input validation.
 */
exports.setUserRole = onCall({ enforceAppCheck: true }, async (request) => {
  const { auth: caller, data } = request

  if (!caller) {
    throw new HttpsError('unauthenticated', 'Sign in required.')
  }

  // Re-verified here, server-side. A client-side role check is a UI convenience,
  // never an authorisation decision.
  if (caller.token.role !== 'admin') {
    logger.warn('Non-admin attempted role assignment', {
      uid: caller.uid,
      claimedRole: caller.token.role ?? null,
    })
    throw new HttpsError('permission-denied', 'Only an admin can assign roles.')
  }

  const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : ''
  const role = typeof data?.role === 'string' ? data.role : ''
  const name = typeof data?.name === 'string' ? data.name.trim() : ''

  if (!email || email.length > 254 || !email.includes('@')) {
    throw new HttpsError('invalid-argument', 'A valid email address is required.')
  }
  if (!ASSIGNABLE_ROLES.includes(role)) {
    throw new HttpsError('invalid-argument', `role must be one of: ${ASSIGNABLE_ROLES.join(', ')}`)
  }
  if (name.length > 120) {
    throw new HttpsError('invalid-argument', 'Name is too long.')
  }

  let target
  try {
    target = await admin.auth().getUserByEmail(email)
  } catch {
    // Deliberately vague: this endpoint should not confirm which addresses have
    // accounts to anyone probing it.
    throw new HttpsError('not-found', 'No account exists for that email address.')
  }

  if (target.uid === caller.uid) {
    throw new HttpsError('failed-precondition', 'You cannot change your own role.')
  }

  const previousRole = target.customClaims?.role ?? null

  await admin.auth().setCustomUserClaims(target.uid, { role })

  await admin.firestore().collection('team').doc(target.uid).set(
    {
      name: name || target.displayName || null,
      email: target.email ?? email,
      role,
      dateAdded: admin.firestore.FieldValue.serverTimestamp(),
      addedBy: caller.uid,
    },
    { merge: true },
  )

  await recordAudit({
    actorUid: caller.uid,
    actorEmail: caller.token.email ?? null,
    action: 'role.assigned',
    targetUid: target.uid,
    details: { email, previousRole, newRole: role },
  })

  logger.info('Role assigned', { by: caller.uid, target: target.uid, role })

  // The target's existing ID token still carries the old claim until it
  // refreshes (up to an hour, or immediately via getIdToken(true)).
  return { ok: true, uid: target.uid, role, tokenRefreshRequired: true }
})

/**
 * Admin-only: revoke staff access by demoting to `sponsor` and revoking live
 * sessions, so access ends now rather than whenever the token happens to expire.
 */
exports.deactivateTeamMember = onCall({ enforceAppCheck: true }, async (request) => {
  const { auth: caller, data } = request

  if (!caller) {
    throw new HttpsError('unauthenticated', 'Sign in required.')
  }
  if (caller.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Only an admin can deactivate team members.')
  }

  const uid = typeof data?.uid === 'string' ? data.uid.trim() : ''
  if (!uid) {
    throw new HttpsError('invalid-argument', 'uid is required.')
  }
  if (uid === caller.uid) {
    throw new HttpsError('failed-precondition', 'You cannot deactivate your own account.')
  }

  const target = await admin.auth().getUser(uid).catch(() => null)
  if (!target) {
    throw new HttpsError('not-found', 'No such user.')
  }

  const previousRole = target.customClaims?.role ?? null

  await admin.auth().setCustomUserClaims(uid, { role: 'sponsor' })
  await admin.auth().revokeRefreshTokens(uid)
  await admin.firestore().collection('team').doc(uid).set(
    { active: false, deactivatedAt: admin.firestore.FieldValue.serverTimestamp(), deactivatedBy: caller.uid },
    { merge: true },
  )

  await recordAudit({
    actorUid: caller.uid,
    actorEmail: caller.token.email ?? null,
    action: 'team.deactivated',
    targetUid: uid,
    details: { previousRole },
  })

  return { ok: true, uid }
})

/**
 * Moves a pipeline lead to a new stage and appends the matching activity entry
 * in one transaction.
 *
 * This lives server-side rather than in the drag-and-drop UI so the stage change
 * and its log entry cannot come apart — a stage that moved with no record of who
 * moved it is exactly what the audit requirement exists to prevent.
 */
exports.movePipelineStage = onCall({ enforceAppCheck: true }, async (request) => {
  const { auth: caller, data } = request

  if (!caller) {
    throw new HttpsError('unauthenticated', 'Sign in required.')
  }
  if (!['admin', 'editor'].includes(caller.token.role)) {
    throw new HttpsError('permission-denied', 'Team access required.')
  }

  // Keep in sync with STAGES in src/lib/firebase.js and the pipeline stage
  // allowlist in firestore.rules.
  const STAGES = ['lead', 'contacted', 'interested', 'pledged', 'donated', 'recurring', 'lapsed']
  const leadId = typeof data?.leadId === 'string' ? data.leadId.trim() : ''
  const toStage = typeof data?.toStage === 'string' ? data.toStage : ''
  const note = typeof data?.note === 'string' ? data.note.slice(0, 5000) : ''

  if (!leadId) throw new HttpsError('invalid-argument', 'leadId is required.')
  if (!STAGES.includes(toStage)) {
    throw new HttpsError('invalid-argument', `toStage must be one of: ${STAGES.join(', ')}`)
  }

  const db = admin.firestore()
  const leadRef = db.collection('pipeline').doc(leadId)

  const fromStage = await db.runTransaction(async (tx) => {
    const snap = await tx.get(leadRef)
    if (!snap.exists) {
      throw new HttpsError('not-found', 'No such lead.')
    }

    const previous = snap.get('stage') ?? null

    tx.update(leadRef, {
      stage: toStage,
      lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    tx.set(leadRef.collection('activity').doc(), {
      type: 'stage-change',
      note: note || `Stage changed from ${previous ?? 'none'} to ${toStage}.`,
      stageAtTimeOfEntry: previous,
      newStage: toStage,
      loggedBy: caller.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })

    return previous
  })

  await recordAudit({
    actorUid: caller.uid,
    actorEmail: caller.token.email ?? null,
    action: 'pipeline.stageChanged',
    targetUid: null,
    details: { leadId, fromStage, toStage },
  })

  return { ok: true, leadId, fromStage, toStage }
})

/**
 * Public donation / sponsorship enquiry intake.
 *
 * Writes straight into the existing `pipeline` collection so an enquiry becomes
 * a lead the team already knows how to work — same model, same board, same
 * stage vocabulary. There is deliberately no second lead store and no parallel
 * admin screen.
 *
 * This is the only unauthenticated callable in the codebase, so the trust
 * boundary matters. firestore.rules denies every client write to /pipeline
 * (`allow create, update: if isStaff()`), which is what forces intake through
 * here, where it can be validated before the Admin SDK writes it. The rules are
 * not relaxed to let the browser write a lead directly.
 *
 * The client supplies contact details and nothing else. `stage`, `source`,
 * `assignedTo` and the opening activity entry are set here, server-side — a
 * visitor cannot post themselves in as a 'donated' lead owned by a trustee,
 * whatever they put in the payload.
 *
 * enforceAppCheck matches every other callable here. Without it this endpoint
 * is an unauthenticated write into the Trust's CRM, i.e. a spam funnel. Until
 * App Check is registered on the client this call is rejected in production and
 * the form falls back to email, which is why that fallback is not optional.
 */
/**
 * Validates and normalises a public enquiry into the lead document that gets
 * written to /pipeline. Pure and exported so it can be unit-tested directly:
 * the callable around it enforces App Check, which cannot be satisfied from a
 * test harness, so the rules that actually matter would otherwise go
 * unexercised.
 *
 * Throws HttpsError on invalid input. Returns the document minus its server
 * timestamps, which only the caller can mint.
 */
function buildEnquiryLead(data = {}) {
  /**
   * Trim, cap, and strip control characters. A newline survives only in the
   * free-text message; everywhere else control characters are what make log
   * and email-header injection possible downstream.
   */
  const clean = (value, max, { multiline = false } = {}) => {
    if (typeof value !== 'string') return ''
    let out = ''
    for (const ch of value) {
      const code = ch.charCodeAt(0)
      if (code < 32 || code === 127) {
        out += multiline && code === 10 ? ch : ' '
      } else {
        out += ch
      }
    }
    if (!multiline) out = out.replace(/\s{2,}/g, ' ')
    return out.trim().slice(0, max)
  }

  const fullName = clean(data.fullName, 120)
  const email = clean(data.email, 254).toLowerCase()
  const phone = clean(data.phone, 40)
  const supportType = clean(data.supportType, 80)
  const interest = clean(data.interest, 120)
  const amount = clean(data.amount, 60)
  const orgName = clean(data.orgName, 160)
  const message = clean(data.message, 5000, { multiline: true })

  // POPIA: no consent, no record. Checked here and not only in the browser,
  // because a client-side tick is not evidence of anything.
  if (data.consent !== true) {
    throw new HttpsError('failed-precondition', 'Consent is required before an enquiry can be recorded.')
  }
  if (!fullName) {
    throw new HttpsError('invalid-argument', 'A name is required.')
  }
  // Either channel is enough — insisting on both loses enquiries from people
  // who only want to be phoned, or only want to be emailed.
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailLooksValid && !phone) {
    throw new HttpsError('invalid-argument', 'An email address or a phone number is required.')
  }
  if (email && !emailLooksValid) {
    throw new HttpsError('invalid-argument', 'That email address is not valid.')
  }
  // A corporate sponsorship enquiry without an organisation is not actionable.
  const isCorporate = /corporate|company|organisation|organization/i.test(supportType + ' ' + interest)
  if (isCorporate && !orgName) {
    throw new HttpsError('invalid-argument', 'A company or organisation name is required for corporate sponsorship.')
  }

  return {
    name: fullName,
    email: email || null,
    phone: phone || null,
    orgName: orgName || null,
    supportType: supportType || null,
    interest: interest || null,
    amount: amount || null,
    message: message || null,
    consentGiven: true,
    // Server-assigned. Never read from the payload — a visitor cannot post
    // themselves in as a 'donated' lead owned by a trustee.
    stage: 'lead',
    source: 'website donation form',
    assignedTo: null,
  }
}

/**
 * Public donation / sponsorship enquiry intake.
 *
 * Writes straight into the existing `pipeline` collection so an enquiry becomes
 * a lead the team already knows how to work — same model, same board, same
 * stage vocabulary. There is deliberately no second lead store and no parallel
 * admin screen.
 *
 * This is the only unauthenticated callable in the codebase, so the trust
 * boundary matters. firestore.rules denies every client write to /pipeline
 * (`allow create, update: if isStaff()`), which is what forces intake through
 * here, where it can be validated before the Admin SDK writes it. The rules are
 * not relaxed to let the browser write a lead directly.
 *
 * enforceAppCheck matches every other callable here. Without it this endpoint
 * is an unauthenticated write into the Trust's CRM, i.e. a spam funnel. Until
 * App Check is registered on the client this call is rejected in production and
 * the form falls back to email, which is why that fallback is not optional.
 */
exports.submitDonationEnquiry = onCall({ enforceAppCheck: true }, async (request) => {
  const lead = buildEnquiryLead(request.data)
  const db = admin.firestore()
  const now = admin.firestore.FieldValue.serverTimestamp()

  const leadRef = await db.collection('pipeline').add({
    ...lead,
    consentDate: now,
    createdAt: now,
    lastActivityAt: now,
  })

  // Opening entry so the moves-management history starts at the enquiry itself
  // rather than at whatever a staff member happens to do first.
  await leadRef.collection('activity').add({
    type: 'enquiry-received',
    note: 'Enquiry submitted through the website donation form.',
    loggedBy: null,
    timestamp: now,
  })

  logger.info('Donation enquiry captured', { leadId: leadRef.id })

  return { ok: true, leadId: leadRef.id }
})

module.exports.buildEnquiryLead = buildEnquiryLead
module.exports.ALL_ROLES = ALL_ROLES
