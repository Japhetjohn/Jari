# JARI Frontend — Remaining Work

This file is the handoff checklist for finishing the frontend before backend development begins. Start here, then use `frontend-fix.md` for detailed acceptance criteria. Keep the existing JARI brand, seeded demo accounts and records.

## Constraints

- Frontend only. Do not add, change or call backend functionality.
- Keep screens calling `frontend/src/services/index.ts`; implement simulated behavior in `frontend/src/lib/simulated-data.ts` so services can later be replaced by APIs.
- Preserve and migrate existing demo records when changing browser storage.
- Do not add dependencies without a project need and approval.

## Priority 1 — Finish core farm workflows

- [ ] Add partial sale and expense payments, with payment history, balance validation and updated totals.
- [ ] Implement a combined flock transfer between groups: validate source count and destination capacity, update both populations in one operation and save matching movement history.
- [ ] Add health-record editing/deletion and treatment records. Confirm mortality is applied once and cannot reduce a flock below zero.
- [ ] Review farm assets for complete edit, archive/delete and validation behavior.
- [ ] Review document previews, file-size/storage-quota failures and backup handling. Uploaded content is stored in browser local storage with a 1.5 MB per-file limit.
- [ ] Validate every field in imported backup sections before writes; handle quota/write failures without leaving partial data. Add a confirmed demo-data reset action.
- [ ] Turn the JSON report snapshot into a readable farm report for sharing/printing while retaining backup export/import.
- [ ] Review every create/update action for a useful success/error state, empty state and immediate cross-page refresh.

## Priority 2 — Complete product flows

- [ ] Review authentication, registration, session persistence, demo accounts, password recovery and role guards against sections 4 and 5 of `frontend-fix.md`.
- [ ] Review risk and financial readiness assessments. Derive results only from available records; explain missing inputs and avoid fabricated scores.
- [ ] Audit farmer dashboard, analytics, notifications and activity for static or unsupported values. Make activity and notification links reflect real simulated actions.
- [ ] Expand admin and institution workspaces beyond the current shared-data catch-all pages: implement useful verification, opportunity review, reports, partners and request/referral views with role-appropriate links and outcomes.
- [ ] Add full opportunity eligibility details and the admin-side review of farmer saved applications. Keep provider submission clearly simulated until an API exists.
- [ ] Check all remaining links, buttons, forms and menu actions, including keyboard use and accessible labels.

## Priority 3 — Test and polish

- [ ] Expand `frontend/scripts/simulated-data.test.cjs` for mortality, paired transfers, backup rollback, document persistence, preferences and role workflows.
- [ ] Manually exercise sign-in and role navigation, farm registration, flock movements, feed, production, health, finance, KYC review, opportunities and backup import/export across refreshes.
- [ ] Review phone, tablet and desktop layouts; fix overflow, focus visibility, motion/reduced-motion behavior and menu interactions.
- [ ] Configure ESLint deliberately, then run `npm run lint`. Currently `next lint` opens its first-time interactive setup because no ESLint configuration exists.
- [ ] Run `npm run test:workflows`, `npm run build` and `git diff --check` after changes.

## Already implemented — Do not repeat

- Versioned `jari-demo:v1:` storage with legacy-record migration, shared change events and centralized simulated services.
- Persistent workflows for farm profile, houses, flock creation/movements, feed purchases/use/stock, production, health creation, sales/expenses, assets, KYC, activity and preferences.
- Payment settlement for full outstanding balances; partial payments/history remain above.
- Data-based sales/expense/production summaries and analytics charts; downloadable JSON report/backup.
- Opportunity save/checklist stages, local document upload/preview/download/remove, backup import confirmation and basic section validation.
- Admin/institution catch-all routes for current sidebar paths, plus earlier dashboard navigation, detail/edit, notification, KYC confirmation and tour interactions.

## Latest validation

- `npm run build`: passed; all 42 routes generated. Tailwind reports an ambiguous custom easing-class warning.
- `npm run test:workflows`: passed, 5 checks (legacy migration, flock population update, feed stock, payment bounds and malformed-backup rejection).
- `git diff --check`: passed; Git prints line-ending normalization notices.
- No backend code was changed.

## Start here

Implement partial payments and atomic flock transfers first. Add tests alongside each workflow, then finish health treatments/editing and backup failure handling. Update this checklist as items are completed; do not mark the frontend complete until the responsive/manual checks above pass.
