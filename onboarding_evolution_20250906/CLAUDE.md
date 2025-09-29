# CLAUDE.md - Onboarding Evolution Project

## Project Purpose
Enhancing ResultMaps web application onboarding flows based on detailed research and documentation. This will be done in subprojects that each has success criteria, find them in the /subprojects folder in this project

The Evolution 1 implementation now lives in the renamed `_onboard_account_owners.html.erb` partial inside `resultmaps-web`. The original v1 markup has been archived as `_onboard_account_owners_backup.html.erb` for reference only. The gating column was renamed to `users.should_show_onboarding`; future rules will be wrapped in a `User` helper.

## Key Context Files
- `background_v6.md` - Persona system implementation details
- `research_findings_v5.md` - Query params and routing behaviors  
- `onboarding flows - account owner.md` - Account creation flows
- `onboarding flows - invited teammate.md` - Team invitation flows

## Target Application
Main Rails app: `~/Development/resultmaps-web/`
- Must run through Docker (Ruby 1.9.3)
- Key controllers and models: are documented in the key context files above.

## Current Work Focus
- Defined in "/subproject" folders, specified by asking user where to focus if not supplied.

## Critical Implementation Notes
- All changes must follow Code Complete principles found in ~/Development/vibe_research/agents/code_complete_reviewer/as laid out in code_complete_reviewer.md
- Thoroughly read context files.

## CRITICAL NAMING RULES
- **NEVER use "evolution_1" or any sprint/project names in code**
- **NEVER suffix functions/variables with version numbers**
- Use generic, timeless names like:
  - `onboarding_data` not `evolution_1_data`
  - `checkOnboarding()` not `checkEvolution1Onboarding()`
  - `steps` not `evolution_1_steps`
- The ONLY place project names should appear is in documentation files
