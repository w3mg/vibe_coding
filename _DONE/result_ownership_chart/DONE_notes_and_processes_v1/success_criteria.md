# Seat Modal Attachments - Success Criteria

1. Allow documents, links, or text to be attached to seats
2. Reuse existing back end elements
3. Simple and easy customer experience with minimal clicks
4. Elegant display
5. Code conforms to Code Complete guidelines
6. Minimal impact on the amount of logic loaded into the page

## Plan

1. Develop a tab pattern in the modal with clean UI
2. Propose architecture
3. Implement agreed architecture

## Related Documents

- [Attached Files and URLs](../../../resultmaps-web/doc/attached_files_and_urls.md)
- [Team Weekly Notes and Attachments Tab](../../../resultmaps-web/doc/team_weekly_notes_and_attachments_tab.md)
- [Accountability Chart Code Map](../../../resultmaps-web/doc/Accountability%20Chart%20Code%20Map.md)
- [API - Linked URLs](../../../resultmaps-web/doc/API/API%20-%20Linked%20URLs.md)
- [API - Seats & Snapshots](../../../resultmaps-web/doc/API/API%20-%20Seats%20&%20Snapshots.md)
- [Modal Files](../../../resultmaps-web/doc/ux/modals/modal-files.md)

## Current State (Pre-Project)

### Accountability Chart Files

**Controllers**
- `app/controllers/groups_controller.rb` - accountability_chart action
- `app/controllers/api/seats_controller.rb` - seat CRUD and snapshots API

**Views**
- `app/views/groups/accountability_chart.html.erb` - main view and seat modal
- `app/views/shared/_accountability_chart_snapshots.html.erb` - snapshots UI
- `app/views/widgets/_accountability_chart_print.html.erb` - PDF export

**JavaScript**
- `public/assets/javascripts/accountability_chart.js` - D3 chart, Knockout VM, seat modal logic

**Models**
- `app/models/seat.rb` - seat data and permissions
- `app/models/group.rb` - seat_data, owner options
- `app/models/custom_content.rb` - snapshot storage

**Routes**
- `config/routes.rb` - /teams/:id/seats, /api/seats/*

### Seat Modal Structure

The seat modal consists of two overlays defined in `accountability_chart.html.erb`.

**Main modal view:**
![Seat Modal Main View](Screenshot%202025-12-08%20at%201.14.04%20PM.png)

The "core" seat modal is a single overview screen: breadcrumb/title/owner at the top, then static sections for accountabilities, measurables, and rocks/goals using framework labels. Editing/aligning happens in hidden alignment sections (`.seat-sections.measures`/`.goals`) that swap in when triggered, not within the overview itself.

**Key constraint:** Any tab UI should sit above these existing blocks and only control which already-separated section is shown, without moving or merging their content. Labels must stay framework-aware.

#### Details Modal (`#seat_popup_modal`)
Container: `div.seat_popup#seat_popup_modal`

**Main section** (`.seat-sections.main`) - the overview screen:
- Breadcrumb (Team / Seats)
- Seat title (inline editable for editors)
- Seat owner with avatar (Tribute picker for editors)
- Accountabilities (rich text description, Trix editor for editors)
- Measurables list (framework label, Knockout-bound scoreboard widget)
- Rocks/Goals list (framework label, Knockout-bound, EOS/OKR only)

**Hidden alignment sections** (swap in when triggered):
- `.seat-sections.measures` - filter, checkbox list, Save/Cancel
- `.seat-sections.goals` - year/quarter filters, checkbox list, Save/Cancel

**Permission classes:**
- `.editor` class added when user can edit (reveals `.editor-show` elements)
- `.viewer-show` elements visible to all users

#### Edit Overlay (`#edit_seat_overlay`)
Container: `div#edit_seat_overlay`

**Fields:**
- Title input
- Seat Owner dropdown (Chosen select)
- Associated Team dropdown (Chosen select)
- Parent Seat dropdown (Chosen select)
- Save/Cancel buttons

**Trigger:** Pencil icon (`.edit-seat-open`) in details modal header
