# JARI Frontend Active Phase

## Current phase
Phase 23: Farmer dashboard interactions

## Status
Implemented; responsive browser review remains.

## Completed in this phase
- Added a four-item notification preview dropdown and expandable notification details, with a full notifications page.
- Removed the farmer workspace heading text from the mobile header.
- Replaced the generic tour dialog with a responsive spotlight that points to the farm shortcut, navigation and a page action.
- Made farm house and bird group cards open detail panels; made equipment cards open editable details.
- Simplified dashboard wording and changed the menu label from Messages to Notifications.
- Reduced the desktop scrollbar thickness to 3px.
- Changed farm review submission to hide the form and show an animated confirmation state.

## Files in this phase
- `frontend/src/app/(dashboard)/notifications/page.tsx`
- `frontend/src/app/(dashboard)/poultry-houses/page.tsx`
- `frontend/src/app/(dashboard)/birds/page.tsx`
- `frontend/src/app/(dashboard)/assets/page.tsx`
- `frontend/src/app/(dashboard)/kyc/page.tsx`
- `frontend/src/app/(dashboard)/dashboard/page.tsx`
- `frontend/src/app/(dashboard)/layout.tsx`
- `frontend/src/components/layout/role-shell.tsx`
- `frontend/src/components/layout/dashboard-tour.tsx`
- `frontend/src/lib/notifications.ts`
- `frontend/src/lib/simulated-data.ts`
- `frontend/src/app/globals.css`
- `active.md`
- `progress.md`

## Validation
- `git diff --check` only; no build, tests or browser review.
