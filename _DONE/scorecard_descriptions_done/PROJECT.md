# Scorecard Descriptions Project

## Overview

This project focuses on scorecard description functionality within the ResultMaps application.

## Documentation Sources

### Core Documentation

| Document | Path | Description |
|----------|------|-------------|
| Team Scorecard | `doc/team_scorecard.md` | Overview of the Team Scorecard page, routes, main widget, JS utilities, data flow |
| Measures | `doc/measures.md` | Core model/associations for measures (scorecard measurables), ownership, history, JS hooks |
| LLM Scorecard Measurables | `doc/llm_scorecard_measurables.md` | Design for the LLM-driven "scorecard_measurables" agent (prompt content, save/retrieve markers) |
| Scorecard to CSV | `doc/scorecard_to_csv.md` | CSV export plugin for scorecards (usage and widget expectations) |

### API Documentation

| Document | Path | Description |
|----------|------|-------------|
| Measures API | `doc/API/API - Measures.md` | Measure CRUD, ordering, history endpoints |
| Groups API | `doc/API/API - Groups.md` | Group scorecard endpoint |
| Scorecard Grids API | `doc/API/API - Scorecard Grids.md` | Grid scoring endpoints |

## Success Criteria

1. Users can easily capture definitions of each measurable/measure in a rich text/blob
2. Easy to maintain
3. Great customer experience
4. Follows our development patterns and Code Complete guidelines

## Quick Reference

All documentation paths are relative to the `resultmaps-web` project root.
