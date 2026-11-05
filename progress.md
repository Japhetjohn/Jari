# JARI Frontend Progress

## Phase 0: Requirements review and project assessment

Status: Completed

### Reviewed
- Frontend implementation requirements: [frontend-documentation.md](frontend-documentation.md)
- Frontend operating instructions: [fronend-instruction.md](fronend-instruction.md)
- Existing frontend scaffold: [frontend/package.json](frontend/package.json)
- Current app entry points: [frontend/src/app/page.tsx](frontend/src/app/page.tsx), [frontend/src/app/layout.tsx](frontend/src/app/layout.tsx), [frontend/src/app/globals.css](frontend/src/app/globals.css)

### Current codebase state
- A minimal Next.js app is already scaffolded in [frontend](frontend).
- The project includes the required frontend dependencies for Next.js, React, TypeScript, Tailwind, TanStack Query, React Hook Form, Zod and Recharts.
- The app foundation and public/auth shell have now been implemented.

## Phase 1: App foundation and auth/public shell

Status: Completed

### Completed
- Replaced the placeholder landing page with a JARI-branded marketing homepage in [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- Added a green-and-white design system foundation in [frontend/src/app/globals.css](frontend/src/app/globals.css)
- Created the app auth layout in [frontend/src/app/(auth)/layout.tsx](frontend/src/app/(auth)/layout.tsx)
- Added login, register and forgot-password pages in [frontend/src/app/(auth)/login/page.tsx](frontend/src/app/(auth)/login/page.tsx), [frontend/src/app/(auth)/register/page.tsx](frontend/src/app/(auth)/register/page.tsx), and [frontend/src/app/(auth)/forgot-password/page.tsx](frontend/src/app/(auth)/forgot-password/page.tsx)
- Added the dashboard shell and default farmer dashboard in [frontend/src/app/(dashboard)/layout.tsx](frontend/src/app/(dashboard)/layout.tsx) and [frontend/src/app/(dashboard)/dashboard/page.tsx](frontend/src/app/(dashboard)/dashboard/page.tsx)
- Added the redirect from the root dashboard route to the working dashboard page in [frontend/src/app/(dashboard)/page.tsx](frontend/src/app/(dashboard)/page.tsx)

## Phase 2: Farmer onboarding and farm management

Status: Completed

### Completed
- Added the farm overview page in [frontend/src/app/(dashboard)/farm/page.tsx](frontend/src/app/(dashboard)/farm/page.tsx)
- Added the farm registration page in [frontend/src/app/(dashboard)/farm/new/page.tsx](frontend/src/app/(dashboard)/farm/new/page.tsx)
- Added the poultry house listing page in [frontend/src/app/(dashboard)/poultry-houses/page.tsx](frontend/src/app/(dashboard)/poultry-houses/page.tsx)
- Added the poultry house registration page in [frontend/src/app/(dashboard)/poultry-houses/new/page.tsx](frontend/src/app/(dashboard)/poultry-houses/new/page.tsx)

## Phase 3: Flock and feed operations

Status: Completed

### Completed
- Added flock overview and list page in [frontend/src/app/(dashboard)/birds/page.tsx](frontend/src/app/(dashboard)/birds/page.tsx)
- Added flock registration form in [frontend/src/app/(dashboard)/birds/new/page.tsx](frontend/src/app/(dashboard)/birds/new/page.tsx)
- Added feed management dashboard in [frontend/src/app/(dashboard)/feed/page.tsx](frontend/src/app/(dashboard)/feed/page.tsx)
- Added purchase tracking page in [frontend/src/app/(dashboard)/feed/purchases/page.tsx](frontend/src/app/(dashboard)/feed/purchases/page.tsx)
- Added consumption logging page in [frontend/src/app/(dashboard)/feed/consumption/page.tsx](frontend/src/app/(dashboard)/feed/consumption/page.tsx)

## Phase 4: Production, health, sales, expenses and assets

Status: Completed

### Completed
- Added production overview and log flow in [frontend/src/app/(dashboard)/production/page.tsx](frontend/src/app/(dashboard)/production/page.tsx) and [frontend/src/app/(dashboard)/production/new/page.tsx](frontend/src/app/(dashboard)/production/new/page.tsx)
- Added poultry health dashboard and vaccination/incident views in [frontend/src/app/(dashboard)/health/page.tsx](frontend/src/app/(dashboard)/health/page.tsx), [frontend/src/app/(dashboard)/health/vaccinations/page.tsx](frontend/src/app/(dashboard)/health/vaccinations/page.tsx), and [frontend/src/app/(dashboard)/health/incidents/page.tsx](frontend/src/app/(dashboard)/health/incidents/page.tsx)
- Added sales overview and sales-record form in [frontend/src/app/(dashboard)/sales/page.tsx](frontend/src/app/(dashboard)/sales/page.tsx) and [frontend/src/app/(dashboard)/sales/new/page.tsx](frontend/src/app/(dashboard)/sales/new/page.tsx)
- Added expense overview and expense-record form in [frontend/src/app/(dashboard)/expenses/page.tsx](frontend/src/app/(dashboard)/expenses/page.tsx) and [frontend/src/app/(dashboard)/expenses/new/page.tsx](frontend/src/app/(dashboard)/expenses/new/page.tsx)
- Added asset overview and asset registration form in [frontend/src/app/(dashboard)/assets/page.tsx](frontend/src/app/(dashboard)/assets/page.tsx) and [frontend/src/app/(dashboard)/assets/new/page.tsx](frontend/src/app/(dashboard)/assets/new/page.tsx)

## Phase 5: Analytics, assessments, reports and opportunities

Status: Completed

### Completed
- Added analytics overview in [frontend/src/app/(dashboard)/analytics/page.tsx](frontend/src/app/(dashboard)/analytics/page.tsx)
- Added farm assessments view in [frontend/src/app/(dashboard)/assessments/page.tsx](frontend/src/app/(dashboard)/assessments/page.tsx)
- Added reports overview in [frontend/src/app/(dashboard)/reports/page.tsx](frontend/src/app/(dashboard)/reports/page.tsx)
- Added opportunities overview in [frontend/src/app/(dashboard)/opportunities/page.tsx](frontend/src/app/(dashboard)/opportunities/page.tsx)

## Phase 6: Notifications, settings and role-specific shells

Status: Implemented

### Completed
- Added notification center in [frontend/src/app/(dashboard)/notifications/page.tsx](frontend/src/app/(dashboard)/notifications/page.tsx)
- Added account settings page in [frontend/src/app/(dashboard)/settings/page.tsx](frontend/src/app/(dashboard)/settings/page.tsx)
- Added admin landing page in [frontend/src/app/(admin)/admin/page.tsx](frontend/src/app/(admin)/admin/page.tsx)
- Added institution landing page in [frontend/src/app/(institution)/institution/page.tsx](frontend/src/app/(institution)/institution/page.tsx)

### Validation status
- The app now includes the main farmer, admin and institutional user entry points.
- Build validation remains deferred until requested.

### Next step
- The next implementation phase is the API integration and shared frontend data layer.
- This includes project-wide types, route constants, query hooks and an API client aligned to the FastAPI backend.

## Phase 7: Brand refresh foundation and public experience

Status: Implemented and pending review

### Completed
- Reviewed `generated-page.html` as a visual reference. Adapted its warm botanical palette, editorial serif headings, restrained green accents and generous spacing for JARI's poultry farm product.
- Reworked the public landing page around JARI's actual farmer workflows and removed unsupported marketing metrics and outcomes.
- Created a scalable JARI sprout-and-field SVG mark and applied a shared wordmark component across the landing page, authentication panel and role workspaces.
- Replaced the landing page's abstract hero panel with a locally bundled photo that visibly shows broilers, feeders and a brooder inside a poultry house in Kano, Nigeria. Added visible photographer attribution and CC BY-SA 4.0 license links.
- Added shared farmer, admin and institution workspace framing with responsive navigation and consistent role-aware access.
- Updated global design tokens, typography, focus states, reduced-motion handling and page metadata.
- Refreshed the authentication side panel to use the same JARI identity.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/app/layout.tsx](frontend/src/app/layout.tsx)
- [frontend/src/app/(auth)/auth-shell.tsx](frontend/src/app/(auth)/auth-shell.tsx)
- [frontend/src/components/layout/role-shell.tsx](frontend/src/components/layout/role-shell.tsx)
- [frontend/src/components/brand/jari-logo.tsx](frontend/src/components/brand/jari-logo.tsx)
- [frontend/public/logo/jari-mark.svg](frontend/public/logo/jari-mark.svg)
- [Wikimedia Commons photo: An indoor space for raising chickens](https://commons.wikimedia.org/wiki/File:An_indoor_space_for_raising_chickens.jpg) by Abdulybature, CC BY-SA 4.0. Bundled 960 × 720 version at [frontend/public/images/nigerian-poultry-house.jpg](frontend/public/images/nigerian-poultry-house.jpg).
- [frontend/src/app/(dashboard)/layout.tsx](frontend/src/app/(dashboard)/layout.tsx)
- [frontend/src/app/(admin)/layout.tsx](frontend/src/app/(admin)/layout.tsx)
- [frontend/src/app/(institution)/layout.tsx](frontend/src/app/(institution)/layout.tsx)
- [frontend/tailwind.config.ts](frontend/tailwind.config.ts)

### Validation
- `git diff --check` completed without whitespace errors.
- Build and browser review have not been run.

### Next step
- Continue the brand refresh through the authentication screens, farmer routes and shared page components, then apply the same review to admin and institutional pages.
- Preserve each page's existing workflows and data behavior while aligning its hierarchy, empty/loading/error states and mobile layout with the JARI design system.

## Phase 8: Landing page redesign

Status: Implemented and pending review

### Completed
- Replaced the prior marketing layout with a shorter, plain-language introduction to JARI.
- Focused the hero on one clear action: create a farm profile, with sign-in as the secondary action.
- Used a Nigerian poultry-house photo and added visible photographer, source and license attribution.
- Reduced the page to a simple three-step explanation and one closing call to action.
- Preserved the existing `/register` and `/login` routes.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)

### Validation
- `git diff --check` completed without whitespace errors.
- Build and browser review have not been run.

### Next step
- Review this landing page direction before applying the new design across the remaining frontend routes.

## Phase 9: Product story and visual explanation

Status: Implemented and pending review

### Completed
- Reworked the headline and intro to explain JARI as a clearer farm picture that helps farmers understand risk and explore suitable support.
- Reframed the landing page around JARI's actual sequence: farm records → farm profile and risk areas → practical advice and finance/insurance options.
- Built a responsive product illustration with real farm context, record types, risk/profile outcomes and support options. The central profile is visually emphasized to make JARI's role clear.
- Kept the page short, with one primary registration action and a compact closing action.
- Verified the image depicts broilers, feeders and a brooder in an indoor poultry space in Kano, Nigeria. Added required author, source, resize and CC BY-SA 4.0 credit.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/components/landing/farm-journey.tsx](frontend/src/components/landing/farm-journey.tsx)
- [frontend/public/images/nigerian-poultry-house.jpg](frontend/public/images/nigerian-poultry-house.jpg)

### Validation
- `git diff --check` completed without whitespace errors.
- Build and browser review have not been run.

### Next step
- Review whether the illustrated product story explains JARI clearly before extending this direction to other routes.

## Phase 10: Borderless visual system

Status: Implemented and pending review

### Completed
- Added a global no-outline surface rule so existing page cards, list rows, buttons and banners no longer render visible borders.
- Changed text inputs and selects to use a soft filled surface; checkbox/radio outlines and keyboard focus rings remain visible for usability.
- Simplified role workspace navigation to use the page background and spacing instead of bordered, boxed shells.
- Removed border styling from the landing page and made its farm flow rely on imagery, fill, spacing and a single emphasized JARI panel.

### Files changed
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/components/layout/role-shell.tsx](frontend/src/components/layout/role-shell.tsx)
- [frontend/src/components/landing/farm-journey.tsx](frontend/src/components/landing/farm-journey.tsx)

### Validation
- `git diff --check` completed without whitespace errors.
- Build and browser review have not been run.

### Next step
- Review the borderless direction before continuing the route-by-route visual rebuild.

## Phase 11: Poultry hero direction

Status: Hero layout implemented; refreshed photo pending

### Completed
- Reworked the landing hero into a full-width poultry-house photo background with a dark green gradient for readable text.
- Kept the message short and farmer-focused, with one primary action.
- Removed the photo card from the product flow so the explanation stays focused on farm records → JARI profile → support.
- Moved the existing photo credit out of the image card and into the footer.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/components/landing/farm-journey.tsx](frontend/src/components/landing/farm-journey.tsx)

### Photo follow-up
- The current licensed Nigeria farm image is still being used in the hero. A better Wikimedia Commons candidate was identified, but Wikimedia returned HTTP 429 when downloading it, so its appearance could not be inspected. The image-generation tool is not available in this session.
- Keep the existing Wikimedia author, file and CC BY-SA 4.0 attribution visible in the footer until a replacement is verified.

### Validation
- Build and browser review have not been run.

### Next step
- Replace the hero image after inspecting a better Nigerian poultry-farm photo.

## Phase 12: Brand typography and responsive navigation

Status: Implemented and pending review

### Completed
- Added Newsreader for headings and Source Sans 3 for interface and body text through Next font loading.
- Applied shared font variables to global styles and Tailwind so the public pages, forms and workspaces use one brand typography system.
- Reworked the landing navigation for desktop and mobile, including a direct link to the product explanation and compact account actions.
- Kept workspace navigation usable on small screens with a sticky header and horizontally scrollable, touch-friendly links.
- Reworked the landing product explanation as a farm-record list, a farm profile document preview and support pathways.

### Files changed
- [frontend/src/app/layout.tsx](frontend/src/app/layout.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/components/landing/farm-journey.tsx](frontend/src/components/landing/farm-journey.tsx)
- [frontend/src/components/brand/jari-logo.tsx](frontend/src/components/brand/jari-logo.tsx)
- [frontend/src/components/layout/role-shell.tsx](frontend/src/components/layout/role-shell.tsx)
- [frontend/tailwind.config.ts](frontend/tailwind.config.ts)

### Validation
- Build and browser review have not been run.

### Next step
- Review typography, navigation and the landing flow on phone and desktop sizes.
- Replace the hero photo when a better, inspectable and properly licensed Nigerian poultry-farm photo is available.

## Phase 13: Public company landing page

Status: Core sections implemented; direct contact method awaits confirmed company details

### Completed
- Added a services section for farm records, risk insights, finance and insurance pathways, and localized advisory.
- Added a dedicated contact section and Contact navigation links on mobile and desktop.
- Rebuilt the footer with JARI's product description, section navigation, farmer access, launch market, copyright and photo attribution.
- Kept service descriptions grounded in the product information supplied by the company.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [active.md](active.md)

### Validation
- Build and browser review have not been run.

### Next step
- Add a real public email or phone/WhatsApp link when the company confirms its preferred contact details.
- Review the page at phone and desktop sizes.

## Phase 14: Public motion and About experience

Status: Implemented and pending review

### Completed
- Added a reusable IntersectionObserver reveal wrapper for landing and About sections. Sections reveal on entry and reverse on exit, without continuous scroll-event work.
- Added a restrained copy entrance and subtle image settle on the landing hero.
- Preserved a no-motion presentation for users who request reduced motion.
- Added a dedicated `/about` page explaining the farm records, risk profile and support pathway.
- Added direct email and phone links using the contact details supplied by JARI.
- Shared public navigation and footer components between landing and About pages.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/app/about/page.tsx](frontend/src/app/about/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/components/landing/scroll-reveal.tsx](frontend/src/components/landing/scroll-reveal.tsx)
- [frontend/src/components/layout/public-header.tsx](frontend/src/components/layout/public-header.tsx)
- [frontend/src/components/layout/public-footer.tsx](frontend/src/components/layout/public-footer.tsx)
- [active.md](active.md)

### Validation
- Build and browser review have not been run.

### Next step
- Review on mobile and desktop with reduced motion both enabled and disabled.

## Phase 15: Brand loading, motion and landing polish

Status: Implemented and pending review

### Completed
- Added the root App Router loading screen with a J-first JARI wordmark animation: J begins centered, moves left and reveals ARI beside it.
- Added a shared back-to-top button that appears after scrolling and honors reduced-motion settings.
- Rounded the farm profile illustration and redesigned the landing contact panel with distinct email and phone cards.
- Added a high-contrast pre-footer call to action with bold copy, a Get started action and a compact farm-data journey illustration.
- Preserved reversible section reveals and reduced-motion support.

### Files changed
- [frontend/src/app/loading.tsx](frontend/src/app/loading.tsx)
- [frontend/src/app/layout.tsx](frontend/src/app/layout.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/components/landing/farm-journey.tsx](frontend/src/components/landing/farm-journey.tsx)
- [frontend/src/components/layout/back-to-top.tsx](frontend/src/components/layout/back-to-top.tsx)
- [active.md](active.md)

### Validation
- Build and browser review have not been run.

### Next step
- Review animation rhythm, loading duration and card spacing on phone and desktop sizes.

## Phase 16: Scroll reveal refinement

Status: Implemented and pending review

### Completed
- Made scroll reveals more visible with a 30px lift, a restrained scale transition and a smoother 720ms easing curve.
- Expanded the IntersectionObserver trigger area so sections start revealing before they reach the viewport edge.
- Made sections visible on the server and enabled the hidden state only after hydration, preserving content when JavaScript is unavailable.
- Kept reversible enter/exit behavior and the reduced-motion override.

### Files changed
- [frontend/src/components/landing/scroll-reveal.tsx](frontend/src/components/landing/scroll-reveal.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [active.md](active.md)

### Validation
- Build and browser review have not been run.

### Next step
- Review the revised reveals at phone and desktop sizes and tune if needed.

## Phase 17: Staggered scroll reveal refinement

Status: Implemented and pending browser review

### Completed
- Replaced single-block reveals in the landing flow and services grid with sequenced item reveals.
- Added short entrance delays that reset to zero on exit, so reverse reveals happen immediately while scrolling back.
- Applied the same stagger to the About page's three product steps.
- Increased reveal travel to 32px and adjusted the trigger area so motion is easier to notice and starts earlier.
- Kept visibility fallback and reduced-motion behavior.

### Files changed
- [frontend/src/components/landing/scroll-reveal.tsx](frontend/src/components/landing/scroll-reveal.tsx)
- [frontend/src/components/landing/farm-journey.tsx](frontend/src/components/landing/farm-journey.tsx)
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/app/about/page.tsx](frontend/src/app/about/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [active.md](active.md)

### Validation
- `git diff --check` is the only validation run; no build or browser review.

### Next step
- Review the stagger in a browser and tune the delays if they feel too slow.

## Phase 18: Distinctive landing hero

Status: Implemented and pending review

### Completed
- Replaced the common full-bleed image and dark-gradient hero with an editorial split composition.
- Kept the real Nigerian poultry-house photo and gave it a distinctive arch crop.
- Added a custom farm-profile panel over the photo, showing the flock, health, production and financial records that feed a JARI risk profile.
- Updated the headline to frame the flock as part of a larger farm story and kept the copy plain and farmer-focused.
- Preserved a prominent registration action and added a link to the explanation section.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [active.md](active.md)

### Validation
- Build and browser review have not been run.

### Next step
- Review the image crop, overlap panel and heading wrap at phone and desktop sizes.

## Phase 19: Reference-inspired landing page

Status: Implemented and pending browser review

### Completed
- Rebuilt the landing page around the supplied full-page reference: centered hero, illustrated farm profile, service feature cards, connection pathways, local context, FAQ, direct contact section, closing CTA and footer.
- Kept JARI’s green agricultural palette and explained the product in plain language without borrowing the finance brand’s wording or visuals.
- Added a genuine poultry-farm photo from Uyo, Nigeria alongside the existing Kano poultry-house photo.
- Added restrained hero and decorative motion, reversible section reveals, hover transitions and reduced-motion support.
- Added attribution and license links for both poultry photos in the footer.
- Used the local rollout section in place of reference pricing because JARI pricing has not been provided; avoided unsupported outcome claims and metrics.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/components/layout/public-footer.tsx](frontend/src/components/layout/public-footer.tsx)
- [frontend/public/images/nigerian-poultry-uyo.jpg](frontend/public/images/nigerian-poultry-uyo.jpg)
- [active.md](active.md)

### Validation
- `git diff --check` only; no build or browser review.

### Next step
- Review the new page and animations at mobile and desktop sizes.

## Phase 20: Brand system across product pages

Status: Implemented and pending responsive review

### Completed
- Refined landing-page floating-card animation so entrance motion and ongoing drift use separate transforms; retained the shared scroll reveal and reduced-motion behavior.
- Rebuilt the About page with authentic Nigerian poultry imagery, a clear three-step explanation, mission, Jos South context and contact paths.
- Restyled login, registration and password recovery with the landing-page palette and type, and replaced password visibility emoji with accessible icon controls.
- Reworked the shared auth layout around JARI's genuine Nigerian poultry-house image and consistent brand voice.
- Replaced the role shell's horizontally scrolling mobile links with an accessible hamburger disclosure, scrollable menu, active route indication, click-away and Escape closing, and close-on-navigation.
- Updated the shared dashboard shell with a warm neutral sidebar and consistent brand surfaces across farmer, admin and institution pages.
- Preserved auth routing, role checks, form submissions and existing dashboard navigation destinations.

### Files changed
- [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
- [frontend/src/app/about/page.tsx](frontend/src/app/about/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/app/(auth)/layout.tsx](frontend/src/app/(auth)/layout.tsx)
- [frontend/src/app/(auth)/auth-shell.tsx](frontend/src/app/(auth)/auth-shell.tsx)
- [frontend/src/app/(auth)/login/page.tsx](frontend/src/app/(auth)/login/page.tsx)
- [frontend/src/app/(auth)/register/page.tsx](frontend/src/app/(auth)/register/page.tsx)
- [frontend/src/app/(auth)/forgot-password/page.tsx](frontend/src/app/(auth)/forgot-password/page.tsx)
- [frontend/src/components/layout/role-shell.tsx](frontend/src/components/layout/role-shell.tsx)
- [active.md](active.md)

### Validation
- `git diff --check` only; no build or browser review.

### Next step
- Review the motion and responsive auth/dashboard layouts at phone, tablet and desktop widths.

## Phase 21: Team, auth and dashboard usability

Status: Implemented and pending responsive review

### Completed
- Added three equal About-page team cards with headshot, name and role slots; kept them as placeholders to avoid inventing team details or portraits.
- Redesigned the auth shell with a compact mobile photo banner, account switcher, clearer support path and reusable JARI styling.
- Replaced the inactive password-reset form with clear account-support contact options because no reset API is configured.
- Changed the mobile dashboard hamburger into a left-sliding navigation drawer with backdrop, scroll lock, Escape and outside-click close, and close-on-route-change behavior.
- Grouped farmer, admin and institutional navigation into collapsible sections and kept the workspace header sticky while scrolling.
- Applied shared visual treatment to dashboard form cards, inputs, selects, textareas, focus states and submit buttons.
- Rebuilt farmer dashboard KPI cards with clearer hierarchy, illustrative-data labels and a direct farm-profile summary.
- Improved quick actions to link to existing record routes and made the farm profile directly reachable from the dashboard and farmer avatar.
- Reworked the farm profile into readable identity, operation, housing and biosecurity sections with an edit path.

### Files changed
- [frontend/src/app/about/page.tsx](frontend/src/app/about/page.tsx)
- [frontend/src/app/(auth)/auth-shell.tsx](frontend/src/app/(auth)/auth-shell.tsx)
- [frontend/src/app/(auth)/forgot-password/page.tsx](frontend/src/app/(auth)/forgot-password/page.tsx)
- [frontend/src/app/globals.css](frontend/src/app/globals.css)
- [frontend/src/components/layout/role-shell.tsx](frontend/src/components/layout/role-shell.tsx)
- [frontend/src/app/(dashboard)/layout.tsx](frontend/src/app/(dashboard)/layout.tsx)
- [frontend/src/app/(admin)/layout.tsx](frontend/src/app/(admin)/layout.tsx)
- [frontend/src/app/(institution)/layout.tsx](frontend/src/app/(institution)/layout.tsx)
- [frontend/src/app/(dashboard)/dashboard/page.tsx](frontend/src/app/(dashboard)/dashboard/page.tsx)
- [frontend/src/app/(dashboard)/farm/page.tsx](frontend/src/app/(dashboard)/farm/page.tsx)
- [active.md](active.md)

### Validation
- `git diff --check` only; no build, tests or browser review.

### Next step
- Add the team's actual names, roles and headshots; review the layouts at phone and desktop widths.

## Phase 22: Farmer dashboard clarity and farm review

Status: Implemented; responsive review and backend integration remain

### Completed
- Simplified the farmer dashboard to farm details, clear next steps and a readable review status. Removed unsupported sample KPIs and activity claims.
- Added a farmer onboarding tour shown on the first dashboard visit, with skip, next, finish and Escape controls.
- Added a KYC farm review form for farm name, location and phone number, with pending, verified and more-details states.
- Added an admin verification page where a reviewer can inspect the submitted farm details, mark a farm verified or request more information.
- Replaced fabricated risk ratings and assessment claims with a transparent farm risk profile explaining that JARI has not issued an assessment before a review.
- Added a direct farm risk profile action to the farmer's farm page.
- Reworded farmer navigation in plain language and added farm verification to the menu.
- Updated the mobile navigation to cover the viewport and animate both in and out; added thin desktop scrollbars that are hidden on mobile.

### Implementation limitation
- KYC submissions and review decisions currently use browser local storage because the project has no server-backed KYC or risk-assessment endpoint. Farmer and reviewer views do not sync across different devices or browsers; connect the flow to authenticated backend storage before real use.

### Validation
- `git diff --check` only. No build, tests or browser review.
