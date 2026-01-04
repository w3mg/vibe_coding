# AI Skills Architecture - Chosen Approach and Project Plan

## LAST REVISED 20260104

## Overview

Rename existing infrastructure, don't add new layers.

---

## Routes

- `/api/llm/*` → `/api/skills/*`
- Keep `/agents/*` UI routes as-is
- Add redirect from old `/api/llm/*` paths during transition (remove after 30 days)

---

## Controller

- Rename `Api::LlmController` → `Api::SkillsController`
- Add skill registry: route `agent_type` param to skill class via convention (`"#{agent_type}_skill".classify.constantize`)
- Fallback to existing `LLM.enhanced_message` for unregistered agent_types (backward compatibility)

---

## Models

- `app/models/llm.rb` stays as `LLM` (internal AI client layer, not user-facing)
- `AgentSession` unchanged
- Add skill classes flat in `app/models/`: `team_headlines_skill.rb`, `scorecard_updater_skill.rb`, etc.
- Each skill class implements:
  ```ruby
  def self.call(user, group, message, session)
    # Build prompt, call LLM.chat or LLM.enhanced_message, return response
  end
  ```
- Skills call `LLM` for API interactions; `LLM` is shared infrastructure, skills are business logic

---

## Views

- Rename `app/views/shared/_llm_chatbot.html.erb` → `_skill_chat.html.erb`
- Rename `app/views/shared/_llm_chatbot_simple.html.erb` → `_skill_chat_simple.html.erb`
- Update all 5 agent views that render these partials
- JS: rename `LlmChatbot` class → `SkillChat` in associated JS files

---

## Docs to Update

- `doc/enhancements/agents-architecture.md`: remove `Agents::AgentsWidget` references (doesn't exist), document actual structure
- `doc/enhancements/agents-team-headlines.md`: update to match skill class pattern
- `doc/enhancements/agents-scorecard-updater.md`: update to match skill class pattern
- `doc/enhancements/agents-team-issues.md`: update to match skill class pattern
- `doc/llm_and_ai_features/*.md`: replace "llm_chatbot" with "skill_chat" where referencing UI

---

## Branch Strategy

- All work on `feature/ai-architecture-foundation`
- Merge to `master` when complete
- Other branches (`feature/agents_scorecard_updater`, `implement-team-headlines-skill-pTibc`) are reference only; cherry-pick useful code, do not merge

---

## Implementation Sequence

1. Rename controller + update routes (add redirects)
2. Rename view partials + update references
3. Add first skill class (`CustomerToCashSkill`) by extracting from `LLM.enhanced_message`
4. Update docs to match reality
5. Add remaining skill classes as needed
6. Remove redirects after transition period

---

## Why This Approach

- No new directories
- No new abstractions beyond skill classes
- All user-facing terminology is business-focused (skills, not llm)
- Internal `LLM` class name is accurate (it IS an LLM client)
- Skills are modular, testable, callable by parent agents
- Preserves agent/skill distinction: controller = agent (orchestrator), skill classes = skills (capabilities)
- Docs will match code after step 4
