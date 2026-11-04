# COMPONENTS: FORM CONTROLS & INPUTS
**Directory**: `components/forms/`  
**Ownership**: Shared  
**Status**: DESIGN SYSTEM SPECIFICATION & PLACEHOLDER  

---

## 1. PURPOSE
This directory contains standardized form inputs, currency inputs, select dropdowns, and file upload zones to ensure consistent validation feedback and layout across both farmer and institutional screens.

---

## 2. COMPONENT INVENTORY
- `FormField.tsx`: Wrapper providing label, optional hint text, error message, and required asterisk (`*`).
- `CurrencyInput.tsx`: Specialized input prefixed with an uneditable `₦` block, supporting automatic thousands separators for Nigerian Naira.
- `SelectDropdown.tsx`: Accessible dropdown component with search/filter support for breeds, housing types, and institutions.
- `FileUploadZone.tsx`: Drag-and-drop zone with file preview and size validation for veterinary certificates, post-mortem images, and lab results.
- `DatePickerInput.tsx`: Accessible date picker ensuring ISO 8601 formatting.

---

## 3. INTEGRATION RULES
- Always wrap raw HTML `<input>` or `<select>` inside `<FormField>` to guarantee identical spacing, error banners, and label typography.
- Always use `<CurrencyInput>` for monetary amounts (feed expenses, claim amounts, loan requests).

