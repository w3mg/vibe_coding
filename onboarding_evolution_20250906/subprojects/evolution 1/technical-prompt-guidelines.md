# Technical Prompt Guidelines (Onboarding Evolution)

Use this checklist when starting a fresh agent session for the onboarding evolution work.

1. **Read the required context first:**
   - `doc/testing-strategy.md` in `resultmaps-web` (environment setup + current task list).
   - `~/Development/vibe_research/agents/code_complete_reviewer/code_complete_reviewer.md` (Code Complete expectations).
   - `~/Development/vibe_coding/onboarding_evolution_20250906/CLAUDE.md` (naming rules and project constraints).
2. **Environment assumptions:**
   - Test DB is prepared via `db/test_structure.sql`; do not run `bundle exec rake db:schema:load RAILS_ENV=test`.
   - Do not install or upgrade Ruby/Bundler; any toolchain change needs explicit user direction.
   - Agents add specs/tests and ask the user to run them; do not execute the suite yourself unless instructed.
3. **Current focus:**
   - Follow `doc/testing-strategy.md` (see “Current Work Checklist”) to determine the next task before editing implementation code.
4. **Communication commitments:**
   - Confirm with the user before modifying shared documentation or infrastructure files.
   - Surface assumptions and get approval when unsure; no silent changes.

Paste this checklist into new prompts to keep sessions aligned without repeating instructions every time.

## Worker Prompt Checklist
- Open with the legacy constraints: Ruby 1.9.3, Rails 2.3, hash rockets, no silent toolchain changes; avoid `ensure` blocks—use guard clauses instead.
- Remind the worker to read (in order) `doc/testing-strategy.md`, this file, `implementation_plan_and_tracking.md`, and the task-specific spec (e.g., `architecture_v1.md`).
- Specify the exact files they will touch (tests first, then implementation) and require comments above every new test/helper.
- Forbid running Docker commands, installing gems, or executing tests; instruct them to request the user run `bundle exec …` instead.
- Reinforce the fail-first cycle: add failing tests → stop → request test run → report failures → wait for approval before implementing.
- Remind them that onboarding meta now tracks `account_id` and `group_id` for the current team context and that helpers must not call `default_account`/`default_group`—use creator checks via `group.configurable_by?(user)`.
- Call out any documentation/follow-up requirements (Phase 2/3 placeholders, future controller wiring) so they don’t get dropped.

### Example Prompt (Model Helper TDD)
```
You’re a brilliant, highly practical developer who ships clean code fast while respecting our legacy stack (Ruby 1.9.3, Rails 2.3—use hash rockets, classic ActiveRecord idioms, and avoid `ensure` blocks—lean on guard clauses instead). Every new test and helper must include a concise comment explaining its intent.

Before coding, read:
1. doc/testing-strategy.md (no db:schema:load, no toolchain changes).
2. subprojects/evolution 1/technical-prompt-guidelines.md (this checklist).
3. subprojects/evolution 1/implementation_plan_and_tracking.md (see the “Visibility Helpers” section).
4. subprojects/evolution 1/architecture_v1.md (access-control rules).

All onboarding helpers live in User::OnboardingMeta (app/models/user/onboarding_meta.rb) and tests live in test/unit/user_onboarding_meta_test.rb; keep new work there.

Task (TDD for should_show_account_onboarding?):
1. Add commented tests covering:
   - Returns true when onboarding meta identifies the current account/team (`account_id`/`group_id`) and the user is that account’s creator with `should_show_onboarding` true.
   - Returns false for collaborators who are not creators (config-rights logic will plug in later).
   - Returns false when `should_show_onboarding` is false/nil.
   - Returns false when onboarding meta lacks account or group context; ensure the helper never calls `default_account`/`default_group`.
2. Stop and ask me to run `bundle exec ruby test/unit/user_onboarding_meta_test.rb`; report failures and wait for approval.
3. After approval, implement the helper inside User::OnboardingMeta with a brief comment, then ask me to re-run the suite.

Do not run Docker commands, install gems, or execute tests yourself; request that I run them when needed.
```

## PM / Architect Prompt Checklist
- Always state the persona up front: “You’re stepping in as the senior, highly technical product manager and architect…”.
- Direct the recipient to read the core docs in this order: `doc/testing-strategy.md`, this file, `implementation_plan_and_tracking.md`, `architecture_v1.md`, and `CLAUDE.md`.
- Summarise current status (completed work, blockers, upcoming milestones) so the worker knows the larger context.
- Point them to the Worker Prompt Checklist and example to keep downstream instructions consistent.
- Remind them to enforce legacy constraints, the approval workflow, and documentation updates in every worker prompt.
- Explicitly rate each recommendation (1–10 confidence) before sharing it; keep or revise guidance until it scores high enough to trust.
- Double-check assumptions against the legacy codebase before issuing new marching orders; if something is uncertain, slow down and investigate first.
