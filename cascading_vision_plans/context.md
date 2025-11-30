# Cascading Vision Plans - Context

## Data to Pull

**3-Year Picture**
- Table: `custom_contents` where `title = "Three Year Picture"`
- JSON fields: future_date, revenue, profit, measurables, description
- Get: `AddsOnEOS::VTO.find_three_year_picture(user, team)` (adds_on_eos.rb:40)

**1-Year Plan**
- ObjectMeta key: `eos_year_and_quarter_planning`
- JSON format: `{"2025_0": [text, date, revenue, profit, measures]}` (0=annual, 1-4=quarters)
- Get: `AddsOnEOS::VTO.get_year_and_quarter_planning(user, team, year, quarter)` (adds_on_eos.rb:62)

## Traversing Hierarchy

Use: `group.self_and_internal_teams` (group.rb:4031) — gets all descendants via nested sets

Avoid: `self_and_descendants` — broken, only gets immediate children

## Prerequisites

- Check cascading enabled: `group.is_cascading_goals` (group.rb:5412)
- Only EOS/OKR frameworks support this: `group.is_eos?` or `group.is_okr?`
