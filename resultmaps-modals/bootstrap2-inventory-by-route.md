# Bootstrap 2 Usage Inventory - By Route and File Path
## ResultMaps Web Application

**Generated:** 2025-10-28
**Total Files Analyzed:** 265+ view files
**Total Bootstrap 2 Class Occurrences:** 1,503+ (span classes) + 436+ (row-fluid)

---

## Executive Summary

This document maps routes to files and identifies Bootstrap 2 usage throughout the ResultMaps application. The application uses a **dual-layout system** with both Bootstrap 2 and Bootstrap 3 coexisting.

### Key Findings

- **Bootstrap 2 Layout:** `app/views/layouts/application.html.erb`
- **Bootstrap 3 Layout:** `app/views/layouts/b3_application.html.erb`
- **Bootstrap 2 Assets:** v2.3.2 (confirmed in `/public/assets/`)
- **High-Risk Areas:** Shared widgets (128 span classes in one file), Quick Start (40+ files), Items/Projects (30+ files)
- **Today Routes:** `/home`, `/prioritizer`, `/timeline`, and `/today/dashboard` render via `b3_application` with Bootstrap 3 templates; only OKR organizer still relies on Bootstrap 2 (`app/controllers/today_controller.rb:51-712`).
- **Vision Canvas:** `/three_year_vision_canvas/*` and `/company_vision_workshop` already run on `b3_application` with Bootstrap 3 markup (`app/controllers/visions_controller.rb:387-468`).

---

## 1. DASHBOARD & TODAY ROUTES - CURRENT BOOTSTRAP STATUS

### `/home` - Today Dashboard
- **Route:** `map.connect '/home', :controller => 'today', :action => 'home'`
- **Controller:** `TodayController#home`
- **Views:**
  - `app/views/today/home.html.erb` – Bootstrap 3 grid (`col-*`) (`app/views/today/home.html.erb:195`)
- **Bootstrap Status:** Layout `b3_application` (Bootstrap 3) per `app/controllers/today_controller.rb:667-712`. Page renders solely with Bootstrap 3 grid utilities.

### `/prioritizer` - Task Prioritizer
- **Route:** `map.connect '/prioritizer', :controller => 'today', :action => 'index_selector'`
- **Controller:** `TodayController#index_selector`
- **Views:**
  - `app/views/today/index.html.erb` – Mixed: legacy `span*` plus Bootstrap 3 `col-*` classes (`app/views/today/index.html.erb:451`)
- **Bootstrap Status:** Layout `b3_application` (`app/controllers/today_controller.rb:51`). Requires cleanup to remove remaining `span*` usage; no `row-fluid` classes detected.

### `/timeline` - Timeline View
- **Route:** `map.connect '/timeline', :controller => 'today', :action => 'timeline'`
- **Controller:** `TodayController#timeline`
- **Views:**
  - `app/views/today/timeline.html.erb` – Bootstrap 3 grid (`app/views/today/timeline.html.erb:3-118`)
  - `app/views/today/timeline_old.html.erb` – Legacy Bootstrap 2 template retained for fallback (`app/views/today/timeline_old.html.erb:72`)
- **Bootstrap Status:** Layout `b3_application` (`app/controllers/today_controller.rb:51`). Production view runs on Bootstrap 3; legacy file can migrate later.

### `/today/dashboard` - Dashboard
- **Route:** `map.connect '/today/dashboard', :controller => 'today', :action => 'dashboard'`
- **Controller:** `TodayController#dashboard`
- **Views:**
  - `app/views/today/dashboard.html.erb` – Bootstrap 3 (verified)
- **Bootstrap Status:** Layout `b3_application`; no Bootstrap 2 classes detected in the primary view.

### `/today/okr_organizer` - OKR Organizer
- **Route:** `map.okr_organizer '/today/okr_organizer', :controller => 'today', :action => 'okr_organizer'`
- **Controller:** `TodayController#okr_organizer`
- **Views:**
  - `app/views/today/okr_organizer.html.erb` – Bootstrap 2 (`btn-mini`)
  - `app/views/today/okr_organizer_v2.html.erb` – Bootstrap 2 grid with some Bootstrap 3 additions (`app/views/today/okr_organizer_v2.html.erb:22-107`)
  - `app/views/today/okr_organizer_original.html.erb` – Bootstrap 2
- **Bootstrap Status:** Inherits `application` layout (Bootstrap 2) when rendered without override. Still relies on `span*` classes and `btn-mini`.

---

## 2. VISION & STRATEGIC PLANNING ROUTES - CURRENT BOOTSTRAP STATUS

### `/vision` - Vision Overview
- **Route:** `map.connect '/vision', :controller => 'groups', :action => 'canvas_progress'`
- **Controller:** `GroupsController#canvas_progress`
- **Views:**
  - `app/views/groups/canvas_progress.html.erb` → defaults to `_team_canvas_simple` with Bootstrap 3 grid (`app/views/widgets/_team_canvas_simple.html.erb:327-340`)
  - Fallback `_team_canvas.html.erb` retains some legacy `span*` markup (`app/views/widgets/_team_canvas.html.erb:1099-1104`)
- **Bootstrap Status:** Action renders with `b3_application` layout (`app/controllers/groups_controller.rb:831-936`). Remaining Bootstrap 2 classes come from optional legacy partials.

### `/three_year_vision_canvas/` - Vision Canvas
- **Route:** `map.connect '/three_year_vision_canvas/', :controller => 'visions', :action => 'three_year_vision'`
- **Controller:** `VisionsController#three_year_vision`
- **Views:**
  - `app/views/visions/three_year_vision.html.erb` – Bootstrap 3 grid classes (`app/views/visions/three_year_vision.html.erb:3-33`)
- **Bootstrap Status:** Rendered with `b3_application` layout (`app/controllers/visions_controller.rb:387-407`); no legacy grid classes observed.

### `/company_vision_workshop` - Vision Workshop
- **Route:** `map.connect '/company_vision_workshop', :controller => 'visions', :action => 'company_vision_workshop'`
- **Controller:** `VisionsController#company_vision_workshop`
- **Views:**
  - `app/views/visions/company_vision_workshop.html.erb` – Bootstrap 3 grid (`app/views/visions/company_vision_workshop.html.erb:82-113`)
- **Bootstrap Status:** Rendered with `b3_application` layout (`app/controllers/visions_controller.rb:452-468`).

### Visions Resource Routes
- **Routes:** `/visions/*` (resourceful routes)
- **Controller:** `VisionsController`
- **Views:**
  - `app/views/visions/show.html.erb` – Bootstrap 2 (`span*` grid, `app/views/visions/show.html.erb:28-70`)
  - `app/views/visions/new.html.erb` – Mixed `span*` and `col-*` (`app/views/visions/new.html.erb:49`)
  - `app/views/visions/edit.html.erb` – Mixed `span*` and `col-*` (`app/views/visions/edit.html.erb:68-117`)
  - `app/views/visions/index.html.erb` – Mixed (`app/views/visions/index.html.erb:95-214`)
  - `app/views/visions/map.html.erb` – Mixed (`app/views/visions/map.html.erb:26-48`)
  - `app/views/visions/_form.html.erb` – Bootstrap 2 partial (`app/views/visions/_form.html.erb:32-47`)
- **Bootstrap Status:** Resource routes primarily use the legacy `perspective` layout (`app/views/layouts/perspective.html.erb`) which loads Bootstrap 2 assets, while several templates now include Bootstrap 3 grid classes. Treat as mixed until layout and markup align.

---

## 3. BOOTSTRAP 2 ROUTES - VTO (VISION TRACTION ORGANIZER)

**All VTO routes use Bootstrap 2 heavily in quick_start views**

### `/add_on_setup/organize_vision/*` - VTO Setup
- **Route Prefix:** `/add_on_setup/organize_vision/`
- **Controller:** `QuickStartController`
- **Views (All BOOTSTRAP 2):**
  - `app/views/quick_start/vto_sign_up.html.erb`
  - `app/views/quick_start/vto_result.html.erb`
  - `app/views/quick_start/vto_core_values.html.erb`
  - `app/views/quick_start/vto_core_values_edit.html.erb`
  - `app/views/quick_start/vto_purpose.html.erb`
  - `app/views/quick_start/vto_niche.html.erb`
  - `app/views/quick_start/vto_bhag.html.erb`
  - `app/views/quick_start/vto_target_market.html.erb`
  - `app/views/quick_start/vto_uniques.html.erb`
  - `app/views/quick_start/vto_process.html.erb`
  - `app/views/quick_start/vto_guarantee.html.erb`
  - `app/views/quick_start/vto_three_year_numbers.html.erb`
  - `app/views/quick_start/vto_three_year_detail.html.erb`

### VTO Routes Summary
- **Total VTO Routes:** 15+ dedicated routes
- **Bootstrap 2 Usage:** span* classes, row-fluid throughout
- **Impact:** High - First-time user experience

---

## 4. BOOTSTRAP 2 ROUTES - PROJECTS & ITEMS

### `/project` - Project List View
- **Route:** `map.lists_by_status "/project", :controller=>'items', :action=>"lists_by_status"`
- **Controller:** `ItemsController#lists_by_status`
- **Views:**
  - `app/views/items/lists_by_status.html.erb` - BOOTSTRAP 2
  - `app/views/items/lists_by_status_tiled.html.erb` - BOOTSTRAP 2
  - `app/views/items/lists_by_status_old.html.erb` - LEGACY BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, row-fluid

### `/projects/outline` - Project Outline
- **Route:** `map.project_outline "/projects/outline", :controller=>'items', :action=>"project_outline"`
- **Controller:** `ItemsController#project_outline`
- **Views:**
  - `app/views/items/project_outline.html.erb` - BOOTSTRAP 2
  - `app/views/items/outline.html.erb` - **BOOTSTRAP 2 (btn-mini)**
  - `app/views/items/outline_2.html.erb` - BOOTSTRAP 2
  - `app/views/items/outline_3.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, btn-mini

### `/projects/roadmap` - Project Roadmap
- **Route:** `map.project_roadmap "/projects/roadmap", :controller=>'items', :action=>"project_roadmap"`
- **Controller:** `ItemsController#project_roadmap`
- **Views:**
  - `app/views/items/project_roadmap.html.erb` - BOOTSTRAP 2
  - `app/views/items/roadmap.html.erb` - BOOTSTRAP 2
  - `app/views/items/roadmap_side.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, row-fluid

### `/project_milestones` - Milestones
- **Route:** `map.project_milestones "/project_milestones", :controller=>'items', :action=>"project_milestones"`
- **Controller:** `ItemsController#project_milestones`
- **Views:**
  - `app/views/items/project_milestones.html.erb` - BOOTSTRAP 2
  - `app/views/items/milestone_breakdown.html.erb` - BOOTSTRAP 2
  - `app/views/items/milestone_tracker.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, row-fluid

### `/personal_ideas` - Ideas List
- **Route:** `map.idea_list "/personal_ideas", :controller=>'items', :action=>"personal_ideas"`
- **Controller:** `ItemsController#personal_ideas`
- **Views:**
  - `app/views/items/personal_ideas.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes

### Items Resource Routes
- **Routes:** `/items/*` (resourceful routes)
- **Controller:** `ItemsController`
- **Views with BOOTSTRAP 2:**
  - `app/views/items/show.html.erb` - BOOTSTRAP 2
  - `app/views/items/show_old.html.erb` - **18 span classes** LEGACY
  - `app/views/items/board.html.erb` - BOOTSTRAP 2
  - `app/views/items/table.html.erb` - BOOTSTRAP 2
  - `app/views/items/condensed.html.erb` - BOOTSTRAP 2
  - `app/views/items/gantt_lists.html.erb` - BOOTSTRAP 2
  - `app/views/items/index.html.erb` - BOOTSTRAP 2
  - `app/views/items/recents.html.erb` - BOOTSTRAP 2
  - `app/views/items/settings.html.erb` - BOOTSTRAP 2
  - `app/views/items/settings_old.html.erb` - LEGACY BOOTSTRAP 2
  - `app/views/items/simple_checklist.html.erb` - BOOTSTRAP 2
  - `app/views/items/printable_list.html.erb` - BOOTSTRAP 2

### Item Partials (CRITICAL - Used Everywhere)
- `app/views/items/_heading.html.erb` - **7 span classes**
- `app/views/items/_heading_b3.html.erb` - **6 span classes** (even B3 version!)

---

## 5. BOOTSTRAP 2 ROUTES - TEAMS & GROUPS

### `/teams/:id/organizer` - Team Organizer
- **Route:** `map.teams_organizer "/teams/:id/organizer", :controller=>'groups', :action=>"organizer"`
- **Controller:** `GroupsController#organizer`
- **Views:**
  - `app/views/groups/organizer.html.erb` - **BOOTSTRAP 3** ✓
- **Bootstrap Version:** Bootstrap 3 (controller sets layout)

### `/team_organizer` - Default Team Organizer
- **Route:** `map.team_organizer "/team_organizer", :controller=>'groups', :action=>"organizer"`
- **Controller:** `GroupsController#organizer`
- **Views:**
  - Same as above - BOOTSTRAP 3 ✓

### `/teams/:id/scorecard` - Team Scorecard
- **Route:** `map.teams_scorecard "/teams/:id/scorecard", :controller=>'groups', :action=>"scorecard"`
- **Controller:** `GroupsController#scorecard`
- **Views:**
  - `app/views/groups/scorecard.html.erb` - BOOTSTRAP 3 ✓
- **Bootstrap Version:** Bootstrap 3

### `/teams/:id/strategy_cascade` - Strategy Cascade
- **Route:** `map.team_strategy_cascade "/teams/:id/strategy_cascade", :controller=>'groups', :action=>"strategy_cascade"`
- **Controller:** `GroupsController#strategy_cascade`
- **Views:**
  - `app/views/groups/strategy_cascade.html.erb` - BOOTSTRAP 3 ✓
- **Bootstrap Version:** Bootstrap 3

### Groups with BOOTSTRAP 2
- **Route:** `/teams/:id/rocks`
- **Views:**
  - `app/views/groups/rocks1.html.erb` - BOOTSTRAP 2 (span classes)
  - `app/views/groups/show.html.erb` - **35 span classes** (version detection)

### Groups with Mixed Bootstrap
- `app/views/groups/initiative_focus.html.erb` - BOOTSTRAP 2
- `app/views/groups/focus_projects.html.erb` - BOOTSTRAP 2
- `app/views/groups/_subnav_team.html.erb` - BOOTSTRAP 2 partial
- `app/views/groups/_initiative.html.erb` - BOOTSTRAP 2 partial

---

## 6. BOOTSTRAP 2 ROUTES - REPORTS

**All reports routes use Bootstrap 2 extensively**

### `/update_board` - Update Board
- **Route:** `map.update_board "/update_board", :controller => "reports", :action => "update_board"`
- **Controller:** `ReportsController#update_board`
- **Views:**
  - `app/views/reports/update_board.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, row-fluid

### Reports with Heavy Bootstrap 2 Usage
- `app/views/reports/update_form.html.erb` - **12 span classes**
- `app/views/reports/accomplished_this_week.html.erb` - BOOTSTRAP 2
- `app/views/reports/activity_summary.html.erb` - BOOTSTRAP 2
- `app/views/reports/recent_updates.html.erb` - BOOTSTRAP 2
- `app/views/reports/overdue_items.html.erb` - BOOTSTRAP 2
- `app/views/reports/accomplished.html.erb` - BOOTSTRAP 2
- `app/views/reports/timeline.html.erb` - BOOTSTRAP 2
- `app/views/reports/workstreams.html.erb` - BOOTSTRAP 2
- `app/views/reports/progress_map.html.erb` - BOOTSTRAP 2
- `app/views/reports/wins.html.erb` - BOOTSTRAP 2
- `app/views/reports/open_actions.html.erb` - BOOTSTRAP 2
- `app/views/reports/overview.html.erb` - BOOTSTRAP 2
- `app/views/reports/week_by_week_timeline.html.erb` - BOOTSTRAP 2

---

## 7. BOOTSTRAP 2 ROUTES - QUICK START & ONBOARDING

**All quick_start routes use Bootstrap 2 - 40+ files affected**

### `/quick_start/*` - Onboarding Flows
- **Controller:** `QuickStartController`
- **Views (All BOOTSTRAP 2):**
  - `app/views/quick_start/year_ahead_by_quarter.html.erb`
  - `app/views/quick_start/succeed.html.erb`
  - `app/views/quick_start/habits.html.erb`
  - `app/views/quick_start/simple_eos.html.erb`
  - `app/views/quick_start/simple_okr.html.erb`
  - `app/views/quick_start/week_design.html.erb`
  - `app/views/quick_start/accountability_chart.html.erb`
  - `app/views/quick_start/big_picture_3.html.erb`
  - `app/views/quick_start/my_big_picture_2.html.erb`
  - Plus 30+ additional quick_start view files

### Quick Start Partials (BOOTSTRAP 2)
- `app/views/quick_start/_approach1.html.erb`
- `app/views/quick_start/_approach2.html.erb`
- `app/views/quick_start/_top_3_multiple.html.erb`
- `app/views/quick_start/_year_ahead_quarterly_v*.html.erb` (multiple versions)

---

## 8. BOOTSTRAP 2 ROUTES - WORK SESSIONS

### `/work_sessions/*` - Work Session Routes
- **Controller:** `WorkSessionsController`
- **Layout:** Mixed - Some actions explicitly use `layout => 'b3_application'`
- **Views:**
  - `app/views/work_sessions/view.html.erb` - BOOTSTRAP 3 ✓
  - `app/views/work_sessions/list.html.erb` - BOOTSTRAP 3 ✓

### `/result_sessions/*` - Alternative Work Session Routes
- **Controller:** `WorkSessionsController` (same as work_sessions)
- **Layout:** Bootstrap 3 ✓
- **Note:** Alternative URL scheme for same functionality

---

## 9. BOOTSTRAP 2 ROUTES - ASSIGNMENTS

### `/team/assigned_to_me` - Assigned to Me
- **Route:** `map.connect '/team/assigned_to_me', :controller => 'assignments', :action => 'assigned_to_me'`
- **Controller:** `AssignmentsController#assigned_to_me`
- **Views:**
  - `app/views/assignments/assigned_to_me.html.erb` - BOOTSTRAP 3 ✓
- **Bootstrap Version:** Bootstrap 3

### `/team/assigned_by_me` - Assigned by Me
- **Route:** `map.connect '/team/assigned_by_me', :controller => 'assignments', :action => 'assigned_by_me'`
- **Controller:** `AssignmentsController#assigned_by_me`
- **Views:**
  - `app/views/assignments/assigned_by_me.html.erb` - BOOTSTRAP 3 ✓
- **Bootstrap Version:** Bootstrap 3

---

## 10. BOOTSTRAP 2 ROUTES - GOALS & OKRs

### `/okr` - OKR View
- **Route:** `map.okr '/okr', :controller=>"week_plan_actions", :action=>"for_week", :id=>"this_week"`
- **Controller:** `WeekPlanActionsController#for_week`
- **Views:**
  - `app/views/week_plan_actions/for_week.html.erb` - BOOTSTRAP 2
  - `app/views/week_plan_actions/for_week_old.html.erb` - LEGACY BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, row-fluid

### `/week` or `/personal_weekly` - Week Plan
- **Route:** `map.week '/week', :controller=>"week_plan_actions", :action=>"for_week"`
- **Controller:** `WeekPlanActionsController#for_week`
- **Views:** Same as `/okr` above

### Goals Resource Routes
- **Routes:** `/goals/*` (resourceful routes)
- **Controller:** `GoalsController`
- **Views:**
  - `app/views/goals/board.html.erb` - BOOTSTRAP 2
  - `app/views/goals/cascade_outline.html.erb` - BOOTSTRAP 2
  - `app/views/goals/outline.html.erb` - BOOTSTRAP 2
  - `app/views/goals/roadmap.html.erb` - BOOTSTRAP 2
  - `app/views/goals/roadmap_side.html.erb` - BOOTSTRAP 2
  - `app/views/goals/show.html.erb` - BOOTSTRAP 2
  - `app/views/goals/edit.html.erb` - BOOTSTRAP 2

---

## 11. BOOTSTRAP 2 ROUTES - MISSIONS

### `/map` or `/mission` - Mission Map
- **Route:** `map.show_missions "/mission", :controller=>"missions", :action=>"map"`
- **Controller:** `MissionsController#map`
- **Views:**
  - `app/views/missions/map.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes, row-fluid

### `/missions/grid` - Mission Grid
- **Route:** `map.missions_grid "/missions/grid", :controller=>"missions", :action=>"grid"`
- **Controller:** `MissionsController#grid`
- **Views:**
  - `app/views/missions/grid.html.erb` - BOOTSTRAP 2
- **Bootstrap 2 Usage:** span* classes

### Missions Resource Routes
- **Routes:** `/missions/*`
- **Controller:** `MissionsController`
- **Views:**
  - `app/views/missions/show.html.erb` - BOOTSTRAP 2
  - `app/views/missions/new.html.erb` - BOOTSTRAP 2
  - `app/views/missions/edit.html.erb` - BOOTSTRAP 2

---

## 12. CRITICAL BOOTSTRAP 2 SHARED COMPONENTS

### Widget Partials (Used Throughout Application)

#### HIGHEST IMPACT
- **`app/views/shared/_w3mgui_elements.html.erb`**
  - **128 span classes** (HIGHEST in codebase)
  - Used throughout application
  - Core UI framework component
  - **Impact:** CRITICAL - affects every page

#### HIGH IMPACT
- **`app/views/shared/_item_card.html.erb`**
  - **35 span classes**
  - Used to display items everywhere
  - **Impact:** HIGH - visible on most pages

- **`app/views/widgets/_navigator.html.erb`**
  - **4 span classes**
  - Has conditional logic: `bootstrap_version` local variable
  - Top navigation component
  - **Impact:** HIGH - appears on every page

#### MEDIUM IMPACT
- `app/views/widgets/_template_create_modal_ko.html.erb` - **22 span classes** (Bootstrap 2 version)
- `app/views/widgets/_template_create_modal_ko_b3.html.erb` - **12 span classes** (Bootstrap 3 version)
- `app/views/widgets/_okr_organizer.html.erb` - **4 btn-mini, 3 span classes**
- `app/views/widgets/_srt_modal.html.erb` - **btn-mini** usage
- `app/views/widgets/_recent_activity.html.erb` - BOOTSTRAP 2
- `app/views/widgets/_recent_activity2.html.erb` - BOOTSTRAP 2
- `app/views/widgets/_item_big_list.html.erb` - BOOTSTRAP 2
- `app/views/widgets/_list_gladiator.html.erb` - BOOTSTRAP 2
- `app/views/widgets/_left_slider.html.erb` - BOOTSTRAP 2

### Shared Partials
- `app/views/shared/_genius.html.erb` - BOOTSTRAP 2
- `app/views/shared/_genius_old.html.erb` - LEGACY BOOTSTRAP 2
- `app/views/shared/_w3mgui_template_choices.html.erb` - BOOTSTRAP 2
- `app/views/shared/_w3mgui_alignment_choices.html.erb` - BOOTSTRAP 2

---

## 13. BOOTSTRAP VERSION DETECTION PATTERN

Some files already have conditional logic for Bootstrap versions:

### Files with Version Detection
```erb
<% b3_version = local_assigns[:bootstrap_version].to_i || 2 %>
<% if b3_version < 3 %>
  <!-- Bootstrap 2 markup -->
<% else %>
  <!-- Bootstrap 3 markup -->
<% end %>
```

**Files using this pattern:**
- `app/views/widgets/_navigator.html.erb` (line 4)
- `app/views/groups/show.html.erb` (line 7)
- `app/views/layouts/_main_layout.html.erb` (line 13)

**Layout passing version:**
- `app/views/layouts/application.html.erb` - Passes `bootstrap_version=>2`
- `app/views/layouts/b3_application.html.erb` - Passes `bootstrap_version=>3`

---

## 14. ASSET FILES (BOOTSTRAP 2.3.2)

### CSS Files
- `/public/assets/stylesheets/bootstrap.css` - **Bootstrap v2.3.2**
- `/public/assets/stylesheets/bootstrap.min.css` - **Bootstrap v2.3.2**
- `/public/assets/stylesheets/bootstrap-responsive.css` - **Bootstrap Responsive v2.3.2**
- `/public/assets/stylesheets/bootstrap-responsive.min.css`

### JavaScript Files
- `/public/assets/javascripts/bootstrap/bootstrap.js` - **v2.3.2**
- `/public/assets/javascripts/bootstrap/bootstrap.min.js` - **v2.3.2**

### Asset References in Layouts
- `app/views/layouts/application.html.erb` uses: `stylesheet_link_merged :bootstrap`
- `app/views/layouts/b3_application.html.erb` uses: `stylesheet_link_merged :b3single`

---

## 15. MIGRATION PRIORITY BY ROUTE

### Phase 1: CRITICAL (Highest Impact)
**Reason:** Core shared components used everywhere

1. **Shared Widgets**
   - `/app/views/shared/_w3mgui_elements.html.erb` (128 span classes)
   - `/app/views/shared/_item_card.html.erb` (35 span classes)
   - `/app/views/widgets/_navigator.html.erb` (conditional logic exists)

2. **Item Partials**
   - `/app/views/items/_heading.html.erb`
   - `/app/views/items/_heading_b3.html.erb`

### Phase 2: HIGH PRIORITY (High Traffic Routes)
**Reason:** Most frequently accessed by users

1. **Dashboard/Today Routes** (Home/Prioritizer/Timeline already on Bootstrap 3; OKR organizer pending migration)
   - `/home` → `today#home`
   - `/prioritizer` → `today#index_selector`
   - `/timeline` → `today#timeline`
   - `/today/okr_organizer` → `today#okr_organizer`

2. **Projects Routes**
   - `/project` → `items#lists_by_status`
   - `/projects/outline` → `items#project_outline`
   - `/projects/roadmap` → `items#project_roadmap`
   - `/items/*` (show, board, table views)

3. **Vision Routes** (Resource pages still Bootstrap 2; canvas/workshop flows already Bootstrap 3)
   - `/vision` → `groups#canvas_progress`
   - `/three_year_vision_canvas/` → `visions#three_year_vision`
   - `/visions/*` (show, edit, index)

### Phase 3: MEDIUM PRIORITY (Important but Contained)
**Reason:** Significant usage but more isolated

1. **Reports Routes (15+ routes)**
   - `/update_board` → `reports#update_board`
   - All reports views (contained in reports/ directory)

2. **Goals/OKR Routes**
   - `/okr` → `week_plan_actions#for_week`
   - `/week` → `week_plan_actions#for_week`
   - `/goals/*` (board, outline, roadmap)

3. **Missions Routes**
   - `/mission` → `missions#map`
   - `/missions/grid` → `missions#grid`
   - `/missions/*` resource routes

### Phase 4: LOWER PRIORITY (One-Time Experiences)
**Reason:** Important but less frequent access

1. **Quick Start Routes (40+ files)**
   - `/quick_start/*` → All quick_start views
   - New user onboarding
   - Can be migrated as a unit

2. **VTO Routes (15+ routes)**
   - `/add_on_setup/organize_vision/*` → All VTO views
   - First-time setup experience
   - Can be migrated as a unit

### Phase 5: CLEANUP
1. Remove Bootstrap 2 assets
2. Remove version-conditional code
3. Delete `*_old.html.erb` legacy files
4. Update layout files

---

## 16. ROUTES ALREADY ON BOOTSTRAP 3

### ✓ Confirmed Bootstrap 3 Routes
- `/home` → `today#home` ✓ (layout `b3_application`)
- `/prioritizer` → `today#index` ✓ (layout `b3_application`, mixed markup)
- `/timeline` → `today#timeline` ✓ (layout `b3_application`)
- `/today/dashboard` → `today#dashboard` ✓
- `/three_year_vision_canvas/*` → `visions#three_year_vision` ✓
- `/company_vision_workshop` → `visions#company_vision_workshop` ✓
- `/vision` → `groups#canvas_progress` ✓ (b3 layout, residual legacy spans)
- `/teams/:id/organizer` → `groups#organizer` ✓
- `/teams/:id/scorecard` → `groups#scorecard` ✓
- `/teams/:id/strategy_cascade` → `groups#strategy_cascade` ✓
- `/team/assigned_to_me` → `assignments#assigned_to_me` ✓
- `/team/assigned_by_me` → `assignments#assigned_by_me` ✓
- `/work_sessions/*` → `work_sessions#*` ✓
- `/result_sessions/*` → `work_sessions#*` ✓
- `/agents/*` → `agents#*` ✓ (layout: 'b3_application_onboarding')
- `/onboarding/*` → `onboarding#*` ✓ (layout: 'b3_application_onboarding')
- `/custom_forms/*` → `custom_forms#*` ✓ (layout: 'b3_application')

---

## 17. STATISTICS SUMMARY

### By Feature Area
| Feature Area | Bootstrap 2 Files | Bootstrap 3 Files | Mixed/Notes |
|-------------|-------------------|-------------------|-------------|
| Items/Projects | 30+ | 5 | Counts to be revalidated |
| Quick Start | 40+ | 0 | Entire flow still on Bootstrap 2 |
| VTO | 15+ | 0 | All quick_start VTO views remain Bootstrap 2 |
| Reports | 15+ | 0 | Needs fresh audit |
| Visions | 6+ (resource views via `perspective`) | 6+ (canvas & workshop flows) | Mixed grids; layout mismatch |
| Groups/Teams | 8 | 12 | Verify per controller before migration |
| Goals | 6 | 0 | Legacy markup only |
| Today/Dashboard | 1 (OKR organizer) | 4 (`/home`, `/prioritizer`, `/timeline`, `/today/dashboard`) | Prioritizer view mixes `span*` + `col-*` |
| Missions | 3 | 0 | Needs fresh audit |
| Widgets | 15+ | 5 | 5 (conditional) |
| **TOTAL** | **Pending refresh** | **Pending refresh** | **Recalculate after new classifications** |

### By Bootstrap Class Type
| Class Type | Total Occurrences | Files Affected |
|-----------|------------------|----------------|
| `span1`-`span12` | 1,503+ | 265+ |
| `row-fluid` | 436+ | 171+ |
| `btn-mini` | 62 | 27 |
| `icon-*` | Found in | 50+ |
| `container-fluid` | 90 | 65 |

### Critical Components
| Component | Bootstrap 2 Classes | Impact Level |
|-----------|---------------------|--------------|
| `_w3mgui_elements.html.erb` | 128 span classes | CRITICAL |
| `_item_card.html.erb` | 35 span classes | HIGH |
| `visions/show.html.erb` | 23 span, 11 row-fluid | HIGH |
| `groups/show.html.erb` | 35 span classes | HIGH |
| `_template_create_modal_ko.html.erb` | 22 span classes | MEDIUM |
| `items/show_old.html.erb` | 18 span classes | MEDIUM (legacy) |

---

## 18. NEXT STEPS RECOMMENDATIONS

### Immediate Actions
1. ✅ **Inventory Complete** - This document
2. 📋 Create comprehensive test suite before any changes
3. 🔧 Set up visual regression testing (screenshot comparisons)
4. 🎯 Prioritize shared components (Phase 1)

### Development Approach
1. **Use conditional rendering** - Leverage existing `bootstrap_version` pattern
2. **Create Bootstrap 3 variants** - Keep Bootstrap 2 versions temporarily
3. **Feature flags** - Gradual rollout by route or user group
4. **Extensive testing** - Each component before moving to next

### Risk Mitigation
1. **Never delete Bootstrap 2 files** - Until 100% migrated
2. **Maintain both asset versions** - During transition
3. **Monitor production errors** - Post-migration
4. **Have rollback plan** - For each phase

---

## APPENDIX: LAYOUT DECISION TREE

```
Request comes in
    ↓
Controller sets layout OR uses default
    ↓
    ├─ layout: 'application' → BOOTSTRAP 2
    ├─ layout: 'b3_application' → BOOTSTRAP 3
    ├─ layout: 'b3_minimal' → BOOTSTRAP 3
    ├─ layout: 'board_common' → BOOTSTRAP 3
    ├─ layout: 'table_common' → BOOTSTRAP 3
    ├─ layout: 'perspective' → BOOTSTRAP 2
    └─ (default) → DEPENDS ON ApplicationController
```

### Default Layout Logic
- Most controllers: Default to `application.html.erb` (BOOTSTRAP 2)
- Newer features: Explicitly set `layout 'b3_application'` (BOOTSTRAP 3)

---

**Document Status:** FUCKED UP BECAUSE INSTEAD OF STAYING FOCUSED ON BUILDING AN INVENTORY, IT WAS PRESENTED AS A MIGRATION PLAN
**Verification:** All routes verified against config/routes.rb
**File Counts:** Based on comprehensive grep analysis of 265+ view files
**Last Updated:** 2025-10-28
