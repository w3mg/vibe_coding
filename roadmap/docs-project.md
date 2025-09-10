# User‑Facing Documentation Initiative

Status: Backlog
Owner: TBD
Stakeholders: ResultMaps team, Support, Engineering
Last Updated: 2025-09-05

Problem
- We lack user‑facing documentation; knowledge lives in internal notes and slack messages.
- This slows onboarding, increases support load, and creates inconsistent workflows.

Goals (outcomes)
- Provide clear, searchable docs that enable users to self‑serve.
- Reduce “how do I…?” support pings by 30–50% within a release cycle.
- Establish a repeatable docs workflow (templates + CI checks).

Scope (initial)
- Convert internal help text to user‑facing guides.
- Cover: Getting Started, common How‑Tos, Reference for key APIs/CLI, Troubleshooting.
- Start with high‑impact surfaces (e.g., resultmaps‑web usage), without bloating that repo.

Non‑Goals (initial)
- Full website rebrand or custom docs platform build.
- Exhaustive API reference for all services.

Deliverables
- IA (information architecture) and lightweight style guide.
- Docs templates (how‑to, reference, troubleshooting, migration note).
- Initial content inventory + prioritized list.
- Drafts for top 3–5 tasks and one reference page.

Proposed Phases & Estimates
1) Inventory & IA (4–6 hours)
   - Gather internal notes, runbooks, slack snippets; cluster by task.
   - Propose IA and template set.
2) Templates & Workflow (2–4 hours)
   - Markdown templates, PR checklist, optional snippet tests in CI.
3) Draft Key Pages (1–2 days)
   - Getting Started; 3–5 How‑Tos; 1 Reference; Troubleshooting starter.
4) Review & Publish (2–4 hours)
   - Stakeholder review; link from READMEs; announce internally.

Minimal‑Overhead Policy (default)
- Keep changes small; update docs only for user‑visible or breaking changes.
- Ask before enabling strict protocol for a given task.

Strict Protocol (opt‑in per task)
- For major changes, spend up to ~10 minutes updating README/usage and brief migration notes.
- Block completion until strict items are addressed.

Implementation Options
- Start here in `vibe_coding/docs/` (cross‑repo) with links to code.
- Or add per‑repo `docs/` with a shared style guide here.

Intake & Next Steps
- Option A: Provide sample internal help text; convert to user‑facing draft.
- Option B: Approve scaffolding of `docs/` structure + templates.
- Decision needed: Preferred hosting (repo docs vs centralized) and style preferences.

Decision Log
- 2025‑09‑05: Logged initiative; default minimal overhead with strict opt‑in.

