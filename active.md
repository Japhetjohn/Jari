# JARI Frontend Active Phase

## Current phase
Phase 22: Farmer dashboard clarity and farm review

## Status
Implemented; needs responsive product review and backend integration for persistent KYC review.

## Completed in this phase
- Replaced technical and fabricated dashboard metrics with plain-language farm details and useful actions.
- Added a first-visit farmer tour that can be skipped, works from any farmer dashboard page and adapts to phone and desktop screens.
- Added a farm verification request page with farm name, location and phone number, plus a simple review status.
- Added an admin verification screen to inspect a submitted request and mark it verified or request more details.
- Rebuilt the farm risk profile to explain what it covers and show that JARI has not yet issued a risk assessment.
- Added a direct risk-profile button on the farmer farm page.
- Changed farmer navigation labels to everyday language and made the mobile menu a full-screen drawer with an animated exit.
- Added a slim desktop scrollbar and hid scrollbars on mobile.

## Implementation note
The current app has no server-backed KYC submission or risk-assessment API. The new request/review flow uses browser local storage as a demonstration, so it is only shared in the same browser and must be connected to authenticated backend storage before it can support real submissions across farmer and reviewer devices.

## Files in this phase
- `frontend/src/app/(dashboard)/dashboard/page.tsx`
- `frontend/src/app/(dashboard)/layout.tsx`
- `frontend/src/app/(dashboard)/kyc/page.tsx`
- `frontend/src/app/(dashboard)/assessments/page.tsx`
- `frontend/src/app/(dashboard)/farm/page.tsx`
- `frontend/src/app/(admin)/admin/verification/page.tsx`
- `frontend/src/components/layout/dashboard-tour.tsx`
- `frontend/src/components/layout/role-shell.tsx`
- `frontend/src/lib/simulated-data.ts`
- `frontend/src/app/globals.css`
- `active.md`
- `progress.md`

## Validation
- `git diff --check` only; no build, tests or browser review.
