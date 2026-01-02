Objective roadmap legacy surface areas (read from resultmaps-web)

- Server routes
  - `config/routes.rb:548-586` keeps `/objectives/:id/roadmap` alive via `map.resources :goals` member `:roadmap` plus explicit `map.connect "/objectives/:id/:action"`, so `/objectives/{id}/roadmap` routes to `GoalsController#roadmap`.
  - Goals controller renders two versions: `app/controllers/goals_controller.rb:181-210` sends to `roadmap_side` (default) or legacy `roadmap` when `?old=1`.

- UI navigation still linking to goal/objective roadmap
  - Goal view tabs/subnav: `app/views/goals/_view_options.html.erb` and `app/views/goals/_goal_view_selection.html.erb` render a `GANTT/ROADMAP` button pointing to `<goal.show_path>/roadmap` (hidden only for yearly goals).
  - Goal tools menu: `app/views/goals/_tools.html.erb` includes “Roadmap (Gantt timeline)” link to `/goals/:id/roadmap`; dropup variant `app/views/goals/_tools_dropup.html.erb` uses `goToView('roadmap')` in the view switcher.
  - Mindmap context menu: `app/views/layouts/_mindmap_common.html.erb:340-360` exposes “Focus here” submenu with `goToView('roadmap')`, so mindmap nodes can jump into the roadmap view.
  - OKR dropdown templates: `app/views/widgets/_okr_dropdown_templates.html.erb` contain hidden/secondary menu entries using `goToView('roadmap')` for goals (non-yearly) and yearly goals, making the roadmap reachable from KO dropdowns.

- Modal/zoom flows that can “climb” into roadmap
  - The shared “Zoom in” submenu rendered by `application_helper#render_item_views_dropdown_submenu` (`app/helpers/application_helper.rb:2549-2557`) includes `goToView('roadmap')`. That helper is used inside item/goal board-style UIs where detail modals are opened from lists:
    - `app/views/items/_simplified_items.html.erb` (used by work sessions/board variants) embeds the submenu under each column’s dropdown.
    - `app/views/items/_table_view_nested_list.html.erb` uses the same dropdown.
    - `app/views/items/board.html.erb` includes the submenu in the column actions.
  - Because `public/assets/javascripts/models/goal.js:391-417` defines `goToView('roadmap')` to navigate to `/objectives/:id/roadmap` for default goal types, any of those dropdowns/detail modals allow drilling into the objective roadmap even if primary OKR UI hides it.

- Roadmap views still present
  - Templates for the goal roadmap exist in `app/views/goals/roadmap_side.html.erb` (default with sidebar) and `app/views/goals/roadmap.html.erb` (legacy layout). Both render shared roadmap assets and the roadmap override modal.
  - Roadmap override modal `app/views/widgets/_roadmap_override_popup.html.erb` can auto-open the detail modal from within roadmap pages, indicating the view is still wired.

- API touchpoints that sustain the feature
  - `/api/goals/:id/roadmap` handled by `app/controllers/api/goals_controller.rb:20-27` returns roadmap data for goals; `/api/items/:id/roadmap` and `/api/projects/roadmap` offer similar data for items/projects and are referenced by the roadmap views.
  - Client models still accept “roadmap” as a valid default view (see `public/assets/javascripts/templates_utilities.js` and tests setting default_view to `roadmap`), so objects configured that way will redirect to the roadmap route on open.

- Execution Tracker (cascade grid) path seen in UI (screenshot)
  - From `/teams/strategy_grid?group_id={team}` (Execution Tracker), clicking an objective’s name (`w3mgui-detail-modal` anchor from `app/views/groups/_strategy_cascade_grid_okr.html.erb`, which includes the KO `goal_dropdown_options` template) opens the goal modal shown in the screenshot.
  - The modal’s bottom-right “Zoom in” dropdown is driven by the same `goToView` wiring (`goal_dropdown_options` template from `app/views/widgets/_okr_dropdown_templates.html.erb` plus `public/assets/javascripts/models/goal.js`). It offers view hops like Overview, Board/Cards+Columns, Mind map, and can include roadmap (`goToView('roadmap')`) because the template still defines it.
  - This means a user inside the OKR Execution Tracker can open a goal modal and pivot into `/objectives/:id/roadmap` via the modal’s view switcher, even if the primary navigation no longer exposes the roadmap.
  - Second screenshot (team goal modal) shows the same dropdown currently rendering only Overview / Cards + Columns / Mind map (no roadmap). This is coming from the `goal_dropdown_options` template; whether roadmap appears depends on the template variant and the goal type flags passed into the KO view model. The same template still contains the roadmap entry, so the absence/presence is a logic/config toggle, not a removed feature.

Objective outline view reachability (/objectives/:id/outline)
- Routes/controllers/views exist: `config/routes.rb` exposes `:outline` on goals/resources; `GoalsController#outline` renders `app/views/goals/outline.html.erb` under `b3_application`.
- No direct links found to `/objectives/:id/outline`: repo search for `/objectives/.*/outline` and `navigateTo('/goals/..../outline')` returned none.
- UI hooks that mention outline are hidden/inactive: `goToView('outline')` links in dropdown templates (`app/views/widgets/_okr_dropdown_templates.html.erb`, `app/views/goals/_tools_dropup.html.erb`, `app/views/layouts/_mindmap_common.html.erb`) are marked `class="invisible"`.
- JavaScript goal model intentionally reroutes outline to board: `public/assets/javascripts/models/goal.js` `goToView('outline')` comment “temporarily disabling page” and navigates to `/board` instead. So even if a hidden outline entry were surfaced, it would land on the board view, not outline.
- Net: outline view exists but is effectively unreachable through current UI; only possible via manual URL entry, and the standard `goToView('outline')` helper won’t take the user there.
- Outline template removed (was archived in `app/views/goals/archive/outline.html.erb`, now deleted); controller still 404s and route entry removed.
- Controller now hard-404s: `GoalsController#outline` returns `404` plain text (2025-12-05) so the route no longer works even via manual URL.
- Route update: removed `:outline` from `config/routes.rb` goal member routes (catch-all `map.connect "/objectives/:id/:action"` still exists, but the action itself 404s).

Goal cascade_outline view
- `GoalsController#cascade` defaults to `render 'cascade_outline'` when `visualization` is `tree` or omitted. The template lives at `app/views/goals/cascade_outline.html.erb`.
- No active UI render of the old link: the only cascade link in `app/views/goals/_tools_dropup.html.erb` is commented out where the partial is included (e.g., `cascade_outline.html.erb` has the render commented). No other templates render `_tools_dropup`.
- No `goToView('cascade')` in models/helpers; access today would be manual URL entry (`/goals/:id/cascade?visualization=tree`) or enabling that hidden dropdown.
- `_tools_dropup` now carries a comment noting it appears unused (2025-12-05).
- Disabled: removed `:cascade` member route from `config/routes.rb` (2025-12-05) and `GoalsController#cascade` now returns 404 with a retirement message; UI entry points were already absent; `cascade_outline` template removed (was in goals/archive).

Item simple_checklist view
- View removed (previously archived in `app/views/items/archive/simple_checklist.html.erb`, now deleted).
- Controller disabled: `ItemsController#simple_checklist` now returns 404 with a retirement message (2025-12-05).
- Route disabled: `:simple_checklist` member route commented in `config/routes.rb` (items resources).

Item punchlist view
- View removed (previously archived in `app/views/items/archive/punchlist.html.erb`, now deleted).
- Controller disabled: `ItemsController#punchlist` now returns 404 with a retirement message (2025-12-05).
- Route disabled: `:punchlist` member route commented in `config/routes.rb` (items resources).

Removed view files (2025-12-05)
- `app/views/items/archive/simple_checklist.html.erb` (legacy simple checklist)
- `app/views/items/archive/punchlist.html.erb`
- `app/views/items/archive/new_simple_checklist.html.erb` (legacy variant)
- `app/views/items/archive/outline_2.html.erb.20251205`
- `app/views/items/archive/outline_3.html.erb.20251205`
- `app/views/items/archive/outline-old.html.erby`
- `app/views/goals/archive/outline.html.erb`
- `app/views/goals/archive/cascade_outline.html.erb`

Item milestones (not archived)
- Views: `app/views/items/milestone_tracker.html.erb` and `app/views/items/project_milestones.html.erb` remain in place.
- Active references found: links to `/items/:id/milestone_tracker` in `app/views/items/_tools.html.erb` and in Gantt/project views (`gantt_lists.html.erb`, `project_overview.html.erb`).
- Route still active: `:milestone_tracker` member route in `config/routes.rb` plus standalone `/project_milestones` route. Because of live links, not moved/disabled.

Notes/implications
- The route and controller remain fully functional, so any link or default view targeting `roadmap` will keep `/objectives/:id/roadmap` reachable.
- “Zoom in” dropdowns and mindmap/OKR dropdowns are the main indirect paths that let users reach the old roadmap, even if the primary OKR execution UI omits it.
- Cleaning up will require removing/replacing these links and possibly deprecating the roadmap member route and API endpoints if the view is to be retired.
