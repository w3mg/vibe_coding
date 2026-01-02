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

## Open Questions
- Should the data loader be API-driven or server-rendered JSON?
- Do we want one consolidated endpoint for seat tree + measures + process materials?
- Should we reuse `GET /api/seats/:id/materials` or pre-load materials in bulk?
