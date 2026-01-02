# Project Plan: Accountability Chart Printouts Enhancement

## Overview
Enhance the Accountability Chart's print/export functionality to offer multiple printout options via a modal interface.

---

## Deliverables

### 1. Cog Button Visual Fix ✓ COMPLETE
**Current State:** The cog icon in the top right of the accountability chart does not visually indicate it is clickable.

**Success Criteria:**
- Cog icon displays pointer cursor on hover
- Consistent with other clickable elements in the application

**Completed:** Pointer cursor and click affordance confirmed.

---

### 2. Measurables Font Weight Fix (Web App Seat Nodes) ✓ COMPLETE
**Current State:** In the accountability chart web view, the MEASURABLES section within seat nodes displays text with light font weights, making it difficult to read.

**Scope:** This applies to the seat node cards rendered in the browser on the accountability chart page only - NOT the PDF printouts.

**Success Criteria:**
- Remove light font weight styling from measurables text in seat node cards
- Apply semi-bold font weight for proper readability
- Affects the "MEASURABLES" label and its content (e.g., "TBD" or actual measurable values)

---

### 3. "Save as PDF" → "Printouts" Modal ✓ COMPLETE (OBSOLETE)
**Current State:** "Save as PDF" directly triggers PDF generation of the visual chart.

**Success Criteria:**
- Menu item text changes from "Save as PDF" to "Printouts"
- Clicking "Printouts" launches a modal dialog
- Modal presents options as buttons (matching the style of existing date filter buttons)
- Modal is simple and focused - no unnecessary complexity

---

### 4. Printout Option: "Simple Visual Chart" ✓ COMPLETE
**Success Criteria:**
- First button option in the Printouts modal
- Triggers the existing PDF export functionality (current "Save as PDF" behavior)
- No change to the output - same visual chart PDF as before

---

### 5. Printout Option: "Full Seat Summaries" ✓ COMPLETE
**Success Criteria:**
- Second button option in the Printouts modal
- Generates a PDF with one page per seat
- Each seat page includes:
  - **Seat Name** (large bold header)
  - **Seat Owner:** [person name]
  - **Reports to:** [parent seat name]
  - **Direct report seats** (bulleted list showing seat name | owner name)
  - **ACCOUNTABILITIES** (numbered list)
  - **MEASURABLES** (bulleted list)
  - **PROCESS/PLAYBOOK INVENTORY** (bulleted list)
  - **ROCKS | [Current Quarter]** (bulleted list with status indicators)

**Reference:** See sample PDF at `/Users/scottilevy/Development/vibe_coding/seat-printouts-etc/Sample - Product Sales Seat.pdf`

---

## Completion Note: Process Documents by Seat ✓ COMPLETE

The Process/Playbook report is complete and wired into the Accountability Chart print menu. Each seat renders on its own page and the Process/Playbook inventory now includes clickable links for both uploaded documents and linked URLs, with URL normalization to ensure links work even when a scheme is missing.

--- 

## Reference Documentation
See `background.md` for list of relevant codebase documentation files.

---

## Follow-on Project: Single Seat Print ✓ COMPLETE

**Context:** Users need the ability to print an individual seat summary using the same format as the Full Seat Summaries report, but for just one seat.

**Scope:**
- Add print option accessible from individual seat (likely from seat modal or seat context menu)
- Generates single-page PDF using identical format to Full Seat Summaries
- Same sections: seat name, owner, reports to, direct reports, accountabilities, measurables, process/playbook inventory, rocks

**Completed:**
- Seat modal print action (seat cog menu)
- Cog icon
- Config heading

---

## Follow-on Project: Team Picker for Rocks/Milestones ✓ COMPLETE

**Context:** The team picker was removed from rock/milestone selection. It needs to be restored but scoped to only show teams within the current parent organization.

**Scope:**
- Re-add team picker to rock/milestone choices
- Limit team options to current parent organization only
- Added for both measurables and rocks

---

## Follow-on Project: Pre-review Worksheet

**Scope:**
- Add dropdown under print icon on seat modal
- Dropdown options:
  - Seat Summary (existing functionality)
  - Pre-review Worksheet (Self)
  - Pre-review Worksheet (Direct Report)

**To-do:**
- [ ] Share sample PDF for Pre-review Worksheet (Self) - Scott
- [ ] Share sample PDF for Pre-review Worksheet (Direct Report) - Scott

**Status:** Not started

---

## Follow-on Project: Quick Wins Tab

**Scope:**
- Add a "Quick Wins" tab to the seats modal

**Status:** Not started

---

## Follow-on Project: Reports Page Printouts Entry Point ✓ COMPLETE

**Scope:**
- Add a printouts entry point on the Reports page

**Completed:**
- Process/Playbook Inventory report at `/reports/process_playbook_inventory`
- PDF print functionality with clickable links
- Linked from Reports dashboard

---

## Follow-on Project: Seat Notes Tab ✓ COMPLETE

**Context:** Users tend to overload accountabilities with 10-15 bullet points when best practice is to keep them concise. A dedicated notes section gives them a place for additional context without cluttering the core accountability list.

**Scope:**
- Add a 3rd tab to the seats modal
- Tab labeled "Notes" (or similar)
- Free-form text area for supplementary information
- Notes field added to Seat model
- Database migration

---

## Open Questions
- [ ] What order should seats appear in the Full Seat Summaries PDF? (org hierarchy? alphabetical?)
- [ ] Should there be a cover page or table of contents?
- [ ] Should empty sections (no measurables, no rocks, etc.) be hidden or shown with placeholder text?
- [ ] Does "Process/Playbook Inventory" map to existing data in the system, or is this a new field?

---
