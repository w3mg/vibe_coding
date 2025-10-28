# ResultMaps Modal Files - Accurate Reference Map

## Summary

24 modal definition files found in the codebase. This document provides a **verified and accurate** mapping of which modal files are used in which views and layouts.

**CRITICAL DISTINCTIONS:**
- **Bootstrap 2 vs Bootstrap 3 variants:** `_template_create_modal_ko.html.erb` (B2) vs `_template_create_modal_ko_b3.html.erb` (B3) are different files used in different layouts
- **Layout-level vs view-level includes:** Some modals are included at the layout level (available globally), others only in specific views

---

## Modal Definition Files (24 total)

### Item Modals (4)

#### app/views/items/_new_item_modal.html.erb
**Usage Status:** No references found (orphaned or dynamically loaded via AJAX)

#### app/views/items/_generic_modal.html.erb
**Used In:**
- Controllers: `app/controllers/goals_controller.rb`
- Views: `app/views/users/show.html.erb`, `app/views/users/show_old.html.erb`
- Widgets: `app/views/widgets/_global_modals.html.erb`, `app/views/widgets/_goal_form.html.erb`
- JavaScript: `public/assets/javascripts/application.js`, `public/assets/javascripts/today_index_utilities.js`, `public/assets/javascripts/w3mg_utilities.js`
- Self-reference: `app/views/items/_generic_modal.html.erb`

#### app/views/items/_bucket_config_modal.html.erb
**Used In:**
- `app/views/items/bucket_assignees.html.erb`
- `app/views/items/bucket_status.html.erb`
- Self-reference: `app/views/items/_bucket_config_modal.html.erb`
- Trigger link only: `app/views/items/_bottom_navigation.html.erb` (exposes the "Configure" button but does not render the modal itself)

#### app/views/items/_create_plan_modal.html.erb
**Used In:**
- `app/views/week_plan_actions/for_week.html.erb`
- `app/views/week_plan_actions/for_week_old.html.erb`
- JavaScript: `public/assets/javascripts/today_index_utilities.js`
- Self-reference: `app/views/items/_create_plan_modal.html.erb`

---

### Mission Modals (2)

#### app/views/missions/new_modal.html.erb
**Usage Status:** No references found (orphaned or dynamically loaded)

#### app/views/missions/new_from_modal.html.erb
**Usage Status:** No references found (orphaned or dynamically loaded)

---

### Widget Modals (12)

#### app/views/widgets/_workflow_modals.html.erb
**Used In:**
- `app/views/assignments/assigned_to_me.html.erb`
- `app/views/backups/items/project_milestones.html.erb` (line 2)
- `app/views/items/_heading.html.erb`
- `app/views/items/_heading_b3.html.erb`
- `app/views/items/project_milestones.html.erb`
- JavaScript: `public/assets/javascripts/w3mgui.js`
- Tests: `test/functional/activity_feeds_controller_test.rb`

#### app/views/widgets/_work_session_alignments_modals.html.erb
**Used In:**
- `app/views/groups/organizer.html.erb`
- `app/views/groups/scorecard.html.erb`
- `app/views/today/dashboard.html.erb`
- `app/views/work_sessions/view.html.erb`
- Self-reference: `app/views/widgets/_work_session_alignments_modals.html.erb`

#### app/views/widgets/_template_create_modal_ko.html.erb
**BOOTSTRAP 2 VERSION**
**Used ONLY In:**
- `app/views/layouts/perspective.html.erb` (line 122)

**Note:** This is the original Bootstrap 2 variant, used ONLY in the perspective layout. All other layouts use the B3 variant.

#### app/views/widgets/_template_create_modal_ko_b3.html.erb
**BOOTSTRAP 3 VERSION**
**Used In:**
- **Layouts (globally available):**
  - `app/views/layouts/_b3_application.html.erb` (line 118)
  - `app/views/layouts/_b3_application_side.html.erb` (line 369)
  - `app/views/layouts/board_common.html.erb` (line 106)
  - `app/views/layouts/table_common.html.erb` (line 106)
- **View-specific:**
  - `app/views/items/roadmap.html.erb` (line 472)
  - `app/views/items/roadmap_side.html.erb` (line 436)
- Self-reference: `app/views/widgets/_template_create_modal_ko_b3.html.erb`

**Note:** This is the Bootstrap 3 variant, used across most modern layouts. Line numbers verified against actual source code.

#### app/views/widgets/_project_selector_modal.html.erb
**Used In:**
- `app/views/reports/team_accomplishments.html.erb` (line 237)
- `app/views/search/index_b3.html.erb`
- JavaScript: `public/assets/javascripts/team_accomplishment_utilities.js` (line 429)
- Self-reference: `app/views/widgets/_project_selector_modal.html.erb`

#### app/views/widgets/_srt_modal.html.erb
**Used In:**
- `app/views/groups/_organizer_goal_section.html.erb`
- `app/views/groups/end_of_month_wizard.html.erb`
- `app/views/groups/end_of_quarter_wizard.html.erb`
- `app/views/layouts/_srt_styles.html.erb`
- `app/views/result_areas/battle_plan.html.erb`
- `app/views/widgets/_dropbox_chooser.html.erb`
- `app/views/widgets/_srt_must_win_battle_cards.html.erb`
- `app/views/widgets/_srt_outcomes_status_widget.html.erb`
- `app/views/widgets/_team_canvas_srt.html.erb`
- JavaScript: `public/assets/javascripts/srt_modal_scripts.js`
- Self-reference: `app/views/widgets/_srt_modal.html.erb`

**Note:** SRT = Strategic Results Tracker framework modals

#### app/views/widgets/_goal_form_modal.html.erb
**Used In:**
- `app/views/goals/edit.html.erb`

#### app/views/widgets/_content_form_modal.html.erb
**Used In:**
- `app/views/missions/edit.html.erb`
- `app/views/missions/new.html.erb`

#### app/views/widgets/_global_modals.html.erb
**GLOBALLY AVAILABLE - Used In All Major Layouts:**
- `app/views/layouts/_b3_application.html.erb`
- `app/views/layouts/_b3_application_side.html.erb`
- `app/views/layouts/application.html.erb`
- `app/views/layouts/b3_minimal.html.erb`
- `app/views/layouts/board_common.html.erb`
- `app/views/layouts/perspective.html.erb`
- `app/views/layouts/table_common.html.erb`

**Note:** This modal is available throughout the entire application. Contains the main item creation/editing modal.

#### app/views/widgets/_roadmap_override_popup.html.erb
**Used In:**
- `app/views/goals/roadmap.html.erb`
- `app/views/goals/roadmap_side.html.erb`
- `app/views/items/project_roadmap.html.erb`
- `app/views/items/roadmap.html.erb`
- `app/views/items/roadmap_side.html.erb`

#### app/views/widgets/_genius_in_popup_overlay_scripts.html.erb
**Used In:**
- `app/views/goals/board.html.erb`
- `app/views/goals/cascade_outline.html.erb`
- `app/views/goals/outline.html.erb`
- `app/views/goals/roadmap.html.erb`
- `app/views/goals/roadmap_side.html.erb`
- `app/views/goals/show.html.erb`
- `app/views/items/board.html.erb`
- `app/views/items/condensed.html.erb`
- `app/views/items/milestone_breakdown.html.erb`
- `app/views/items/mindmap.html.erb`
- `app/views/items/outline.html.erb`
- `app/views/items/outline20210901back.html.erb`
- `app/views/items/outline_2.html.erb`
- `app/views/items/personal_ideas.html.erb`
- `app/views/items/punchlist.html.erb`
- `app/views/items/roadmap.html.erb`
- `app/views/items/roadmap_side.html.erb`
- `app/views/items/show.html.erb`
- `app/views/items/show_old.html.erb`
- `app/views/items/show_review.html.erb`
- `app/views/items/table.html.erb`

**Note:** Widely used popup overlay JavaScript - present in 20+ views

#### app/views/widgets/_item_remove_choices_modal.html.erb
**GLOBALLY AVAILABLE - Used In All Major Layouts:**
- `app/views/layouts/_b3_application.html.erb`
- `app/views/layouts/_b3_application_side.html.erb`
- `app/views/layouts/application.html.erb`
- `app/views/layouts/b3_minimal.html.erb`
- `app/views/layouts/board_common.html.erb`
- `app/views/layouts/perspective.html.erb`
- `app/views/layouts/table_common.html.erb`
- **Widget-specific:**
  - `app/views/widgets/_item_quick_capture_ui.html.erb`
  - `app/views/widgets/_item_quick_capture_ui_sandbox.html.erb`

**Note:** Available throughout the application for item deletion workflows.

---

### Report Modals (1)

#### app/views/reports/_curating_items_modal.html.erb
**Used In:**
- `app/views/reports/_add_slack_information.html.erb`
- `app/views/reports/team_activity.html.erb`
- Self-reference: `app/views/reports/_curating_items_modal.html.erb`

---

### Shared Modals (1)

#### app/views/shared/_date_range_filter_modal.html.erb
**Used In (16 locations):**
- `app/views/assignments/assigned_by_me.html.erb`
- `app/views/assignments/assigned_to_me.html.erb`
- `app/views/groups/assignments.html.erb`
- `app/views/groups/assignments_old.html.erb`
- `app/views/reports/team_accomplishments.html.erb`
- `app/views/reports/team_business_review_back.html.erb`
- `app/views/reports/team_business_review_print.html.erb`
- `app/views/reports/team_business_review_print_svep.html.erb`
- `app/views/reports/team_quarterly_old.html.erb`
- `app/views/reports/team_quarterly_print.html.erb`
- `app/views/search/index_b3.html.erb`
- `app/views/today/timeline.html.erb`
- `app/views/users/show.html.erb`
- `app/views/users/show_old.html.erb`
- `app/views/work_sessions/view.html.erb`
- Self-reference: `app/views/shared/_date_range_filter_modal.html.erb`

**Note:** Widely used date filtering modal across reports and assignment views.

---

### Signup Modals (2)

#### app/views/quick_start/_signup_modal.html.erb
**Used In (19 locations):**
- `app/views/add_ons/assess.html.erb`
- `app/views/quick_start/_approach1.html.erb`
- `app/views/quick_start/_approach2.html.erb`
- `app/views/quick_start/_top_3_multiple.html.erb`
- `app/views/quick_start/_vto_team_form_for_new_user.html.erb`
- `app/views/quick_start/_vto_team_form_for_new_user_old.html.erb`
- `app/views/quick_start/_year_ahead_quarterly_v1.html.erb`
- `app/views/quick_start/_year_ahead_quarterly_v2.html.erb`
- `app/views/quick_start/_year_ahead_quarterly_v4.html.erb`
- `app/views/quick_start/_year_ahead_v3.html.erb`
- `app/views/quick_start/accountability_chart.html.erb`
- `app/views/quick_start/big_picture_3.html.erb`
- `app/views/quick_start/check_in_sign_up.html.erb`
- `app/views/quick_start/habits.html.erb`
- `app/views/quick_start/my_big_picture_2.html.erb`
- `app/views/quick_start/simple_eos.html.erb`
- `app/views/quick_start/simple_okr.html.erb`
- `app/views/quick_start/week_design.html.erb`
- `app/views/visions/three_year_vision_sign_up.html.erb`

**Note:** Primary signup modal used across all quick start and onboarding flows.

#### app/views/quick_start/_signup_modal2.html.erb
**Usage Status:** No references found (orphaned variant or legacy)

---

### Permission Modals (1)

#### app/views/permissions/dialog_for_adding.html.erb
**Used In:**
- `app/views/widgets/_permissions.html.erb`

---

### Session Modals (1)

#### app/views/sessions/_close_popup.html.erb
**Usage Status:** No file references found
**Note:** Pure JavaScript partial for popup window communication. Likely triggered by session timeout or popup close events rather than explicit renders.

---

## Key Patterns

### 1. Layout-Level Modals (Globally Available)
These modals are included in 7 main layouts and available throughout the application:
- `_global_modals.html.erb` - Main item creation/editing
- `_item_remove_choices_modal.html.erb` - Item deletion workflows

### 2. Bootstrap Version Variants
**CRITICAL:** Two separate template modal files exist:
- `_template_create_modal_ko.html.erb` - Bootstrap 2 (perspective layout only)
- `_template_create_modal_ko_b3.html.erb` - Bootstrap 3 (4 modern layouts + 2 roadmap views)

**Do NOT confuse these files!** They have different classes and structure.

### 3. Widely-Used Modals (10+ references)
- `_genius_in_popup_overlay_scripts.html.erb` - 20+ views
- `_signup_modal.html.erb` - 19 quick start flows
- `_date_range_filter_modal.html.erb` - 16 report/assignment views

### 4. Orphaned/Untracked Modals (5)
No file references found - may be dynamically loaded via JavaScript/AJAX:
- `_new_item_modal.html.erb`
- `new_modal.html.erb` (missions)
- `new_from_modal.html.erb` (missions)
- `_signup_modal2.html.erb`
- `_close_popup.html.erb` (JavaScript-only partial)

---

## Verification Notes

All line numbers for template modal variants have been **verified against actual source code**:
- `perspective.html.erb:122` ✓
- `_b3_application.html.erb:118` ✓
- `_b3_application_side.html.erb:369` ✓
- `board_common.html.erb:106` ✓
- `table_common.html.erb:106` ✓
- `roadmap.html.erb:472` ✓
- `roadmap_side.html.erb:436` ✓

---

*Last Updated: 2025-10-25*
*Verification Status: All Bootstrap 2/3 variants verified*
*Related Files: modal-files-with-references.md, modal-css-classes.md*
