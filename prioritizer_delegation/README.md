# Prioritizer Delegation – Remove After Assign

## Feature Branch
- Repo: `resultmaps-web`
- Branch: `feature/delegation-remove-after`
- Goal: Add a “Remove from my list after delegating” option in the delegation slider (teamUpSlider) so delegated items drop out of the user’s prioritizer/day plan.

## Proposed Implementation (high level)
- **UI**: In `app/views/widgets/_team_up_slider.html.erb`, add a checkbox under the team selector with label “Remove from my list after delegating.”
- **State**: In `public/assets/javascripts/team_up_slider.js`, add `removeAfterDelegate = ko.observable(false)` (consider persisting via user meta/localStorage).
- **Behavior**: In `teamUpSlider.saveAssignment`, after the assignment succeeds, if `removeAfterDelegate()` is true, find the related day plan action in `context.dayPlanActions()` and call `deleteFromList()` to remove it (this already sends the DELETE to `/day_plan_actions/destroy/:id` and updates UI).
- **Guardrails**: No-op if day plan context is missing; ensure checkbox is remembered if persistence is added.

## Open Questions
- Should the checkbox default to checked or unchecked?
- Should the preference persist per user across sessions?
- Do we also remove from quadrants view immediately, or rely on shared `dayPlanActions` updates to propagate?
