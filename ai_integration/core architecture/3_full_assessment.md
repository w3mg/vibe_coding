# About this project
This is cleanup project to create a good plan for creating a fresh branch called feature/ai-skill-202501A and bring the BEST aspects
  of what's been done over into it. and then execute on that plan. it must go iteratively.

## LAST REVISED 20260104 12:38PM CENTRAL TIME

## Success Criteria FOR ALL EFFORTS GOING FORWARD ON THIS PROJECT (from documentation)

1. Best aspects of each branch are examined and used
2. Architecture is easy to build/support for humans and LLM agents
3. Easy to decouple and reuse skills/agents
4. Clear terminology (prefer "agent skill/module" over "widget")
5. Architecture reflects business context
6. Flexible while simple and practical
7. End up with one branch to work from
8. Work iteratively to keep from bloating the architecturing or getting off course
9. work in small incremental steps to prevent getting off course.

###THIS CURRENT DOCUMENT SERVES AS THE  Single source of truth for agent skills across branches and docs in order to move forward. 

 First draft is  is built from:
- `core architecture/1_claude_EVALUATION REPORT_ Agent Skills Implementation State.md`
- `core architecture/2_codex_review.md`
- `core architecture/3_full_assessment.md`

The two source files above are archived under `/ARCHIVE-DO-NOT-READ/` and were removed from the active set after consolidation.

The code we are evaluating is: `/Users/scottilevy/Development/resultmaps-web`

---


## CORE VALUES TO USE WHEN MAKING DECISIONS

- Use industry-accurate terms: "agent skill" or "agent module" (not "widget")
- Modular, reusable without copy-paste
- Callable by parent agents without code duplication
- Docs must reflect what actually exists
- Simple, pragmatic and efficient approach

---
## ALWAYS

- Always use core values to guide decisions and choices before they are presented

---
## NEVER

- Never present options that would violate the core values
- Never add unnecessary complications to the coding approach
- Never use jargon when simple language will do

---
## OPEN TODOS

- TODO-001: Review `agent_type` naming and routing for alignment with skill/agent architecture (customer_to_cash, scorecard_measurables).
- TODO-002: Define a strategy for pulling the best working elements from reviewed branches into the central branch.
- TODO-003: Update `/doc` with the ultimate functionality once the architecture is finalized.
- TODO-004: After inventory/strategy, decide whether to adjust the `/llm` path for clearer naming and potential future use of smaller models.
- TODO-005: Update or migrate docs that reference sandbox-only AI entry points once replacements are chosen.
- TODO-006: Decide the fate of `/sandbox/test_llm_chatbot_simple`: move it into the launchpad as the official simple chatbot container or delete it.
- TODO-007: Decide the fate of `/sandbox/test_weekly_prep_conversation`: delete it or move it out of sandbox as archived reference (no routes/UI links).

---
## CURRENT STATE SNAPSHOT (AS OF THIS DOCUMENT)

- Branch: `feature/ai-architecture-foundation`.
- Source of truth: this document and the launchpad view (`resultmaps-web/app/views/agents/launchpad.html.erb`).
- Launchpad UI lives in `resultmaps-web/app/views/agents/launchpad.html.erb` and is the roadmap surface.
- Status sections: Working, Planned, Reference Only DO NOT USE.
- Agent vs skill: agent = orchestrator/runner; skill = user-facing capability selected by the agent.
- Working skills listed: Core Values - Onboarding, Customer-to-Cash (working, embedded only).
- Planned skills listed: Team Headlines, Scorecard Updater, Team Issues, Braindump Organizer, Weekly Todo Review, (Personal) Prioritizer Review.
- Working workflows listed: Vision Confirmation (EOS + Non-EOS), Vision Confirmation - Onboarding, Goals - Onboarding, Scorecard - Onboarding.
- Planned workflows listed: Weekly Meeting Prep, Quarterly Meeting Prep, App Guide.
- Reference only: `weekly_prep_archive_poc` (no routes; deprecated POC).
- Weekly prep conversational UI is deprecated and should not be linked from UI.
- Sandbox routes are POC/test only and are not production entry points.
- Current production UI entry points for this scope: `/agents/launchpad`, `/agents/vision`, `/agents/core_values`, `/agents/goals`, `/agents/scorecard`, `/teams/vision_organizer_eos_support`, `/teams/vision_organizer_svep`.

## KNOWN GAPS / WHAT IS NOT YET COMPLETE

- Full inventory of all existing LLM/agent entry points (routes + UI links) is not completed.
- Customer-to-cash is embedded in scorecard onboarding and has no standalone UI entry point.
- Sandbox test entry points still exist and need decisions per TODO-006/007.

---
## NEXT SESSION PROMPT (COPY/PASTE)

Review `vibe_coding/ai_integration/core architecture/3_full_assessment.md` and `resultmaps-web/app/views/agents/launchpad.html.erb`. Verify the CURRENT STATE SNAPSHOT against the codebase (routes, controllers, views, sandbox test pages). Identify any missing or incorrect entry points and update the launchpad list and OPEN TODOS accordingly. Use core values and the ALWAYS/NEVER rules; do not introduce new architecture options beyond what is already documented unless explicitly requested.

---
## HOW THE CODE WAS DEVELOPED AND WHY THERE ARE MULTIPLE BRANCHES 
- Patrick did an inital pass as a discovery exercise, attempting to conversationalize our weekly meeting prep form since it includes many components - measurables, rocks, to-dos, headlines and issues,this first-pass implementation lives on `feature/agents_scorecard_updater` and includes the agent code paths (`app/models/agents/`, `app/controllers/api/agents/`, `public/assets/javascripts/agents/`).
- The approach was too tightly coupled to work, and far too much work for users
- Scott wants to update and standardize the approach to the architecture and docs to be modern and easy to support
- The `implement-team-headlines-skill-pTibc` branch represents an attempt at a truly standalone skill (team headlines) that follows this decoupled philosophy, scott's concern is that may be overengineered and doesn't even have a way to check it's work yet.
- That branch is the discovery build; it works, but the approach and code quality are not acceptable for long-term use.

---

## Branch Availability (explicit)

These branches were deleted (not present locally or in `git branch -a`). Prior docs already noted they are missing:
- `origin/claude/evaluate-agent-skills-6ejXB`
- `origin/claude/review-agent-component-docs-pTibc`

Present and reviewed:
- `origin/feature/agents_scorecard_updater`
- `origin/claude/implement-team-headlines-skill-pTibc`
- `origin/claude/review-agents-scorecard-nL8VJ`
- `master`

---

## Branch Inventory

| Branch | Has Code | Has Docs | Merged to Master |
|--------|----------|----------|------------------|
| `feature/agents_scorecard_updater` | Yes | Yes | No |
| `implement-team-headlines-skill-pTibc` | Yes (4 files) | Yes | No |
| `review-agents-scorecard-nL8VJ` | No | Yes | Yes (PR #411) |
| `master` | No agent code | Yes (docs only) | N/A |

---

## Scorecard Updater Spec Criteria Check (Agents Scorecard Updater.md)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Update all owned measurables (bulk + sequential) | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Bulk mode requires confirmation before write | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Explicit confirmation before any write | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Values persisted via existing Scorecard API | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Parsing handles messy input | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Modular/reusable without copy-paste | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| No unhandled exceptions or silent failures | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Easy to maintain/port | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |
| Callable by parent agents without duplication | Unknown | Implementation exists on `feature/agents_scorecard_updater`; not assessed here |

---

## Key Design Difference Between Branches

| Aspect | `review-agents-scorecard-nL8VJ` | `implement-team-headlines-skill-pTibc` |
|--------|--------------------------------|----------------------------------------|
| Headlines file | `agents-scorecard-headlines.md` | `agents-team-headlines.md` |
| Headlines approach | Shows scorecard data first, then asks for headlines | Standalone, just asks for headlines |
| Terminology | "modules" | "skills" (standalone, composable) |
| File names | `scorecard_headlines.rb` | `team_headlines.rb` |
| JS class | `ScorecardHeadlinesModule` | `TeamHeadlinesSkill` |

Master adopted the team headlines doc naming and the standalone skill language in `doc/llm_and_ai_features/agents-architecture.md`.

---

## Branch: `implement-team-headlines-skill-pTibc`

### Code Files (4 files, 355 lines added)

| File | Purpose |
|------|---------|
| `app/models/agents/modules/team_headlines.rb` | Business logic, direct Claude API calls |
| `app/controllers/api/agents/team_headlines_controller.rb` | HTTP endpoints, API auth |
| `public/assets/javascripts/agents/team_headlines.js` | Frontend skill class |
| `config/routes.rb` | 2 routes added |

### Routes Added

- `GET /api/agents/team_headlines/init`
- `POST /api/agents/team_headlines/message`

### Code Analysis

**Good:**
- Clean separation: module handles logic, controller is thin
- Standalone design, no dependencies on other skills
- Proper retry handling for API calls
- Uses `[QUICK_REPLY]` and `[TRIGGER_*]` command pattern

**Problems:**
- Calls Claude API directly (`RestClient.post`) instead of shared framework
- Each skill must duplicate API call logic (not DRY)
- Uses `require_api_authentication` + `allow_cors` + `skip_before_filter :verify_authenticity_token`

### Doc Files on This Branch

| Doc | Matches Code? |
|-----|---------------|
| `agents-team-headlines.md` | Partial |
| `agents-architecture.md` | No |
| `agents-scorecard-updater.md` | No code exists |
| `agents-team-issues.md` | No code exists |
| `agents-controller.md` | Yes (different system - onboarding) |

### Doc/Code Mismatches

| Item | Doc Says | Code Does |
|------|----------|-----------|
| Authentication | `before_filter :authenticate_user!` | `before_filter :require_api_authentication` |
| API calls | `Agents::AgentsWidget.message(...)` | Direct `RestClient.post` to Claude API |
| Shared framework | Uses `Agents::AgentsWidget` class | No shared framework exists |

### Evaluation vs Success Criteria

| Criterion | Status | Notes |
|-----------|--------|-------|
| Decoupled/reusable | Pass | Standalone, no dependencies |
| Clear terminology | Pass | Uses "Skill" suffix |
| Easy to build/support | Partial | Pattern is clear, but requires duplicating API code |
| Docs match code | Fail | Auth and API pattern don't match |
| DRY/no copy-paste | Fail | Each skill must copy Claude API call logic |
| Callable by parent agents | Partial | Standalone module methods exist, but no shared framework or router to call without custom integration |
| Architecture reflects business context | Pass | Standalone skill aligns with weekly meeting workflow and can be composed per team needs |

### Core Values Check (Headlines Code)

| Value | Status | Notes |
|-------|--------|-------|
| Industry-accurate terms | Pass | Uses "Skill" naming in JS |
| Modular/reusable without copy-paste | Fail | Direct API logic duplicated per skill |
| Callable by parent agents | Partial | Not designed for orchestration beyond direct module calls |
| Stateless design | Partial | No AgentSession persistence, but uses session-based group fallback |
| Docs must reflect reality | Fail | Docs describe a framework that does not exist in code |

---

## Branch: `review-agents-scorecard-nL8VJ`

### Code Files

**None** — This was a documentation-only branch, already merged to master via PR #411. There are no agent code directories in this branch (`app/models/agents/`, `app/controllers/api/agents/`, `public/assets/javascripts/agents/`).

### Doc Files on This Branch

| Doc | Code Exists? |
|-----|--------------|
| `agents-architecture.md` | No (`agents_widget.rb` doesn't exist) |
| `agents-scorecard-updater.md` | No |
| `agents-scorecard-headlines.md` | No |
| `agents-team-issues.md` | No |
| `agents-controller.md` | Yes (matches onboarding code, not agent skills) |

### Why This Branch Still Matters

Even though this branch is docs-only and already merged, it provides the the future state of how the agent should  docs must be organized, and and where updates should be made as the architecture evolves (architecture doc, per-skill docs, and the controller doc for onboarding).

### Design Differences from Headlines Branch

This branch describes headlines as `scorecard_headlines` — a skill that:
1. Shows user's scorecard measures and goals
2. Asks for headlines based on that context

The headlines branch describes headlines as `team_headlines` — a standalone skill that:
1. Just asks if user has headlines
2. No scorecard context required

### Evaluation vs Success Criteria

| Criterion | Status | Notes |
|-----------|--------|-------|
| Docs match code | Partial | Skills architecture doesn't exist; `agents-controller.md` matches onboarding code |
| Clear terminology | Mixed | Uses both "modules" and "skills" |
| Architecture reflects business | Pass | Good business context documentation |

---

## Master Branch State

| Item | Status |
|------|--------|
| `app/models/agents/` directory | Does not exist |
| `app/controllers/api/agents/` directory | Does not exist |
| `public/assets/javascripts/agents/` directory | Does not exist |
| `doc/llm_and_ai_features/agents-*.md` files | Exist (from PR #411), including `agents-team-headlines.md` (not `agents-scorecard-headlines.md`) |

Master has documentation describing an architecture that has never been implemented.

---

## Critical Findings

### 1. Two Different Headlines Approaches
- Scorecard-Headlines (scorecard branch): shows measures/goals first, then asks for headlines
- Team-Headlines (headlines branch): standalone, just asks for headlines

Master adopted the Team-Headlines approach in docs. This is consistent with the "standalone and composable" design principle.

### 2. Shared Framework Never Built
All docs describe `Agents::AgentsWidget.message()` as the shared API layer. This class was never created. The only working code (team_headlines) bypasses it with direct API calls.

### 3. Authentication Mismatch
- Docs: `before_filter :authenticate_user!` (session-based)
- Code: `require_api_authentication` + `allow_cors` + skip CSRF (API token-based)

This suggests the code was built for a different use case (external API access) than the docs describe (session-based web UI).

### 4. Terminology Inconsistency

| Component | Scorecard Branch | Headlines Branch | Master |
|-----------|------------------|-----------------|--------|
| General term | "modules" | "skills" | "skills" |
| Headlines file | scorecard_headlines | team_headlines | team_headlines |
| JS class pattern | `*Module` | `*Skill` | Mixed |

---

## Recommendations

### Option A: Adopt Direct API Pattern (Simpler)

Accept that each skill calls Claude API directly. Update docs to match.

**Pros:** Working code exists, simple pattern, no shared framework to maintain
**Cons:** Not DRY, API logic duplicated per skill

**Steps:**
1. Fix `agents-team-headlines.md` to show actual auth (`require_api_authentication`) and direct API calls
2. Update `agents-architecture.md` to remove `Agents::AgentsWidget` references
3. Merge team_headlines branch
4. Build scorecard_updater and team_issues following same pattern

### Option B: Build Shared Framework First

Create `Agents::AgentsWidget` as described in docs, then refactor team_headlines to use it.

**Pros:** DRY, consistent with docs, easier to maintain API logic
**Cons:** More work upfront, delays getting working skills

**Steps:**
1. Create `app/models/agents/agents_widget.rb` with shared `message()` method
2. Refactor team_headlines to use it
3. Decide on auth strategy (session vs API token)
4. Update docs if auth approach changes
5. Merge and build remaining skills

### Option C: Hybrid (Recommended)

Merge working code now, build shared framework as second skill is added.

Recommended because it ships working functionality now while preserving a clear path to DRY consolidation once a second skill is built.

**Steps:**
1. Fix team_headlines docs to match current code
2. Merge team_headlines branch
3. When building scorecard_updater, extract common API logic into `Agents::AgentsWidget`
4. Refactor team_headlines to use shared framework
5. Continue with team_issues

---

## Terminology Standardization Needed

| Current | Recommendation |
|---------|----------------|
| "Widget" in class names | Remove - use "Skill" or nothing |
| Mixed `*Module` / `*Skill` JS classes | Standardize on one (suggest `*Skill`) |
| `agents_widget.rb` file name | Rename to `agent_framework.rb` or `agent_core.rb` |

---

## Summary Table

| Branch | Code | Docs | Doc/Code Match | Recommended Action |
|--------|------|------|----------------|-------------------|
| `implement-team-headlines-skill-pTibc` | Working | Present | Mismatched | Fix docs, merge |
| `review-agents-scorecard-nL8VJ` | None | Present | N/A | Already merged |
| `master` | None | Present | No code | Merge headlines branch |

---

## Next Steps (Priority Order)

1. Fix team_headlines docs to match actual code (auth method, direct API calls)
2. Decide on auth strategy — session-based (`authenticate_user!`) or API token (`require_api_authentication`)
3. Merge team_headlines branch to master
4. Build scorecard_updater following team_headlines pattern (or build shared framework first)
5. Standardize terminology — pick "Skill" and use it consistently
6. Update architecture docs to reflect reality (no shared framework, or document it when built)

---

## AGREED ACTION STEPS

1. Define the first UI surface for the initial working feature.

---

## DECISIONS MADE DURING THE PROJECT

**Terminology: "agent" and "skill"**

- **Skill** is the durable label for a discrete, user-facing capability. It describes what the feature does without implying how it is orchestrated or implemented.
- **Agent** is reserved for the orchestrator/runner that invokes skills. This avoids conflating the feature with the system that routes or coordinates it.
- **Why this split:** Using "skill" keeps the feature name stable even if the orchestration architecture changes. Using "agent" only for the orchestrator prevents misleading labels and keeps internal plumbing clearly separated from user-facing functionality.

**Branching decision**

- **New branch:** `feature/ai-architecture-foundation` in `resultmaps-web`
- **Why:** Create a clean, centralized place to assemble working features and pull only the needed elements from prior branches.

**Launchpad decision**

- **UI entry point:** `/agents/launchpad`
- **Why:** Clear internal testing surface for agents/skills without implying end-user readiness.
- **Role:** Launchpad is the roadmap surface for planned skills and agentic workflows.
- **Roadmap source:** The roadmap is tracked in `resultmaps-web/app/views/agents/launchpad.html.erb` on `feature/ai-architecture-foundation` to keep things simple and not invent the need for more functionality.
- **Status icons:** Planned items use an empty checkbox icon; delivered items will use a checked icon.
- **Working flows tracked here:** Vision Confirmation (`/teams/vision_organizer_eos_support`, `/teams/vision_organizer_svep`), Vision Confirmation - Onboarding (`/agents/vision`), Core Values - Onboarding (`/agents/core_values`), Goals - Onboarding (`/agents/goals`), Scorecard - Onboarding (`/agents/scorecard`).
- **Reference only:** `weekly_prep_archive_poc` (`/agents/weekly_prep`) is retained only as a reference due to unusable flow.

**Group context routing (background)**

- `group_id` routes exist to allow explicit team context when the entry point is external (e.g., email or deep link).
- This applies to agent endpoints themselves, not the launchpad UI.

**Dashboard/launchpad guidelines**

- Use the existing dashboard tile pattern (no new layout/partials).
- Separate tiles into Working, Planned, and Reference Only sections.
- Reference Only tiles may be linked if they are clearly disclaimed in the UI with the “reference only” badge.

**Terminology example (agent vs skill)**

We reviewed the onboarding scorecard flow to decide how to label it. The page `/agents/scorecard` renders the shared LLM chatbot UI, and the chatbot uses `agent_type` values like `scorecard_measurables` and `customer_to_cash` to select what work happens. The agent here is the chatbot runner and the session/router that uses `agent_type` to choose behavior; the skill is the specific capability selected by that `agent_type` (for example, customer‑to‑cash or scorecard measurables). This means the flow should be listed as a skill even when it is embedded inside another UI, and “agent” should be reserved for the orchestrator that routes between skills.

**Reference note**

- `scorecard_measurables` is a reference for an agentic flow only; the current pattern is clunky and not a target user experience.


