/**
 * Donation / sponsorship enquiry intake — server-side validation.
 *
 * Exercises buildEnquiryLead, the pure half of the submitDonationEnquiry
 * callable. The callable itself enforces App Check, which a test harness
 * cannot satisfy, so testing through the emulator would only ever assert a
 * 401. Testing the validator directly is what actually covers the trust
 * boundary: consent, required fields, and the fact that a visitor cannot
 * choose their own pipeline stage, source or owner.
 *
 * Run via: npm run test:intake
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'

const require = createRequire(import.meta.url)
const { buildEnquiryLead } = require('../functions/index.js')

const valid = {
  fullName: 'Thandiwe Nkosi',
  email: 'Thandiwe@Example.co.za',
  phone: '083 555 0111',
  supportType: 'Individual donor',
  interest: 'Once-off donation',
  amount: 'R2 500',
  message: 'I would like to sponsor a wheelchair.',
  consent: true,
}

/** Returns the HttpsError code thrown, or null if the call succeeded. */
function codeFor(data) {
  try {
    buildEnquiryLead(data)
    return null
  } catch (caught) {
    return caught.code ?? 'unknown'
  }
}

describe('buildEnquiryLead — successful capture', () => {
  it('normalises an enquiry into a pipeline lead', () => {
    const lead = buildEnquiryLead(valid)
    assert.equal(lead.name, 'Thandiwe Nkosi')
    assert.equal(lead.email, 'thandiwe@example.co.za', 'email is lower-cased')
    assert.equal(lead.phone, '083 555 0111')
    assert.equal(lead.amount, 'R2 500')
    assert.equal(lead.consentGiven, true)
  })

  it('assigns stage, source and owner server-side', () => {
    const lead = buildEnquiryLead(valid)
    assert.equal(lead.stage, 'lead')
    assert.equal(lead.source, 'website donation form')
    assert.equal(lead.assignedTo, null)
  })

  it('accepts a phone-only enquiry', () => {
    assert.equal(codeFor({ ...valid, email: '', phone: '083 555 0111' }), null)
  })

  it('accepts an email-only enquiry', () => {
    assert.equal(codeFor({ ...valid, email: 'a@b.co.za', phone: '' }), null)
  })

  it('keeps newlines in the message but not in single-line fields', () => {
    const lead = buildEnquiryLead({ ...valid, message: 'Line one\nLine two', fullName: 'Bad\r\nName' })
    assert.ok(lead.message.includes('\n'), 'the message keeps its line breaks')
    assert.ok(!lead.name.includes('\n'), 'newlines must not survive in the name')
    assert.ok(!lead.name.includes('\r'), 'carriage returns must not survive in the name')
  })

  it('caps an oversized message rather than rejecting it', () => {
    const lead = buildEnquiryLead({ ...valid, message: 'x'.repeat(9000) })
    assert.equal(lead.message.length, 5000)
  })
})

describe('buildEnquiryLead — the public client cannot escalate', () => {
  it('ignores a client-supplied stage, source, owner and consent flag', () => {
    const lead = buildEnquiryLead({
      ...valid,
      stage: 'donated',
      source: 'forged',
      assignedTo: 'admin-1',
      owner: 'admin-1',
      consentGiven: 'yes-obviously',
    })
    assert.equal(lead.stage, 'lead', 'stage must not come from the payload')
    assert.equal(lead.source, 'website donation form', 'source must not come from the payload')
    assert.equal(lead.assignedTo, null, 'assignedTo must not come from the payload')
    assert.equal(lead.consentGiven, true)
  })

  it('does not carry unknown payload keys onto the lead', () => {
    const lead = buildEnquiryLead({ ...valid, role: 'admin', internalNote: 'promote me' })
    assert.ok(!('role' in lead), 'role must never reach the document')
    assert.ok(!('internalNote' in lead), 'internal notes are staff-only')
  })
})

describe('buildEnquiryLead — validation', () => {
  it('rejects a submission without consent', () => {
    assert.equal(codeFor({ ...valid, consent: false }), 'failed-precondition')
  })

  it('rejects a truthy-but-not-true consent value', () => {
    assert.equal(codeFor({ ...valid, consent: 'on' }), 'failed-precondition')
  })

  it('rejects a submission with no name', () => {
    assert.equal(codeFor({ ...valid, fullName: '   ' }), 'invalid-argument')
  })

  it('rejects a submission with neither email nor phone', () => {
    assert.equal(codeFor({ ...valid, email: '', phone: '' }), 'invalid-argument')
  })

  it('rejects a malformed email address', () => {
    assert.equal(codeFor({ ...valid, email: 'not-an-email' }), 'invalid-argument')
  })

  it('requires an organisation for corporate sponsorship', () => {
    assert.equal(codeFor({ ...valid, supportType: 'Corporate sponsor', orgName: '' }), 'invalid-argument')
  })

  it('accepts corporate sponsorship once an organisation is given', () => {
    assert.equal(codeFor({ ...valid, supportType: 'Corporate sponsor', orgName: 'Sasol Foundation' }), null)
  })
})
