# Onboarding Architecture (Version 1)

## 1. Data Model and Storage
- Persona configs live in `User::USER_ONBOARDING_CONFIGS`.
  ```ruby
  ONBOARDING_CONFIGS = {
    visionary: {
      steps: [:vision, :core_values, :customer_flow, :scorecard, :yearly_targets],
      dependencies: {
        customer_flow: [:vision, :core_values],
        scorecard: [:customer_flow],
        yearly_targets: [:scorecard]
      }
    },
    integrator: {
      steps: [:scorecard, :process_docs, :meeting_rhythm, :issues_list, :rocks],
      dependencies: {
        meeting_rhythm: [:process_docs],
        issues_list: [:meeting_rhythm],
        rocks: [:scorecard, :issues_list]
      }
    }
  }
  ```
- Onboarding state is stored in `ObjectMeta` (key: `user_onboarding`). Required keys:
  ```json
  {
    "completed_onboarding": ["vision", "core_values"],
    "role_name": "visionary",
    "account_id": 42,
    "group_id": 7
  }
  ```
- Context rules: `account_id` and `group_id` describe the team currently onboarding. `role_name` records the persona snapshot.

## 2. Visibility and Access Rules
- Show the onboarding UI only when **all** of the following are true:
  1. `users.should_show_onboarding` (raw column) is `true`.
  2. Onboarding meta contains `account_id` and `group_id` for the active context.
  3. `Group#configurable_by?(user)` returns `true` for that context.
- Phase 2 will extend the rule to support invited helpers via an additional flag in onboarding meta.

## 3. Helper Responsibilities
- `User::OnboardingMeta#should_show_account_onboarding?`
  - Validates context IDs and the `should_show_onboarding` flag.
  - Looks up the group by `group_id`, double-checks it belongs to `account_id`, and defers to `group.configurable_by?(user)`.
- `Group#configurable_by?(user)`
  - Returns `true` when the user created the group (`group.user_id == user.id`).
  - Returns `true` when the user owns the parent account (`group.account.user_id == user.id`).
  - Returns `false` otherwise (config-delegate support lands in Phase 2).
- Step state helpers already available in `User::OnboardingMeta`:
  - `initialize_onboarding_meta`, `completed_onboarding_steps`, `mark_onboarding_step_complete`, `onboarding_step_unlocked?`, `next_onboarding_step`, `onboarding_complete?`, `should_show_onboarding?`.
- Step trigger hooks (stubs ready for implementation):
  - `onboarding_step_complete_from_data?(step)` dispatches to:
    - `vision_step_complete_from_data?`
    - `core_values_step_complete_from_data?`
    - `customer_flow_step_complete_from_data?`
    - `scorecard_step_complete_from_data?`
    - `yearly_targets_step_complete_from_data?`
  - Each helper currently returns `false` and is tagged for Patrick to supply real completion rules.

## 4. Open Questions
1. Should completed onboarding `ObjectMeta` rows be deleted or retained for history?
2. If we delete them, when is it safe to do so without race conditions?
3. When do we move initial onboarding-data creation out of user creation and into an async job?

## 5. Next Architecture Tasks
1. Define the data triggers that mark each onboarding step complete (fills in the helpers listed above).
2. Document and implement the invited-helper flag once the data model is finalized.
3. Revisit config delegation in `Group#configurable_by?` once the ObjectMeta format for config users is confirmed.
4. Keep the step helper list in sync with any future persona additions beyond visionary/integrator.

## Determining Step Completion
Document the source-of-truth signals that mark each step finished before touching implementation. Treat each subsection as a living specification; update it as requirements evolve.

### Vision
- _Status_: confirmed rules.
- _Completion criteria_:
  - There exists at least one `Vision` row whose `visionable_type` is `Group` and `visionable_id` equals the onboarding `group_id`.
  - Its `description` (trimmed) is longer than 20 characters.
  - Its `purpose` (trimmed) is longer than 20 characters.
- _Notes_: Treat the step as complete as soon as any qualifying record is found (multiple entries are unexpected but acceptable). Ignore records that only differ by whitespace padding.
- _Reference_: `app/models/vision.rb` (`visions` table).

### Core Values
- _Status_: confirmed rules.
- _Completion criteria_:
  - Using the onboarding context (`current_team` / `current_team_context`), at least three `Label` records exist for that team, each with a `name` ≥ 3 characters after trimming whitespace.
  - Labels must belong to the onboarding context: `group_id` equals the current team id and `user_id`/`account_id` align with the onboarding user’s ownership (as created via VTO flows).
- _Notes_: The EOS helper may still redirect to a parent via `AddsOnEOS.determineTeamToUse`, but onboarding helpers should start with the current team context provided by the controller/view.
- _Reference_: `app/models/label.rb` (`labels` table), `AddsOnEOS::VTO` helper at `app/models/adds_on_eos.rb`.

### Customer Flow
- _Status_: blocked (Patrick branch).
- _Notes_: The data source for the customer-to-cash map lives on Patrick’s in-flight branch; document completion rules once those changes merge.
- _Reference_: pending (Patrick branch).

### Scorecard
- _Status_: confirmed rules.
- _Completion criteria_:
  - Within the onboarding context (`current_team` / `current_team_context`), at least three active `Measure` records (`is_archived IS NOT true`) exist where `measurable_type` is `Group` and `measurable_id` equals the current team id.
  - Each qualifying measure must have a trimmed `name` ≥ 3 characters; other fields (targets, types) can be optional for now.
- _Notes_: Do not traverse parent-team inheritance for scorecard completion—stay anchored to the current team context surfaced by ApplicationController/ApplicationHelper.
- _Reference_: `app/models/measure.rb` (`measures` table), `Group` association at `app/models/group.rb`.

### Yearly Targets
- _Status_: confirmed rules.
- _Completion criteria_:
  - At least one `Goal` in the current team context (`current_team` / `current_team_context`) with `achievable_type == 'Group'`, `achievable_id` equal to that team id, and `goal_type == Goal::GOAL_TYPES['yearly']` (2). Ignore goals whose `current_state` is `'archived'` or `'cancelled'`.
  - At least one `Goal` in the same context with `goal_type == Goal::GOAL_TYPES['rock']` (1), again belonging to the current team and not archived/cancelled.
  - For both yearly goals and rocks, require the trimmed `name` to be ≥ 3 characters so placeholder text doesn’t satisfy the rule.
- _Notes_: These checks stay anchored to the current team context; do not traverse parent inheritance for onboarding completion. `achievable_type` plus `goal_type` are the authoritative signals for “1-year goals” vs “rocks.”
- _Reference_: `app/models/goal.rb` (`goals` table), including `GOAL_TYPES` constants and `is_yearly?` / `is_rock?` helpers.
