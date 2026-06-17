# Mpho Madi Trust Fund Website

This project is a React + Vite homepage prototype for Mpho Madi Trust Fund.

## Project Focus
- Trust-led nonprofit messaging.
- Clear donor and applicant pathways.
- Editorial layout with strong readability.
- Centralized content for easier updates.

## Financial Year and Operating Context
- Keep financial-year reporting separate from monthly donation and sponsorship activity.
- Verify all trust, registration, and impact figures before public use.
- Treat placeholder values as `TBD_VERIFIED` until confirmed.

## Transaction and Category Rules
- Every transaction must be categorized before it is treated as report-ready.
- Reconciliation should keep bank activity, support notes, and reporting outputs aligned.
- Category names should stay consistent so the team can review monthly figures without ambiguity.

## Monthly Close Process
- Capture the opening balance.
- Capture the closing balance.
- Reconcile unresolved items before month-end signoff.
- Keep a clear audit trail for any adjustment.

## SARS Mode and Compliance Notes
- CFC Income must default to R0 unless a foreign-company relationship is explicitly confirmed.
- SARS-facing figures must be traceable back to source transactions.
- Manual adjustments must be clearly explained.
- Balance sheet and profit-and-loss outputs must remain internally consistent before annual export.

## Audit Trail Logic
- Log every create, update, delete, import, reconciliation, export, and lock action.
- Keep organisation-level data isolated.
- Use role-based access control for sensitive finance data.

## Export Pack Contents
- Ledger export.
- Monthly profit and loss export.
- Annual profit and loss export.
- Balance sheet export.
- Asset register export.
- SARS capture schedule export.
- Audit trail export.

## Role Permissions
- Use role-based access control for finance, review, and export actions.
- Restrict approval and lock actions to authorised users.

## Finance Dictionary Usage
- Explain accounting and SARS terms in plain language inside the app.
- Use one dictionary entry as the single source of truth for help text and warnings.
- Prefer labels like `Foreign company income (CFC Income)` where plain language is needed.

## Limitations
- Donation provider, banking, and registration details still require verification.
- Sponsor and trust claims should remain explicit until verified.
- Financial and SARS outputs should be reviewed by a qualified professional before submission.

## Accountant Disclaimer
This system helps organise, calculate, and review business finance records. It does not replace a registered accountant, auditor, or tax practitioner. Final SARS submissions should be reviewed by a qualified professional where required.
