# JARI FRONTEND DEVELOPMENT IMPLEMENTATION DOCUMENTATION

**Project:** JARI  
**Product:** Poultry Farm Risk Intelligence and Financial Enablement Platform  
**Frontend responsibility:** Frontend Engineering  
**Initial market:** Jos South, Plateau State, Nigeria  
**Primary users:** Poultry farmers  
**Additional users:** Administrators, verification agents and institutional users  
**Frontend framework:** Next.js, React and TypeScript  
**Styling:** Tailwind CSS and shadcn/ui  
**API integration:** FastAPI REST API  
**API base path:** `/api/v1`

---

# 1. FRONTEND OBJECTIVE

The frontend is the primary interaction layer between JARI and its users.

Its responsibility is to make the platform's agricultural data collection, farm management, analytics, risk assessment and financial enablement capabilities accessible through a simple, responsive and reliable interface.

The frontend must allow farmers to:

1. Create and manage their accounts.
2. Register and manage poultry farms.
3. Register poultry houses and birds.
4. Record feed purchases and consumption.
5. Record poultry production.
6. Maintain poultry health and vaccination records.
7. Record mortality.
8. Record sales and operating expenses.
9. Maintain farm asset information.
10. View farm analytics and performance.
11. Understand agricultural risk and financial capacity assessments.
12. Generate and download farm business reports.
13. Discover grant, loan and insurance opportunities.
14. Prepare information for financial applications.
15. Receive farm-specific reminders and notifications.

The frontend must also provide the interfaces required by administrators, verification agents and authorized institutional users.

## 1.1 Core frontend principles

All frontend implementation decisions must follow these principles:

- Mobile-first design.
- Simple language that poultry farmers can understand.
- Progressive data collection.
- Minimal and purposeful forms.
- Automatic calculations wherever possible.
- Reusable components.
- Consistent validation.
- Clear loading, success and error states.
- Secure authentication and authorization.
- Clear separation of user roles.
- Responsive dashboards.
- Accessible interface components.
- Reliable API integration.
- No fabricated farm analytics or assessment results.
- No presentation of simulated opportunities as real opportunities.

The frontend must not overwhelm farmers with a large questionnaire during registration. Farm information should be collected progressively as farmers use the platform.

---

# 2. FRONTEND TECHNOLOGY STACK

The frontend should use the following stack.

| Technology | Responsibility |
|---|---|
| Next.js | Application framework, routing and rendering |
| React | Component-based interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | Reusable interface components |
| React Hook Form | Form state and submission |
| Zod | Form and data validation |
| TanStack Query | API requests, caching and server state |
| Recharts | Farm analytics and visualizations |
| Lucide React | Interface icons |
| date-fns | Date formatting and date utilities |
| PWA support | Installable mobile-first experience |

## 2.1 Technical implementation decisions

### Next.js

Use the App Router.

Organize application routes using route groups to separate authentication pages from protected application areas.

Use Server Components by default where appropriate. Use Client Components for interactive forms, dashboards, charts, tables and other components that require browser-side state.

### TypeScript

Use strict TypeScript configuration.

Avoid unnecessary `any` types.

Define interfaces and types for:

- Users.
- Authentication.
- Farms.
- Poultry houses.
- Birds.
- Flock movements.
- Feed purchases.
- Feed consumption.
- Production records.
- Vaccination records.
- Health incidents.
- Mortality records.
- Treatment records.
- Sales.
- Expenses.
- Assets.
- Documents.
- Analytics.
- Risk assessments.
- Financial assessments.
- Data confidence.
- Reports.
- Opportunities.
- Matching results.
- Applications.
- Notifications.

### React Hook Form and Zod

All major forms should use React Hook Form and Zod.

Validation should be consistent between related forms and should provide understandable messages.

Frontend validation improves usability but does not replace backend validation.

### TanStack Query

Use TanStack Query for server-managed data.

It should handle:

- Fetching records.
- Caching responses.
- Pagination.
- Refetching.
- Mutations.
- Loading states.
- Error states.
- Cache invalidation.
- Optimistic updates where appropriate.

Do not use one large global React context to store all server data.

### Recharts

Use Recharts for:

- Production trends.
- Feed consumption trends.
- Mortality trends.
- Revenue and expense trends.
- Financial performance.
- Other analytics returned by the backend.

Charts must use actual API data. Do not generate artificial chart values to fill missing records.

### PWA

Build the application as a responsive web application with PWA support.

Offline record synchronization is an advanced capability. The frontend architecture should accommodate it, but full offline synchronization should not delay the essential MVP.

---

# 3. FRONTEND PROJECT STRUCTURE

The repository currently contains:

```text
project-root/
│
├── backend/
│
├── frontend/
│
├── .gitignore
│
└── writing-block.md
```

Keep this separation.

All frontend implementation should take place inside `frontend/`.

The following is the proposed internal structure:

```text
frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── manifest.json
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (farmer)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── farm/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [farmId]/
│   │   │   │
│   │   │   ├── poultry-houses/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [houseId]/
│   │   │   │
│   │   │   ├── birds
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [flockId]/
│   │   │   │
│   │   │   ├── feed/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── purchases/
│   │   │   │   └── consumption/
│   │   │   │
│   │   │   ├── production/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layers/
│   │   │   │   └── broilers/
│   │   │   │
│   │   │   ├── health/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── vaccinations/
│   │   │   │   ├── incidents/
│   │   │   │   ├── mortality/
│   │   │   │   └── treatments/
│   │   │   │
│   │   │   ├── sales/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │
│   │   │   ├── assets/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── assessments/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [reportId]/
│   │   │   │
│   │   │   ├── opportunities/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [opportunityId]/
│   │   │   │
│   │   │   ├── applications/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [applicationId]/
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── farmers/
│   │   │   │   ├── farms/
│   │   │   │   ├── birds
│   │   │   │   ├── verification/
│   │   │   │   ├── assessments/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── institutions/
│   │   │   │   ├── applications/
│   │   │   │   ├── advisory/
│   │   │   │   ├── reports/
│   │   │   │   ├── audit-logs/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (institution)/
│   │   │   ├── institution/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── farms/
│   │   │   │   ├── reports/
│   │   │   │   ├── assessments/
│   │   │   │   ├── documents/
│   │   │   │   ├── referrals/
│   │   │   │   ├── requests/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── ui/
│   │   │   └── shadcn-components/
│   │   │
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── app-header.tsx
│   │   │   ├── mobile-navigation.tsx
│   │   │   ├── page-header.tsx
│   │   │   └── dashboard-shell.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx
│   │   │   ├── activity-list.tsx
│   │   │   ├── reminders-panel.tsx
│   │   │   ├── farm-overview.tsx
│   │   │   └── quick-actions.tsx
│   │   │
│   │   ├── farm/
│   │   │   ├── farm-form.tsx
│   │   │   ├── farm-card.tsx
│   │   │   ├── farm-summary.tsx
│   │   │   └── farm-selector.tsx
│   │   │
│   │   ├── flock/
│   │   │   ├── flock-form.tsx
│   │   │   ├── flock-card.tsx
│   │   │   ├── flock-table.tsx
│   │   │   └── flock-movement-form.tsx
│   │   │
│   │   ├── records/
│   │   │   ├── record-table.tsx
│   │   │   ├── record-filters.tsx
│   │   │   ├── record-form-dialog.tsx
│   │   │   └── record-empty-state.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics-card.tsx
│   │   │   ├── production-chart.tsx
│   │   │   ├── mortality-chart.tsx
│   │   │   ├── feed-chart.tsx
│   │   │   └── financial-chart.tsx
│   │   │
│   │   ├── assessment/
│   │   │   ├── assessment-summary.tsx
│   │   │   ├── risk-category-card.tsx
│   │   │   ├── assessment-indicator.tsx
│   │   │   ├── assessment-explanation.tsx
│   │   │   └── data-confidence-card.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── report-card.tsx
│   │   │   ├── report-preview.tsx
│   │   │   └── report-filters.tsx
│   │   │
│   │   ├── opportunities/
│   │   │   ├── opportunity-card.tsx
│   │   │   ├── opportunity-details.tsx
│   │   │   ├── match-status.tsx
│   │   │   └── requirement-checklist.tsx
│   │   │
│   │   ├── documents/
│   │   │   ├── document-uploader.tsx
│   │   │   ├── document-list.tsx
│   │   │   └── document-status.tsx
│   │   │
│   │   ├── notifications/
│   │   │   ├── notification-item.tsx
│   │   │   └── notification-bell.tsx
│   │   │
│   │   └── shared/
│   │       ├── confirm-dialog.tsx
│   │       ├── loading-state.tsx
│   │       ├── error-state.tsx
│   │       ├── empty-state.tsx
│   │       ├── status-badge.tsx
│   │       ├── currency-display.tsx
│   │       ├── date-display.tsx
│   │       └── pagination.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── farms/
│   │   ├── poultry-houses/
│   │   ├── birds
│   │   ├── feed/
│   │   ├── production/
│   │   ├── health/
│   │   ├── sales/
│   │   ├── expenses/
│   │   ├── assets/
│   │   ├── analytics/
│   │   ├── assessments/
│   │   ├── reports/
│   │   ├── opportunities/
│   │   ├── applications/
│   │   ├── notifications/
│   │   └── administration/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   └── error-handler.ts
│   │   ├── auth/
│   │   │   ├── auth-provider.tsx
│   │   │   ├── permissions.ts
│   │   │   └── session.ts
│   │   ├── utils/
│   │   │   ├── format-currency.ts
│   │   │   ├── format-date.ts
│   │   │   ├── format-number.ts
│   │   │   └── calculations.ts
│   │   └── constants/
│   │       ├── routes.ts
│   │       ├── enums.ts
│   │       └── navigation.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-farms.ts
│   │   ├── use-birds
│   │   ├── use-analytics.ts
│   │   ├── use-assessments.ts
│   │   └── use-permissions.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── farm.schema.ts
│   │   ├── poultry-house.schema.ts
│   │   ├── flock.schema.ts
│   │   ├── feed.schema.ts
│   │   ├── production.schema.ts
│   │   ├── health.schema.ts
│   │   ├── sales.schema.ts
│   │   ├── expense.schema.ts
│   │   └── asset.schema.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── farm.ts
│   │   ├── poultry-house.ts
│   │   ├── flock.ts
│   │   ├── feed.ts
│   │   ├── production.ts
│   │   ├── health.ts
│   │   ├── finance.ts
│   │   ├── analytics.ts
│   │   ├── assessment.ts
│   │   ├── report.ts
│   │   ├── opportunity.ts
│   │   └── notification.ts
│   │
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   └── app-providers.tsx
│   │
│   └── middleware.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── components.json
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

This is a target organization, not a requirement to create every directory immediately. Build modules as their corresponding features are implemented. Keep the codebase understandable and avoid empty or unnecessary abstractions.

---

# 4. APPLICATION ROUTING AND ACCESS CONTROL

JARI has three primary application experiences:

1. Farmer application.
2. Administrative application.
3. Institutional application.

Verification agents should use a restricted administrative experience with permissions appropriate to their work.

## 4.1 Public routes

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/login` | User authentication |
| `/register` | Farmer registration |
| `/forgot-password` | Password recovery |

The landing page should explain JARI's purpose and direct users to registration or login.

## 4.2 Farmer routes

| Route | Purpose |
|---|---|
| `/dashboard` | Farmer overview |
| `/farm` | Farm profile and management |
| `/farm/new` | Register a farm |
| `/poultry-houses` | Manage poultry houses |
| `/birds | Manage fbirds
| `/feed` | Feed purchase and consumption records |
| `/production` | Poultry production records |
| `/health` | Poultry health records |
| `/sales` | Sales and revenue |
| `/expenses` | Operating expenses |
| `/assets` | Farm assets |
| `/analytics` | Farm performance analytics |
| `/assessments` | Agricultural and financial assessments |
| `/reports` | Business reports |
| `/opportunities` | Grants, loans and insurance |
| `/applications` | Application preparation and tracking |
| `/notifications` | Farmer notifications |
| `/settings` | Account settings |

## 4.3 Administrative routes

| Route | Purpose |
|---|---|
| `/admin` | Platform overview |
| `/admin/farmers` | Farmer account management |
| `/admin/farms` | Farm management |
| `/admin/birds Flock overview |
| `/admin/verification` | Verification workflows |
| `/admin/assessments` | Assessment review |
| `/admin/opportunities` | Opportunity management |
| `/admin/institutions` | Institutional account management |
| `/admin/applications` | Application and referral tracking |
| `/admin/advisory` | Advisory management |
| `/admin/reports` | Platform reports |
| `/admin/audit-logs` | Activity and audit history |
| `/admin/settings` | Administrative settings |

## 4.4 Institutional routes

| Route | Purpose |
|---|---|
| `/institution` | Institutional overview |
| `/institution/farms` | Farmer-authorized farm profiles |
| `/institution/reports` | Authorized business reports |
| `/institution/assessments` | Relevant farm assessments |
| `/institution/documents` | Authorized supporting documents |
| `/institution/referrals` | Referral tracking |
| `/institution/requests` | Additional information requests |
| `/institution/settings` | Account and permissions |

## 4.5 Route protection

The frontend must use authenticated route protection and role-aware navigation.

Expected roles:

- `farmer`
- `admin`
- `verification_agent`
- `institutional_user`

Access rules:

- Farmers can access their own farm information.
- Administrators can access administrative functions according to their permissions.
- Verification agents can access only the records and workflows assigned to them.
- Institutional users can access only farmer-authorized information.
- Unauthorized users must not access protected routes.

Important: hiding a sidebar link is not authorization. The backend must independently enforce all access permissions.

The frontend should redirect users to the appropriate dashboard after successful authentication based on their role.

---

# 5. APPLICATION LAYOUT AND NAVIGATION

## 5.1 Farmer application layout

The farmer application should have:

- Sidebar navigation on larger screens.
- Mobile navigation on smartphones.
- Top header.
- Page title and description.
- Notification access.
- User account menu.
- Farm selector where the farmer has multiple farms.
- Main content area.

The layout must work well on narrow smartphone screens without requiring horizontal scrolling.

### Farmer sidebar

Recommended order:

1. Dashboard.
2. My Farm.
3. My Birds
4. Feed Records.
5. Production.
6. Poultry Health.
7. Sales.
8. Expenses.
9. Farm Assets.
10. Analytics.
11. Farm Assessment.
12. Business Reports.
13. Opportunities.
14. Applications.
15. Notifications.
16. Settings.

Group related pages where doing so improves navigation.

### Header

The header should contain:

- Current page title or breadcrumb.
- Farm selector where applicable.
- Notifications.
- User profile menu.

## 5.2 Administrative layout

The administrative layout should have a distinct navigation structure.

It should prioritize platform management rather than farmer data entry.

## 5.3 Institutional layout

The institutional layout should be focused on authorized profiles, assessments, reports and application-related workflows.

Institutional users must not see unrestricted farmer records.

---

# 6. AUTHENTICATION AND FARMER ONBOARDING

Authentication is the first major frontend implementation milestone.

## 6.1 Registration page

Route: `/register`

Required fields:

- Full name.
- Phone number.
- Password.
- Password confirmation.
- Privacy and data-use terms acceptance.

The registration process should be straightforward and mobile-friendly.

After successful registration:

1. Establish the authenticated session.
2. Retrieve the user profile.
3. Determine the user's role.
4. Direct the farmer to the farm registration or onboarding experience.

## 6.2 Login page

Route: `/login`

Fields:

- Phone number or the identifier supported by the backend.
- Password.

The frontend must display understandable errors for invalid credentials, expired sessions and account issues.

## 6.3 Forgot password

Route: `/forgot-password`

Build this page around the password recovery process exposed by the backend.

Do not assume an OTP, SMS or email recovery mechanism until the backend authentication contract defines it.

## 6.4 Authentication state

The frontend should support:

- Authenticated user.
- Unauthenticated user.
- Session loading.
- Expired session.
- Logout.
- Permission-aware route access.

Use a secure session strategy coordinated with the backend.

Prefer secure, HttpOnly, SameSite cookies for refresh/session credentials where supported by the backend. Do not expose long-lived authentication secrets to browser JavaScript or store refresh tokens in localStorage.

The final authentication implementation must match the backend's actual token and cookie contract.

---

# 7. FARMER ONBOARDING AND FARM REGISTRATION

The farmer should be able to create an account, register a farm and access the dashboard without completing every operational record immediately.

## 7.1 Farm registration

Route: `/farm/new`

The farm registration form should collect the following information.

### Farm identity

- Farm name.
- Farm owner's name.
- Phone number.
- Community.
- LGA.
- State.
- Establishment date.

### Farm operation

- Poultry operation type:
  - Broiler.
  - Layer.
  - Breeder.
- Production system:
  - Deep litter.
  - Battery cage.
  - Free range.
  - Other.
- Number of poultry houses.
- Water source:
  - Borehole.
  - Well.
  - Municipal supply.
  - Surface water.
  - Other.
- Number of farm workers.

### Biosecurity measures

Allow selection of:

- Restricted farm access.
- Footbath.
- Disinfection.
- Visitor control.
- Protective clothing.
- Other.

## 7.2 Farm registration UX

Do not display all farm fields as one intimidating form.

Use logical sections:

1. Farm information.
2. Location.
3. Poultry operation.
4. Infrastructure.
5. Biosecurity.

Include:

- Progress indication.
- Clear field labels.
- Required-field indicators.
- Inline validation.
- Save and continue.
- Back navigation.
- Submission confirmation.

The form should preserve entered information when moving between sections.

## 7.3 Farm overview

Route: `/farm`

Display:

- Farm name.
- Owner.
- Location.
- Poultry operation.
- Establishment date.
- Number of poultry houses.
- Total housing capacity.
- Water source.
- Biosecurity information.
- Farm workers.

Total housing capacity must be derived from registered poultry houses, not independently entered as a duplicate value.

---

# 8. POULTRY HOUSE MANAGEMENT

Route: `/poultry-houses`

The farmer should be able to add, view and edit poultry houses.

## 8.1 Poultry house form

Fields:

- House name/reference.
- Housing system.
- Maximum bird capacity.
- Water source.
- Ventilation type.
- Feed storage availability.

## 8.2 Poultry house list

Display:

- House reference.
- Housing system.
- Maximum capacity.
- Water source.
- Ventilation.
- Feed storage availability.

Calculate total farm housing capacity from all registered poultry houses.

Provide clear empty states when a farm has no poultry houses.

---

# 9. FLOCK MANAGEMENT

Route: `/birds

Each flock represents a distinct group of birds acquired and managed as a batch.

## 9.1 Flock registration form

Fields:

- Flock reference/name.
- Poultry house.
- Poultry type.
- Breed/strain.
- Acquisition date.
- Source of birds.
- Initial number of birds.
- Age at acquisition.
- Age unit:
  - Days.
  - Weeks.
- Initial purchase cost.
- Cycle start date.

Cycle completion date should be recorded when the farmer completes the production cycle.

Flock status:

- Active.
- Completed.

## 9.2 Flock overview

Display:

- Flock reference.
- Poultry type.
- Poultry house.
- Acquisition date.
- Initial bird quantity.
- Current flock population.
- Flock status.
- Production cycle information.

## 9.3 Flock population movements

The frontend must support recording changes in flock population.

Movement categories include:

- Initial acquisition.
- Additional birds.
- Mortality.
- Sales.
- Other recorded movements.

The frontend must not allow a farmer to silently overwrite current flock size without retaining the underlying movement history.

Current flock size should be returned by the backend as a derived value.

The frontend may display calculated values but should not become the authoritative source of flock population calculations.

---

# 10. FEED MANAGEMENT

Route: `/feed`

Feed management has two separate workflows:

1. Feed purchases.
2. Feed consumption.

These records must not be treated as interchangeable.

## 10.1 Feed purchase form

Fields:

- Purchase date.
- Flock.
- Feed type.
- Feed brand.
- Quantity purchased.
- Quantity unit:
  - Bags.
  - Kilograms.
- Weight per bag, when the unit is bags.
- Total purchase cost.
- Amount paid.

Feed types:

- Starter.
- Grower.
- Finisher.
- Layer.
- Breeder.

### Automatic calculations

When the quantity unit is bags:

`Total quantity in kg = Number of bags × Weight per bag`

Outstanding balance:

`Outstanding balance = Total purchase cost - Amount paid`

These calculations should be shown to the farmer before submission.

The backend remains responsible for authoritative validation and calculation.

## 10.2 Feed consumption form

Fields:

- Flock.
- Recording date.
- Feed type.
- Quantity consumed.
- Unit.

## 10.3 Feed management interface

Provide:

- Purchase history.
- Consumption history.
- Date filters.
- Flock filters.
- Feed type filters.
- Quantity summaries.
- Expenditure summaries.

Clearly distinguish purchased feed from consumed feed.

Feed purchases must be linked to the expense ledger. Do not ask farmers to record the same feed purchase again through the general expense form.

---

# 11. POULTRY PRODUCTION MANAGEMENT

Route: `/production`

Production interfaces must adapt to the poultry operation type.

The frontend must not display layer-specific fields to broiler farmers or broiler-specific fields to layer farmers.

## 11.1 Layer production

Fields:

- Flock.
- Recording date.
- Number of live laying birds.
- Total eggs collected.
- Good eggs.
- Damaged/rejected eggs.

Display calculated indicators where the backend provides them:

- Daily egg production.
- Egg production rate.
- Good egg percentage.
- Damaged/rejected egg percentage.
- Production trends.

Tray conversion must use a configurable tray size supplied by the backend or platform configuration. Do not assume a universal tray size.

## 11.2 Broiler production

Fields:

- Flock.
- Recording date.
- Current live birds.
- Number of birds weighed.
- Average bird weight in kilograms.
- Number of birds ready for sale.

Display:

- Current live population.
- Number of birds weighed.
- Average recorded weight.
- Birds ready for sale.
- Weight performance over time.

The frontend must preserve the number of birds weighed as the sample size used for the average weight.

## 11.3 Production interface

Provide:

- Production record list.
- Add production record.
- Edit record.
- Flock filter.
- Date filter.
- Production charts.
- Empty state when no production data exists.

---

# 12. POULTRY HEALTH MANAGEMENT

Route: `/health`

Poultry health should have a dedicated section with separate record types.

## 12.1 Vaccination records

Fields:

- Flock.
- Vaccine name.
- Vaccination date.
- Number of birds covered.
- Next scheduled vaccination date.
- Vaccination cost.
- Administration status:
  - Scheduled.
  - Administered.

Interface requirements:

- Vaccination history.
- Upcoming vaccination reminders.
- Overdue vaccination records.
- Vaccination status.
- Add and edit vaccination records.

Do not present an unadministered scheduled vaccination as completed.

## 12.2 Health incidents

Fields:

- Flock.
- Incident date.
- Number of affected birds.
- Observed symptoms.
- Suspected condition.
- Veterinary diagnosis, where available.
- Action taken.
- Incident outcome:
  - Ongoing.
  - Resolved.
  - Escalated.

The interface must distinguish farmer-observed symptoms and suspected conditions from confirmed veterinary diagnoses.

## 12.3 Mortality records

Fields:

- Flock.
- Recording date.
- Number of birds lost.
- Suspected cause.
- Veterinary confirmation status:
  - Confirmed.
  - Unconfirmed.

Display mortality history and trends.

The frontend must show validation feedback when reported mortality conflicts with the available flock population.

## 12.4 Treatment and medication records

Fields:

- Flock.
- Treatment date.
- Medication/treatment name.
- Quantity administered.
- Treatment purpose.
- Treatment duration.
- Prescribed by.

The frontend is a recordkeeping interface.

JARI must not use this interface to independently diagnose diseases or prescribe medication.

Veterinary-related guidance should direct farmers to appropriate professional support.

---

# 13. SALES AND REVENUE MANAGEMENT

Route: `/sales`

Every sale must be recorded as an individual transaction.

## 13.1 Sales form

Fields:

- Flock.
- Sales date.
- Product sold:
  - Live birds.
  - Eggs.
  - Manure.
  - Other poultry products.
- Quantity sold.
- Unit of measurement.
- Unit selling price.
- Amount received.

## 13.2 Automatic calculations

Total sales amount:

`Total sales = Quantity sold × Unit selling price`

Outstanding balance:

`Outstanding balance = Total sales amount - Amount received`

Display the calculated totals before submission.

## 13.3 Sales dashboard

Display:

- Total sales.
- Amount received.
- Outstanding receivables.
- Recent transactions.
- Revenue trends.

The interface must clearly distinguish sales revenue from cash actually received.

---

# 14. OPERATING EXPENSE MANAGEMENT

Route: `/expenses`

## 14.1 Expense form

Fields:

- Flock, where applicable.
- Expense date.
- Expense category.
- Expense amount.
- Amount paid.

Expense categories:

- Feed.
- Vaccination.
- Veterinary services.
- Medication.
- Labour.
- Electricity and fuel.
- Water.
- Transportation.
- Maintenance and repairs.
- Rent.
- Other operating expenses.

## 14.2 Automatic calculation

`Outstanding balance = Expense amount - Amount paid`

## 14.3 Expense dashboard

Display:

- Total operating expenses.
- Amount paid.
- Outstanding payables.
- Expense breakdown by category.
- Expense trends.

Feed purchases must be linked to the expense ledger and must not be duplicated through manual expense entry.

The interface should make it clear when an expense is already represented by a feed purchase transaction.

---

# 15. FARM ASSET MANAGEMENT

Route: `/assets`

The asset interface should capture major productive farm assets.

## 15.1 Asset form

Fields:

- Asset name/type.
- Quantity.
- Ownership status:
  - Owned.
  - Leased.
  - Rented.
- Operational condition:
  - Functional.
  - Needs repair.
  - Non-functional.
- Estimated value.

## 15.2 Asset interface

Display:

- Asset name.
- Quantity.
- Ownership status.
- Operational condition.
- Estimated value.

The interface should not encourage farmers to record every small tool or consumable.

Only major assets relevant to farm operations and financial assessment should be included.

---

# 16. FARMER DASHBOARD

Route: `/dashboard`

The dashboard is the farmer's main landing page after authentication.

It should provide a useful overview of the farm without overwhelming the user.

## 16.1 Dashboard sections

### A. Farm overview

Display:

- Farm name.
- Farm location.
- Poultry operation type.
- Total housing capacity.
- Number of registered poultry houses.

### B. Flock overview

Display:

- Number of active birds
- Current flock population.
- Active flock details.

### C. Production overview

Display:

- Recent production.
- Egg production for layers.
- Broiler weight and sale readiness for broilers.
- Production trends where sufficient records exist.

### D. Feed overview

Display:

- Recent feed purchases.
- Feed consumption.
- Feed expenditure.

### E. Poultry health

Display:

- Recent mortality.
- Upcoming vaccinations.
- Outstanding health records.
- Important reminders.

### F. Financial overview

Display:

- Revenue.
- Expenses.
- Amount received.
- Outstanding receivables.
- Outstanding payables.

### G. Assessment overview

Display:

- Agricultural risk assessment summary.
- Financial capacity summary.
- Data confidence.
- Assessment date.
- Important improvement areas.

### H. Reminders and notifications

Display:

- Upcoming vaccination schedules.
- Missing production records.
- Incomplete financial records.
- Missing documentation.
- Other farm-specific reminders.

### I. Opportunities

Display relevant grant, loan and insurance opportunities returned by the matching API.

## 16.2 Dashboard implementation rules

Only display indicators supported by available records.

When information is unavailable:

- Show an empty state.
- Explain what information is needed.
- Provide an appropriate action to add the record.

Do not display zero when the actual meaning is unknown or the data has not been recorded.

Do not invent chart values or assessment scores.

The dashboard should provide quick actions for frequently used tasks:

- Add flock.
- Record feed purchase.
- Record feed consumption.
- Record production.
- Record vaccination.
- Record mortality.
- Record sale.
- Record expense.

---

# 17. ANALYTICS DASHBOARD

Route: `/analytics`

This section converts farm records into understandable performance insights.

The frontend should display analytics returned by the backend rather than independently recreating the entire analytics engine.

## 17.1 Operational analytics

Display relevant information about:

- Farm capacity.
- Housing capacity.
- Capacity utilization where the required data exists.
- Infrastructure information.
- Biosecurity information.

## 17.2 Production analytics

Display:

- Flock population trends.
- Mortality trends.
- Feed consumption.
- Production output.
- Layer egg production trends.
- Broiler weight trends.
- Production cycle history.

## 17.3 Health analytics

Display:

- Vaccination history.
- Vaccination coverage.
- Health incident history.
- Mortality trends.
- Treatment history.
- Relevant health expenditure.

## 17.4 Financial analytics

Display:

- Sales revenue.
- Actual cash received.
- Operating expenditure.
- Outstanding receivables.
- Outstanding payables.
- Revenue trends.
- Expense trends.
- Estimated operating surplus or deficit where supported.

Clearly distinguish financial estimates from complete financial statements.

## 17.5 Analytics filters

Support:

- Date range.
- Flock.
- Poultry operation type where relevant.
- Record category.

## 17.6 Chart implementation

Use Recharts for appropriate visualizations:

- Line charts for trends.
- Bar charts for comparisons.
- Pie or donut charts for category breakdowns where meaningful.

Every chart should include:

- Title.
- Appropriate units.
- Date or category labels.
- Useful tooltips.
- Empty state.
- Loading state.
- Error state.

Never make a chart look complete by inserting fabricated records.

---

# 18. FARM ASSESSMENT INTERFACE

Route: `/assessments`

This is one of JARI's most important frontend modules.

It communicates the intelligence generated from farm records.

The interface must explain the assessment rather than simply display a score.

## 18.1 Three assessment outputs

Present three distinguishable outputs.

### A. Agricultural Risk Profile

Includes:

1. Operational risk.
2. Poultry health risk.
3. Production risk.

### B. Financial Capacity Profile

Includes:

- Revenue.
- Expenses.
- Cash flow.
- Outstanding receivables.
- Outstanding payables.
- Existing financial obligations where recorded.
- Funding requirements.
- Financial performance indicators.

### C. Data Confidence Profile

Includes:

- Record completeness.
- Record consistency.
- Historical coverage.
- Digital validation status.
- Independent verification status.
- Supporting documentation.
- Missing information.

Do not confuse agricultural risk with financial capacity or data confidence.

## 18.2 Assessment detail page

Each assessment should show:

- Assessment date.
- Assessment status.
- Records used.
- Assessment dimensions.
- Indicators evaluated.
- Positive indicators.
- Identified risk factors.
- Missing information.
- Recommendations.
- Data confidence.
- Assessment version where supplied.

## 18.3 Risk explanation interface

For every displayed risk indicator, show:

- Indicator name.
- Current result.
- Explanation.
- Supporting record or evidence.
- Why the indicator matters.
- Recommended action.

Farmers should be able to understand why a particular concern has been identified.

## 18.4 Risk scoring presentation

The backend may return category-level scores and an overall summary where its methodology supports them.

The frontend must:

- Display only scores returned by the backend.
- Show the score's meaning and scale.
- Clearly identify the assessment date.
- Show contributing indicators.
- Display missing information.
- Avoid claiming predictive accuracy.
- Avoid presenting provisional weights as validated industry standards.

If an assessment cannot be generated because of insufficient information, explain what information is missing.

Do not automatically represent missing records as poor farm performance.

---

# 19. FARM BUSINESS REPORTS

Route: `/reports`

Farm business reports transform JARI records into structured information that farmers can use when approaching financial institutions and other relevant organizations.

## 19.1 Reports page

Display:

- Previously generated reports.
- Report reference.
- Reporting period.
- Generation date.
- Report status.
- Download action.
- Preview action.

## 19.2 Generate report workflow

The farmer should be able to:

1. Select a reporting period.
2. Request report generation.
3. View the report preview.
4. Review the included information.
5. Download the PDF.
6. Generate an updated report after making changes.

## 19.3 Report contents

The frontend report preview should reflect the backend report structure:

1. Farm identification.
2. Operational profile.
3. Production profile.
4. Poultry health profile.
5. Financial profile.
6. Risk assessment.
7. Supporting evidence.
8. Reporting period.
9. Generation date.
10. Verification status.

The report must clearly distinguish farmer-submitted, digitally validated and independently verified information.

## 19.4 Report security

Before sharing a report externally:

- Show the intended recipient or sharing destination where supported.
- Show what information will be shared.
- Require farmer authorization.
- Provide clear confirmation.
- Respect backend sharing permissions.

---

# 20. FINANCIAL OPPORTUNITIES

Route: `/opportunities`

This section presents three distinct opportunity categories:

1. Grants.
2. Loans and financing.
3. Insurance.

The frontend must clearly distinguish these categories.

## 20.1 Opportunity listing page

Provide category filters:

- All opportunities.
- Grants.
- Loans.
- Insurance.

Opportunity cards should display information supplied by the backend.

Depending on the opportunity category, display:

- Opportunity name.
- Institution or provider.
- Description.
- Category.
- Location eligibility.
- Relevant funding or coverage information.
- Application deadline.
- Opportunity status.
- Potential match status.

Do not invent funding amounts, interest rates, premiums, eligibility requirements or deadlines.

## 20.2 Opportunity details page

Display:

- Opportunity name.
- Institution.
- Description.
- Target beneficiaries.
- Agricultural sector.
- Geographic eligibility.
- Requirements.
- Required documents.
- Application opening date.
- Application closing date.
- Application instructions.
- Official application destination.
- Opportunity status.

For loan opportunities, display financing details only when supplied and verified.

For insurance opportunities, display coverage, exclusions and premium information only when supplied and verified.

## 20.3 Matching interface

The frontend should show:

- Potential match status.
- Requirements satisfied.
- Requirements not satisfied.
- Missing information.
- Missing documents.
- Recommended preparation steps.

Never label a potential match as guaranteed eligibility, guaranteed financing, approved insurance or an awarded grant.

## 20.4 Simulated opportunities

For the HackJos prototype, simulated opportunities must be visibly labelled as simulated.

Do not present sample providers or opportunities as confirmed partnerships.

---

# 21. APPLICATION PREPARATION

Route: `/applications`

The application preparation interface should help farmers organize information for relevant opportunities.

## 21.1 Application preparation workflow

1. Farmer selects an opportunity.
2. JARI displays its requirements.
3. Farmer reviews requirements.
4. JARI identifies available information.
5. JARI identifies missing information and documents.
6. Farmer completes the preparation checklist.
7. Farmer reviews the assembled information.
8. Farmer authorizes sharing or submission through an available workflow.

## 21.2 Application interface

Display:

- Opportunity name.
- Institution.
- Application status.
- Requirements checklist.
- Missing documents.
- Prepared farm information.
- Submission or referral status where supported.

The frontend must not imply that an application has been submitted when the farmer has only completed preparation.

---

# 22. DOCUMENT MANAGEMENT

Documents support farm profiles, verification and financial applications.

## 22.1 Document upload component

Create a reusable document uploader.

It should support:

- File selection.
- Upload progress.
- File name and size display.
- Upload success.
- Upload failure.
- Retry.
- Document preview where supported.
- Document removal where authorized.

## 22.2 Document categories

Support document types relevant to JARI:

- Farm photographs.
- Receipts.
- Vaccination documents.
- Veterinary documents.
- Production records.
- Sales records.
- Financial records.
- Supporting business documents.
- Generated reports.

## 22.3 Document status

Show relevant verification states:

- Farmer-submitted.
- Digitally validated.
- Independently verified.
- Requires review.

Do not use a verification label unless the backend provides the corresponding status.

## 22.4 Upload security

The frontend must enforce the file types and size limits defined by the backend.

Never expose private object-storage credentials.

Use authorized upload workflows and secure document access links supplied by the backend.

---

# 23. NOTIFICATIONS AND ADVISORY

Route: `/notifications`

The initial notification experience should focus on in-app notifications.

## 23.1 Notification categories

- Vaccination reminders.
- Overdue vaccination records.
- Unusual mortality trends.
- Missing production records.
- Missing financial records.
- Feed consumption changes.
- Incomplete production cycles.
- Missing supporting documents.
- Assessment recommendations.

## 23.2 Notification interface

Each notification should contain:

- Title.
- Message.
- Category.
- Date.
- Read/unread status.
- Related farm or flock where applicable.
- Relevant action.

Examples of actions:

- Open vaccination records.
- Add production record.
- Review mortality history.
- Complete farm information.
- Review assessment.

## 23.3 Advisory rules

Advisory content must be based on platform records and identified rules.

Veterinary-related notifications must not present JARI as a diagnostic or treatment authority.

---

# 24. ADMINISTRATIVE FRONTEND

The administrative interface is a separate experience from the farmer dashboard.

Its purpose is to allow authorized platform personnel to manage JARI.

## 24.1 Admin overview

Display:

- Registered farmers.
- Registered farms.
- Active birds
- Pending verification items.
- Assessments requiring review.
- Active opportunities.
- Application and referral activity.
- Recent administrative activity.

Only display metrics returned by the backend.

## 24.2 Farmer management

Features:

- Farmer listing.
- Search.
- Filters.
- Farmer profile.
- Registered farm information.
- Account status.
- Relevant activity.

## 24.3 Farm management

Features:

- Farm listing.
- Farm details.
- Flock overview.
- Record overview.
- Farm assessment.
- Verification information.

## 24.4 Verification management

Features:

- Verification queue.
- Farmer-submitted information.
- Supporting documents.
- Verification status.
- Review notes.
- Verification actions permitted by the user's role.

## 24.5 Assessment management

Features:

- Assessment listing.
- Assessment details.
- Assessment history.
- Indicator review.
- Assessment rule information where permission allows.

## 24.6 Opportunity management

Administrators should be able to:

- Create opportunities.
- Edit opportunities.
- Set eligibility criteria.
- Add required documents.
- Set application dates.
- Activate opportunities.
- Deactivate opportunities.
- Mark opportunities as expired.
- Review matching activity.

Opportunity creation forms should adapt to the selected category: grant, loan or insurance.

## 24.7 Institutional management

Features:

- Institutional accounts.
- Institution profiles.
- Account status.
- Permissions.
- Authorized access management.

## 24.8 Advisory management

Features:

- Advisory content.
- Advisory rules.
- Notification management.
- Active/inactive status.

## 24.9 Audit history

Display administrative activity and relevant audit events returned by the backend.

The frontend must not permit unauthorized users to modify sensitive assessment, verification or platform configuration data.

---

# 25. INSTITUTIONAL FRONTEND

The institutional portal is intended for authorized grant institutions, lenders and insurance providers.

It must remain separate from the unrestricted administrative interface.

## 25.1 Institutional overview

Display:

- Authorized farm profiles.
- Available reports.
- Assessments.
- Supporting documents.
- Referrals.
- Additional information requests.

## 25.2 Authorized farm profiles

Institutional users should only see farmer information that has been authorized for their access.

The interface should show the scope of the available information.

## 25.3 Farm reports and assessments

Provide access to relevant:

- Farm business profiles.
- Operational information.
- Production summaries.
- Health records.
- Financial information.
- Agricultural risk assessments.
- Data confidence information.

## 25.4 Additional information requests

Where supported, institutional users should be able to request additional information or documents.

The farmer should receive the request and decide how to respond.

## 25.5 Institutional permissions

The frontend must respect the access scope returned by the backend.

Do not assume that an institutional user can search or view every registered farm.

---

# 26. API INTEGRATION SPECIFICATION

The frontend will communicate with the FastAPI backend through a versioned REST API.

Base path:

`/api/v1`

The following endpoint groups are defined in the JARI technical specification.

| API group | Frontend responsibility |
|---|---|
| `/auth` | Registration, login, refresh and logout |
| `/users` | User profile |
| `/farms` | Farm management |
| `/poultry-houses` | Poultry house management |
| `/birdsFlock management |
| `/flock-movements` | Flock population movements |
| `/feed/purchases` | Feed procurement |
| `/feed/consumption` | Feed consumption |
| `/production/layers` | Layer production |
| `/production/broilers` | Broiler production |
| `/health/vaccinations` | Vaccination records |
| `/health/incidents` | Health incidents |
| `/health/mortality` | Mortality records |
| `/health/treatments` | Treatment records |
| `/sales` | Sales transactions |
| `/expenses` | Operating expenses |
| `/assets` | Farm assets |
| `/documents` | Document upload and management |
| `/analytics` | Farm analytics |
| `/assessments` | Risk and financial assessments |
| `/reports` | Business report generation |
| `/opportunities` | Opportunity discovery |
| `/matching` | Opportunity matching |
| `/applications` | Application preparation and tracking |
| `/advisory` | Farm-specific guidance |
| `/notifications` | Notifications |
| `/admin` | Administrative functions |
| `/institutions` | Institutional accounts and authorized access |

These are endpoint groups, not a complete endpoint contract.

The exact HTTP methods, request bodies, response schemas, query parameters and status codes must be agreed with the backend implementation. Do not invent endpoint details when integrating.

## 26.1 API client

Create one centralized API client.

Responsibilities:

- Base URL configuration.
- Authentication handling.
- Request headers.
- JSON serialization.
- Multipart file uploads.
- Response parsing.
- Error normalization.
- Session-expiration handling.
- Consistent error reporting.

Do not scatter direct `fetch()` calls across page components.

## 26.2 API configuration

Use environment variables.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

This is a development example. Production must use the actual deployed backend URL.

Do not put secrets or private API credentials in `NEXT_PUBLIC_` variables.

## 26.3 API response handling

The frontend must consistently handle:

- Successful responses.
- Validation errors.
- Authentication errors.
- Permission errors.
- Missing resources.
- Server errors.
- Network failures.

Show field-level validation messages when the backend identifies invalid fields.

Show a general error message when the problem is not associated with a specific form field.

## 26.4 TanStack Query integration

Create feature-specific query hooks.

Examples:

- `useFarms()`
- `useFarm(farmId)`
- `useCreateFarm()`
- `useBirdsrmId)`
- `useCreateFlock()`
- `useFeedPurchases(flockId)`
- `useFeedConsumption(flockId)`
- `useProductionRecords(flockId)`
- `useHealthRecords(flockId)`
- `useSales(farmId)`
- `useExpenses(farmId)`
- `useFarmAnalytics(farmId)`
- `useAssessments(farmId)`
- `useOpportunities()`
- `useNotifications()`

After a successful mutation, invalidate or update the relevant cached queries.

Example: creating a flock should refresh the flock list and any dashboard information that depends on active flock counts.

---

# 27. FRONTEND DATA TYPES

Create shared TypeScript types that reflect the backend's actual API schemas.

The following are the primary frontend domain entities.

| Entity | Main information |
|---|---|
| User | Identity, contact and role |
| FarmerProfile | Farmer information |
| Farm | Identity, location and operation |
| PoultryHouse | Housing and infrastructure |
| Flock | Poultry group and lifecycle |
| FlockMovement | Population changes |
| FeedPurchase | Feed procurement |
| FeedConsumption | Feed usage |
| LayerProduction | Egg production |
| BroilerProduction | Weight and sale readiness |
| Vaccination | Vaccination history |
| HealthIncident | Poultry health incident |
| Mortality | Bird losses |
| Treatment | Treatment history |
| Sale | Revenue transaction |
| Expense | Operating expenditure |
| Asset | Farm asset |
| Document | Uploaded evidence |
| Verification | Information verification |
| FarmIndicator | Calculated performance indicator |
| RiskAssessment | Agricultural risk assessment |
| FinancialAssessment | Financial capacity |
| DataConfidenceAssessment | Information reliability |
| Report | Generated business report |
| Opportunity | Grant, loan or insurance opportunity |
| MatchingResult | Opportunity comparison |
| Application | Preparation or application status |
| Notification | Farmer notification |

Avoid defining a second frontend data model that conflicts with the backend.

The backend API schemas are the source of truth for the final data contracts.

---

# 28. FORM DESIGN AND VALIDATION STANDARDS

All forms should follow one consistent implementation pattern.

## 28.1 Form structure

Each form should have:

1. Clear title.
2. Short description.
3. Logical field grouping.
4. Required-field indication.
5. Inline validation.
6. Loading state during submission.
7. Success feedback.
8. Error feedback.
9. Cancel or back action.

## 28.2 Input types

Use appropriate input controls:

- Text input for names and references.
- Telephone input for phone numbers.
- Number input for quantities and financial values.
- Date picker for dates.
- Select for predefined categories.
- Multi-select or checkboxes for biosecurity measures.
- Textarea for descriptions and observations.
- File uploader for supporting documents.

## 28.3 Numeric validation

Validate:

- Non-negative bird quantities.
- Valid measurement quantities.
- Valid financial amounts.
- Valid sample sizes.
- Valid production values.
- Amount received not exceeding the relevant sales amount.
- Amount paid not exceeding the relevant expense amount.

Some rules require server-side records to evaluate correctly. In those cases, display the backend validation response rather than relying on incomplete frontend calculations.

## 28.4 Automatic calculations

Where possible, display derived values before submission.

Examples:

- Feed quantity in kilograms.
- Feed outstanding balance.
- Sales total.
- Sales outstanding balance.
- Expense outstanding balance.
- Other calculations returned by the backend.

Do not create separate manual fields for values that can be derived from existing records.

## 28.5 Progressive data entry

Do not require every module to be completed before a farmer can use JARI.

A farmer should be able to:

- Register a farm.
- Create a flock.
- Add available records.
- Return later to complete missing information.

The frontend should communicate incomplete information without blocking unrelated workflows.

---

# 29. STATE MANAGEMENT

Use different tools for different types of state.

## Server state

Use TanStack Query for:

- Farms.
- Birds
- Records.
- Analytics.
- Assessments.
- Reports.
- Opportunities.
- Notifications.
- Administrative information.

## Form state

Use React Hook Form for:

- Registration.
- Farm forms.
- Flock forms.
- Feed forms.
- Production forms.
- Health forms.
- Financial forms.
- Opportunity and administrative forms.

## Local UI state

Use React state for:

- Dialog visibility.
- Selected tabs.
- Temporary filters.
- Expandable sections.
- Local interaction state.

## Authentication state

Use the agreed authentication/session strategy and a centralized authentication provider or equivalent.

Avoid duplicating user/session information across unrelated components.

---

# 30. UI DESIGN SYSTEM

The interface should feel professional, trustworthy and practical.

JARI is a farm intelligence platform, so the design should prioritize clarity, usability and information hierarchy rather than decorative elements.

## 30.1 Design requirements

- Consistent spacing.
- Consistent typography.
- Clear page hierarchy.
- Readable forms.
- Clear navigation.
- Responsive tables.
- Consistent status indicators.
- Reusable cards.
- Accessible dialogs.
- Consistent button styles.
- Clear empty states.
- Consistent error messages.

The actual brand color palette, logo and visual identity should follow the approved JARI brand assets. Do not introduce arbitrary brand colors or invent a logo during feature implementation.

## 30.2 Reusable interface components

Build reusable components for:

- Buttons.
- Inputs.
- Selects.
- Date pickers.
- Dialogs.
- Dropdowns.
- Cards.
- Tables.
- Tabs.
- Badges.
- Alerts.
- Tooltips.
- Pagination.
- Search.
- Filters.
- File uploads.
- Confirmation dialogs.
- Loading skeletons.
- Empty states.

Use shadcn/ui as the foundation and customize components consistently.

## 30.3 Status indicators

Create reusable status components for:

- Active.
- Completed.
- Scheduled.
- Administered.
- Pending.
- Approved where the backend confirms approval.
- Rejected.
- Requires review.
- Farmer-submitted.
- Digitally validated.
- Independently verified.
- Simulated.

Never infer a status from incomplete data.

---

# 31. RESPONSIVE DESIGN AND MOBILE EXPERIENCE

The farmer application must be designed for smartphone use first.

## 31.1 Mobile requirements

- Responsive navigation.
- Touch-friendly controls.
- Readable text.
- Compact dashboard cards.
- Forms that fit narrow screens.
- No unnecessary horizontal scrolling.
- Responsive charts.
- Responsive data tables.
- Easy document capture and upload.
- Clear feedback after saving records.

## 31.2 Desktop requirements

Desktop layouts should provide:

- Sidebar navigation.
- Wider data tables.
- Multi-column dashboard sections.
- Larger analytics views.
- Efficient administrative workflows.

## 31.3 Table responsiveness

Tables must adapt to mobile layouts.

Where a table becomes too wide, use a responsive card/list representation rather than forcing users to scroll horizontally through many columns.

## 31.4 Offline readiness

The document identifies offline record entry and controlled synchronization as a product capability.

For the initial implementation:

- Keep the API and form architecture compatible with future offline workflows.
- Do not assume that a failed network request has been saved.
- Show clear network and synchronization feedback.
- Implement local persistence and synchronization as a separate, tested capability.
- Do not silently overwrite newer server records during synchronization.

Full offline synchronization belongs in the later expansion scope unless the development team explicitly moves it into the MVP.

---

# 32. SECURITY AND PRIVACY REQUIREMENTS

The frontend must respect JARI's security and data governance requirements.

Implement:

- Protected routes.
- Role-aware navigation.
- Secure session handling.
- Permission-aware actions.
- Secure document access.
- Safe file uploads.
- Form validation.
- Safe rendering of user-submitted content.
- Clear consent interfaces.
- Session-expiration handling.

Never rely on frontend permission checks alone.

Every sensitive operation must be authorized by the backend.

## 32.1 Farmer consent

Before sharing information with an institution, show:

- The intended institution.
- The information to be shared.
- The purpose of sharing.
- The relevant documents.
- The confirmation action.

The farmer must explicitly authorize the sharing workflow supported by the backend.

## 32.2 Data correction

Farmers should be able to review and correct inaccurate records through the relevant interfaces.

When editing historical records, show the relevant record details and any audit information made available by the backend.

---

# 33. ERROR, LOADING AND EMPTY STATES

Every major page must handle these states.

## Loading state

Use skeletons or loading indicators while API data is being retrieved.

## Empty state

Explain what is missing and provide an appropriate next action.

Examples:

- No farms registered.
- No active birds
- No feed purchases recorded.
- No production records.
- No health records.
- No assessments available.
- No reports generated.
- No opportunities currently available.

## Error state

Provide understandable error messages and a retry action where appropriate.

## Permission state

If the user does not have permission to access a resource, show an appropriate unauthorized or access-denied screen.

Do not expose sensitive information in error messages.

---

# 34. TESTING REQUIREMENTS

Frontend testing must cover the actual JARI workflows.

## 34.1 Unit tests

Test:

- Formatting utilities.
- Currency formatting.
- Date formatting.
- Form schemas.
- Validation rules.
- Reusable calculations.
- Permission helpers.
- Status rendering.

## 34.2 Component tests

Test:

- Registration form.
- Login form.
- Farm form.
- Flock form.
- Feed forms.
- Production forms.
- Health forms.
- Sales form.
- Expense form.
- Document uploader.
- Dashboard cards.
- Assessment components.
- Opportunity cards.

## 34.3 Integration tests

Test:

- Successful API requests.
- Failed API requests.
- Authentication handling.
- Query invalidation.
- Form submission.
- Form validation.
- File upload.
- Report generation.
- Permission-dependent rendering.

## 34.4 End-to-end tests

Test the complete farmer workflow:

1. Farmer registers.
2. Farmer logs in.
3. Farmer creates a farm.
4. Farmer registers a poultry house.
5. Farmer creates a flock.
6. Farmer records feed purchases.
7. Farmer records feed consumption.
8. Farmer records production.
9. Farmer records vaccination and health information.
10. Farmer records mortality.
11. Farmer records sales.
12. Farmer records expenses.
13. Farmer views analytics.
14. Farmer views farm assessment.
15. Farmer generates a farm report.
16. Farmer views financial opportunities.
17. Farmer reviews application requirements.

## 34.5 Responsive testing

Test the application across:

- Small smartphones.
- Larger smartphones.
- Tablets.
- Laptop screens.
- Desktop screens.

## 34.6 Test data

Use controlled sample datasets.

Simulated farm information must be clearly identified and must never be represented as actual farmer performance.

---

# 35. FRONTEND DEVELOPMENT PHASES

The frontend should follow the product's development order while coordinating with the backend team.

## PHASE 0: FRONTEND FOUNDATION

**Objective:** Establish a maintainable frontend environment.

Tasks:

1. Inspect the existing `frontend/` directory.
2. Confirm whether Next.js is already initialized.
3. Preserve existing working code.
4. Configure TypeScript.
5. Configure Tailwind CSS.
6. Configure shadcn/ui.
7. Configure ESLint and formatting.
8. Configure the App Router.
9. Establish the application layout.
10. Configure environment variables.
11. Configure the API client foundation.
12. Configure TanStack Query.
13. Establish the shared type organization.
14. Establish the shared component organization.
15. Configure frontend testing.

**Deliverable:** A working frontend foundation with reusable layouts and application configuration.

## PHASE 1: AUTHENTICATION AND FARMER ONBOARDING

**Objective:** Allow farmers to access JARI and register farms.

Tasks:

1. Registration page.
2. Login page.
3. Forgot password page.
4. Authentication provider.
5. Session handling.
6. Role-aware navigation.
7. Protected farmer routes.
8. Farmer profile.
9. Farm registration.
10. Farm overview.
11. Form validation.
12. Save and continue functionality.

**Deliverable:** A farmer can register, log in, register a farm and access a personalized dashboard.

## PHASE 2: FARM OPERATIONS AND RECORD MANAGEMENT

**Objective:** Build the farmer's core recordkeeping interface.

Tasks:

1. Poultry house management.
2. Flock management.
3. Flock movement records.
4. Feed purchases.
5. Feed consumption.
6. Layer production.
7. Broiler production.
8. Vaccination records.
9. Health incidents.
10. Mortality records.
11. Treatment records.
12. Sales.
13. Expenses.
14. Farm assets.
15. Document uploads.
16. Record editing.
17. Record history.
18. Form validation.
19. Calculated values.

**Deliverable:** Farmers can manage their essential poultry business records through JARI.

## PHASE 3: DASHBOARD AND ANALYTICS

**Objective:** Make collected farm data understandable.

Tasks:

1. Farmer dashboard.
2. Farm overview.
3. Active flock summaries.
4. Feed summaries.
5. Production summaries.
6. Health summaries.
7. Financial summaries.
8. Production charts.
9. Mortality charts.
10. Feed charts.
11. Revenue and expense charts.
12. Date and flock filters.
13. Empty and incomplete-data states.

**Deliverable:** Farmers can view relevant farm performance information based on their recorded data.

## PHASE 4: FARM ASSESSMENT

**Objective:** Present agricultural risk, financial capacity and data confidence.

Tasks:

1. Assessment overview.
2. Agricultural risk profile.
3. Operational risk interface.
4. Poultry health risk interface.
5. Production risk interface.
6. Financial capacity interface.
7. Data confidence interface.
8. Indicator explanations.
9. Positive indicators.
10. Missing information.
11. Recommendations.
12. Assessment history.

**Deliverable:** Farmers can understand their farm assessments and the information behind them.

## PHASE 5: BUSINESS REPORTS

**Objective:** Provide structured farm business reports.

Tasks:

1. Report listing.
2. Reporting period selection.
3. Report generation request.
4. Report preview.
5. Report download.
6. Report history.
7. Report version information.
8. Farmer review.
9. Consent-based sharing workflow.

**Deliverable:** Farmers can generate and review professional farm business reports.

## PHASE 6: OPPORTUNITIES AND APPLICATION PREPARATION

**Objective:** Present grants, loans and insurance opportunities.

Tasks:

1. Opportunity listing.
2. Category filters.
3. Opportunity details.
4. Matching status.
5. Requirements checklist.
6. Missing information.
7. Missing documents.
8. Application preparation.
9. Application status.
10. Farmer consent and sharing.

**Deliverable:** Farmers can discover relevant opportunities and prepare the information needed for applications.

For the HackJos prototype, simulated opportunities must be labelled clearly.

## PHASE 7: ADMINISTRATIVE INTERFACE

**Objective:** Build platform management interfaces.

Tasks:

1. Admin layout.
2. Admin overview.
3. Farmer management.
4. Farm management.
5. Flock overview.
6. Verification management.
7. Assessment review.
8. Opportunity management.
9. Institution management.
10. Application and referral management.
11. Advisory management.
12. Reports.
13. Audit history.
14. Settings.

**Deliverable:** Authorized administrators can manage JARI through a dedicated interface.

## PHASE 8: INSTITUTIONAL INTERFACE

**Objective:** Support authorized institutional access.

Tasks:

1. Institutional layout.
2. Institutional overview.
3. Authorized farm profiles.
4. Farm reports.
5. Assessments.
6. Supporting documents.
7. Additional information requests.
8. Referral tracking.
9. Account and permission management.

**Deliverable:** Authorized institutions can review farmer-approved information.

## PHASE 9: TESTING AND RELEASE

**Objective:** Prepare the frontend for a reliable pilot.

Tasks:

1. Unit testing.
2. Component testing.
3. Integration testing.
4. End-to-end testing.
5. Mobile responsiveness testing.
6. Authentication testing.
7. Permission testing.
8. Form validation testing.
9. API error handling.
10. Document upload testing.
11. Report generation testing.
12. Performance review.
13. Accessibility review.
14. Production build validation.
15. Deployment configuration.

**Deliverable:** A tested and deployable JARI frontend.

---

# 36. MVP PRIORITY

Do not build every interface simultaneously.

Follow the product's release priorities.

## P0: Essential MVP

These features must be prioritized:

- Authentication.
- Farmer onboarding.
- Farm registration.
- Poultry house management.
- Flock management.
- Feed purchases.
- Feed consumption.
- Production records.
- Poultry health and vaccination records.
- Mortality records.
- Sales.
- Expenses.
- Farm assets.
- Data validation feedback.
- Farmer dashboard.
- Basic analytics.
- Explainable farm assessment.
- Farm business profile.
- PDF report generation.
- Basic administration.

## P1: Financial enablement

- Grant opportunities.
- Loan opportunities.
- Insurance opportunities.
- Opportunity details.
- Eligibility comparison.
- Missing-document identification.
- Application preparation.
- Farmer consent and sharing.

## P2: Expansion

- Full institutional portal.
- Independent verification workflows.
- Assisted farmer onboarding.
- Offline record synchronization.
- Advanced analytics.
- External integrations.
- Application tracking integrations.
- More advanced assessment interfaces.

The first release should demonstrate the complete core farmer workflow without depending on external institutional integrations.

---

# 37. FRONTEND ACCEPTANCE CRITERIA

The frontend implementation will be considered functionally ready for the essential MVP when the following conditions are met.

## Authentication

- A farmer can register.
- A farmer can log in.
- A farmer can log out.
- Protected routes require authentication.
- Role-based navigation works.
- Expired sessions are handled correctly.

## Farm management

- A farmer can create a farm.
- A farmer can view farm information.
- A farmer can update authorized farm information.
- A farmer can register poultry houses.
- Total housing capacity is derived from registered houses.

## Flock management

- A farmer can register a flock.
- A farmer can view flock details.
- A farmer can record flock movements.
- Current flock population is obtained from the backend.

## Recordkeeping

- A farmer can record feed purchases.
- A farmer can record feed consumption.
- A farmer can record layer or broiler production as appropriate.
- A farmer can record vaccination.
- A farmer can record health incidents.
- A farmer can record mortality.
- A farmer can record treatments.
- A farmer can record sales.
- A farmer can record expenses.
- A farmer can manage major farm assets.
- A farmer can edit records where authorized.

## Analytics and assessments

- Dashboard information comes from the API.
- Charts use actual returned records.
- Missing data is clearly identified.
- Assessment categories are distinguishable.
- Assessment explanations are visible.
- Unsupported scores are never fabricated.

## Reports and opportunities

- A farmer can request a business report.
- A farmer can preview and download available reports.
- Opportunities are categorized correctly.
- Potential matches are not represented as guaranteed eligibility.
- Simulated opportunities are clearly labelled.
- External information sharing requires farmer authorization.

## Administration and permissions

- Administrative routes are protected.
- Administrative features respect permissions.
- Institutional users only see authorized information.
- Verification status is displayed accurately.

## Quality

- Forms are validated.
- API errors are handled.
- Loading and empty states are implemented.
- The application works on smartphones.
- The frontend builds successfully.
- Core workflows have automated tests.

---

# 38. FRONTEND AND BACKEND COORDINATION

Frontend and backend development must follow a shared API contract.

Before implementing each feature, confirm:

1. The endpoint.
2. HTTP method.
3. Request schema.
4. Response schema.
5. Authentication requirement.
6. Required permissions.
7. Validation rules.
8. Error response format.
9. Pagination behavior.
10. Supported filters.

Do not guess backend response structures.

For every feature, coordinate the following:

| Frontend responsibility | Backend responsibility |
|---|---|
| Form inputs | Request schemas |
| Client-side validation | Authoritative validation |
| API calls | API endpoints |
| Dashboard rendering | Analytics calculations |
| Chart rendering | Analytics data |
| Assessment presentation | Assessment calculations |
| Report preview | Report generation |
| Opportunity display | Opportunity management |
| Matching explanation display | Matching rules |
| Permission-aware interface | Authorization enforcement |
| Document upload interface | Secure document storage |

The backend is responsible for authoritative business logic, database operations, calculations, access control and assessment results.

The frontend is responsible for user interaction, presentation, client-side validation, navigation and API communication.

---

# 39. RECOMMENDED IMPLEMENTATION ORDER FOR THE FRONTEND ENGINEER

Use this practical execution sequence.

**Step 1: Inspect the existing frontend codebase.**

Confirm the framework, package manager, dependencies, existing routes and current implementation before modifying anything.

**Step 2: Establish the frontend foundation.**

Configure the App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query and shared layouts.

**Step 3: Establish the API integration layer.**

Create the API client, environment configuration, error handling and authentication integration.

**Step 4: Build authentication.**

Complete registration, login, session handling, route protection and role-aware redirects.

**Step 5: Build farmer onboarding.**

Implement the farmer profile and progressive farm registration experience.

**Step 6: Build farm and flock management.**

Implement poultry houses, flock registration and population movements.

**Step 7: Build recordkeeping modules.**

Implement feed, production, poultry health, sales, expenses and assets.

**Step 8: Build the farmer dashboard.**

Aggregate farm information returned by the backend and create the dashboard overview.

**Step 9: Build analytics.**

Implement production, mortality, feed and financial visualizations.

**Step 10: Build assessments.**

Present agricultural risk, financial capacity and data confidence with clear explanations.

**Step 11: Build business reports.**

Implement report generation, preview and download workflows.

**Step 12: Build financial opportunities.**

Implement grants, loans, insurance and application preparation.

**Step 13: Build administration.**

Implement platform management and verification interfaces.

**Step 14: Build institutional access.**

Implement the restricted institutional experience when the backend permissions and workflows are ready.

**Step 15: Test and prepare deployment.**

Complete responsive, functional, integration and end-to-end testing.

---

# 40. FINAL FRONTEND DEVELOPMENT DIRECTION

The frontend should not be developed as a collection of unrelated dashboards and forms.

It must deliver one connected farmer experience:

**Register → Create Farm → Register Poultry Houses → Register Birds→ Record Farm Activities → View Analytics → Understand Farm Assessment → Generate Business Report → Discover Financial Opportunities → Prepare Applications.**

Every page and component should support this workflow.

The most important frontend priority is to make farm recordkeeping simple and reliable. The analytics, assessments, reports and opportunity-matching experiences depend on the quality and completeness of those records.

Build the farmer experience first. Add administrative and institutional interfaces according to their release priorities and the availability of backend functionality.

**JARI: From Farm Data to Financial Access.**