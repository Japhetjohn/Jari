# COMPONENTS: COMMON UI ATOMS & MOLECULES
**Directory**: `components/common/`  
**Ownership**: Shared  
**Status**: DESIGN SYSTEM SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
This directory contains foundational, domain-agnostic UI components adhering strictly to `docs/DESIGN_SYSTEM.md`. Both developers must reuse these components rather than authoring custom one-off styling.

---

## 2. COMPONENT INVENTORY
- `Button.tsx`: Primary (Emerald 600), Secondary (Slate outline), Destructive (Red 600), and Loading states.
- `Card.tsx`: Standard surface container with header, body, and footer slots.
- `Badge.tsx`: Status pills for `ACTIVE` (Emerald), `WARNING`/`PENDING` (Amber), `ALERT` (Red), and `DRAFT` (Slate).
- `Modal.tsx`: Accessible dialog overlay with backdrop and escape key dismissal.
- `LoadingSpinner.tsx`: Smooth SVG spinner with size variants (`sm`, `md`, `lg`).
- `EmptyState.tsx`: Friendly fallback rendering an agricultural or document illustration, title, description, and action button.

---

## 3. INTEGRATION RULES
- No developer should create independent button or modal styles.
- When creating a new variant, ensure it aligns with the palette tokens in `docs/DESIGN_SYSTEM.md`.

