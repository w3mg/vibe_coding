# MCP Server for ResultMaps

**Last updated:** 2026-01-13

## Purpose

An MCP server that connects ResultMaps data to AI assistants (Claude, ChatGPT). Enables conversational access to client activity and engagement data.

## Scope

**Phase 1:** Personal tool for Scott (user_id=1) to stay on top of Elite Integration clients.

**Phase 2:** TBD - potential extension to other users or connector patterns.

## Success Criteria (V1)

1. MCP server runs and connects to Claude and ChatGPT
2. Authenticates to ResultMaps API
3. Supports team filtering to scope which clients are visible
4. Surfaces basic activity data for filtered teams

## Related Resources

ResultMaps web application lives at `~/Development/resultmaps-web/`.

- Core architecture: `~/Development/resultmaps-web/doc/guidelines-core-product-architecture.md`
- Doc folder guidelines: `~/Development/resultmaps-web/doc/guidelines-doc-folder-usage.md`

### API Documentation Inventory

All at `~/Development/resultmaps-web/doc/api/`:

- `api-assignments.md`
- `api-authentication.md`
- `api-big-picture.md`
- `api-communication.md`
- `api-custom-contents.md`
- `api-custom-reports.md`
- `api-day-plan-actions.md`
- `api-day-plan-columns.md`
- `api-goals.md`
- `api-groups.md`
- `api-integrations-hooks-webhooks.md`
- `api-integrations-nango.md`
- `api-integrations-slack.md`
- `api-items-v3.md`
- `api-items.md`
- `api-labels.md`
- `api-linked-urls.md`
- `api-material-categories.md`
- `api-measures.md`
- `api-object-metas.md`
- `api-preferences.md`
- `api-projects-roadmap.md`
- `api-result-areas.md`
- `api-scorecard-grids.md`
- `api-search.md`
- `api-seats-snapshots.md`
- `api-sessions-auth.md`
- `api-stripe-discord.md`
- `api-templates.md`
- `api-today-journal.md`
- `api-todo-list.md`
- `api-typeform.md`
- `api-users.md`
- `api-weekly-materials.md`

## Use Cases

| Use Case | Type | Notes |
|----------|------|-------|
| Create issue | Direct MCP tool | |
| Create todo | Skill | |
| Pull from personal prioritizer | Skill | |
| Pull all todos from a Level 10 | Direct MCP tool | |
| Pull my todos only from a Level 10 | Direct MCP tool | |
| Add todo to Level 10 for a given team | Direct MCP tool | |
| Add issue to Level 10 for a given team | Direct MCP tool | |
| Add todo to 1:1 for a given person | Direct MCP tool | |
| Add issue to 1:1 for a given person | Direct MCP tool | |
| Add item to a given project | Direct MCP tool | |
| Add issue to a given project | Direct MCP tool | |
| Read open items from a project | Direct MCP tool | |

**Type Legend:**
- **Direct MCP tool** - Data plumbing; the MCP server exposes a tool that returns/writes data
- **Empowered by MCP** - Ad-hoc AI reasoning; AI uses tools to analyze and answer
- **Skill** - Repeatable workflow invoked via `/skill-name`

## Things to Think About

From `RESEARCH Example MCP Approach.md`:

**Key pattern from the research:**
- Command matrix: entities (workspace, project, list, task) × verbs (list, get, create, update, delete)
- Auth via token + defaults in config
- JSON output for scripting, human output for interactive use

The research also suggests mapping ResultMaps entities (rocks, scorecards, meetings, etc.) to a similar command structure.

## Open Questions

- API authentication approach for MCP server
- Which activity data is most useful to surface first
