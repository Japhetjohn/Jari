# JARI Frontend Implementation Tracker

This tracker continues the work in `frontend-fix.md`. The application is frontend-only: use simulated services and browser storage; do not add or change backend code.

## Current status

**In progress.** Persistent demo data and several core farm-record workflows are implemented. The latest frontend production build passes. Full acceptance criteria in `frontend-fix.md` are not complete yet; remaining items are listed below so the next developer can continue without re-auditing completed work.

## Completed in this pass

- [x] Added a versioned `jari-demo:v1:` local-storage namespace with one-time migration from existing unversioned demo records. Writes emit `jari:mock-data-changed` for cross-screen refresh.
- [x] Centralized simulated records, validation and CRUD helpers in `frontend/src/lib/simulated-data.ts`; exposed a backend-replaceable facade in `frontend/src/services/index.ts`.
- [x] Added farm record models and shared state for flock populations/movements, farm houses, feed purchases/use and stock, production, vaccinations, health incidents, sales, expenses, assets, KYC and activity.
- [x] Added validations for flock movement, house capacity/archiving, feed stock, production and financial record creation.
- [x] Connected feed purchase/use, flock creation/movements, house creation/edit/archive, and the production, sale, expense and asset forms to persistent simulated records.
- [x] Replaced production, sales and expense summaries with values from the records; added cross-screen refresh through the shared storage event.
- [x] Replaced invented analytics values with actual saved sales, feed-purchase and egg-production data; added responsive charts.
- [x] Replaced the inactive reports button with a downloadable farm-record snapshot.
- [x] Replaced static vaccination and health-incident screens with persistent create forms, record lists, validation and clear empty states. Recorded mortality updates the flock population through the movement ledger.
- [x] Added validated full-balance collection and expense-payment actions that update shared sales/expense records.
- [x] Added persistent saved-opportunity status tracking with preparation guidance and explicit local-only messaging.
- [x] Connected farmer contact settings, reminder/analytics preferences and local data backup to persistent simulated storage.
- [x] Added local farm-document upload, persisted file metadata/content, download and remove actions with a 1.5 MB size limit.
- [x] Added backup import confirmation and pre-write validation so malformed sections are rejected before any farm data is changed.
- [x] Added useful admin/institution catch-all views for every existing sidebar destination, with shared demo farm/review summaries and clear local-simulation limitations.
- [x] Added five no-dependency workflow tests for legacy storage migration, bird-count updates, feed inventory, financial payment balances and safe backup validation.
- [x] Preserved the earlier notification detail/preview, dashboard tour spotlight, house/flock/asset detail-edit, KYC confirmation, and slim scrollbar work.
- [x] Updated this file with remaining tasks and execution order.

## Remaining implementation checklist

### P0 — Complete and verify core farm workflows

- [ ] Read the remaining detailed acceptance criteria in `frontend-fix.md` sections 4–25 and confirm each route against them.
- [ ] Add partial-payment entry and payment history; keep outstanding balances consistent with sales/expense records.
- [ ] Add health-record edit/delete and treatment records; review mortality edge cases and ensure mortality is reflected once in flock counts.
- [ ] Ensure flock transfers update both source and destination populations and preserve a movement history.
- [ ] Finish asset edit/delete edge cases; review document previews, browser-storage quota handling and import/export edge cases.
- [ ] Persist opportunity applications and statuses (initial save/checklist tracking is done); add detailed eligibility and an admin review management view.
- [ ] Complete farm profile/business report generation in a readable downloadable format (the current report snapshot is JSON).
- [ ] Ensure all record lists refresh after create/update/delete and show useful empty, error and success states.
- [ ] Expand backup import validation to every record-field schema and add clear rollback handling for storage quota/write failures.

### P1 — Product-wide consistency and roles

- [ ] Review auth, session persistence, registration, password-recovery explanation and role guards against demo accounts in `frontend-fix.md`.
- [ ] Finish farmer dashboard and risk/financial assessments using only available demo data; clearly label any illustrative or not-yet-assessed result.
- [ ] Replace remaining static/fabricated values in farmer dashboard and other screens with shared demo data or explicit empty states.
- [ ] Complete admin/institution verification, opportunity, report and partner workflows in local simulation; preserve role restrictions and provide visible outcomes.
- [ ] Make notification/activity records consistent with user actions and ensure notification links open their relevant pages.
- [ ] Add a dedicated demo-data reset confirmation; settings contact/preferences/backup import/export are implemented.
- [ ] Review all buttons, links, forms and menus for actual behavior, keyboard access and understandable copy.

### P2 — Validation and quality

- [x] Run a successful production build after the latest changes. All routes compile; one existing Tailwind easing-class ambiguity warning remains.
- [x] Attempt lint and document the missing ESLint configuration; `npm run lint` requires first-time interactive setup before it can run.
- [x] Run the first no-dependency workflow tests (5 pass); expand coverage to health mortality, transfer pairs, settings and role-based flows.
- [ ] Manually exercise sign-in/demo role navigation, farm creation, flock movements, feed, production, health, sales, expenses, verification and reports across refreshes.
- [ ] Review responsive layouts at phone, tablet and desktop widths; fix overflow, focus visibility, accessible labels and reduced-motion behavior.
- [x] Run `git diff --check`; no whitespace errors. No backend paths were edited in this pass.

## Architecture and constraints

- Screens should call `frontend/src/services/index.ts`, not bind directly to a future API or add backend dependencies.
- `frontend/src/lib/simulated-data.ts` is the browser-only implementation for now. Keep existing seeded demo accounts and records; preserve their one-time migration when changing storage schema.
- Do not modify or introduce anything under `backend/`.
- No dependency installation is required or authorized by the project instructions.

## Last validation

- `npm run build`: passed after all current changes; all 42 routes generated. Tailwind reports the existing ambiguous custom easing class warning.
- `git diff --check`: passed (Git emitted line-ending normalization notices only).
- `npm run lint`: did not run because Next.js opened its first-run ESLint configuration prompt; no ESLint configuration exists in the project yet. Choose/configure a lint setup in a follow-up, then rerun.
- `npm run test:workflows`: passed (5 checks: legacy migration, flock population change, feed stock calculations, sale/expense payment bounds and malformed backup rejection).
- Browser/device review remains outstanding; expand automated workflow coverage beyond these four checks.

## Suggested next task

Add partial-payment entry and combined flock transfers first, then health treatments/editing and document workflows. Continue through opportunities/settings and the admin/institution experiences, then exercise every workflow with persisted data. Latest build passes; configure ESLint before retrying lint. Update this checklist as each item is actually completed.
