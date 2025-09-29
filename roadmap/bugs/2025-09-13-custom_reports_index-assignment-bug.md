Title: Api::CustomReportsController#index uses assignment instead of comparison
Author: Codex (LLM) — requires human verification
Created: 2025-09-13

Location
- File: app/controllers/api/custom_reports_controller.rb
- Line: in `index`, branch `elsif @reportable = @api_user` (assignment)

Impact
- Branch selection can be incorrect. When neither Group nor Measure reportable are matched, the controller may assign and fall through to the wrong branch, causing index to default to current-user reports unexpectedly.

Proposed Fix
- Change assignment to comparison: `elsif @reportable == @api_user`.
- Add a functional controller test covering all index branches:
  - reportable_type=Group (with view rights)
  - reportable_type=Measure (owned or viewable)
  - no reportable_* params (defaults to current user)

Risk
- Low. The change corrects a logic bug; behavior for existing valid Group/Measure calls remains the same.

Tests
- Add/extend tests in `test/functional/api/custom_reports_controller_test.rb`:
  - Verify GET /api/custom_reports?reportable_type=Group&reportable_id=<id> returns only group-scoped reports for the current user.
  - Verify GET /api/custom_reports?reportable_type=Measure&reportable_id=<id> returns the measure’s custom_report (or nil) when viewable.
  - Verify GET /api/custom_reports (no reportable) returns the current user’s reports.
  - Include permission checks (unauthorized when not viewable/owner).

Acceptance Criteria
- The incorrect assignment is replaced with a comparison.
- All three branches are exercised by tests and pass.
- No regressions in existing API behavior (manual spot-check acceptable).

Notes
- Auth and CORS are managed via ApplicationController; no changes required.
- This ticket was authored by Codex; please verify analysis before implementation.

