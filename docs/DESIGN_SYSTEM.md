# DESIGN SYSTEM & UI CONVENTIONS
**Project**: Commercial Poultry Insurance & Finance Infrastructure (Jari)  
**Hackathon**: HackJos 2026  
**Status**: APPROVED DESIGN SYSTEM (V1.0)

---

## 1. DESIGN PHILOSOPHY & BRAND IDENTITY

The user interface of Jari bridges two worlds:
1. **Commercial Poultry Operators in Plateau State**: Demands pragmatic, uncluttered, highly legible layouts with clear call-to-actions, straightforward form fields, and obvious status indicators.
2. **Institutional Underwriters & Agricultural Lenders**: Demands structured, audit-grade, high-density data presentations, verified evidence panels, and transparent metrics.

---

## 2. COLOR PALETTE & SEMANTIC TOKENS

```
+------------------------------------------------------------------------------------+
|  PRIMARY: Agricultural Emerald | INSTITUTIONAL: Slate Navy | HARVEST: Readiness Amber |
|  500: #10B981                  | 800: #1E293B              | 500: #F59E0B             |
|  600: #059669                  | 900: #0F172A              | 600: #D97706             |
|  700: #047857                  | 950: #020617              | 700: #B45309             |
+------------------------------------------------------------------------------------+
|  DANGER: Outbreak Crimson      | NEUTRAL SURFACES          | BORDERS & DIVIDERS       |
|  500: #EF4444                  | App Canvas: #F8FAFC       | Light: #E2E8F0           |
|  600: #DC2626                  | Card / Surface: #FFFFFF   | Medium: #CBD5E1          |
|  700: #B91C1C                  | Muted Surface: #F1F5F9    | Focus Ring: #059669      |
+------------------------------------------------------------------------------------+
```

### 2.1 CSS / Tailwind Token Definitions

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `primary-default` | `#059669` (Emerald 600) | Primary CTA buttons, active tabs, verified checkmarks |
| `primary-hover` | `#047857` (Emerald 700) | Button hover states |
| `primary-light` | `#ECFDF5` (Emerald 50) | Success banners, active menu pill backgrounds |
| `institutional-navy`| `#0F172A` (Slate 900) | Institutional portal header, primary headings, audit logs |
| `institutional-subtle`| `#334155` (Slate 700) | Secondary text, table headers |
| `amber-warning` | `#D97706` (Amber 600) | Pending inspections, partial readiness, missing documents |
| `amber-light` | `#FFFBEB` (Amber 50) | Warning callouts, readiness checklist item highlights |
| `crimson-danger` | `#DC2626` (Red 600) | High mortality alert, disease outbreak declaration, claim repudiation |
| `crimson-light` | `#FEF2F2` (Red 50) | Outbreak banners, critical loss badges |
| `surface-canvas` | `#F8FAFC` (Slate 50) | Background page canvas |
| `surface-card` | `#FFFFFF` (White) | Content containers, modal windows, table cards |
| `border-subtle` | `#E2E8F0` (Slate 200) | Card dividers, input borders, table borders |

---

## 3. TYPOGRAPHY SYSTEM

- **Primary Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`
- **Monospace Family (for Reference Codes)**: `"JetBrains Mono"`, `ui-monospace`, `Menlo`, `monospace`

| Style | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display H1** | 28px (`1.75rem`) | 700 (Bold) | 36px | Page titles, Institutional dashboard head |
| **Heading H2** | 22px (`1.375rem`)| 600 (Semibold) | 28px | Section headers, modal titles, dossier headers |
| **Heading H3** | 18px (`1.125rem`)| 600 (Semibold) | 24px | Card headers, form section subheads |
| **Body Default**| 15px (`0.9375rem`)| 400 (Regular) | 22px | Standard paragraphs, table data |
| **Body Medium** | 15px (`0.9375rem`)| 500 (Medium) | 22px | Form labels, button text, table rows |
| **Small / Caption**| 13px (`0.8125rem`)| 400 / 500 | 18px | Helper text, timestamps, badge labels |
| **Code / Ref** | 13px (`0.8125rem`)| 600 (Semibold) | 18px | Identifiers (`FLK-2026-001`, `CLM-2026-001`) |

---

## 4. UI COMPONENT CONVENTIONS

### 4.1 Buttons
- **Primary Button**: Background `emerald-600`, text `white`, rounded `8px` (`rounded-lg`), medium font weight, smooth hover to `emerald-700`. Used for "Save Record", "Generate Claim Package", "Submit Application".
- **Secondary / Outline Button**: Border `slate-300`, background `white`, text `slate-700`, hover `slate-50`.
- **Destructive Button**: Background `red-600`, text `white`, hover `red-700`. Used for "Declare Disease Outbreak", "Revoke Access".
- **Loading State**: Display a subtle spinning circle (`animate-spin`) replacing the leading icon, with button disabled (`opacity-60 cursor-not-allowed`).

### 4.2 Form Inputs
- **Text & Number Inputs**: Height `40px`, border `1px solid #CBD5E1`, padding `8px 12px`, rounded `6px`. Focus state: `border-emerald-600 ring-2 ring-emerald-100 outline-none`.
- **Currency Inputs**: Always prefix with bold Naira symbol `₦ ` in an un-editable leading block (`bg-slate-100 text-slate-600 border-r`).
- **Required Fields**: Indicate with a red asterisk `*` on the label. Include explicit helper text for agricultural units (e.g., *"Number of dead birds found in pen today"*).

### 4.3 Data Tables
- **Header**: Background `slate-100`, text uppercase `slate-600`, `12px` font size, bold tracking.
- **Rows**: Alternating subtle hover (`hover:bg-slate-50/80`). Padding `12px 16px`.
- **Numeric Alignment**: All quantities, mortality counts, and currency values must be **right-aligned**.
- **Empty State**: When table has 0 rows, render the shared `<EmptyState />` component with an icon, descriptive explanation, and action button.

### 4.4 Status Badges & Pills
All badges use rounded-full pills (`px-2.5 py-0.5 text-xs font-semibold`):

| Badge Status | Background | Text Color | Border | Example Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `SUCCESS` / `ACTIVE` | `bg-emerald-50` | `text-emerald-700` | `border border-emerald-200` | Active Flock, Insurance Ready, Claim Settled |
| `WARNING` / `PENDING` | `bg-amber-50` | `text-amber-800` | `border border-amber-200` | In Review, Underwriting Pending, Inspection Due |
| `CRITICAL` / `ALERT` | `bg-red-50` | `text-red-700` | `border border-red-200` | Outbreak Reported, High Mortality Surge |
| `NEUTRAL` / `DRAFT` | `bg-slate-100` | `text-slate-700` | `border border-slate-200` | Draft Dossier, Resting Pen, Archived Batch |

### 4.5 Metric KPI Cards
Standard 3-line metric card:
1. Label (`text-xs font-medium uppercase tracking-wider text-slate-500`)
2. Value (`text-2xl font-bold text-slate-900`)
3. Subtext/Trend (`text-xs text-emerald-600` or `text-slate-500`)

---

## 5. DESIGN SYSTEM DIRECTORY STRUCTURE

All UI components are organized strictly in `components/`:
```
components/
├── common/
│   ├── Badge.tsx          # Status pills & readiness indicators
│   ├── Button.tsx         # Primary, secondary, outline, destructive
│   ├── Card.tsx           # Surface container & KPI card
│   ├── EmptyState.tsx     # Zero-data friendly prompts
│   ├── LoadingSpinner.tsx # Asynchronous state feedback
│   └── Modal.tsx          # Accessible overlay dialog
├── forms/
│   ├── FormField.tsx      # Label, input container & error message
│   ├── CurrencyInput.tsx  # Specialized NGN Naira input with formatting
│   ├── SelectDropdown.tsx # Accessible select
│   └── FileUploadZone.tsx # Drag-and-drop evidence / document upload
├── navigation/
│   ├── FarmerNavbar.tsx   # Top navigation for poultry operators
│   ├── InstitutionalNavbar.tsx # Top navigation for underwriters & lenders
│   └── Breadcrumbs.tsx    # Dossier & page hierarchy path
└── tables/
    ├── DataTable.tsx      # Standardized sortable, paginated data table
    └── DossierView.tsx    # Institutional review split-pane viewer
```

