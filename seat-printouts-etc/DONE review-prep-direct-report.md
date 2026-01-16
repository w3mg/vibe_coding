# Pre-Review Worksheet (Direct Report) - Enhancement Document

**Status:** Complete
**Created:** 2026-01-02
**Related:** `review-prep.md` (Self version - completed)

## Overview

Add "Direct Report" perspective variant to the existing Pre-Review Worksheet feature. Changes question phrasing from first-person ("I do...") to third-person ("{Name} does...").

This enhancement enables managers to generate pre-review worksheets for their direct reports with appropriately phrased assessment questions.

---

## Scope

- Seat modal dropdown entry point only
- Single worksheet per direct report
- Third-person question rephrasing

---

## What Changes

### Question Phrasing

| Self Version | Direct Report Version |
|--------------|----------------------|
| "I understand the needs of this seat..." | "{Name} understands the needs of this seat..." |
| "I understand the technical skills required..." | "{Name} understands the technical skills required..." |
| "Problem solving in these roles engages my mind..." | "Problem solving in these roles engages {Name}'s mind..." |
| "This role aligns with my career and financial goals" | "This role aligns with {Name}'s career and financial goals" |
| "I am clear on the company's vision" | "{Name} is clear on the company's vision" |

### What Stays the Same

- PDF structure and layout (7 pages)
- Seat data sections (accountabilities, measurables, rocks, etc.)
- Rating tables and freeform boxes
- Logo placement (centered at bottom of each page)

---

## Files to Modify

### 1. `public/assets/javascripts/seat_print_module.js`

- Add `perspective` parameter to page generation functions
- Create question variant objects with `self` and `directReport` keys
- Modify `addGWCScorecardPage`, `addCompanyAssessmentPage` to accept perspective and seat owner name
- Select appropriate question text based on perspective

**Question Variants Structure:**
```javascript
var gwcQuestions = {
  getsIt: [
    {
      self: "I understand the needs of this seat...",
      directReport: "{name} understands the needs of this seat..."
    },
    // ... etc
  ],
  wantsIt: [
    {
      self: "I genuinely want this role",
      directReport: "{name} genuinely wants this role"
    },
    // ...
  ]
};
```

**Function Signature Changes:**
```javascript
// Before
addGWCScorecardPage(doc, seatOwnerName, logo)

// After
addGWCScorecardPage(doc, seatOwnerName, logo, perspective)
// perspective: 'self' (default) | 'direct-report'
```

### 2. `app/views/groups/accountability_chart.html.erb`

Add third dropdown option to existing print menu:

```html
<li><a href="javascript:void(0)" onclick="window.printSeatReviewPrep && window.printSeatReviewPrep('direct-report')">Pre-Review Worksheet (Direct Report)</a></li>
```

### 3. `app/views/widgets/_accountability_chart_print.html.erb`

Modify `printSeatReviewPrep` to accept optional perspective parameter:

```javascript
window.printSeatReviewPrep = function(perspective) {
  perspective = perspective || 'self';
  // ... existing code ...
  SeatPrintModule.generateReviewPrepPdf(normalizedSeat, {
    // ... existing options ...
    perspective: perspective
  });
};
```

---

## Implementation Steps

1. Add question variant objects to `seat_print_module.js`
2. Modify `addGWCScorecardPage` to accept and use perspective parameter
3. Modify `addCompanyAssessmentPage` to accept and use perspective parameter
4. Update `generateReviewPrepPdf` to pass perspective through
5. Add dropdown option in `accountability_chart.html.erb`
6. Modify wrapper function in `_accountability_chart_print.html.erb`

---

## Testing Checklist

- [ ] Generate Self worksheet - verify first-person questions unchanged
- [ ] Generate Direct Report worksheet - verify third-person questions with correct name substitution
- [ ] Dropdown shows both options correctly
- [ ] PDF filename includes perspective indicator if needed
