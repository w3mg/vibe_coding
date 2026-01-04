# Codex Review: Agent Skills Architecture Alignment

## Context and scope
This note is intended to summarize architectural and documentation conflicts across three sources related to ResultMaps AI agent skills, and outlines decisions needed to finalize the system architecture without coding. It is intended to be readable without prior project context.



## Values to use making decisions
- Prefer industry-accurate terms over internal jargon. Background: You asked, "look if someone from open ai or anthropic came to my team, would they call it a widget? or something else, what's the best most accurate term. not internal jargon" and I answered: "They would not call it a widget. The most accurate non-jargon term is agent skill or agent module. For the UI, say embedded chat interface or agent chat UI. For the system, say agent framework."
- Related todo: rename elements in both relevant /doc and develop a renaming plan for any affected architecture.

## Branch reviews (resultmaps-web)

### Branch availability
- Missing from repo: `origin/claude/evaluate-agent-skills-6ejXB` and `origin/claude/review-agent-component-docs-pTibc` (referenced in the Claude evaluation report but not present in `/Users/scottilevy/Development/resultmaps-web`).
- Present and reviewed: `origin/claude/implement-team-headlines-skill-pTibc`, `origin/claude/review-agents-scorecard-nL8VJ`.

### `origin/claude/implement-team-headlines-skill-pTibc`
**Code changes**
- Adds Team Headlines skill implementation:
  - `app/models/agents/modules/team_headlines.rb` (direct Claude API call, no shared agent framework usage).
  - `app/controllers/api/agents/team_headlines_controller.rb` (uses `allow_cors`, `require_api_authentication`, skips CSRF).
  - `public/assets/javascripts/agents/team_headlines.js` (class `TeamHeadlinesSkill`, processes quick replies client-side).
  - Routes added in `config/routes.rb` for `/api/agents/team_headlines/init` and `/api/agents/team_headlines/message`.

**Docs review (from `/doc` folder)**
- `doc/llm_and_ai_features/agents-team-headlines.md` describes a module that uses `Agents::AgentsWidget` and `before_filter :authenticate_user!`, which conflicts with the branch’s direct API call and auth strategy. This is a terminology and architecture mismatch between doc and code.

### `origin/claude/review-agents-scorecard-nL8VJ`
**Docs changes**
- Updates/adds agent docs:
  - `doc/llm_and_ai_features/agents-architecture.md`
  - `doc/llm_and_ai_features/agents-scorecard-updater.md`
  - `doc/llm_and_ai_features/agents-team-issues.md`
  - `doc/llm_and_ai_features/agents-scorecard-headlines.md` (new doc added in this branch)

**Code review (current `master` workspace)**
- The documented agent framework paths do not exist in the codebase:
  - Missing directories: `/Users/scottilevy/Development/resultmaps-web/app/models/agents`, `/Users/scottilevy/Development/resultmaps-web/app/controllers/api/agents`, `/Users/scottilevy/Development/resultmaps-web/public/assets/javascripts/agents`.
  - This means the docs in this branch describe an architecture that is not present in code on `master`.
