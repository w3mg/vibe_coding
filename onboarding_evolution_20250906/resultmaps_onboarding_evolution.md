# ResultMaps Onboarding Evolution — Current State

*Last verified: 2025-10-24 (line references reflect repository state on this date).*

## ✅ Evolution 1 & 3: COMPLETE

All planned onboarding enhancements have been implemented and are operational.

## Implementation Snapshot
- **Today dashboard entry point**: `app/controllers/today_controller.rb:124` checks `current_user.should_show_account_onboarding?` and renders `app/views/today/_onboard_account_owners.html.erb` when the flag returns true.
- **Step configuration & gating**: `app/models/user/onboarding_meta.rb` stores onboarding meta under the `user_onboarding` key, enforces persona sequences from `User::USER_ONBOARDING_CONFIGS`, and re-checks underlying data (visions, labels, customer-to-cash entries, measures, goals/rocks) before persisting completion with `mark_onboarding_step_complete`.
- **Persona defaults**: `default_onboarding_role_name` pins production users to the visionary flow; integrator configs remain available for future persona switching.
- **EOS-only visibility**: `should_show_account_onboarding?` requires `users.should_show_onboarding`, matching `account_id/group_id`, and an EOS team via `Group#is_eos?` before exposing the card.
- **Agent surfaces**: `/agents/vision`, `/agents/core_values`, `/agents/scorecard`, and `/agents/goals` (handled by `LlmController`) power the cards in the onboarding partial.
- **Manual activation**: Passing `?onboarding=1` to `/today/dashboard` forces the onboarding view, which is useful for QA even when the helper returns false (`app/controllers/today_controller.rb:125`).

## Test Coverage
Onboarding system behavior is verified through 133 tests across unit and functional test suites:

### Unit Tests (Model Logic)
- **`test/unit/user_onboarding_meta_test.rb`** — 125 tests covering User::OnboardingMeta module
  - `initialize_onboarding_meta` payload creation and persistence
  - `completed_onboarding_steps` tracking and progression
  - `should_show_account_onboarding?` visibility rules (creator vs. invited, EOS requirement, completion state)
  - `mark_onboarding_step_complete` and prerequisite enforcement
  - Data-driven completion checks (`*_step_complete_from_data?` for vision, core values, customer flow, scorecard, yearly targets)
  - Role/persona configuration handling

- **`test/unit/onboarding_cart_test.rb`** — Stub file (OnboardingCart model not actively used in current implementation)

### Functional Tests (Controller Integration)
- **`test/functional/user_onboarding_today_controller_test.rb`** — 5 tests for today#dashboard onboarding flow
  - New account owners see onboarding partial
  - Completed users skip onboarding, render normal dashboard
  - Invited users (non-creators) cannot access onboarding
  - Partial completion shows onboarding with correct step state
  - `?onboarding=1` query parameter forces onboarding visibility

- **`test/functional/user_onboarding_groups_controller_test.rb`** — 3 tests for invitation flow
  - Account owners inviting users creates accounts without onboarding access
  - Invited users do not see onboarding on today#dashboard after invitation
  - Multiple simultaneous invites maintain consistent access denial

Run tests: `docker-compose exec web bash -l -c "cd /app && bundle exec ruby test/unit/user_onboarding_meta_test.rb"`

## Intentional Guardrails
- Account creators receive onboarding via `setup_onboarding_if_required` immediately after creation, ensuring `should_show_onboarding` and the ObjectMeta payload are set.
- Invited teammates never see onboarding; functional tests in `test/functional/user_onboarding_groups_controller_test.rb` confirm that invites skip both the survey flag and the onboarding view.
- Live data controls progress: each `*_step_complete_from_data?` helper recalculates completion and syncs `completed_onboarding` when requirements are met.
- While the flow is active, `today_controller` sets `session[:is_onboarding] = true`; once all steps complete, `_onboard_account_owners.html.erb` fires the confetti modal and clears the session (`app/controllers/today_controller.rb:130`, `app/views/today/_onboard_account_owners.html.erb:325`).

## Where to Review Project Documentation (vibe_coding Repository)
Consult these folders for supporting research and plans:

- `vibe_coding/onboarding_evolution_20250906/CLAUDE.md` — charter, scope, naming guidance.
- `vibe_coding/onboarding_evolution_20250906/background_v6.md` — persona codes, defaults, persistence rules.
- `vibe_coding/onboarding_evolution_20250906/research_findings_v6.md` — query strings and session flags that affect onboarding routing.
- `vibe_coding/onboarding_evolution_20250906/onboarding flows - account owner.md` — end-to-end owner flow descriptions and technical entry points.
- `vibe_coding/onboarding_evolution_20250906/onboarding flows - invited teammate.md` — invited teammate flow and data handling.
- `vibe_coding/onboarding_evolution_20250906/subprojects/evolution 1/architecture_v2.md` — ObjectMeta schema, helper responsibilities, step rules.
- `vibe_coding/onboarding_evolution_20250906/subprojects/evolution 1/implementation_plan_and_tracking.md` — milestone tracking and delivered work.
- `vibe_coding/onboarding_evolution_20250906/subprojects/evolution 1/plan_iteration_1_prototype_DONE.md` — historical prototype notes.
- `vibe_coding/onboarding_evolution_20250906/subprojects/evolution 1/technical-prompt-guidelines.md` — agent prompt conventions for onboarding tasks.

> **Heads-up:** The dependency list in `architecture_v2.md` predates the current `USER_ONBOARDING_CONFIGS`. When in doubt, defer to the live code at `app/models/user.rb:238`.

Keep this document aligned with the implementation and update the reference list as new sprint artifacts land in `vibe_coding/onboarding_evolution_*`.
