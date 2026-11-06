# JARI Frontend Implementation Handoff

Updated: 2026-11-05

This tracker records the current frontend implementation. The JARI demo frontend work below is implemented. The remaining checklist is limited to validation that requires a real browser/device or a deliberate lint configuration decision. Continue from the unchecked items; do not repeat completed implementation.

## Project rules

- Frontend only. Do not add, change, or call backend functionality.
- Keep UI workflows behind `frontend/src/services/index.ts`; keep simulated persistence and business rules in `frontend/src/lib/simulated-data.ts` so a future API can replace the services.
- Preserve and migrate existing browser demo records, seeded accounts, and simulated records.
- Do not add dependencies without a clear need.
- Describe scores, eligibility, reviews, insurance, financing, notifications, and outcomes only when supported by saved demo data. Label simulations clearly; never imply an actual insurer, lender, or reviewer has acted.
- Keep farmer-facing labels plain. Preserve responsive layouts, keyboard support, accessible labels, and reduced-motion behavior.

## Completed implementation

### Shared data and workflows

- [x] Added atomic multi-record commits with rollback for browser-storage failures; activity history is written with the change rather than after it.
- [x] Preserved and normalized legacy sale/expense records; partial payments validate against the remaining balance, append dated history, and update shared totals.
- [x] Paired flock transfers validate source count and destination house capacity, update both groups, and save matching movement rows together.
- [x] Flock creation, movement, transfer, sales, mortality, production, vaccination/treatment, feed, and farm-house workflows validate required values and update shared demo data.
- [x] Mortality is applied once; deleting a loss record restores flock count and records the adjustment.
- [x] Archived houses are excluded from active dashboard totals.
- [x] Added storage change events and cross-tab refresh/sign-out handling for open dashboard views.
- [x] Added dynamic notifications from saved KYC, vaccination, feed, opportunity, and institution-request records; the menu previews four and supports full detail views.

### Farm records and preferences

- [x] Asset listing/detail/edit/remove is connected to shared data; names, quantity, value, condition, duplicate names, and removal are handled with feedback.
- [x] Document upload enforces supported file types and a 1.5 MB limit, persists locally, previews PDF/images, downloads other files, confirms removal, and reports storage errors.
- [x] Backup import validates supported sections and record fields before writes, rolls back failed storage writes, and supports existing demo data.
- [x] Settings persist local preferences and farm contact edits, provide backup export/import, and offer a confirmed farm-record reset that retains demo sign-in accounts.
- [x] Reports provide a farm summary, print action, and separate JSON data-backup download.

### Authentication, risk, and roles

- [x] Login offers seeded farmer/admin/farm reviewer/institution demo accounts and explains browser-local session behavior.
- [x] Registration validates inputs and rolls back a failed multi-key save. Password recovery remains explicitly simulated.
- [x] Risk and assessment screens avoid unsupported risk scores or financing/insurance guarantees and explain when data is illustrative or incomplete.
- [x] KYC review requests and reviewer decisions are persisted as demo data and labeled as local simulations.
- [x] Admin and institution entry pages now provide role-specific verification, opportunity review, reports, and institution request workflows.
- [x] Institution workspace exposes aggregate portfolio statistics and inquiry requests only; individual farm identities, scores, records and documents are hidden.
- [x] Institution requests and opportunity applications save status; farmers can see review feedback. Provider submission is identified as simulated, with no external application sent.
- [x] Registration now offers Farmer and Institution account types; the existing farmer form remains its own flow.
- [x] Institution onboarding is a multi-step wizard for organisation details, official contacts/location, service categories, conditional service details, representative credentials, verification evidence, and final review.
- [x] Wizard navigation validates each step, keeps entered data while moving backward, and updates its progress indicator as service categories change.
- [x] Institution service steps collect the lending, insurance, and grant details listed in `JARI Institution Onboarding and Institutional Dashboard Implementation.md`.
- [x] Registration collects category-relevant evidence (registration, lender/insurer licence, and grant-authority documents) plus optional representative-authority evidence and organisation logo.
- [x] Institution submission creates a browser-local institutional account and a `Pending Verification` application; the institution home page displays the saved status and selected services.
- [x] Institution portfolio view uses clear aggregate poultry statistics and charts, with an inquiry route for institutions to request a farmer conversation.
- [x] Farmer risk profile shows the farmer's own profile status, record coverage and links to update their information without inventing an automated risk score.
- [x] Admin assessments view shows detailed farm and record information for review; the institution workspace does not expose that individual profile view.
- [x] Removed unsupported eligibility/match claims; status reflects saved records only.

### Tests and code structure

- [x] Simulated operations are exposed through the service facade for later API substitution.
- [x] Workflow test coverage includes legacy migration/payments, role login, registration rollback, sales, feed stock, paired transfers, mortality restoration, treatment, documents/quota, assets, preferences, institution consent/requests, reset behavior, and backup validation/rollback.
- [x] Workflow tests confirm institution profile persistence and rollback of account/session when institution profile storage fails.
- [x] Retained the JARI poultry brand, existing UI direction, mobile drawer, reduced-motion behavior, and farmer-readable copy.

## Remaining validation

- [x] Run the listed automated checks after the institution wizard changes.
- [ ] In a real browser, manually exercise farmer/admin/reviewer/institution sign-in and navigation; farm profile; houses; flock create/movement/transfer; feed purchase/use; production; health/treatment; sale and partial payment; expense and partial payment; KYC; opportunity save/review; documents; reports; and backup import/export across refreshes.
- [ ] Visually check phone, tablet, and desktop for overflow, fixed-header/drawer/dialog behavior, keyboard focus, and touch-target sizing. Check reduced-motion and landing-page reveal behavior.
- [ ] ESLint currently has no project configuration; `npm run lint` starts the interactive first-run setup. Review and add a deliberate configuration before enabling lint; do not accept a default blindly.

## Latest verification

- `npm run test:workflows`: 24 tests passed after adding institution-registration and rollback coverage.
- `npx tsc --noEmit`: passed after the institution wizard and status card were added.
- `npm run build`: passed on retry and generated all 42 routes. The first attempt encountered a missing generated Next.js chunk during page-data collection; the retry completed cleanly. The ambiguous custom easing warning was removed.
- After adding the institution risk-profile directory, TypeScript passed. The latest build attempt compiled but failed page-data collection while a Next.js dev process was again writing to `.next`; rerun a production build only after the active dev server is stopped.
- `git diff --check`: passed; Git only printed line-ending normalization notices for modified files.
- Production HTTP smoke check returned 200 for `/`, `/login`, `/dashboard`, `/admin`, `/admin/opportunities`, `/institution`, and `/institution/requests`. A broader sequential sweep stalled the local server and was stopped; it is not counted as a successful full-route smoke test.
- No browser executable is available in this environment, so visual/responsive end-to-end checks remain outstanding.
- No backend files or backend behavior were changed.

## Next steps

1. Run the remaining manual browser/device checks when a browser is available; include all three institution service selections, multi-service selection, backwards navigation, required evidence, final review, and pending-status display. Confirm the existing farmer registration still works.
2. Check phone, tablet, and desktop layouts and keyboard navigation; fix any issues and record the results here.
3. Decide on a reviewed ESLint configuration, then run lint.
