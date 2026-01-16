---
name: rm-doc-rate
description: Rate resultmaps-web documentation in doc/ for clarity, accuracy, and completeness. Use when asked to review, grade, or audit resultmaps-web docs against the codebase, especially files under doc/ that need scored feedback and improvement guidance.
argument-hint: <filename(s) in doc/>
---

# Resultmaps Doc Rating

## Overview

Review one or more files in `resultmaps-web/doc/`, verify claims against the codebase, and provide ratings with actionable improvements.

## Workflow

1. Change into the repo: `cd ~/Development/resultmaps-web`.
2. Read the target doc file(s) in `doc/` carefully.
3. Search `doc/` for related keywords and read any matching docs; note cross-references.
4. Follow any references in the doc to confirm accuracy:
   - Open cited code/config files.
   - Search the codebase for relevant behavior or APIs; include `app/` and `public/assets/` when UI behavior is claimed.
   - Search `test/` for unit tests related to the documented behavior (Rails uses test/, not spec/).
5. Note discrepancies, missing details, unclear sections, and uncited claims.
6. Produce the required output format for each file.

## Rating Criteria

### Clarity (1-10)
- Keep related elements together.
- Ensure a novice or another LLM can follow quickly.
- Maintain logical structure and clear headings.
- Avoid jargon or explain it directly.
- Keep citations under the relevant headings.

### Accuracy (1-10)
- Match behavior and structures in the codebase.
- Mark hypotheses or guesswork explicitly.
- Cite relevant files or locations where appropriate.
- Call out outdated or incorrect statements.
- Require a last-updated stamp; it must be a full date (YYYY-MM-DD), not just month/year.
- Put unknowns in a dedicated section when needed.

### Completeness (1-10)
- Cover all relevant aspects of the topic.
- Include edge cases, limits, and constraints.
- Identify missing details a reader would need.
- Include and cite all relevant related files.
- Include cross-references to related docs in `doc/` where relevant.
- Check other files in `doc/` to identify missing cross-references.

## Scoring Philosophy

Rate based on practical utility, not theoretical completeness:
- Would a developer new to this codebase find what they need?
- Would an LLM be able to use this doc to reason about the system?
- Are the gaps actually blocking understanding, or just "nice to have"?

Do NOT suggest:
- Splitting docs unless consolidation is genuinely hurting usability
- Documenting edge cases that aren't encountered in practice
- Performance notes unless there's evidence of actual issues
- Hypothetical improvements that add bulk without value

## Output Format

For each file reviewed, use this structure:

**File**: `doc/<filename>`

**Summary**: Brief description of what the doc covers

**Ratings**:
| Criterion | Score | Justification |
|-----------|-------|---------------|
| Clarity | X/10 | brief justification |
| Accuracy | X/10 | brief justification |
| Completeness | X/10 | brief justification |

**Key Issues**: List specific problems found

**Path to 10/10**: For any score below 10, list the specific changes needed:
- Clarity improvements needed: list if < 10
- Accuracy improvements needed: list if < 10
- Completeness improvements needed: list if < 10

**Recommendations**: Prioritized, actionable improvements. For each suggestion, rate its impact on a scale of 1-10. Only include suggestions that rate 8/10 or higher in impact. Must include adding a Sources section to the reviewed doc with explicit file paths. If all scores are 10/10, omit this section entirely.

**Sources Consulted**: List all sources consulted (doc + code/config)

## Output Quality Gate

Before writing or proposing any output, rate it on a 1-10 scale for clarity, accuracy, and completeness. If any score is below 10/10, revise until all three are 10/10, then present the output. Always include the Ratings section in the final output.

## Notes

- If a file does not exist in `doc/`, say so and ask for the correct filename.
- Keep the review concise but evidence-based; cite code paths when needed.
