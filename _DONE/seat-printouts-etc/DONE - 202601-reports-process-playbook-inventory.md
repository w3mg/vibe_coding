# Reports: Process/Playbook Inventory (HTML)

## Status
COMPLETE

## Goal
Add a new HTML-only report page under Reports that displays the Process/Playbook index by seat.

## Route
- `/reports/process_playbook_inventory`

## Scope
- Render an HTML report with one section per seat.
- Include seat title, owner, reports-to, direct reports, accountabilities, measurables, and Process/Playbook inventory.
- Pull Process/Playbook materials from the existing seat materials API.

## Data Sources
- Seat tree: `Group#seat_data(include_thumbs: true, include_goals: true)`
- Measures: `Group#team_weekly_measures_data`
- Process/Playbooks: `GET /api/seats/:id/materials` filtered by `MaterialCategory` "Process / Playbooks"

## Implementation Notes
- New action in `ReportsController` that loads the current group context and seat process category.
- New view under `app/views/reports/process_playbook_inventory.html.erb` that renders the HTML layout and fetches seat materials per seat.
- Add route in `config/routes.rb` for `/reports/process_playbook_inventory`.

## Open Questions
- Confirm desired ordering: hierarchy order or alphabetical.
- Confirm whether empty sections should show "None listed" or be hidden.
