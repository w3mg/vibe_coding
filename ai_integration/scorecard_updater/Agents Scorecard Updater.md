# Scorecard Update Workflow via Chat Interface | Feature Specification

## Success Criteria

- [ ] User can update every measurable they own for the current week via either mode  
- [ ] Bulk mode never writes silently — confirmation table required first  
- [ ] Explicit user confirmation before any write  
- [ ] Values persisted correctly via existing Scorecard API  
- [ ] Parsing handles realistically messy input  
- [ ] Code is modular, reusable without copy-paste  
- [ ] No unhandled exceptions or silent failures  
- [ ] Easy to maintain or port to TypeScript, Python, or modern framework
- [ ] Callable by parent agents (router, meeting prep orchestrator) without code duplication

## Overview

Clarification: This specification should be treated as a collection/application of independent skills/agents, not a standalone monolith.

This feature introduces an AI-powered chat workflow for updating scorecard measurables. The scorecard is an object composed of multiple measurables, tracked weekly (similar to frames in a bowling or golf scorecard). Users can update their assigned measurables either one at a time or several at once.

**Key Points:**

- **Trigger**: User clicks a button to initiate the update process  
- **Interface**: Chat-based (in the page or in a modal), powered by Anthropic's API (already integrated)  
- **Channel**: New option alongside existing web forms and webhooks  
- **Design**: Modular — works standalone AND callable by parent agents (router, meeting prep orchestrator)  
- **Environment**: Ruby 1.9.3 / Rails 2.3, no migration planned

**Two Paths:**

- **Multiple at Once (Bulk)**: Fetch all assigned measurables, display with current values and targets, allow copy/paste updates with fuzzy parsing, require confirmation, batch save  
- **One at a Time (Sequential)**: Step through each measurable, show details, collect input, validate, save progressively

## Detailed Requirements

### **Entry Point**

- User navigates to their scorecard view in the SaaS dashboard  
- Clicks button labeled "Update This Week's Scorecard" (or equivalent)  
- Launches chat-style interface (in the page or in a modal)  
- Agent greets user and initiates workflow

### **Initial Choice Prompt**

- Agent asks: "Would you like to update several measurables at once, or go one at a time?"  
- User responds in natural language (e.g., "several," "bulk," "all at once," "one by one," or full sentences)  
- Agent interprets flexibly:  
  - Detects bulk intent (words like "several," "all," "bulk," "multiple") → bulk path  
  - Otherwise or if unclear → defaults to one-at-a-time path

### **Bulk Update Path ("Several at Once")**

1. Agent fetches user's assigned measurables for current week via API (transparent to user)  
     
2. Displays formatted list/table of all measurables:  
     
   - Measurable name (e.g., "Closed Won ARR")  
   - Target value (e.g., "$150,000")  
   - Last week's value (e.g., "$87,500" or "–" if none)  
   - Blank spot for new value

   

   Example output:

   

   Here are your measurables for this week:

   

   Closed Won ARR          Last week: $87,500    Target: $150,000    → \[new value here\]

   

   Meetings Held           Last week: 38         Target: 40          → \[new value here\]

   

   Pipeline Created        Last week: $420,000   Target: $500,000    → \[new value here\]

   

3. Agent instructs: "Copy this list, update the numbers with your new values, and paste it back to me. You can be a bit messy—I'll try to figure it out."  
     
4. User pastes updated version (can be imprecise — reordered, extra text, abbreviations like "120k", or just numbers if order matches)  
     
   Valid input examples:  
     
   - `"Closed Won ARR → 120k\nMeetings Held 45\nPipeline Created: 510,000"`  
   - `"120000\n45\n510k"` (positional matching if count aligns)  
   - `"45 meetings held\nclosed won arr 120,000\n510000 pipeline"`

   

5. Agent parses input (handles variations, units, fuzziness) and shows confirmation:  
     
   Got it\! Here's what I understood—I'll save:  
     
   • Closed Won ARR        → $120,000   (was $87,500)  
     
   • Meetings Held         → 45         (was 38\)  
     
   • Pipeline Created      → $510,000   (was $420,000)  
     
   Does this look right? Reply 'yes' to save, or anything else to cancel/edit.  
     
6. If parsing fails or ambiguous → agent asks for clarification: "I couldn't match 'xyz' to a measurable—can you try pasting again with more details?"  
     
7. On confirmation ("yes," "confirm," thumbs-up emoji) → agent updates via API → confirms: "All values saved successfully for this week\!"  
     
8. If canceled → offers retry or switch to one-at-a-time mode  
     
9. Chat ends or user exits manually

### **One-at-a-Time Update Path (Sequential)**

1. Agent fetches measurables via API  
     
2. Walks user through each sequentially:  
     
   - First: "Let's start with Closed Won ARR. Target: $150,000. Last week: $87,500. What's the new value for this week?"  
   - User enters value (e.g., "120000," "120k," "120,000")  
   - Agent confirms: "Got $120,000 for Closed Won ARR—saving that now."  
   - Proceeds to next: "Next: Meetings Held. Target: 40\. Last week: 38\. New value?"

   

3. Handles invalid inputs gracefully: "That's not a number—try again?"  
     
4. Supports skip commands ("skip" or "next")  
     
5. After all complete: "All measurables updated for this week\! Anything else?"

### **Error Handling and Robustness**

- Agent is forgiving: ignores extra text, normalizes units ("k" to thousands)  
- Falls back to one-at-a-time if bulk parsing fails completely  
- API failures: "Having trouble fetching your measurables—try again later?"  
- Conversation state maintained across messages (e.g., remembers current measurable in sequential mode)

---

## Technical Architecture

### Code Organization

```
app/models/agents/
  scorecard_updater.rb             # Module - all business logic (Agents::ScorecardUpdater)

app/controllers/api/agents/
  scorecard_updater_controller.rb  # Thin HTTP layer

app/views/agents/
  scorecard_updater.html.erb       # View (loaded by existing AgentsController)
```

Follows existing pattern: `app/models/discord/` for namespaced modules.

### Design Decisions

**Module, not model:** No database table. Pure behavior. Lives in `app/models/agents/` with future agents.

**Dedicated controller:** Thin wrapper that calls the module. Lives under `api/agents/` to keep agent-related code together. Two actions:
- `GET /api/agents/scorecard_updater/measurables` — returns user's assigned measurables
- `POST /api/agents/scorecard_updater/message` — processes chat turn, returns response

**Stateless:** No AgentSession persistence. Frontend manages conversation state. Each request includes full context needed for that turn.

**Parent agent callability:** Other agents call `Agents::ScorecardUpdater.method(...)` directly. No HTTP overhead.

**Portability:** Module contains pure Ruby. Controller is the only Rails-specific code.

### Backend Operations

1. **Fetch measurables** — returns user's assigned measurables with name, target, last week's value
2. **Chat** — sends message + context to Claude, returns response
3. **Save values** — batch save to MeasurableHistory (called when Claude emits save marker after user confirmation)

## Later Considerations — Only If Needed

- **Base agent class**: If shared behavior emerges across agents, extract a common base. Not needed until then.
- **Router agent**: Orchestrator that dispatches to child agents. Build when there are multiple agents to route between.

---

## Questions and Issues

### Issue #1: Session Storage Decision

**Decision:** No AgentSession persistence for scorecard updater.

**Rationale:** Unlike other agents (customer_to_cash, scorecard_measurables) which build artifacts refined over multiple sessions, scorecard updates are transactional. User enters numbers, confirms, done. No value in resuming last week's update session.

**Implication:** Cannot reuse existing `enhanced_message` flow which assumes session persistence. Need stateless endpoint where frontend manages conversation state. Each request includes full context needed for that turn.

**Status:** Decided
