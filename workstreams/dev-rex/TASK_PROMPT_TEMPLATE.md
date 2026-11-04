# TASK PROMPT TEMPLATE: WORKSTREAM 2 (DEVELOPER 2)
*Instructions: Copy and paste the block below into ChatGPT or Antigravity whenever you start implementing a specific feature in Developer 2's workstream. Fill in the `<FEATURE_NAME>` and `<TASK_DESCRIPTION>` placeholders.*

---

```markdown
You are assisting Developer 2, Lead Engineer for Workstream 2 on the "Commercial Poultry Insurance & Finance Infrastructure (Jari)" project for HackJos 2026.

Before writing any code or generating files, you must strictly follow these engineering protocols:

1. CONTEXT INITIALIZATION:
   - Read our workstream master context: `workstreams/developer-2/AI_CONTEXT.md`.
   - Read the relevant module specifications in `modules/finance-readiness/README.md` or `modules/institutional-dashboard/README.md`.
   - Verify the database models in `docs/DATABASE_SCHEMA.md` and endpoints in `docs/API_CONTRACTS.md`.

2. SOURCE CODE INSPECTION:
   - Inspect existing files in the target module folder before modifying or creating anything.
   - Check what reusable components already exist in `components/common/`, `components/forms/`, and `components/tables/`.

3. STRICT IMPLEMENTATION BOUNDARIES:
   - Implement ONLY the feature requested below. Do not refactor unrelated code.
   - Do NOT modify Japhet's modules (`modules/farm-management/`, `modules/insurance-management/`, `modules/incident-claims/`).
   - Do NOT alter `shared/` core infrastructure or shared contracts without explicit authorization.
   - Reuse existing design tokens from `docs/DESIGN_SYSTEM.md` (e.g. Institutional Slate 900 `#0F172A`, Emerald 600 `#059669`, NGN currency formatting).

4. REGULATORY & BUSINESS LOGIC INTEGRATION:
   - Label institutional partners as prospective pilot partners (e.g. Gowans Microfinance Bank, Bank of Agriculture, NAIC).
   - Do NOT build an automated loan approval engine or automated credit scoring engine. Underwriting decisions remain strictly with the institutional partner.
   - Enforce data privacy and scoped access grants (`institutional_access_grants`).

5. TASK SPECIFICATION:
   - Feature Name: <FEATURE_NAME>
   - Specific Deliverable / Requirement: <TASK_DESCRIPTION>
   - Target Directory: <e.g., modules/finance-readiness/ or modules/institutional-dashboard/>

6. VERIFICATION & PROGRESS UPDATE:
   - Provide unit/manual verification instructions to ensure the feature works properly.
   - Update `workstreams/developer-2/PROGRESS.md` with the new implementation status.
```

