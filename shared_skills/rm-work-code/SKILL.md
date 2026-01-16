---
name: rm-work-code
description: Orient work in the resultmaps-web codebase; always check /doc for relevant documentation as well as the codebase.
metadata:
  short-description: ResultMaps codebase orientation
---

# RM Work Code

Use this skill to orient any task in the `resultmaps-web` codebase and ensure documentation is reviewed alongside code.

## Workflow

1. Confirm the repo path: `/Users/scottilevy/Development/resultmaps-web`.
2. Search `/Users/scottilevy/Development/resultmaps-web/doc` for keywords from the request and the feature name; read any relevant docs found.
3. Search the codebase (including `app/`, `config/`, and `public/assets/`) for the same keywords to locate implementation.
4. Cross-check docs vs code; call out mismatches with file + line references.
5. Summarize findings and list all docs consulted.

## Notes

- Prefer `rg` for searches.
- If a feature is UI/UX-related, always include `public/assets/` in searches.
- If a doc references endpoints or storage, verify in controllers/models and include line references.
