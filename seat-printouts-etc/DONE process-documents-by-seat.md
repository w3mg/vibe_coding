# Process Documents by Seat - Implementation Plan

Status: COMPLETE
Date closed: 2026-01-01

## Feature
New printout option in Accountability Chart: "Process Documents by Seat"

## PDF Content (per page)
- Seat title, owner, reports to, profile photo
- Reporting seats block (direct reports)
- Accountabilities (numbered list)
- Measurables (names only - no goal values)
- Process/Playbook Inventory (clickable URLs)

**Excluded**: Rocks

---

## Background and Implementation Notes

This feature was implemented in the Accountability Chart print stack by reusing the existing seat summary PDF flow and then customizing it for a process-focused report. The core work lives in `app/views/widgets/_accountability_chart_print.html.erb`, which already hosts the jsPDF logic for printouts. The new report:

- Adds a new print menu item wired to `printProcessDocuments()` in `app/views/groups/accountability_chart.html.erb`.
- Fetches seat materials from `/api/seats/:id/materials` and assembles a list of files and links via `fetchSeatProcessFiles(seat)`.
- Renders each seat on its own page via `addProcessDocumentPage(doc, seat, options)`.
- Uses `writeListWithLinks()` to ensure Process/Playbook items are clickable in the PDF.

Final hardening included normalizing URLs for linked URLs and documents so they render as clickable links even when the API omits a scheme (e.g., `https://`). This was the last-mile fix for "titles shown but not clickable."

---

## Files to Modify

### 1. `app/views/groups/accountability_chart.html.erb` (~line 407)
Add menu item in print dropdown after "Full Seat Summaries":
```erb
<li>
  <a <%= void_href %> onClick="printProcessDocuments()">
    Process/Playbook Index
  </a>
</li>
```

### 2. `app/views/widgets/_accountability_chart_print.html.erb`

#### Modify `fetchSeatProcessFiles(seat)` (~line 449)
API already returns `full_path` for linked_urls - currently discarded. Change to return objects instead of strings:

**Current**: Returns `['Title 1', 'Title 2']`
**New**: Returns `[{title: 'Title 1', url: 'https://...', isDocument: false}, ...]`

```javascript
// In success callback, change from:
list.push(link.title || link.full_path || 'Link');

// To:
list.push({
  title: link.title || link.full_path || 'Link',
  url: link.full_path,
  isDocument: false
});

// For documents:
list.push({
  title: doc.name || doc.title || 'Document',
  url: null,
  isDocument: true
});
```

#### Add `writeListWithLinks(doc, opts)` helper (~line 484)
New helper similar to `writeList()` but uses `doc.textWithLink()` for files with URLs:

```javascript
function writeListWithLinks(doc, opts){
  var files = opts.files || [];
  if (!files.length){ files = [{title: 'None listed', url: null}]; }
  var y = opts.y;
  var marginLeft = opts.marginLeft;
  var maxWidth = opts.maxWidth;
  var lineHeight = opts.lineHeight || 16;

  files.forEach(function(file){
    var text = '\u2022 ' + file.title;
    var lines = doc.splitTextToSize(text, maxWidth);
    if (file.url){
      doc.textWithLink(lines[0], marginLeft, y, { url: file.url });
      // Handle multi-line (continuation lines not clickable)
      for (var i = 1; i < lines.length; i++){
        y += lineHeight;
        doc.text(lines[i], marginLeft, y);
      }
    } else {
      doc.text(lines, marginLeft, y);
    }
    y += lines.length * lineHeight;
  });
  return y;
}
```

#### Add `addProcessDocumentPage(doc, seat, options)` (~after line 662)
Copy from `addSeatSummaryPage()` with these changes:
- Remove ROCKS section entirely
- Change measurables to show names only (remove `| Goal: value`)
- Use `writeListWithLinks()` for Process/Playbook section

#### Add `printProcessDocuments()` (~after line 773)
Copy from `printSeatSummaries()` with these changes:
- Call `addProcessDocumentPage()` instead of `addSeatSummaryPage()`
- Change filename to `*-process-documents.pdf`
- Change measurables mapping to return names only

---

## Code Conventions (from existing codebase)

| Pattern | Convention | Example |
|---------|------------|---------|
| Function naming | camelCase, descriptive | `printSeatSummaries`, `addSeatSummaryPage` |
| Print functions | Init jsPDF, validate, loop seats, call addPage, save | `printSeatSummaries()` |
| Page functions | Render content to PDF doc | `addSeatSummaryPage(doc, seat, options)` |
| Async helpers | Return Promise | `fetchSeatProcessFiles(seat)` |
| Empty lists | Show "None listed" | `writeList()` line 486 |
| Loading message | `showLoadingMsg('...')` | line 677, 722 |
| Error handling | `reportActionResult('...', 'negative')` | line 683, 713 |

---

## Testing Checklist
- [ ] New menu option appears in print dropdown
- [ ] PDF generates with filename `*-process-documents.pdf`
- [ ] Each seat on its own page
- [ ] Seat header shows correctly (name, owner, reports to, photo)
- [ ] Reporting seats block displays
- [ ] Accountabilities show numbered
- [ ] Measurables show as bullets (names only, no goal values)
- [ ] Process files show as bullets with clickable URLs (blue, underlined)
- [ ] Documents without URLs show as non-clickable text
- [ ] Empty sections show "None listed"
- [ ] Existing `printSeatSummaries()` still works (backward compatibility)
