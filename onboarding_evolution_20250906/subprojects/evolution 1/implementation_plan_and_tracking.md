# Implementation Plan for Evolution 1 Onboarding Screen

## Approach: Conditional Partial Replacement
Replace the normal dashboard partial with the new onboarding screen when users haven't completed the 5-step onboarding flow.

Gating boolean lives on `users.should_show_onboarding`; a future `User` helper will encapsulate the display rules (per Scott).

The active partial is now `app/views/today/_onboard_account_owners.html.erb` (formerly v3). The original v1 implementation lives at `_onboard_account_owners_backup.html.erb` and should only be used for historical reference.

## 1. Create New Onboarding Detection Logic
- Add a new method to check for "evolution 1" onboarding status (separate from existing `onboarding_survey_completed`), leveraging `should_show_onboarding` when the helper is introduced
- Check for completion of the 5 specific steps:
  1. Vision confirmation
  2. Core values/guardrails
  3. Customer to cash flow map
  4. Scorecard measurables
  5. Yearly targets

## 2. TDD Implementation - Methods to Build

**Build these methods one at a time using TDD (tests first, then implementation):**

1. ✅ `initialize_onboarding_meta`
   - Tests and implementation cover empty `completed_onboarding`, schema versioning, graceful JSON recovery, persona `role_name` persistence, and automatic seeding during user creation.
   - 💡 Future refinement: add explicit specs for non-default personas (e.g., subscriber_persona 7 → integrator) once persona mapping rules stabilize.
2. ✅ `completed_onboarding_steps`
   - Covered by existing specs (symbolized order, blank payload handling, non-string filtering, non-mutation).
3. ✅ `mark_onboarding_step_complete(step)`
   - Tests cover rejection of unknown steps, idempotency, persona-specific validation, prerequisite enforcement, and persistence of the updated payload.
   - Implementation now normalizes persona role names (`default_onboarding_role_name`), seeds meta during user creation, and updates ObjectMeta records accordingly.
4. ✅ `onboarding_step_unlocked?(step)`
   - Tests cover satisfied/unsatisfied prerequisites, dependency-free steps, persona scope validation, and resilience to missing or invalid onboarding meta.
   - Implementation ensures prerequisite checks leverage the persona configuration and sanitized onboarding payload.
5. ✅ `next_onboarding_step`
   - Tests confirm persona-ordered selection, prerequisite awareness, completion detection, and empty payload handling.
6. ✅ `onboarding_complete?`
   - Tests assert all persona steps complete → true, missing steps → false, empty/invalid payloads → false.
7. ✅ `should_show_onboarding?`
   - Tests assert true when onboarding is incomplete, false when complete, and resilience to missing meta.
8. ✅ `onboarding_steps_for_persona`
   - Tests cover persona-specific configs, default fallbacks, and dependency structures.

### Visibility Helpers
- ✅ `should_show_account_onboarding?` lives in `User::OnboardingMeta` and now checks:
  - Gating column `users.should_show_onboarding` (raw column value must be true).
  - Context IDs persisted in onboarding meta (`account_id` and `group_id`).
  - Rights via `Group#configurable_by?(user)` (Phase 1: group creator or account owner) and bails out once `onboarding_complete?` returns true.
- ✅ `Group#configurable_by?(user)` exists with unit coverage in `test/unit/group_test.rb`.
- 🚧 Step Trigger Hooks — ACTION REQUIRED (`app/models/user/onboarding_meta.rb`)
  - Current state: the dispatcher exists with metadata fallback; Vision, Core Values, Scorecard, and Yearly Targets now run against real data.
  - Process guardrails:
    - One mini-project per helper (`vision_step_complete_from_data?`, `core_values_step_complete_from_data?`, `customer_flow_step_complete_from_data?`, `scorecard_step_complete_from_data?`, `yearly_targets_step_complete_from_data?`). Do not stack tasks; finish or park one before starting the next.
    - Each mini-project must begin by requesting up-to-date completion requirements from Scott before any specs are written. Capture those rules in this document as part of the task kickoff.
    - Follow strict TDD with Scott in the loop: write failing specs, stop and have Scott run `bundle exec ruby test/unit/user_onboarding_meta_test.rb`, then implement only after the failures are confirmed. Ask Scott to rerun the file after implementation and iterate until green.
  - Next actions (repeat per helper):
    1. Record the agreed requirements for the step in this plan (what data/state marks it complete, source tables, edge cases). Link back to the model files noted in `architecture_v2.md` (Vision → `app/models/vision.rb`, Core Values → `app/models/label.rb` + `app/models/adds_on_eos.rb`, Scorecard → `app/models/measure.rb`, Yearly Targets → `app/models/goal.rb`). Vision/Core Values/Scorecard/Yearly Targets are complete; Customer Flow is still blocked on Patrick’s branch.
    2. Extract shared metadata parsing into a common helper so business rules stay focused on real data checks.
    3. Add/extend unit specs to cover both the metadata fallback and the new data-driven trigger paths, updating the existing `mark_onboarding_step_complete` integration coverage so it asserts the real-world data, not just ObjectMeta echoing.
    4. Implement the helper using the documented rules, keeping the account/group context intact and avoiding `default_account`/`default_group`.
  - Helper snapshot:
    - ✅ Vision helper implemented (trimmed description/purpose > 20 chars, `Vision` scoped to current team).
    - ✅ Core Values helper implemented (≥3 labels with trimmed names ≥3 chars on current team context).
    - ✅ Scorecard helper implemented (≥3 active measures with trimmed names ≥3 chars on current team).
    - ✅ Yearly Targets helper implemented (requires ≥1 yearly goal + ≥1 rock for the current team, trimmed names ≥3 chars, non-archived).
    - 🚧 Customer Flow helper blocked until Patrick’s branch merges.
- ✅ Controller wiring (`today#dashboard`)
  - Functional coverage now lives in `test/functional/user_onboarding_today_controller_test.rb` and asserts the helper is called, onboarding flags are assigned, and step completion variables drive the view.
  - Follow-ups:
    - ✅ Early-render audit complete: onboarding short-circuit now sets all variables consumed by `_onboard_account_owners.html.erb`, and functional coverage already exercises the render-before-return path.
    - 🚧 Replace the `'#'` placeholder URLs in `_onboard_account_owners.html.erb` once the step flows are ready (track in the UI workstream).
- TODO Phase 2 Enhancements:
  1. Extend `Group#configurable_by?` to honour config-user delegates (ObjectMeta storage TBD).
  2. Implement invited-helper flag in onboarding meta and update visibility logic/tests accordingly.

### Current Focus
- ✅ Onboarding concern now owns all helpers (tests enforce `User::OnboardingMeta` as the single surface).
- All foundational helpers covered via TDD; next up is wiring the step-trigger helpers to real data (see tasks above).
- Controller integration exists; keep iterating on onboarding step flows/URLs and invited-helper rules in Phase 2.
- When personas beyond visionary/integrator become available, expand specs to assert correct `role_name` mapping for each persona type (still pending).

### Migration Plan: Extract Onboarding Helpers
_Completed:_
1. Tests updated to assert onboarding helpers come from `User::OnboardingMeta`.
2. Concern introduced and included; autoload confirmed without additional requires.
3. Duplicated methods removed from `User`; module now owns the logic.
4. Suite re-run to verify behaviour remained intact.

### Outstanding Test Debt
- Legacy `test/unit/user_test.rb` currently fails unrelated scenarios; schedule a follow-up cleanup to restore that suite once the onboarding helpers stabilize (log as a separate TODO project).

## 3. Controller Modifications (today_controller.rb)
- ✅ `today#dashboard` now calls `should_show_account_onboarding?`, assigns step-completion variables, and short-circuits to render the onboarding partial when appropriate.
- Functional coverage: `test/functional/user_onboarding_today_controller_test.rb` proves the helper is called for account owners, suppressed for invited users, respects completed onboarding, and honours the `onboarding=true` override for manual QA.
- Follow-up items:
  - Confirm the early render path doesn’t break any downstream data expectations (add regression coverage as needed).
  - Replace temporary `'#'` URLs in `_onboard_account_owners.html.erb` once the step flows are available.

## 4. View Implementation
- Create/maintain partial: `app/views/today/_onboard_account_owners.html.erb`
- In `dashboard.html.erb`, add conditional at the top:
  ```erb
  <% if @should_show_config %>
    <%= render 'evolution_onboarding' %>
  <% else %>
    <!-- existing dashboard content -->
  <% end %>
  ```

## 5. Onboarding Partial Structure (✅ COMPLETED)
- Implement the card-based layout from the design (5 cards)
- Each card shows:
  - Completion status (checkmark when done)
  - Title and description
  - Time estimate
  - Lock status for dependent steps
- Add "Continue" button at bottom
- Include progress indicators

Current behaviour: "About You" renders as a hard-coded completed card, the first dynamic step resolves to the `active` state (purple-electric border + pointer icon), and all subsequent steps default to `locked` until their predecessors are marked complete.

## 6. JavaScript/Interaction Layer
- Handle card clicks to launch appropriate flows
- Track completion status via AJAX
- Update UI dynamically as steps complete
- Handle the "Continue" button to advance through steps

## 7. Completion Tracking
- Store completion status in ObjectMeta or new fields
- Mark overall onboarding complete when all 5 steps done
- Redirect to regular dashboard after completion

## 8. Query String Support
- Support query params to trigger specific Intercom tours/popups (current `?onboarding=v3` path is **testing only**; production gating will read a dedicated database field once defined)
- Allow bypassing for testing (`?skip_onboarding=1`)
- Support different persona/framework variations

## Benefits of This Approach:
- **Minimal disruption** to existing dashboard code
- **Easy to test** - can be toggled on/off
- **Progressive enhancement** - gracefully falls back to regular dashboard
- **Clean removal path** - once stable, can be easily deprecated
- **Follows existing patterns** - similar to how dashboard_srt and dashboard_coach work

## Key Implementation Notes:
- The dashboard controller already has ~400 lines and the view has ~800 lines
- The existing code uses `@view_to_render` pattern for different dashboard variants
- Current onboarding uses `onboarding_survey_required` and `onboarding_survey_completed` flags
- ApplicationController has a `redirect_to_onboarding_if_required` before_filter
- Dashboard is set as `User::NEW_USER_FIRST_PAGE = '/today/dashboard'`

## Future Phases
- **Phase 2:** provide role-specific onboarding partials and step definitions.
- **Phase 3:** enable admins to configure which onboarding experience front-line employees see.
