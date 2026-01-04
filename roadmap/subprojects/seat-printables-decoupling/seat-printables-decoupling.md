# Seat Printables Decoupling

## Goal
Decouple print report generation from the Accountability Chart view so print outputs can be triggered from other pages (e.g., Reports) without relying on `viewModel` or in-page globals.

## Current Coupling
The print logic in `app/views/widgets/_accountability_chart_print.html.erb` depends on:
- `window.viewModel` (seat tree, measures, selected seat)
- `window.teammates`
- `window.measuresData`

These are only guaranteed on the Accountability Chart page.

## Proposed Approach
1. **Extract a shared print module** that accepts explicit inputs:
   - seat tree (root seat)
   - teammates (owner list)
   - measures (team weekly measures)
   - seat materials (documents + linked URLs)
2. **Create a data loader** for the Reports page:
   - server-render `@seats` + `@group.team_weekly_measures_data` into JSON
   - or expose a dedicated API endpoint that returns both in one payload
3. **Refactor print entry points**:
   - In team seats, pass existing data into the module
   - In Reports, pass server-rendered data
4. **Add a print trigger** to `/reports/process_playbook_inventory` after decoupling

## Related Recent Commits (Completed Work)
The seat printables work from `vibe_coding/seat-printouts-etc` is already implemented in `resultmaps-web`. Reference these commits when executing this project:

- `0802242dc` (PR #410) New reports and architecture cleanup
  - Files: `app/controllers/reports_controller.rb`, `app/views/groups/accountability_chart.html.erb`, `app/views/reports/dashboard.html.erb`, `app/views/reports/seat_review_prep.html.erb`, `app/views/widgets/_accountability_chart_print.html.erb`, `config/routes.rb`, `public/assets/images/ResultMaps_Logo_Transparent.png`, `public/assets/javascripts/seat_print_module.js`
  - Behavior: adds 7-page Pre-Review Worksheet PDF (self + direct report perspectives), seat modal dropdown entries, reports dashboard entry, and shared PDF generation via `seat_print_module.js`.
- `7a9ee458e` (PR #409) Process documents by seat (reports dashboard update)
  - Files: `app/views/reports/dashboard.html.erb`
  - Behavior: adjusts reports dashboard layout/cards to include printouts entry points.
- `f3595e359` Add PDF print functionality to process/playbook inventory report
  - Files: `app/views/reports/process_playbook_inventory.html.erb`, `public/assets/javascripts/seat_print_module.js`
  - Behavior: adds print button and generates multi-page PDF with seat summaries and clickable process/playbook links; introduces shared print module.
- `c9ed7be39` Initial process/playbook inventory report
  - Files: `app/controllers/reports_controller.rb`, `app/views/reports/process_playbook_inventory.html.erb`, `config/routes.rb`, `doc/seat-process-attachments.md`
  - Behavior: adds HTML report for process/playbook inventory and documents the materials API contract.
- `85a0960ad` (PR #395) Full seat summaries printout formatting
  - Files: `app/views/groups/accountability_chart.html.erb`, `app/views/widgets/_accountability_chart_print.html.erb`
  - Behavior: adds/adjusts full seat summary printout layout and print flow from the chart menu.
- `768424095` (PR #394) Seat modal print action, cog icon, config heading
  - Files: `app/views/groups/accountability_chart.html.erb`, `app/views/widgets/_accountability_chart_print.html.erb`
  - Behavior: adds seat modal print action and chart UI affordances (cog icon/config header).
- `3ce70eee9` (PR #397) Measurables and rocks team pickers restored
  - Files: `app/views/groups/accountability_chart.html.erb`, `public/assets/javascripts/accountability_chart.js`
  - Behavior: restores team pickers for measurables and goals/rocks with updated styles.
- `67af93b88` (PR #396) Seat modal notes tab
  - Files: `app/models/custom_content.rb`, `app/models/seat.rb`, `app/views/groups/accountability_chart.html.erb`, `db/migrate/449_add_notes_to_seats.rb`, `doc/feature_summaries/quick_wins.md`, `public/assets/javascripts/accountability_chart.js`, `test/functional/api/seats_controller_test.rb`
  - Behavior: adds Notes tab to seat modal, persists notes on seats, and updates tests/docs.

## Open Questions
- Should the data loader be API-driven or server-rendered JSON?
- Do we want one consolidated endpoint for seat tree + measures + process materials?
- Should we reuse `GET /api/seats/:id/materials` or pre-load materials in bulk?
