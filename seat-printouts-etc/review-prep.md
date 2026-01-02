# Pre-review Worksheet (Self) - Project Document

**Status:** Planning
**Created:** 2026-01-02
**Related:** `202601-project-backlog.md`

## Overview

Enable seat occupants to generate a self-assessment worksheet PDF ahead of performance reviews. The worksheet combines existing seat data with structured self-assessment forms (GWC scorecard, company alignment, 90-day reflection, START/STOP/KEEP).

## Access Points

1. **Seat Modal Print Dropdown**
   - Location: `app/views/groups/accountability_chart.html.erb:424`
   - Current: Single print icon calling `printSelectedSeatSummary()`
   - Change: Convert to dropdown with options:
     - Seat Summary (existing)
     - Pre-review Worksheet (Self)
     - Pre-review Worksheet (Direct Report) *(future)*

2. **Reports Page**
   - Add new report option for "Seat Review Prep"
   - Allow user to select which seat to generate worksheet for

## PDF Structure

Reference: `Working - Seat Review Prep 20260101.pdf`

### Pages 1-2: Seat Summary (Dynamic Data)

Reuses existing `addSeatSummaryPage()` structure from `_accountability_chart_print.html.erb`:

| Section | Data Source |
|---------|-------------|
| Seat Title | `seat.title` |
| Seat Owner | `seat.userName` / `seatOwnerName()` |
| Reports To | `seat.parent.title` |
| Profile Photo | `seatThumbUrl()` → `loadImageData()` |
| Reporting Seats | `seat.children` via `seatDirectReports()` |
| Accountabilities | `seat.description` via `seatAccountabilities()` |
| Measurables | `viewModel.measures()` filtered by seat ID |
| Process/Playbook Inventory | `/api/seats/:id/materials` via `fetchSeatProcessItems()` |
| Rocks | `seat.goals()` via `seatRocks()` |

### Page 3: GWC Scorecard - Gets It & Wants It

**Format:** Tables with 1-5 rating scale (empty boxes for user to fill in)

#### Gets It (Total: ___/15)
| Statement | Rating |
|-----------|--------|
| I understand the needs of this seat, its component roles, and how they relate to the business | [ ] |
| I understand the technical skills required and how they relate to my ability to get the job done | [ ] |
| I understand the technical skills required and how they relate to the vision and mission of our business | [ ] |

#### Wants It (Total: ___/15)
| Statement | Rating |
|-----------|--------|
| Problem solving in these roles engages my mind and curiosity | [ ] |
| This role aligns with my career and financial goals | [ ] |
| This is the role I most want to be in right now | [ ] |

### Page 4: Company / Empowered Execution (Total: ___/45)

| Statement | Rating |
|-----------|--------|
| I am clear on the company's vision | [ ] |
| I understand the company's goals for the year | [ ] |
| I understand the company's 90 day action plan (rocks and milestones) as they relate to my work | [ ] |
| I understand the company's core values, I use them in my decision making and I see the company using them in its decision making | [ ] |
| The company's weekly meeting rhythm helps me stay on track | [ ] |
| The communications from my direct superior is clear and helpful | [ ] |
| I receive the resources (tools, budget) I need to excel in my role | [ ] |
| I receive the training and support I need to excel in my role | [ ] |
| I understand when/how to use our different communication tools, and the way my teammates use them helps me stay focused and organized | [ ] |
| I understand how and where our company stores its knowledge | [ ] |

### Page 5: 90-Day Reflection (Free-form Entry)

#### What went well in the last 90 days
*Instructions: Put an asterisk on anything that you want to make a habit or ensure you do as a process. Circle anything that deserves celebration as a win (the more the better, be liberal).*

`[Large empty box for writing]`

#### What did not go as well as you would have liked in the last 90 days
*Instructions: Circle anything you want to escalate to an issue for discussion*

`[Large empty box for writing]`

### Page 6: START/STOP/KEEP (Free-form Entry)

#### STOPS
*What will you stop doing in the coming 90 days? What things would improve your focus and results if you completely got rid of them.*

`[Empty box for writing]`

#### KEEPS
*What new learnings or approaches did you try that you want to keep and/or build upon*

`[Empty box for writing]`

#### START
*Based on your issues, learnings and the business situation, what will you commit to start doing in the coming ninety days.*

`[Empty box for writing]`

### Page 7: Blank Page (Notes)

ResultMaps logo header only - blank page for additional notes.

---

## Implementation Plan

### Phase 1: Core PDF Generation Function

**File:** `app/views/widgets/_accountability_chart_print.html.erb`

Add new function `printSeatReviewPrep(targetSeat)`:

```javascript
window.printSeatReviewPrep = function(targetSeat) {
  // 1. Initialize jsPDF (letter, portrait)
  // 2. Get seat data (reuse existing helpers)
  // 3. Add seat summary pages (reuse addSeatSummaryPage or variant)
  // 4. Add GWC scorecard page (new: addGWCScorecardPage)
  // 5. Add Company/Empowered page (new: addCompanyAssessmentPage)
  // 6. Add 90-day reflection page (new: addReflectionPage)
  // 7. Add START/STOP/KEEP page (new: addStartStopKeepPage)
  // 8. Add blank notes page
  // 9. Save PDF
};
```

### Phase 2: PDF Page Builders

New helper functions:

| Function | Purpose |
|----------|---------|
| `addGWCScorecardPage(doc, seatOwnerName)` | Render Gets It + Wants It tables |
| `addCompanyAssessmentPage(doc)` | Render Company/Empowered Execution table |
| `addReflectionPage(doc)` | Render 90-day reflection boxes |
| `addStartStopKeepPage(doc)` | Render START/STOP/KEEP boxes |
| `addBlankNotesPage(doc)` | Render blank page with header |
| `drawRatingTable(doc, title, items, y)` | Reusable table renderer with rating boxes |
| `drawFreeformBox(doc, title, instructions, y, height)` | Reusable empty box renderer |

### Phase 3: UI - Seat Modal Dropdown

**File:** `app/views/groups/accountability_chart.html.erb:424`

Replace print icon with dropdown:

```erb
<div class="dropdown" style="display:inline-block;">
  <a class="cursor cursor-pointer quiet dropdown-toggle" data-toggle="dropdown" title="Print options">
    <i class="fal fa-print"></i>
    <i class="fal fa-caret-down" style="font-size:10px;"></i>
  </a>
  <ul class="dropdown-menu dropdown-menu-right">
    <li><a onclick="window.printSelectedSeatSummary()">Seat Summary</a></li>
    <li><a onclick="window.printSeatReviewPrep()">Pre-review Worksheet (Self)</a></li>
    <!-- Future: <li><a onclick="window.printSeatReviewPrepDirectReport()">Pre-review Worksheet (Direct Report)</a></li> -->
  </ul>
</div>
```

### Phase 4: UI - Reports Page Access

**File:** TBD (likely `app/views/reports/` or existing report index)

Add report card/link for "Seat Review Prep" that:
1. Shows seat selector dropdown
2. Generates worksheet for selected seat

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `app/views/widgets/_accountability_chart_print.html.erb` | Modify | Add `printSeatReviewPrep()` and helper functions |
| `app/views/groups/accountability_chart.html.erb` | Modify | Convert print icon to dropdown (~line 424) |
| `app/views/reports/` | Add/Modify | Add Seat Review Prep report access |
| `public/assets/javascripts/seat_print_module.js` | Optional | Extract reusable functions if helpful |

---

## PDF Styling Notes

From the sample PDF:

- **Header:** ResultMaps logo (top-right on each page)
- **Title font:** Bold, ~33px
- **Section headings:** ALL CAPS, bold, ~15px
- **Body text:** ~11px
- **Rating tables:** Gray header row, bordered cells
- **Free-form boxes:** Gray border, large empty area
- **Page margins:** ~46px

---

## Future: Direct Report Version

The Direct Report version changes question phrasing from first-person to third-person:

| Self Version | Direct Report Version |
|--------------|----------------------|
| "I understand the needs of this seat..." | "[Name] understands the needs of this seat..." |
| "Problem solving in these roles engages my mind..." | "Problem solving in these roles engages [Name]'s mind..." |

Implementation: Add `printSeatReviewPrepDirectReport()` that passes a `perspective: 'manager'` option to the page builders, which substitutes the seat owner's name for "I/my/me".

---

## Open Questions

1. **Reports page location:** Where exactly should this appear in the reports hierarchy?
2. **Permission check:** Should non-admins be able to print their own seat's worksheet?
3. **Framework variations:** Should GWC questions vary by framework (EOS vs OKR)?
4. **Logo placement:** Use existing ResultMaps logo asset path?

---

## Testing Checklist

- [ ] PDF generates with correct seat data on pages 1-2
- [ ] GWC scorecard renders with empty rating boxes
- [ ] Company assessment renders all 10 questions
- [ ] 90-day reflection boxes have adequate writing space
- [ ] START/STOP/KEEP boxes render correctly
- [ ] Blank notes page included
- [ ] Dropdown works on seat modal
- [ ] Reports page access works
- [ ] PDF filename follows convention: `{team}-ResultMaps-{seat}-review-prep.pdf`
