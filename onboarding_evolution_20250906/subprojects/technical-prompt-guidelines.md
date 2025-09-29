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

## Worker Prompt Checklist
- Always open with the legacy constraints: Ruby 1.9.3, Rails 2.3, hash rockets, no silent toolchain changes.
- Remind the worker to read (in order) `doc/testing-strategy.md`, this checklist, the current roadmap (`implementation_plan_and_tracking.md`), and the relevant spec file (e.g., `architecture_v1.md`).
- State the exact files they will edit (tests first, then implementation) and require comments above every new test/helper.
- Explicitly forbid running Docker commands, installing gems, or executing tests; instruct them to request the user to run `bundle exec …`.
- Spell out the failure cycle: add fail-first tests → stop → ask user to run the suite → report failures → wait for approval before touching implementation.
- Include reminders about documentation updates or follow-up tasks when relevant (e.g., Phase 2/3 placeholders, future controller wiring).

Paste this checklist into new prompts to keep sessions aligned without repeating instructions every time.
