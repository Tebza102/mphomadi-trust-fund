/**
 * Firestore security-rules tests, run against the emulator.
 *
 *   npm run test:rules
 *
 * These assert the rules from the attacker's side as well as the happy path.
 * A rules suite that only proves "admin can do admin things" tells you nothing
 * about whether a sponsor can reach the donor pipeline.
 */

import { readFileSync } from 'node:fs'
import { after, before, beforeEach, describe, it } from 'node:test'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore'

const PROJECT_ID = 'mphomaditf-rules-test'

let testEnv

/** Authenticated context carrying a role claim, as the real app would. */
const asRole = (uid, role, extra = {}) =>
  testEnv.authenticatedContext(uid, { role, email_verified: true, ...extra }).firestore()

const admin = () => asRole('admin-1', 'admin')
const editor = () => asRole('editor-1', 'editor')
const sponsorA = () => asRole('sponsor-a', 'sponsor')
const sponsorB = () => asRole('sponsor-b', 'sponsor')
const unverifiedSponsor = () => asRole('sponsor-a', 'sponsor', { email_verified: false })
const anon = () => testEnv.unauthenticatedContext().firestore()

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  })
})

after(async () => {
  await testEnv?.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()

  // Seed through a rules-bypassing context, the way the Admin SDK would.
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await setDoc(doc(db, 'sponsors/sponsor-a'), {
      name: 'Sponsor A',
      email: 'a@example.com',
      consentGiven: true,
      consentDate: new Date(),
    })
    await setDoc(doc(db, 'sponsors/sponsor-b'), {
      name: 'Sponsor B',
      email: 'b@example.com',
      consentGiven: true,
      consentDate: new Date(),
    })
    await setDoc(doc(db, 'pipeline/lead-1'), {
      stage: 'lead',
      source: 'website form',
      assignedTo: 'editor-1',
    })
    await setDoc(doc(db, 'pipeline/lead-1/activity/entry-1'), {
      note: 'Initial enquiry',
      loggedBy: 'editor-1',
      timestamp: new Date(),
    })
    await setDoc(doc(db, 'donations/donation-1'), {
      sponsorId: 'sponsor-a',
      amount: 500,
      currency: 'ZAR',
    })
    await setDoc(doc(db, 'team/editor-1'), { name: 'Editor', role: 'editor' })
    await setDoc(doc(db, 'auditLog/entry-1'), { action: 'role.assigned', actorUid: 'admin-1' })
  })
})

// ---------------------------------------------------------------------------

describe('unauthenticated access', () => {
  it('cannot read sponsor profiles', async () => {
    await assertFails(getDoc(doc(anon(), 'sponsors/sponsor-a')))
  })

  it('cannot read the pipeline', async () => {
    await assertFails(getDoc(doc(anon(), 'pipeline/lead-1')))
  })

  it('cannot read donations', async () => {
    await assertFails(getDoc(doc(anon(), 'donations/donation-1')))
  })

  it('cannot read the audit log', async () => {
    await assertFails(getDoc(doc(anon(), 'auditLog/entry-1')))
  })

  it('cannot write anywhere', async () => {
    await assertFails(setDoc(doc(anon(), 'sponsors/sponsor-a'), { name: 'hacked' }))
    await assertFails(setDoc(doc(anon(), 'pipeline/lead-2'), { stage: 'lead' }))
  })
})

describe('sponsor isolation', () => {
  it('can read its own profile', async () => {
    await assertSucceeds(getDoc(doc(sponsorA(), 'sponsors/sponsor-a')))
  })

  it('CANNOT read another sponsor profile', async () => {
    await assertFails(getDoc(doc(sponsorA(), 'sponsors/sponsor-b')))
  })

  it('CANNOT write another sponsor profile', async () => {
    await assertFails(updateDoc(doc(sponsorA(), 'sponsors/sponsor-b'), { name: 'overwritten' }))
  })

  it('can update its own permitted fields', async () => {
    await assertSucceeds(
      updateDoc(doc(sponsorA(), 'sponsors/sponsor-a'), { name: 'New Name', phone: '0800000000' }),
    )
  })

  it('CANNOT inject an unexpected field (e.g. a role-shaped one)', async () => {
    await assertFails(updateDoc(doc(sponsorA(), 'sponsors/sponsor-a'), { role: 'admin' }))
    await assertFails(updateDoc(doc(sponsorA(), 'sponsors/sponsor-a'), { isAdmin: true }))
  })

  it('CANNOT rewrite POPIA consent evidence', async () => {
    await assertFails(updateDoc(doc(sponsorA(), 'sponsors/sponsor-a'), { consentGiven: false }))
  })

  it('CANNOT delete its own profile (retention is an admin decision)', async () => {
    await assertFails(deleteDoc(doc(sponsorA(), 'sponsors/sponsor-a')))
  })
})

describe('sponsor vs internal collections', () => {
  it('CANNOT read the pipeline', async () => {
    await assertFails(getDoc(doc(sponsorA(), 'pipeline/lead-1')))
  })

  it('CANNOT write to the pipeline', async () => {
    await assertFails(setDoc(doc(sponsorA(), 'pipeline/lead-2'), { stage: 'lead' }))
  })

  it('CANNOT read pipeline activity', async () => {
    await assertFails(getDoc(doc(sponsorA(), 'pipeline/lead-1/activity/entry-1')))
  })

  it('CANNOT read the audit log', async () => {
    await assertFails(getDoc(doc(sponsorA(), 'auditLog/entry-1')))
  })

  it('CANNOT read the team directory', async () => {
    await assertFails(getDoc(doc(sponsorA(), 'team/editor-1')))
  })

  it('CANNOT read another sponsor donation', async () => {
    await assertFails(getDocs(collection(sponsorB(), 'donations')))
  })
})

describe('email verification gate', () => {
  it('verified sponsor can read its own donation', async () => {
    await assertSucceeds(getDoc(doc(sponsorA(), 'donations/donation-1')))
  })

  it('UNVERIFIED sponsor cannot read its own donation', async () => {
    await assertFails(getDoc(doc(unverifiedSponsor(), 'donations/donation-1')))
  })
})

describe('staff access', () => {
  it('editor can read and update the pipeline', async () => {
    await assertSucceeds(getDoc(doc(editor(), 'pipeline/lead-1')))
    await assertSucceeds(
      setDoc(doc(editor(), 'pipeline/lead-1'), { stage: 'contacted', source: 'website form' }),
    )
  })

  it('editor cannot set an invalid stage', async () => {
    await assertFails(setDoc(doc(editor(), 'pipeline/lead-1'), { stage: 'not-a-stage' }))
  })

  it('editor can append activity but NOT rewrite history', async () => {
    await assertSucceeds(
      addDoc(collection(editor(), 'pipeline/lead-1/activity'), {
        note: 'Called the donor',
        loggedBy: 'editor-1',
        timestamp: new Date(),
      }),
    )
    await assertFails(
      updateDoc(doc(editor(), 'pipeline/lead-1/activity/entry-1'), { note: 'rewritten' }),
    )
    await assertFails(deleteDoc(doc(editor(), 'pipeline/lead-1/activity/entry-1')))
  })

  it('editor cannot forge another user as the author of an entry', async () => {
    await assertFails(
      addDoc(collection(editor(), 'pipeline/lead-1/activity'), {
        note: 'Not actually me',
        loggedBy: 'admin-1',
        timestamp: new Date(),
      }),
    )
  })

  it('editor CANNOT read the audit log (admin only)', async () => {
    await assertFails(getDoc(doc(editor(), 'auditLog/entry-1')))
  })

  it('editor CANNOT delete a lead (admin only)', async () => {
    await assertFails(deleteDoc(doc(editor(), 'pipeline/lead-1')))
  })

  it('admin can read the audit log and delete a lead', async () => {
    await assertSucceeds(getDoc(doc(admin(), 'auditLog/entry-1')))
    await assertSucceeds(deleteDoc(doc(admin(), 'pipeline/lead-1')))
  })

  it('admin can read any sponsor profile', async () => {
    await assertSucceeds(getDoc(doc(admin(), 'sponsors/sponsor-b')))
  })
})

describe('server-only collections reject all client writes', () => {
  it('nobody can write the audit log, including admin', async () => {
    await assertFails(addDoc(collection(admin(), 'auditLog'), { action: 'forged' }))
  })

  it('nobody can write donations, including admin', async () => {
    await assertFails(setDoc(doc(admin(), 'donations/forged'), { amount: 999999 }))
  })

  it('nobody can write the team directory directly, including admin', async () => {
    await assertFails(setDoc(doc(admin(), 'team/new-person'), { role: 'admin' }))
  })
})

describe('unknown collections', () => {
  it('are denied by the catch-all even for admin', async () => {
    await assertFails(setDoc(doc(admin(), 'somethingNew/doc-1'), { x: 1 }))
    await assertFails(getDoc(doc(admin(), 'somethingNew/doc-1')))
  })
})
