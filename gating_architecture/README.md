# Feature Gating Architecture

## Purpose
Identify and document the simplest, most maintainable way to gate ResultMaps features based on Stripe payments, while aligning with the current Rails 2.3 codebase and minimizing risk.

## What’s Here
- `current_state_draft1.md` — Initial mapping of how gating works today.
- `versions/simple_solution.md` — Early proposal patterns (flags, plan checks, soft gates).
- `approach_rating.md` — Self-assessment of early approaches.
- `simple_solution_v2.md` — A tighter “one-method” direction.
- `current_state_v3.md` — Clean, code-accurate summary of the current system (v3).
- `simple_solution_v3.md` — Finalized, minimal solution proposal (v3) with rollout and test plan.
- `approach_rating_v3.md` — v3 self-assessment with criteria and justifications.

## How to Use This Folder
- Start with `current_state_v3.md` to understand the existing gates and flows.
- Read `simple_solution_v3.md` for the recommended minimal approach and rollout.
- Use `approach_rating_v3.md` for decision-making and tradeoffs at a glance.

## Goals
- Keep one source of truth for “paid access”.
- Preserve existing exemptions and policies (admins, paid accounts, skip lists).
- Avoid DB schema changes; prefer minimal, surgical code edits.
- Provide a reversible rollout plan with clear test steps.
