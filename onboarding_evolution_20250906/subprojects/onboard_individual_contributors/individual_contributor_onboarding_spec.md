# Individual Contributor Onboarding Specification

## Partial Name
`_onboard_individual_contributor.html.erb`

## Location
`~/Development/resultmaps-web/app/views/today/_onboard_individual_contributor.html.erb`

## Cards

### Card 1: About You
- **Time**: N/A (auto-completed)
- **Completion**: Shown as completed on page load

### Card 2: Learn to Get Around
- **Time**: 90 seconds
- **Completion**: User watches video

### Card 3: Get Clarity
- **Time**: 2 minutes
- **Completion**: User watches video

### Card 4: Get Aligned
- **Time**: 3 minutes
- **Completion**: User watches video

## Dependencies
Sequential unlocking (1→2→3→4):
- Card 2 unlocks after Card 1 complete
- Card 3 unlocks after Card 2 complete
- Card 4 unlocks after Card 3 complete

## Implementation Pattern
Follow the exact pattern implemented in `_onboard_account_owners.html.erb`:
- Same card layout and styling
- Same completion/lock state logic
- Same visual indicators (checkmark, lock icon, progress)
- Same data storage via `ObjectMeta` and `User::OnboardingMeta` concern
- Same controller integration via `today#dashboard`

## Architecture
Reuses existing onboarding infrastructure:
- `users.should_show_onboarding` gating column
- `ObjectMeta` storage (key: `user_onboarding`) - separate entry for individual contributor persona
- `User::OnboardingMeta` concern methods
- Persona-based configuration (individual contributor persona)

## Notes
- This is NOT a new architecture—it extends the existing account owner onboarding system
- Patrick will handle persona detection/routing logic
- All video URLs and specific completion triggers TBD during implementation
- Separate ObjectMeta storage ensures individual contributor onboarding state is independent from other personas
