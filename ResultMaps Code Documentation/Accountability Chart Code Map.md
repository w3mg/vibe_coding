# Accountability Chart — Code Map

This document maps where the Accountability Chart feature resides in the ResultMaps web application and how its pieces connect.

## Overview

- Primary route: `/teams/:id/seats` → `GroupsController#accountability_chart`.
- Renders a D3 + Knockout-based org chart with editable “seats”, owners, and related data.
- Supports versioning via “Snapshots” (create/list/update/revert/delete) with audit logging.

Framework naming differences:
- EOS teams use “Accountability Chart”; non‑EOS teams use “Ownership Chart”.
- Default EOS seat names: “Visionary”, “Integrator”, “Sales/Mktg”, “Operations”, “Finance”. For OKR teams, top two default seats are “CEO” and “COO/President”.

## Routes

- `config/routes.rb`
  - `map.team_seats "/teams/:id/seats", :controller=>'groups', :action=>"accountability_chart"`
  - `map.accountability_map "/accountability_map", :controller=>'groups', :action=>"accountability_chart"`
  - Snapshot API endpoints under `# Accountability Chart Snapshot API endpoints`:
    - POST/GET `/api/seats/snapshots`, GET/PUT/DELETE `/api/seats/snapshots/:id`, PUT `/api/seats/snapshots/:id/revert`
  - Seat CRUD API (used by chart): `/api/seats/create`, `/api/seats/update`, `/api/seats/destroy`

## Controllers

- `app/controllers/groups_controller.rb`
  - `def accountability_chart` — loads `@group`, derives `@root_team`, fetches `@seats = @group.seat_data(include_thumbs: true, include_goals: true)`, sets `@is_team_admin`, renders `b3_application` layout.

- `app/controllers/quick_start_controller.rb`
  - `def accountability_chart` — unauthenticated quick-start; redirects signed-in users to `/team_seats`.
  - `def save_accountability_chart` — persists seats posted from quick-start (requires team admin).

- `app/controllers/sandbox_controller.rb`
  - `def accountability_chart` — renders chart for sandbox/testing using same view.

- `app/controllers/api/seats_controller.rb` (Snapshot + Seat API)
  - Snapshot actions: `create_snapshot`, `list_snapshots`, `show_snapshot`, `update_snapshot`, `revert_snapshot`, `delete_snapshot`.
  - Seat actions: `create`, `update`, `destroy` (archives instead of hard delete).
  - Security helpers enforce API auth, team-admin checks for snapshots, and seat edit/delete permissions.

## Views

- Main: `app/views/groups/accountability_chart.html.erb`
  - Injects globals: `seatData` (from `@seats`), `isTeamAdmin`, `groupId`, `teammates` (`@group.seat_owner_options`), `allTeamData` (`@group.seat_associated_team_options`), `window.measuresData`.
  - Renders `#diagram_container` where D3 attaches the SVG.
  - Includes menus (PDF export, Recent Activity, Snapshots) and the seat edit modal (measures/goals tabs).
  - Includes `render '/widgets/accountability_chart_print'` and `render '/shared/accountability_chart_snapshots'`.

- Quick Start: `app/views/quick_start/accountability_chart.html.erb`
  - Loads `/assets/javascripts/accountability_chart_offline.js`.
  - Posts consolidated payload to `/quick_start/save_accountability_chart`.

- Shared:
  - Snapshots UI: `app/views/shared/_accountability_chart_snapshots.html.erb` — modals and AJAX wiring to Snapshot API.
  - Print UI: `app/views/widgets/_accountability_chart_print.html.erb` — defines `window.printOwnershipChart()` and uses jsPDF + html2canvas + jquery.orgchart to generate PDFs; styles in `app/views/layouts/_accountability_chart_print_styles.html.erb`.
  - Print naming: for EOS teams, exported filename includes `accountability-chart`; otherwise `ownership-chart` (see variable `default_filename`).

## Client JavaScript

- `public/assets/javascripts/accountability_chart.js`
  - D3: builds SVG inside `#diagram_container`, manages zoom, layout, and node rendering.
  - Knockout: view model with seat fields, collections (`allSeats`, `measures`, `goals`), filters, and actions; `ko.applyBindings(seatsViewModel)`.
  - Emits events consumed elsewhere: `beforeSeatedCreated`, `beforeSeatedUpdated`, `beforeSeatedDeleted` (used to refresh Recent Activity widget).
  - Calls seat CRUD endpoints: `/api/seats/create`, `/api/seats/update`, `/api/seats/destroy`.

- `public/assets/javascripts/accountability_chart_offline.js`
  - Quick-start variant; renders similarly and posts a single payload to save seats.

## Seat Modal

- Markup (view): `app/views/groups/accountability_chart.html.erb`
  - Modal container: `.seat_popup#seat_popup_modal` — displays seat title, owner, description, measures, and goals tabs; toggles viewer/editor content based on permissions.
  - Edit overlay: `#edit_seat_overlay` — full-width inline editor opened by the pencil icon inside the seat modal (`.edit-seat-open`).

- Open Triggers (D3 node clicks): `public/assets/javascripts/accountability_chart.js`
  - On node rect/title/owner/description click, the handlers call:
    - `selectSeat(d); seatPopup.show(d);`
  - Click-bound elements:
    - `rect.nodeRect`, `text.node-seat-title`, `text.seat-owner`, `foreignObject.seat-description-block`.

- JS Controllers: `public/assets/javascripts/accountability_chart.js`
  - `seatPopup` (overlay for viewing/editing a seat)
    - `init()` wires DOM refs, Tribute owner picker, list click toggles, and detail navigation.
    - `show(seatObj)` initializes jQuery popup overlay, populates title/owner/description, binds measures/goals, updates avatar/link, and resets state on close.
  - `editSeatOverlay` (inline form overlay)
    - `init()` sets up popup overlay (`openelement: '.edit-seat-open'`, `closeelement: '.edit-seat-close'`) and populates fields from `selectedSeat` on open; updates Chosen selects.
    - `saveForm()` persists changes to `selectedSeat` (title, owner, associated team) and calls `selectedSeat.update()`; then returns to the seat modal.

- Data & Bindings
  - View model: `seatsViewModel` exposes `selectedSeat`, `measures`, `goals`, filters, and actions (`newMeasure`, `saveNewMeasure`, `saveGoals`, etc.).
  - Measures/goals lists use `.aligment-choice-checkbox` inputs; selections update responsible seat and may reassign owners.
  - Owner picker: Tribute on hidden input `#hidden_seat_owner` injected before `.seat-username`; typing `@` selects a teammate and updates `seatOwnerId/username`.

- Permissions
  - `selectSeat` sets `window.canEditSeat` based on `selectedSeat.editableByCurrentUser()` or `window.isTeamAdmin`; adds `.editor` class to `#seat_popup_modal` to reveal editor controls.

- Common Signals/Events
  - Emits `beforeSeatedCreated/Updated/Deleted` for audit log refresh; `newSeatInitialized` adds seats to `viewModel.allSeats`.
  - On modal close, resets sections to main view and calls `updateMap(selectedSeat)` to reflect edits.

### Gotchas
- Description sanitization: When extracting plain text from rich HTML descriptions, use `$('<div>').html(str).text()` rather than `$(str).text()`. Passing arbitrary strings directly to `$()` may be interpreted as a selector and can throw Sizzle “unrecognized expression” errors (e.g., strings starting with digits or containing certain punctuation). The seat modal uses the wrapped approach in `Seat.getDescriptionHTML`.

## Printing

- Partial `app/views/widgets/_accountability_chart_print.html.erb` provides a printer-friendly org chart.
- Exposes `window.printOwnershipChart()` used by the More menu.
- Libraries: jsPDF (`/assets/javascripts/jspdf.umd.min.js`), html2canvas, jquery.orgchart; print styles in `layouts/_accountability_chart_print_styles.html.erb`.

## Models and Helpers

- `app/models/group.rb`
  - `seat_data(options={})` — finds root seat via `load_or_create_seats` and returns nested `accountability_map_format`.
  - `seat_owner_options` — returns team members (id, name, login, profile thumb).
  - `seat_associated_team_options` — returns teams and their seat teammates.
  - `create_default_seats`/`create_default_eos_seats` — seeds `Visionary`/`Integrator` etc. for EOS frameworks.
  - Framework labels and names: `GROUP_FRAMEWORK_TEXT` and helpers (e.g., `top_level_name`, `goal_name`, `outcome_name`) drive framework-specific naming across the app.

- `app/models/seat.rb`
  - Core fields include `accountability_owner_id`; association `belongs_to :accountabilty_owner, class_name: 'User', foreign_key: 'accountability_owner_id'`.
  - `accountability_map_format` — shape used by the chart (id, title, seatOwnerId, userName, description, parentId, associatedTeamId, children, optional goals/thumb).
  - Permission helpers: `editable_by?`, `can_add_child?`, `can_delete?`; team-admins can edit all; owners can edit their seat; inheritance via parent.
  - Lifecycle: owner change updates aligned rocks/measurables; `archive!`/`restore!` support snapshot revert and soft delete.

- `app/models/custom_content.rb` (Snapshots)
  - `save_accountability_chart_snapshot`, `get_*`, `update_*`, `revert_to_*`, `delete_*` — persists JSON under `CustomContent` with `content_type_code: 16`; creates audit log entries.
  - Restore logic archives seats not in snapshot, restores/creates those in snapshot recursively.

- `app/models/audit_log.rb`
  - Seat-related change types (e.g., `seat_created`, `seat_updated`, `seat_deleted`, `seat_assignment_*`, `seat_archived`, `seat_restored`, and snapshot events) used in Recent Activity.

- `app/helpers/application_helper.rb`
  - Contains labels/titles and `action_name` checks that include `accountability_chart`.

## Permissions

- Viewing: `GroupsController#accountability_chart` respects `@can_view_group` guard.
- Editing (seats): `Seat#editable_by?` allows team admins, seat owners, or via editable parent; API helpers enforce edit/add/delete rights.
- Snapshots: API requires team admin for the group; token via `Authorization: Bearer <api_token>`.

## Database Touchpoints

- Seats: `seats` table with `accountability_owner_id`, parent-child hierarchy, archive fields.
- Accountabilities: `accountabilities` polymorphic join used for aligned goals.
- Snapshots: `custom_contents` stores snapshot JSON (`json_content`) and metadata.

## Tests (references)

- Groups controller: `test/functional/groups_controller_test.rb` — opening `accountability_chart` across frameworks.
- Quick start: `test/functional/quick_start_controller_test.rb` — chart load and save validations.
- Seats API: `test/functional/api/seats_controller_test.rb` — owner changes, CRUD, snapshot endpoints.

## Key Globals, Selectors, Libraries

- Globals: `seatData`, `groupId`, `isTeamAdmin`, `teammates`, `allTeamData`, `window.measuresData`, `window.viewModel`.
- DOM: `#diagram_container` (chart root), `#seat_popup_modal` (seat modal), Recent Activity modal `#team_seats_recent_activity`.
- Libraries: D3 v3, Knockout, jQuery (aliased as `$j`), jsPDF, html2canvas, jquery.orgchart.

## Data Flow (high-level)

1) Route `/teams/:id/seats` → `GroupsController#accountability_chart`.
2) Controller loads `@seats = @group.seat_data(...)` and permissions.
3) View injects `seatData`, `teammates`, `allTeamData`, etc. into the page.
4) JS renders D3 chart in `#diagram_container` and wires Knockout view model.
5) User actions call API (`/api/seats/...`) for seat CRUD and Snapshot API for versions.
6) Server updates models (Seat, CustomContent) and returns updated `accountability_map_format`.

## Quick Links

- Controller: `app/controllers/groups_controller.rb`
- View: `app/views/groups/accountability_chart.html.erb`
- JS: `public/assets/javascripts/accountability_chart.js`
- Printing: `app/views/widgets/_accountability_chart_print.html.erb`
- Snapshots UI: `app/views/shared/_accountability_chart_snapshots.html.erb`
- Snapshot API: `app/controllers/api/seats_controller.rb`
- Models: `app/models/group.rb`, `app/models/seat.rb`, `app/models/custom_content.rb`

## Navigation Links and Labels

- Side navigation location: `app/views/layouts/_navigation_menu_left_list.html.erb` in the “Accountability” submenu.
  - Link target: always `/team_seats` (routes to `GroupsController#accountability_chart`).
  - Label toggles by framework strictness:
    - If last used group context is EOS and strict: shows “Accountability Chart”.
    - Otherwise: shows “Ownership Chart”.
  - Code snippet reference (conditional): checks `@last_used_group_context.try(:is_eos?) && @last_used_group_context.try(:is_strict)` to choose the label.

Code snippet (side nav label toggle)

```
<!-- app/views/layouts/_navigation_menu_left_list.html.erb -->
<% if @last_used_group_context.try(:present?) && @last_used_group_context.try(:is_eos?) && @last_used_group_context.try(:is_strict) %>
  <li><a  href="/team_seats">Accountability Chart</a></li>
<% else %>
  <li><a  href="/team_seats">Ownership Chart</a></li>
<% end %>
```

Code snippet (print filename switch)

```
<!-- app/views/widgets/_accountability_chart_print.html.erb -->
<% default_filename = "#{@group.name.gsub("'","")}-ResultMaps-" +
   (@group.try(:is_eos?) ? "accountability-chart" : "ownership-chart") %>
```

Code snippet (default seat names by framework)

```
// app/models/group.rb
def create_default_eos_seats
  visionary_name  = self.is_okr? ? "CEO"           : "Visionary"
  integrator_name = self.is_okr? ? "COO/President" : "Integrator"
  visionary  = Seat.create(group_id: self.id, name: visionary_name,  user_id: self.user_id)
  integrator = Seat.create(group_id: self.id, name: integrator_name, user_id: self.user_id, parent_id: visionary.id)
  Seat.create(group_id: self.id, name: 'Sales/Mktg', user_id: self.user_id, parent_id: integrator.id)
  Seat.create(group_id: self.id, name: 'Operations', user_id: self.user_id, parent_id: integrator.id)
  Seat.create(group_id: self.id, name: 'Finance',    user_id: self.user_id, parent_id: integrator.id)
end
```

Code snippet (framework-driven labels/constants)

```
// app/models/group.rb
GROUP_FRAMEWORK_TEXT = {
  'okr' => { goal_name: 'objectives', outcome_name: 'key results', ... },
  'eos' => { goal_name: AddOnFramework::EOS.goal_name.pluralize,
             outcome_name: AddOnFramework::EOS.outcome_name, ... },
  'v2mom' => { goal_name: AddOnFramework::V2MOM.goal_name.pluralize, ... },
  ...
}
```

Related helpers (where naming propagates across the app)

- `app/frameworks_helper.rb`:
  - `render_team_weekly_name(input)` — e.g., “Weekly L10” (EOS), “Weekly Sync” (default).
  - `render_execution_tracker_name(input)` — e.g., “Rocks” (EOS), “OKR/Execution Tracker” (default), “Execution Plan” (SVEP).
  - `render_stat_measure_name(input)` — “measurable” (EOS) vs “measure”.
  - `goal_list_heading_for(input)` — “Rocks + milestones/To-dos” (EOS) vs “Objectives + key results”.
  - `get_top_level_name`, `get_goal_name`, `get_outcome_name` → wrappers over `Group::GROUP_FRAMEWORK_TEXT`.

## Screenshots

Embed images (place files in `images/accountability_chart/`):

![Side nav — EOS label](../images/accountability_chart/sidebar_label_eos.png)
![Side nav — non‑EOS label](../images/accountability_chart/sidebar_label_non_eos.png)
![Chart — main view (EOS)](../images/accountability_chart/chart_main_eos.png)
![Chart — main view (non‑EOS)](../images/accountability_chart/chart_main_non_eos.png)
![Snapshots — modal](../images/accountability_chart/snapshots_modal.png)
![Print — filename example](../images/accountability_chart/print_filename_dialog.png)

Capture tips: see `images/README.md`.
