# AGENTS.md

## Mission
- Make changes safely and efficiently across mixed stacks.
- Default to conservative actions and ask when uncertain.

## Repo Map
- `resultmaps-web`: `~/Development/resultmaps-web` (primary app repo).

## Project Docs (vibe_coding)
- Location: `~/Development/vibe_coding/<project>/` (one folder per project).
- Create/update minimal docs:
  - `SPEC.md`: problem, goals, non‑goals, acceptance criteria.
  - `PLAN.md`: tasks, owners, status (brief checklist).
- Unless told otherwise, place all PM/spec notes in that project folder.

## Doc Reading Order (vibe_coding projects)
- Always open `<project>/CLAUDE.md` first if it exists; use it as the primary source for scope, constraints, and key commands.
- If `CLAUDE.md` is missing, fall back to `<project>/README.md`.
- Example: for onboarding work, open `vibe_coding/onboarding_evolution_20250906/CLAUDE.md` before any other file.
- Apply this rule at the start of every task and whenever re‑scoping within a project.

## Prior Learnings
- Source: `~/Development/CLAUDE.md` (also reachable as `../CLAUDE.md` from here).
- On new tasks, skim CLAUDE.md for constraints and preferred practices; carry them forward unless the user says otherwise.

## Key Practices (from CLAUDE.md)
- ResultMaps Web runs only in Docker (Ruby 1.9.3). Use `DockerProjects/rm_centos7_project` and run app/test commands via `docker-compose exec web ...`.
- Always consult `vibe_research/agents/` before and during work; run the `code_complete_reviewer` checklist before any commit.
- Keep solutions simple and explicit (Code Complete principles). Favor clarity over cleverness.
- SCSS: use `DockerProjects/scss-compiler/` container for compilation; see `vibe_coding/resultmaps-scss-upgrade` for upgrade work.
- Security: never commit secrets; use env vars; sanitize inputs; review exposed ports in docker-compose.
- Testing/debugging happens inside the container; do not run Rails commands on the host.
- CSS work: inspect actual page source/DOM; don’t trust markdown or docs representations.
- Reference command snippets and paths live in CLAUDE.md Quick Start/Key Commands sections.

## Instruction Priority
- Follow System/Developer instructions first, then this file, then ad‑hoc user prompts.
- If there’s a conflict, call it out and ask which to follow.

## Modes (Advisory vs Enforced)
- Per task, ask: “Advisory or Enforced?”
- If not specified and user is unavailable, proceed in Advisory mode with conservative autonomy.

## Autonomy (Default: Conservative)
- Ask before: adding dependencies, using network, deleting/moving files, large refactors, schema/data migrations, secrets handling, or destructive commands.
- Safe without asking: small localized code/doc patches, comments, non‑destructive renames within the same module, local refactors limited to changed file.

## Planning & Communication
- Planning: If not specified, ask whether to create a multi‑step plan. Use `update_plan` when approved.
- Progress: Keep updates brief; explain grouped actions before running tools.
- Tone: Concise, direct, friendly; include rationale only when non‑obvious.

## Testing & Validation
- Default now (A): Run tests for changed areas; add minimal tests if missing nearby. Ask if no obvious command.
- Target goal (B): Full test suite before finish (enabled on request).
- Skips: User may request skipping tests for a task.
- Commands: Detect per repo (e.g., `pnpm/npm/yarn test`, `pytest`, `go test`); if unclear, ask.
- Do not add new test frameworks without approval.

## Documentation Protocol
- Default docs: Minimal. Update docs only for user‑visible or breaking changes; ask if unsure. No changelog by default.
- Strict docs (opt‑in per task): For major changes, spend up to ~10 minutes updating README/usage and brief migration notes; prompt at commit time to enable this.

## Change Boundaries
- Protected paths: none declared. Still ask before touching infra/CI/release pipelines or cross‑repo scripts.
- Avoid unrelated refactors; keep diffs focused on the task.

## Tooling & Commands
- Discover per‑repo: build/run/test/lint/format commands. If not obvious, ask instead of guessing.
- No networked commands (installs, downloads, API calls) without explicit approval.

## Security & Data
- Never print or commit secrets; redact tokens/keys. Use environment variables where required.
- Treat external data and PII as restricted; ask before exporting or transmitting.

## Definition of Done
- Changed‑area tests pass (or approved skip) and build/lint checks pass if configured.
- Docs updated per the selected protocol for the task.
- Plan (if created) marked completed in `update_plan`.

## Fallbacks
- If user is unavailable: Advisory mode, conservative autonomy, minimal docs, changed‑area tests only.
- If repo conventions are unknown: ask; if still unclear, propose options before proceeding.
