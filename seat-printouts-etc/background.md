# Background Documentation for Accountability Chart Enhancement

This file lists the relevant documentation from resultmaps-web for the EOS accountability chart enhancement project.

## Relevant Documentation Files

### Accountability Chart & Seats

1. **`/Users/scottilevy/Development/resultmaps-web/doc/accountability-chart-code-map.md`**
   - Complete code map of the Accountability Chart feature
   - Routes, controllers, views, JavaScript implementation
   - Seat modal functionality, printing capabilities, permissions system
   - EOS/non-EOS framework differences
   - D3 visualization, Knockout.js bindings, snapshot management, PDF export

2. **`/Users/scottilevy/Development/resultmaps-web/doc/api/api-seats-snapshots.md`**
   - API documentation for seat and snapshot management endpoints
   - Seat CRUD operations, snapshot lifecycle management
   - Permission requirements, error handling, curl examples

### EOS Framework

3. **`/Users/scottilevy/Development/resultmaps-web/doc/framework-helpers.md`**
   - EOS framework implementation details
   - Terminology (Rocks, Milestones, Weekly L10)
   - Framework detection methods, framework-specific behaviors
   - Helper methods across Ruby, Views, and JavaScript layers

### Organization Structure & Goal Hierarchy

4. **`/Users/scottilevy/Development/resultmaps-web/doc/group-goal-collection.md`**
   - Group#goal_collection method documentation
   - EOS hierarchy (Yearly Goals -> Quarterly Rocks -> Key Results)
   - Team organizational structure and goal hierarchies

5. **`/Users/scottilevy/Development/resultmaps-web/doc/team-strategy-grid.md`**
   - Strategy grid content loading system
   - Cascading goals and team organization
   - Framework-specific grid rendering (EOS vs OKR)

6. **`/Users/scottilevy/Development/resultmaps-web/doc/cascading-strategy-grid-update.md`**
   - Cascading strategy grid implementation
   - Organizational hierarchy and permission management
   - Company vs team column editing

### Related Features

7. **`/Users/scottilevy/Development/resultmaps-web/doc/team-scorecard.md`**
   - Team Scorecard feature (tracks measurables/KPIs)
   - EOS "measurables" integration with accountability chart seats

8. **`/Users/scottilevy/Development/resultmaps-web/doc/front_end_and_feature_summaries/vision.md`**
   - Vision system documentation
   - EOS VTO (Vision Traction Organizer) implementation
   - Strategic alignment with organizational structure

## Quick Reference

| Topic | Document |
|-------|----------|
| Accountability Chart Code | `Accountability Chart Code Map.md` |
| EOS Framework | `framework_helpers.md` |
| Seats API | `API - Seats & Snapshots.md` |
| Goal Hierarchy | `group_goal_collection.md` |
| Strategy Grid | `team_strategy_grid.md` |
| Cascading Goals | `cascading_strategy_grid_update.md` |
| Team Metrics | `team_scorecard.md` |
| Vision/VTO | `feature_summaries/vision.md` |

## Verification Note

Paths verified against `resultmaps-web/doc` on 2026-01-01; entries updated to current filenames/locations.
