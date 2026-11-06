# JARI: Institution Onboarding and Institutional Dashboard Implementation

## 1. Objective

Extend the existing JARI application to support institutional accounts alongside the already implemented farmer accounts.

The goal is to:

- Add institution registration to the existing Create Account flow.
- Collect the correct information based on the institution's category.
- Implement an institutional verification and vetting process.
- Refine the existing institutional dashboard according to the institution's selected services.
- Make the institutional workflows functional using simulated data.
- Keep the implementation frontend-only, with no backend development.

**Important:** The existing farmer onboarding and farmer dashboard are already implemented. Do not rebuild, replace or disrupt them.

## 2. Update the Existing Create Account Page

Keep the existing registration page and add an account-type dropdown.

**Account Type:**
- Farmer
- Institution

When Farmer is selected, continue with the existing farmer registration process without changing it.

When Institution is selected, reveal another dropdown:

**Institution Category:**
- Lending Institution
- Insurance Provider
- Grant Provider

Allow multiple selections because an organisation may provide more than one service.

After selecting the category, continue to institution-specific registration.

Keep the existing sign-in functionality. After login, redirect users to the appropriate dashboard according to their account type and role.

## 3. Institution Registration Information

Collect the following information.

### A. Basic Organisation Information

| Field | Required |
|---|---|
| Organisation name | Yes |
| Organisation type | Yes |
| CAC registration number | Yes, where applicable |
| Year established | Yes |
| Official email | Yes |
| Official phone number | Yes |
| Website | No |
| Office address | Yes |
| State | Yes |
| LGA | Yes |
| Organisation logo | No |

Organisation type options:
- Bank
- Microfinance bank
- Finance company
- Insurance company
- Government agency
- NGO
- Cooperative
- Other

### B. Service-Specific Information

Only display the fields relevant to the selected institution categories.

#### Lending Institution

Collect:
- Types of agricultural loans offered.
- Minimum loan amount.
- Maximum loan amount.
- Interest rate or pricing structure.
- Loan duration.
- Repayment frequency.
- Collateral requirements.
- Agricultural sectors supported.
- States and LGAs covered.
- Farmer eligibility requirements.

#### Insurance Provider

Collect:
- Types of agricultural insurance offered.
- Agricultural risks covered.
- Coverage amount or limit.
- Premium pricing method.
- Policy duration.
- Policy exclusions.
- Claims requirements.
- Agricultural sectors supported.
- States and LGAs covered.

#### Grant Provider

Collect:
- Grant programme categories.
- Target beneficiaries.
- Minimum funding amount, where applicable.
- Maximum funding amount, where applicable.
- Eligibility requirements.
- Agricultural sectors supported.
- States and LGAs covered.
- Required application documents.
- Application deadline, where applicable.

These details describe the organisation's services. Actual loan products, insurance policies and grant programmes must be created and managed separately through the institutional dashboard.

### C. Authorised Representative

Collect:
- Representative's full name.
- Job title.
- Official email.
- Phone number.
- Proof of authority to represent the organisation, where required.

### D. Verification Documents

Collect relevant documents according to the institution category:

- CAC certificate or applicable registration evidence.
- Relevant operating licence or regulatory authorisation for lenders and insurers.
- Evidence of authority to administer grants for grant providers.
- Supporting documents for the authorised representative.

Do not require irrelevant documents from an organisation. Document requirements should depend on its organisation type and selected services.

## 4. Institution Verification and Vetting

After completing registration, the institution should be redirected to its institutional dashboard.

Initially, its status should be **Profile Incomplete** or **Pending Verification**, depending on whether it has submitted its application.

The institution must be able to:

- Complete its organisation profile.
- Upload required documents.
- Review its submitted information.
- Submit its application for verification.
- Track its verification status.
- Receive feedback from JARI administrators.
- Respond to requests for additional information.

### Verification Statuses

Implement these statuses:

1. Profile Incomplete
2. Pending Verification
3. Under Review
4. Additional Information Required
5. Verified
6. Rejected
7. Suspended

### JARI Administrator Verification

The JARI administrator must be able to:

- View submitted institution applications.
- Review organisation information.
- View uploaded documents.
- Approve an institution.
- Reject an application with a reason.
- Request additional information.
- Suspend an institution.
- View verification history.

Every verification action should update the institution's status and appear in its dashboard.

Only verified institutions should receive access to operational institutional features, such as publishing programmes and accessing authorised farmer profiles.

## 5. Institutional Dashboard

Refine the existing institutional dashboard. Do not create three separate applications.

Build one institutional dashboard with shared functionality and service-specific modules.

The selected and approved institution categories should determine which modules are visible.

### A. Common Dashboard Features

Every verified institution should have access to:

1. Overview
2. Organisation Profile
3. Programmes and Products
4. Applications
5. Farmer Profiles
6. Farm Assessments
7. Notifications
8. Team and User Management
9. Settings

### B. Lending Institution Dashboard

Display lending-specific information:

**Overview**
- Total loan programmes.
- Applications received.
- Applications under review.
- Approved applications.
- Rejected applications.
- Total amount requested.
- Total amount approved.

**Loan Management**
- Create loan programmes.
- Edit loan programmes.
- Set loan amounts and repayment terms.
- Define eligibility requirements.
- Set application deadlines.
- Specify required documents.
- Activate, pause or close programmes.

**Applications**
- View farmer applications.
- Review farmer and farm profiles.
- Review JARI farm assessments.
- Review financial readiness reports.
- Review supporting documents.
- Request additional information.
- Record approval or rejection decisions.
- Record loan disbursement information.

### C. Insurance Provider Dashboard

Display insurance-specific information:

**Overview**
- Total insurance products.
- Applications received.
- Applications under review.
- Policies approved.
- Active policies.
- Claims submitted.
- Claims under review.

**Insurance Management**
- Create insurance products.
- Define agricultural risks covered.
- Set coverage limits.
- Define premiums or pricing methods.
- Specify exclusions.
- Define eligibility requirements.
- Specify required documents.

**Applications and Claims**
- View farmer applications.
- Review farm profiles.
- Review poultry health and mortality records.
- Review farm assessments.
- Request additional information.
- Record underwriting decisions.
- Manage claims submitted through JARI.
- Record claims decisions and payment status.

### D. Grant Provider Dashboard

Display grant-specific information:

**Overview**
- Active grant programmes.
- Applications received.
- Applications under review.
- Approved applications.
- Rejected applications.
- Total funding allocated.
- Total funding awarded.

**Grant Management**
- Create grant programmes.
- Define grant amounts.
- Define eligibility requirements.
- Select target agricultural sectors.
- Set geographic coverage.
- Specify required documents.
- Set application deadlines.
- Publish, pause or close programmes.

**Applications**
- View farmer applications.
- Review farm profiles.
- Review farm performance reports.
- Review JARI assessments.
- Request additional information.
- Record selection decisions.
- Manage approved beneficiaries.
- Record grant disbursement information.

## 6. Farmer Profile Access and Data Sharing

Institutions must not have unrestricted access to all farmer records.

Implement consent-based access.

The workflow should be:

1. Farmer maintains their farm records through the existing farmer dashboard.
2. JARI generates farm assessments and financial readiness reports from available records.
3. A farmer discovers or applies to an institutional programme.
4. The farmer authorises the institution to access the required information.
5. The institution receives access to the authorised farmer profile and relevant reports.
6. The institution reviews the information and makes its own decision.

Institution users should be able to view:

- Farmer identity and contact information, where authorised.
- Farm profile.
- Farm location.
- Farm size and capacity.
- Flock information.
- Production records.
- Feed and operational records.
- Poultry health and mortality records.
- Revenue and expense records.
- Farm assets and supporting documents.
- JARI farm performance assessment.
- JARI risk assessment.
- Financial readiness assessment.
- Data completeness and verification status.

Only display information that the farmer has authorised for the relevant purpose.

Clearly distinguish JARI assessments from the institution's own underwriting or selection decisions. JARI must not guarantee loan approval, insurance coverage or grant selection.

## 7. Institutional Programme and Product Management

This is one of the most important features of the institutional dashboard.

Institutions must be able to publish actual opportunities for farmers.

Examples:

- A lender creates a poultry farming loan programme.
- An insurance provider creates a poultry insurance product.
- A grant provider creates a poultry farm support programme.

Each programme should have:

- Programme or product name.
- Description.
- Institution.
- Service category.
- Target agricultural sector.
- Geographic coverage.
- Minimum and maximum farm requirements, where applicable.
- Financial amount or coverage.
- Eligibility criteria.
- Required documents.
- Application opening date.
- Application deadline.
- Programme status.

Programme statuses:
- Draft
- Published
- Paused
- Closed
- Expired

Farmers should be able to discover relevant published opportunities through the existing farmer dashboard.

JARI should compare farmer information with programme requirements and display potential matches.

Do not represent a potential match as guaranteed eligibility or approval.

## 8. Institutional Staff and Permissions

Support multiple users under one organisation.

Implement these roles:

**Organisation Administrator**
- Full access to the organisation dashboard.
- Manage organisation information.
- Invite and manage staff.
- Manage programmes and products.
- View applications and reports.

**Programme Manager**
- Create and manage programmes.
- Review applications.
- Manage beneficiaries or programme participants.

**Credit or Underwriting Officer**
- Review farmer profiles and assessments.
- Review applications.
- Request additional information.
- Record assessment and decision information.

**Reviewer**
- View assigned applications.
- Review supporting documents.
- Submit recommendations.

**Read-only Analyst**
- View authorised reports and portfolio information.
- Cannot modify records or make decisions.

Only show modules and actions permitted by the assigned role.

## 9. Shared Data and Simulated Implementation

This development stage is still frontend simulation.

Do not introduce backend functionality.

Use centralised simulated services and data structures for:

- Institution accounts.
- Organisation profiles.
- Institution categories.
- Service-specific information.
- Verification applications.
- Verification documents.
- Verification history.
- Institutional users and roles.
- Loan programmes.
- Insurance products.
- Grant programmes.
- Farmer applications.
- Farmer consent records.
- Institutional decisions.
- Notifications.

Preserve all existing farmer demo accounts and data.

Ensure institutional actions update the shared simulated data consistently across the application.

For example:
- Publishing a loan programme should make it visible in the farmer opportunities section.
- A farmer applying for a programme should create an application visible in the institution dashboard.
- Approving or rejecting an application should update its status in both workspaces.
- A verification decision should immediately update the institution's access permissions.
- Revoking farmer consent should remove the institution's access to the affected information.

Persist simulated data across page refreshes.

Keep the service layer modular so the simulated implementations can later be replaced with backend API integrations without redesigning the screens.

## 10. Required End-to-End Testing

Test the following complete workflows:

1. Create a farmer account and confirm the existing flow still works.
2. Create a lending institution account.
3. Create an insurance institution account.
4. Create a grant provider account.
5. Create an organisation offering multiple services.
6. Complete institution onboarding.
7. Submit verification documents.
8. Submit an institution for vetting.
9. Review and approve the institution as a JARI administrator.
10. Confirm the correct institutional dashboard modules appear.
11. Create and publish a programme.
12. Discover the programme through a farmer account.
13. Apply for the programme as a farmer.
14. Authorise the institution to access the required farm information.
15. Review the application as the institution.
16. Request additional information.
17. Record an application decision.
18. Confirm that status updates appear in both dashboards.
19. Test staff roles and permissions.
20. Test responsive layouts on mobile and desktop.

## 11. Implementation Instructions

- Read the existing project documentation and development tracker before making changes.
- Inspect the existing institutional dashboard and extend it instead of building a duplicate.
- Preserve the existing farmer onboarding and dashboard.
- Preserve the existing JARI branding, components and design system.
- Do not remove existing demo data or demo accounts.
- Do not introduce backend services or database integrations.
- Do not introduce fake regulatory approvals or real institutional partnerships.
- Clearly label simulated institutions, programmes, applications and decisions as demo data.
- Make every form, button, navigation item and workflow functional.
- Test the complete workflows rather than only checking whether screens render.
- Update the existing frontend development tracker with completed work, outstanding work and the next actionable tasks.

**Final expected result:** JARI should support both farmers and institutions. Farmers continue using the existing farmer dashboard. Institutions can register, select their service categories, submit their information for vetting and access an appropriate institutional dashboard. Verified institutions can publish financing, insurance and grant opportunities, receive farmer applications, review consented farm information and manage their decisions.

The purpose is to make the institutional side of JARI functional enough to demonstrate the complete business model before backend implementation begins.