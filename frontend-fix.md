# JARI: FRONTEND COMPLETION, FUNCTIONAL SIMULATION AND BACKEND-READINESS IMPLEMENTATION

## 1. PROJECT CONTEXT

You are working on JARI, a poultry farm risk intelligence and financial enablement platform initially targeting poultry farmers in Jos South, Plateau State, Nigeria.

JARI helps poultry farmers digitize their farm operations, maintain structured business records, understand farm performance, identify operational and financial risks, generate credible farm business profiles and prepare for relevant grants, loans and insurance opportunities.

JARI is not a lending institution, insurance company or grant provider. It provides agricultural intelligence, farm documentation, risk assessment and financial enablement services.

The central product proposition is:

**JARI transforms farm records into actionable agricultural and financial intelligence, helping poultry farmers become better prepared for financing, insurance and other support opportunities.**

The current project has an established frontend, several application routes, shared components, a backend scaffold, product documentation and development-tracking files.

Your assignment is to complete and refine the existing frontend into a fully functional, thoroughly testable simulated application that is architecturally ready for future backend integration.

## 2. CRITICAL DEVELOPMENT INSTRUCTION: WE ARE CURRENTLY SIMULATING THE ENTIRE APPLICATION

This is the most important instruction in this assignment.

Do not misunderstand the current development stage.

We are deliberately simulating the entire application before implementing the actual backend.

We want every screen, workflow, form, dashboard, calculation, interaction, navigation path and user journey to work correctly before introducing real backend services.

Therefore:

- Keep the demonstration data.
- Keep the seeded farmer accounts.
- Keep realistic farm records.
- Keep simulated financial figures.
- Keep demonstration opportunities.
- Keep sample verification records.
- Keep sample assessments and analytics.
- Keep the demonstration admin and institutional accounts.

Do not remove the demonstration data simply because the backend is not implemented.

Instead, make the demonstration environment behave like a real, fully functional application.

A user should be able to register, log in, create a farm, add poultry houses, manage flocks, record feed purchases, record production, manage health records, record transactions, generate reports, request verification, review opportunities and interact with the administrative and institutional workspaces.

These interactions must produce consistent changes throughout the application.

For example:

- Adding a flock must update the flock listing, dashboard and relevant analytics.
- Recording mortality must update the flock population and mortality indicators.
- Recording a feed purchase must update feed inventory and expenditure calculations.
- Recording sales must update revenue and financial summaries.
- Updating a farm record must affect relevant profile information.
- Completing an inspection must update verification status and inspection history.
- Updating an opportunity must affect its availability and matching results.

The application must simulate these relationships rather than simply presenting isolated forms and static screens.

### Simulation architecture

Use a centralized mock data and service architecture.

The frontend should simulate backend behaviour through a structured service layer, repository pattern or equivalent architecture.

Separate:

1. Mock database and seed data.
2. Data models and TypeScript types.
3. Business logic and calculations.
4. Data access services.
5. Application hooks.
6. UI components and pages.

Do not scatter hardcoded arrays and business logic throughout individual pages.

All simulated data operations should pass through the service layer.

Use persistent browser storage for the current simulation so that data remains available after page refreshes and navigation.

Where appropriate, use a versioned storage schema and centralized initialization and reset mechanisms.

The architecture must make it possible to replace the mock data services with actual API services later without rebuilding the entire frontend.

Use realistic asynchronous service behaviour where useful, including loading states, success responses, validation errors and failed requests.

Do not introduce artificial delays everywhere. Use them only where they help test realistic application states.

Clearly distinguish sample data from real-world verified information. Do not imply that simulated institutions, opportunities, inspections or risk assessments represent actual partnerships, approvals or validated predictions.

## 3. FIRST TASK: INSPECT THE EXISTING PROJECT

Before changing anything, inspect the complete repository.

Read:

- Product requirements documentation.
- Frontend documentation.
- Frontend development instructions.
- Development progress tracker.
- Active development task.
- Existing architecture documentation.
- Frontend source code.
- Backend scaffold.
- Existing TypeScript types.
- Mock data.
- Authentication implementation.
- Service layer.
- Hooks.
- Components.
- All application routes.
- Configuration and package files.

Do not assume the previous review is completely accurate without checking the source.

Create a clear implementation inventory.

Identify:

- Completed functionality.
- Partially implemented functionality.
- Broken functionality.
- Static demonstration screens.
- Forms without functional submission.
- Buttons without actions.
- Inconsistent mock data.
- Missing workflows.
- Duplicate components.
- Missing validation.
- Incorrect calculations.
- Navigation problems.
- Responsive design issues.
- Architectural problems that would complicate backend integration.

Preserve the existing visual direction, branding, typography, colour system, navigation structure and reusable components unless a specific issue requires improvement.

Do not redesign the entire product unnecessarily.

## 4. AUTHENTICATION AND USER MANAGEMENT

Make the simulated authentication system fully functional.

Support the following roles:

1. Farmer.
2. Administrator.
3. Verification officer.
4. Institutional user.

Implement:

- Registration.
- Login.
- Logout.
- Session persistence.
- Session expiry simulation where appropriate.
- Password validation.
- Password recovery simulation.
- Profile editing.
- Role-specific navigation.
- Role-specific dashboards.
- Role-based route protection.
- Unauthorized access handling.
- Demo account switching.

Create clear demo credentials and document them for testing.

A user must only access the workspace associated with their role.

Simulated authentication must not be presented as production-grade security. Keep its implementation isolated so it can be replaced with real authentication later.

## 5. FARMER ONBOARDING AND FARM REGISTRATION

Implement a complete farmer onboarding experience.

Support:

- Farmer personal information.
- Contact information.
- Farm registration.
- Farm name.
- Farm location.
- State and local government area.
- Farm coordinates where available.
- Establishment date.
- Poultry operation type.
- Farm ownership information.
- Farm capacity.
- Number of poultry houses.
- Water source.
- Ventilation.
- Housing system.
- Biosecurity information.
- Available infrastructure.

Include:

- Multi-step forms where appropriate.
- Form validation.
- Save and continue.
- Previous and next navigation.
- Completion indicators.
- Edit functionality.
- Review before submission.
- Success and error feedback.

A farmer must be able to complete onboarding without encountering dead ends.

The dashboard must reflect the actual onboarding state.

## 6. FARM MANAGEMENT

Implement functional farm management.

Support:

- Create farm.
- View farm.
- Edit farm.
- Update farm information.
- Manage multiple farms where the product model permits.
- View farm operational summaries.
- View farm verification status.
- View farm documentation.

Ensure all related records are associated with the correct farm.

## 7. POULTRY HOUSE MANAGEMENT

Implement complete poultry house management.

Each poultry house should support:

- House name or reference.
- Farm association.
- House type.
- Housing system.
- Capacity.
- Current bird population.
- Dimensions where recorded.
- Ventilation.
- Water facilities.
- Feeding facilities.
- Biosecurity information.
- Condition.
- Notes.

Support creation, editing, viewing and archival.

Do not allow the same house to be unintentionally duplicated.

House capacity and current population must be reflected in relevant farm summaries.

## 8. FLOCK MANAGEMENT AND POPULATION MOVEMENTS

This is one of the most important areas of JARI.

Create a structured flock management system.

Each flock should contain:

- Flock identification.
- Farm.
- Poultry house.
- Production type.
- Breed.
- Date acquired or established.
- Initial population.
- Source.
- Age or age information.
- Current population.
- Flock status.
- Notes.

Support broiler and layer workflows.

Implement a dedicated flock movement system.

Movement types should include:

- Initial stocking.
- Bird acquisition.
- Additional stocking.
- Mortality.
- Sales.
- Transfers.
- Other authorized adjustments.

Current flock population must be calculated from the opening population and subsequent movements.

Do not simply overwrite the population number without preserving the movement history.

Each movement must include:

- Date.
- Movement type.
- Quantity.
- Associated flock.
- Reason.
- Supporting notes.
- Recorded by.

Prevent invalid movements that would result in negative population.

Update all related dashboard figures and analytics automatically.

## 9. FEED MANAGEMENT

Build a complete simulated feed management workflow.

### Feed purchases

Capture:

- Feed type.
- Feed brand.
- Feed category.
- Supplier.
- Purchase date.
- Quantity.
- Quantity unit.
- Bag weight.
- Number of bags.
- Total quantity.
- Unit price.
- Total cost.
- Amount paid.
- Outstanding balance.
- Payment status.
- Associated farm.
- Associated flock where applicable.

### Feed inventory

Implement:

- Current stock.
- Stock additions.
- Stock consumption.
- Stock adjustments.
- Low-stock indicators.
- Inventory history.

### Feed consumption

Capture:

- Date.
- Flock.
- Feed type.
- Quantity consumed.
- Unit.
- Notes.

Consumption must reduce the corresponding inventory where inventory tracking applies.

Prevent negative inventory unless an explicitly documented adjustment workflow permits it.

Update feed expenditure and consumption analytics.

## 10. PRODUCTION MANAGEMENT

Implement complete production recording.

Support separate production workflows for broiler and layer operations.

### Layer production

Capture:

- Flock.
- Recording date.
- Live laying bird population.
- Total eggs collected.
- Good eggs.
- Broken eggs.
- Damaged eggs.
- Production notes.

Calculate egg production rate using the appropriate live laying population and recorded production.

Make the calculation explainable.

### Broiler production

Capture:

- Flock.
- Recording date.
- Population.
- Average weight where measured.
- Total weight where measured.
- Birds ready for sale.
- Feed consumption.
- Production notes.

Support production history and reporting.

Do not force irrelevant layer fields into broiler records or vice versa.

## 11. POULTRY HEALTH MANAGEMENT

Implement a complete poultry health record system.

### Vaccination records

Capture:

- Flock.
- Vaccine name.
- Vaccine type.
- Administration date.
- Number of birds covered.
- Dosage where appropriate.
- Administration method.
- Administered by.
- Next scheduled vaccination.
- Notes.

### Health incidents

Capture:

- Flock.
- Incident date.
- Symptoms observed.
- Affected population.
- Suspected condition.
- Diagnosis where confirmed by a qualified professional.
- Severity.
- Action taken.
- Veterinary professional where applicable.
- Outcome.
- Supporting notes.

Clearly distinguish farmer-observed symptoms from confirmed diagnoses.

### Mortality

Capture:

- Flock.
- Date.
- Number of birds lost.
- Suspected cause.
- Confirmed cause where available.
- Notes.

Mortality must be recorded through the flock movement system or a properly integrated transaction workflow.

Do not count the same mortality twice.

### Treatments

Capture:

- Flock.
- Medication or treatment.
- Date.
- Quantity.
- Dosage where appropriate.
- Administration method.
- Reason.
- Administered by.
- Treatment duration.
- Outcome.

Ensure all health information appears in the relevant flock history and farm profile.

## 12. SALES MANAGEMENT

Build a complete sales management module.

Capture:

- Sale reference.
- Date.
- Customer.
- Product.
- Associated flock.
- Quantity.
- Unit.
- Unit price.
- Total amount.
- Amount received.
- Outstanding balance.
- Payment status.
- Payment method.
- Notes.

Support:

- Create sales.
- Edit sales.
- View sales.
- Record additional payments.
- Track outstanding balances.
- View transaction history.

When birds are sold, the flock population must be adjusted through the movement system.

Prevent the same sale from reducing flock population multiple times when editing or updating a record.

Update revenue and receivables correctly.

## 13. EXPENSE MANAGEMENT

Implement complete farm expense management.

Expense categories should include:

- Feed.
- Medication.
- Vaccination.
- Labour.
- Transportation.
- Utilities.
- Equipment.
- Maintenance.
- Rent.
- Other operational expenses.

Capture:

- Expense reference.
- Date.
- Category.
- Description.
- Supplier or recipient.
- Associated farm.
- Associated flock where relevant.
- Amount.
- Amount paid.
- Outstanding balance.
- Payment status.
- Payment method.
- Supporting document.
- Notes.

Update expense summaries and financial analytics automatically.

Avoid double-counting feed purchases if they are already represented as expenses. Define one canonical financial transaction source and use it consistently.

## 14. ASSET MANAGEMENT

Implement a structured asset management system.

Capture:

- Asset name.
- Category.
- Description.
- Farm.
- Acquisition date.
- Acquisition cost.
- Estimated current value.
- Ownership status.
- Condition.
- Quantity.
- Supporting documents.
- Notes.

Support creation, editing, viewing and archival.

Display assets in farm business profiles.

Do not treat estimated asset values as verified valuations.

## 15. DOCUMENT MANAGEMENT

Create a functional simulated document management workflow.

Support documents such as:

- Farmer identification.
- Farm ownership evidence.
- Farm registration documents.
- Purchase receipts.
- Sales receipts.
- Financial statements.
- Veterinary records.
- Vaccination records.
- Inspection reports.
- Other supporting documents.

Implement:

- Upload simulation.
- Document categorization.
- File metadata.
- Preview where supported.
- Download where supported.
- Replace document.
- Delete document with confirmation.
- Document status.
- Required document indicators.
- Association with farms, flocks or applications.

Keep document operations behind a dedicated service so actual object storage can be introduced later.

## 16. DASHBOARD AND ANALYTICS

The farmer dashboard must display information derived from the simulated records.

Do not maintain unrelated hardcoded dashboard figures.

Dashboard indicators should include:

- Registered farms.
- Poultry houses.
- Active flocks.
- Current bird population.
- Production summaries.
- Mortality indicators.
- Feed inventory.
- Feed expenditure.
- Sales revenue.
- Operating expenses.
- Outstanding receivables.
- Outstanding payables.
- Verification status.
- Farm profile completion.
- Risk assessment status.
- Opportunity readiness.

Implement meaningful empty states and loading states.

### Analytics

Build analytics from actual simulated records.

Include:

- Flock population trends.
- Mortality trends.
- Egg production trends.
- Broiler performance.
- Feed consumption.
- Feed expenditure.
- Revenue.
- Expenses.
- Financial performance.
- Sales trends.

Make reporting periods configurable.

Ensure all charts update when underlying records change.

Do not display invented metrics as if they were calculated.

When sample data is being used, label the demonstration environment appropriately.

## 17. FARM RISK INTELLIGENCE

Implement a structured, explainable simulated risk assessment engine.

Do not introduce arbitrary risk scores without defined calculations.

Create separate assessment categories:

1. Operational risk.
2. Poultry health risk.
3. Production risk.
4. Financial risk.
5. Data confidence.

For each category define:

- Required data.
- Indicators.
- Calculation rules.
- Assessment status.
- Identified risks.
- Positive indicators.
- Missing information.
- Recommendations.

Use configurable provisional rules and weights.

Do not describe provisional weights as scientifically validated standards.

A risk assessment should include:

- Assessment reference.
- Farm.
- Assessment date.
- Reporting period.
- Records used.
- Indicators evaluated.
- Risk findings.
- Positive findings.
- Missing information.
- Data confidence.
- Recommendations.
- Assessment version.

Support:

- Generate assessment.
- View assessment.
- Recalculate assessment.
- Compare assessment history.
- View individual risk categories.

When information is insufficient, return an insufficient-data state instead of inventing a score.

Clearly distinguish missing information from actual risk.

Do not claim predictive AI capabilities or validated risk predictions.

## 18. FINANCIAL CAPACITY AND READINESS ASSESSMENT

Build this independently from agricultural risk.

Assess:

- Revenue history.
- Operating expenses.
- Cash flow where sufficient data exists.
- Outstanding receivables.
- Outstanding payables.
- Asset information.
- Farm production capacity.
- Financial record completeness.
- Funding requirements.

Generate a structured financial readiness profile.

Clearly distinguish:

- Recorded financial performance.
- Estimated financial information.
- Farmer-reported information.
- Missing financial information.
- Verified information.

Support configurable assessment rules.

Do not equate profitability with loan eligibility.

Do not claim that JARI approves or guarantees funding.

## 19. FARM BUSINESS PROFILE AND REPORT GENERATION

Implement a complete farm business profile.

The profile should aggregate:

1. Farm identification.
2. Farmer information.
3. Operational profile.
4. Poultry houses.
5. Flock history.
6. Production history.
7. Poultry health profile.
8. Financial profile.
9. Asset profile.
10. Risk assessment.
11. Financial readiness.
12. Data confidence.
13. Supporting documentation.
14. Verification history.

Implement:

- Profile preview.
- Report generation.
- Reporting period selection.
- PDF export.
- Report download.
- Report versioning.
- Report regeneration.
- Unique report reference.
- Generation date.
- Farmer review before external sharing.

Reports must clearly identify information that is farmer-submitted, system-calculated or physically verified.

## 20. OPPORTUNITY MANAGEMENT AND MATCHING

Build a fully functional simulated opportunity management system.

Keep the existing sample opportunities, but make them configurable through the admin workspace.

Support three opportunity categories:

### Grants

Capture:

- Institution.
- Programme name.
- Description.
- Eligible beneficiaries.
- Agricultural sector.
- Geographic restrictions.
- Eligibility criteria.
- Opening date.
- Closing date.
- Required documents.
- Application instructions.
- Official destination.
- Availability status.

### Loans and financing

Capture:

- Institution.
- Product name.
- Financing purpose.
- Eligible businesses.
- Geographic restrictions.
- Minimum and maximum amounts.
- Financing costs where known.
- Repayment period.
- Collateral requirements.
- Required records.
- Application process.
- Availability status.

### Insurance

Capture:

- Provider.
- Insurance product.
- Coverage type.
- Eligible poultry operations.
- Covered risks.
- Exclusions.
- Premium information where available.
- Claim requirements.
- Required documentation.
- Availability status.

Clearly label fictional or demonstration opportunities.

### Matching engine

Compare farmer information against opportunity requirements.

Return:

- Requirements met.
- Requirements incomplete.
- Requirements not met.
- Missing information.
- Missing documents.
- Eligibility concerns.
- Preparation recommendations.

Use transparent, explainable matching rules.

Do not present arbitrary high, medium or low matches without a defined methodology.

Use readiness statuses such as:

- Requirements met.
- Requirements incomplete.
- Does not meet requirements.
- Unable to assess.

Institutional providers retain final eligibility and approval decisions.

## 21. APPLICATION PREPARATION AND TRACKING

Implement a complete simulated application workflow.

A farmer should be able to:

1. View an opportunity.
2. Review its requirements.
3. Check readiness.
4. See missing information.
5. Prepare required documents.
6. Review generated application information.
7. Provide consent for information sharing.
8. Submit a simulated referral or application.
9. Track application progress.
10. View requests for additional information.
11. View status history.

Possible statuses:

- Draft.
- Preparing.
- Ready for submission.
- Submitted.
- Under review.
- Additional information requested.
- Approved.
- Declined.
- Withdrawn.
- Closed.

Make status transitions functional and preserve their history.

Do not imply that a simulated submission has reached a real institution.

## 22. FARM VERIFICATION WORKFLOW

Build a complete simulated physical farm verification system.

### Farmer side

Allow farmers to:

- Request verification.
- Select a farm.
- Provide preferred inspection dates.
- Submit required information.
- Track verification status.
- View inspection results.
- Respond to additional information requests.

### Verification officer side

Allow officers to:

- View assigned inspections.
- Accept assignments.
- Schedule inspections.
- Record inspection dates.
- View farm information.
- Record farm coordinates where available.
- Inspect poultry houses.
- Record observed flock population.
- Record housing capacity.
- Inspect feeding and water facilities.
- Record ventilation and biosecurity observations.
- Review vaccination and health documentation.
- Upload inspection photographs.
- Add observations.
- Submit inspection findings.

### Administrator side

Allow administrators to:

- Assign verification officers.
- Review inspection reports.
- Request additional information.
- Approve verification.
- Reject verification.
- Record reasons.
- View verification history.

Keep separate statuses for:

- Not requested.
- Requested.
- Pending assignment.
- Assigned.
- Scheduled.
- Inspection completed.
- Under review.
- Additional information required.
- Verified.
- Rejected.

Do not mark a farm physically verified without a completed simulated inspection and review workflow.

Clearly distinguish farmer-submitted records from physically observed and administratively reviewed information.

## 23. ADMINISTRATIVE WORKSPACE

Complete the admin workspace.

Implement:

- Admin dashboard.
- Farmer management.
- Farm management.
- User management.
- Role management.
- Verification management.
- Inspection assignment.
- Record review.
- Risk assessment review.
- Financial readiness review.
- Institution management.
- Opportunity management.
- Application/referral management.
- Document review.
- Audit history.
- Platform analytics.
- Demo data management.

Admin actions must update the shared simulated data.

Implement confirmations for sensitive actions.

Preserve audit records for important administrative operations.

## 24. INSTITUTIONAL WORKSPACE

Complete the institutional workspace.

Institutional users should be able to:

- View their institution profile.
- Manage authorized users.
- View opportunities belonging to their institution.
- View farmer referrals.
- Review farmer-authorized farm profiles.
- Review authorized business reports.
- Review available risk and financial assessments.
- Request additional information.
- Update referral/application statuses.
- View their review history.

Enforce simulated permissions.

Institutions must not automatically access every farmer's information.

Access must depend on farmer consent and appropriate authorization.

## 25. NOTIFICATIONS AND ACTIVITY HISTORY

Implement a simulated notification system.

Support notifications for:

- Farm registration.
- Record updates.
- Verification requests.
- Inspection assignments.
- Inspection completion.
- Additional information requests.
- Verification decisions.
- Assessment generation.
- Opportunity availability changes.
- Application status updates.
- Document requests.

Implement:

- Notification listing.
- Read/unread status.
- Mark as read.
- Mark all as read.
- Related page navigation.
- Activity history.

All notifications must be generated by actual simulated application events.

## 26. USER EXPERIENCE AND DESIGN QUALITY

Preserve JARI's existing branding and visual identity.

Do not introduce an unnecessary redesign.

Review every page for:

- Consistent spacing.
- Typography.
- Form layout.
- Button hierarchy.
- Table presentation.
- Responsive behaviour.
- Loading states.
- Empty states.
- Error states.
- Success feedback.
- Confirmation dialogs.
- Accessibility.
- Mobile usability.

Every visible button, dropdown, tab, navigation item, form and action must work.

Remove decorative controls that do nothing.

Do not leave placeholder buttons or dead-end pages.

Ensure tables support appropriate search, sorting, filtering and pagination where needed.

Ensure forms validate input and communicate errors clearly.

Ensure destructive operations require confirmation.

Ensure all relevant actions provide useful feedback.

## 27. BACKEND-READINESS ARCHITECTURE

Although the backend is not being implemented as part of this task, the frontend must be structured for straightforward backend integration.

Create or refine:

### A. Centralized data models

Define consistent TypeScript interfaces for:

- User.
- Farmer profile.
- Institution.
- Farm.
- Poultry house.
- Flock.
- Flock movement.
- Feed purchase.
- Feed inventory.
- Feed consumption.
- Production record.
- Vaccination.
- Health incident.
- Mortality.
- Treatment.
- Sale.
- Payment.
- Expense.
- Asset.
- Document.
- Verification request.
- Inspection.
- Risk assessment.
- Financial assessment.
- Farm report.
- Opportunity.
- Opportunity requirement.
- Application.
- Consent.
- Notification.
- Audit event.

Use consistent IDs, timestamps, status types and relationship references.

### B. API-ready service architecture

Separate service interfaces from their mock implementations.

For example:

- AuthService.
- FarmerService.
- FarmService.
- PoultryHouseService.
- FlockService.
- FeedService.
- ProductionService.
- HealthService.
- FinanceService.
- AssetService.
- DocumentService.
- AnalyticsService.
- AssessmentService.
- ReportService.
- OpportunityService.
- ApplicationService.
- VerificationService.
- InstitutionService.
- NotificationService.
- AdminService.

All pages and hooks must consume these services rather than accessing local storage or hardcoded data directly.

### C. Future API integration

Prepare:

- Centralized API client.
- Base URL configuration.
- Environment variable handling.
- Endpoint definitions.
- Request and response types.
- Standardized error handling.
- Authentication header handling.
- Query keys.
- Query hooks.
- Mutation hooks.
- Pagination support.
- Filtering and sorting conventions.
- File upload abstractions.

The mock implementation should conform to the same interfaces and response contracts expected from the future API.

Do not invent API endpoints and claim they are implemented.

Document proposed endpoint contracts for the backend team.

### D. Validation

Use the project's existing validation stack where appropriate.

Centralize reusable validation schemas.

Ensure frontend validation aligns with the intended backend data model.

Validate quantities, financial amounts, dates, required relationships and status transitions.

### E. Data consistency

Ensure related data is updated through centralized business operations.

Avoid independent updates that can leave records inconsistent.

Implement transaction-like behaviour in the simulated service layer for operations that affect multiple records.

For example, recording a sale involving birds must update the sale record and flock movement consistently.

### F. Storage

Implement versioned local simulation storage.

Support:

- Initial demo seeding.
- Persistent records.
- Data migration where appropriate.
- Reset to initial demo state.
- Export demo data.
- Import demo data where useful.

Keep the storage implementation isolated so it can later be replaced by API-backed persistence.

## 28. DEMONSTRATION DATA REQUIREMENTS

Retain realistic seeded data.

Create coherent demonstration datasets for:

- Multiple farmers.
- Multiple farms.
- Poultry houses.
- Broiler and layer flocks.
- Flock movements.
- Feed purchases.
- Feed consumption.
- Production.
- Vaccinations.
- Health incidents.
- Mortality.
- Treatments.
- Sales.
- Expenses.
- Assets.
- Documents.
- Verification requests.
- Inspections.
- Risk assessments.
- Financial assessments.
- Opportunities.
- Applications.
- Notifications.

Ensure relationships and calculations are consistent.

Avoid contradictory records.

For example, the current population must agree with the flock movement history.

Sales and expenses must agree with financial summaries.

Inspection decisions must agree with inspection records.

Opportunity readiness must agree with the actual requirements and farmer profile.

Create multiple scenarios so the application can be tested under different conditions:

- New farmer with no farm records.
- Farmer with an established broiler farm.
- Farmer with an established layer farm.
- Farmer with incomplete records.
- Farmer with high mortality.
- Farmer with strong production records.
- Farmer with outstanding payments.
- Farmer awaiting verification.
- Farmer with a verified farm.
- Farmer with incomplete opportunity requirements.
- Farmer with an active application.

Make it possible to switch between demo users or scenarios for testing.

## 29. TESTING REQUIREMENTS

Do not consider a page complete simply because it renders.

Test actual user workflows.

### Authentication tests

- Registration.
- Login.
- Logout.
- Session persistence.
- Role restrictions.

### Farm tests

- Farm registration.
- Farm editing.
- Farm viewing.
- Farm association.

### Flock tests

- Flock creation.
- Flock editing.
- Population calculations.
- Mortality movements.
- Sales movements.
- Invalid population prevention.

### Feed tests

- Purchase recording.
- Inventory updates.
- Consumption.
- Low-stock calculations.
- Financial summaries.

### Production tests

- Layer production.
- Broiler production.
- Production rate calculations.
- Historical records.

### Health tests

- Vaccination.
- Incident recording.
- Mortality.
- Treatments.
- Flock history.

### Financial tests

- Sales.
- Partial payments.
- Outstanding balances.
- Expenses.
- Revenue summaries.
- Prevention of double counting.

### Intelligence tests

- Risk assessment.
- Financial readiness.
- Data confidence.
- Missing information.
- Assessment history.

### Opportunity tests

- Opportunity creation.
- Requirement configuration.
- Matching.
- Missing information.
- Application preparation.
- Application status changes.

### Verification tests

- Request submission.
- Officer assignment.
- Inspection scheduling.
- Inspection completion.
- Administrative review.
- Verification status updates.

### Admin and institutional tests

- Role restrictions.
- Institution permissions.
- Farmer consent.
- Authorized information access.
- Administrative actions.
- Audit history.

### General application tests

- Navigation.
- Responsive layouts.
- Form validation.
- Loading states.
- Error handling.
- Empty states.
- Data persistence after refresh.
- Cross-page data consistency.

Fix discovered issues rather than simply documenting them.

## 30. DEVELOPMENT EXECUTION RULES

Follow these rules throughout implementation:

1. Inspect before modifying.
2. Preserve existing functional work.
3. Do not redesign unnecessarily.
4. Do not remove demo data.
5. Do not replace real functionality with static placeholders.
6. Do not leave nonfunctional buttons.
7. Do not duplicate business logic across pages.
8. Do not use inconsistent data structures.
9. Do not hardcode dashboard calculations.
10. Do not introduce unsupported claims.
11. Do not claim integrations that do not exist.
12. Do not mark simulated results as real-world verified.
13. Use reusable components.
14. Use consistent TypeScript types.
15. Follow the existing project conventions.
16. Maintain mobile responsiveness.
17. Test every significant workflow.
18. Keep documentation synchronized with implementation.
19. Update the development progress tracker.
20. Update the active development task after completing each major milestone.

Do not attempt to complete everything through one enormous, unverified code change.

Break implementation into logical milestones.

After each milestone:

- Run the relevant checks.
- Fix TypeScript errors.
- Run linting.
- Run tests.
- Test the affected workflows.
- Review responsive behaviour.
- Update documentation.
- Record completed work.

Do not mark a milestone completed when only its UI exists.

## 31. EXPECTED DELIVERABLES

At the end of this assignment, provide:

1. A fully functional simulated JARI frontend.
2. A consistent demonstration dataset.
3. A functional mock authentication system.
4. Complete farmer workflows.
5. Complete farm management.
6. Functional flock and population management.
7. Functional feed management.
8. Functional production management.
9. Functional poultry health management.
10. Functional sales and expense management.
11. Functional asset and document management.
12. Dynamic dashboards and analytics.
13. Explainable simulated risk assessment.
14. Financial readiness assessment.
15. Farm business profiles.
16. Report generation and PDF export.
17. Functional opportunity catalogue and matching.
18. Application preparation and tracking.
19. Complete simulated physical verification.
20. Functional administration workspace.
21. Functional institutional workspace.
22. Notifications and activity history.
23. Centralized mock services and data models.
24. API-ready frontend architecture.
25. Backend integration contract documentation.
26. Updated development documentation.
27. Test results and known issues.

## 32. FINAL ACCEPTANCE CRITERIA

The project will be considered ready for backend integration only when the following conditions are satisfied:

- All intended routes render correctly.
- All navigation works.
- All major forms work.
- All important buttons perform their intended actions.
- Demonstration data is coherent.
- User actions update the appropriate data.
- Data persists after refresh in the simulation environment.
- Dashboard figures derive from actual simulated records.
- Analytics derive from actual simulated records.
- Flock population is calculated from movement history.
- Financial calculations are consistent.
- Risk assessments are explainable.
- Insufficient data is handled correctly.
- Opportunity matching is requirement-based.
- Verification follows a complete inspection workflow.
- Farmer, administrator, verification officer and institutional roles have appropriate simulated permissions.
- Institutional information access respects farmer consent.
- Reports contain consistent farm information.
- The application works on mobile and desktop.
- No major workflow ends in a dead end.
- No critical TypeScript, linting or runtime errors remain.
- The mock services can be replaced with API implementations without rewriting the UI.
- Backend integration contracts are documented and consistent with the frontend models.

## 33. FINAL INSTRUCTION

The goal is NOT to build another attractive prototype.

The goal is to complete the frontend as a fully working simulated version of the actual JARI product.

Think of this as building the entire application against a simulated backend.

When the backend is introduced, we should not have to redesign screens, invent missing workflows, rewrite forms or discover that important interactions were never implemented.

We should already have:

- The screens.
- The workflows.
- The data models.
- The validation.
- The business logic.
- The calculations.
- The user interactions.
- The role-based experiences.
- The tested application flows.

The backend should primarily provide real authentication, persistent database operations, secure document storage, API services and real institutional integrations.

**Do not sacrifice functional completeness for visual progress.**

**Do not sacrifice the existing product direction for unnecessary architectural complexity.**

**Keep the demo data, make the simulation realistic, make every workflow functional and prepare JARI for a clean transition to a real backend.**

The guiding principle is:

**Build the complete product experience now. Connect the real infrastructure afterwards.**