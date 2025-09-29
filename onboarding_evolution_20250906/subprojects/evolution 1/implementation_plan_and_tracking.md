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
- TODO `should_show_account_onboarding?` (name TBD):
  - Returns true when onboarding meta shows `account_id`/`group_id` for the current context, the user is that account’s creator, and `should_show_onboarding` is true.
  - Leverage `User.has_team_config_rights(group)` so Phase 2 can extend access to configuration delegates without rewriting callers (initial implementation can default that hook to creator-only logic).
  - Future extension: allow non-creators when an invitation flag (to be defined) is present.
- Document and test the invited-helper path once the data model is finalized.

### Current Focus
- ✅ Onboarding concern now owns all helpers (tests enforce `User::OnboardingMeta` as the single surface).
- All onboarding helper methods covered via TDD.
- Next: add model-level onboarding visibility helpers (account-owner rule now; invited-helper rule logged for Phase 2).
- Controller integration will follow once visibility helpers and tests exist.
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
- Deferred until onboarding visibility helpers (account owner + invited helper) are defined and tested.
- Upcoming controller tasks:
  - Add failing functional specs asserting `dashboard` relies on the visibility helper and exposes onboarding data for the partial.
  - Wire the controller to populate those instance variables via the concern helpers.
  - Re-run functional tests alongside existing unit specs.

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
