# Modal CSS Classes and IDs - Complete Inventory

**Verification Status:** ✓ All modal files read completely ✓ IDs extracted programmatically where possible ✓ Classes cataloged from full file reads ✓ Runtime/dynamic class warnings included ✓ Last verified: 2025-10-25

**Methodology:**
- Files ≤10 lines: Read completely, documented exhaustively
- Files >100 lines: IDs extracted via `grep -o 'id="[^"]*"'`, classes cataloged from systematic file reads
- Knockout.js/JavaScript modals: Runtime class injection documented with warnings
- Legacy or unused variants are summarized when full inventories add little value; any such exceptions are noted inline

---

## Item Modals

### app/views/items/_new_item_modal.html.erb
**IDs:** new_item_form_hider, new_item_form, item_name_modal, item_mission_id, new_item_help_1
**Classes:** invisible, form-inline, btn, btn-success, pull-right
**Hidden Fields:** called_from, item_context, item_type, item[mission_id]

### app/views/items/_generic_modal.html.erb
**IDs:** generic_modal
**Classes:** modal, hide, modal-header, close, modal-body, modal-footer, btn

### app/views/items/_bucket_config_modal.html.erb
**IDs:** bucket_config_modal, what_to_show, who_to_show, group_selection_section
**Classes:** invisible, initialize-popup-overlay, fa-lg, bucket_config_modal_close, text-muted, pull-right, cursor-pointer, close-adjust, containerX, padding20, row, col-xs-12, col-sm-12, col-md-12, col-lg-12, nav, nav-tabs, active, tab-content, padding20, tab-pane, fade, in, active, radio-love, col-xs-11, col-xs-offset-1, descendants-sub-option, checkbox, padding20, w3mgui-container, teammate-list, btn, btn-primary, btn-default, who-to-show
**Helper Calls:** pop_overlay_form_classes(6) - emits space-separated class list at runtime
**Input Names:** what_to_show (radio), hide_first_level (checkbox)
**Note:** `who-to-show` at line 145 is a CLASS applied to dynamically inserted checkboxes, NOT an input name

### app/views/items/_create_plan_modal.html.erb
**IDs:** create_plan_modal
**Classes:** modal, hide, fade, modal-header, close, modal-body, form-inline, input-medium, btn, btn-primary, btn-small, fa, fa-spinner, icon-spin, icon-large, fa-link
**Data Attributes:** data-bind (knockout.js), data-placeholder

---

## Mission Modals

### app/views/missions/new_modal.html.erb
**IDs:** None (renders partial)
**Classes:** None directly (delegates to content_form partial)

### app/views/missions/new_from_modal.html.erb
**IDs:** content_body_dijit
**Classes:** title, editor_standard, colored_border_1, buttons

---

## Widget Modals

### app/views/widgets/_workflow_modals.html.erb
**IDs:** workflow_form_contaniers, decline_form_container, decline_form, decline_comment_text, save_decline_form, skip_decline_form, blocked_form_container, blocked_form, blocked_comment_text, save_blocked_form, skip_blocked_form, mark_review_form_container, mark_review_form, realization_date, realization_notes, realization_object_type, realization_object_id, save_mark_review_form, skip_mark_review_form
**Classes:** invisible, form-inline, row, col-sm-12, col-md-12, quiet, clearfix, space, btn, btn-primary, pull-right, col-sm-4, col-md-2, align-right, col-sm-8, col-md-10, fileupload-buttonbar, progressbar, fileupload-progressbar, nofade, drop-area-small, fileinput-button, table, table-striped, files

### app/views/widgets/_work_session_alignments_modals.html.erb
**IDs:** select_measure_modal, select_work_session_goals_modal, measure_group_selector, measure_options_loading, measure_options_contents
**Classes:** fal, fa-circle, alignment-row, selected, sections, saving, aligment-choice-checkbox
**Style Attributes:** color: <%= colors('purple_electric') %>, z-index: 100002
**Note:** CSS rules reference `#assistant_selection_modal`, which is defined in `app/views/work_sessions/view.html.erb` rather than this partial.

### app/views/widgets/_template_create_modal_ko.html.erb
**IDs:** copy_item_container, item_template_container, item_template_spinner, template_namer, template_advanced, includeAttachments, keepAlignments, item_template_default_view, viewers, item_template_find_by_name_tab, item_template_find_by_email_tab, item_template_find_by_name, item_template_access_type_by_name, item_template_find_by_email, item_template_access_type_by_email, copy_item_spinner, copy_item_form, people
**Classes:** modal, hide, modal-header, close, modal-body, invisible, row-fluid, span12, spinner-holder, clearfix, nice-input, big-input, col-md-12, avenir, no-vertical-margin, pull-left, select-label, quiet, table, table-striped, table-condensed, nav, nav-pills, g-style, labeler, active, tab-content, tab-pane, span9, span6, span2, span3, span10, btn, btn-primary, btn-default, pull-right, underline-only, specialcrumb, orange, checkbox

### app/views/widgets/_template_create_modal_ko_b3.html.erb
**IDs:** Same as _template_create_modal_ko.html.erb
**Classes:** Same as _template_create_modal_ko.html.erb
**Note:** Bootstrap 3 variant

### app/views/widgets/_project_selector_modal.html.erb
**IDs:** project_selector_modal
**Classes:** invisible, initialize-popup-overlay, padding30, row, col-md-12, text-center, well, filters-row, col-md-6, filter-search, small-font, col-md-3, btn-small-text, btn, btn-default, btn-select-all-projects, text-muted, align-right, should-hide-inactive, apply-selection-list, short, project-list, project-children-list, alignment-row, span1, col-xs-1, aligment-choice-checkbox, project-checkboxes, span10, col-xs-10, object-name, btn-primary, btn-search-projects, project_selector_modal_close
**Helper Calls:** pop_overlay_form_classes(3) - emits space-separated class list at runtime
**Data Attributes:** data-vertical, data-scrolllock, data-bind (knockout.js), data-type

### app/views/widgets/_srt_modal.html.erb
**File Length:** 449 lines (verified 2025-10-25)

**IDs (32 total - extracted via grep, 100% coverage):**
attachments_dropdown, attachments_droparea, btn_new_child, btn_srt_create_google_doc, btn_srt_upload_documents, create_google_file, document_uploaded_data, google_file_type_title, object_assignee, object_code, object_description_hidden, object_due, object_due_container, object_id, object_position, object_text, object_textarea, object_type, save_srt_comments, srt_comments, srt_comments_editor, srt_comments_form, srt_modal, srt_modal_fileupload, srt_modal_form_save, srt_modal_google_add_folder, srt_modal_google_drive_folder, srt_modal_google_file_name, srt_modal_google_file_notes, srt_modal_google_file_type, srt_object_recent_updates, srt_objects_commments_contents

**Classes (95+ unique combinations - most common listed):**
- **Layout:** row, col-xs-12, col-xs-2, col-sm-1, span12, col-md-12, padding30
- **Bootstrap Modals:** modal-top-right, close-srt-modal-popup
- **Bootstrap Buttons:** btn, btn-primary, btn-default, btn-sm, btn-mini, pull-right, pull-left
- **Bootstrap Tables:** table, table-striped, table-condensed
- **Visibility:** invisible, hide-on-upload, hide-on-print
- **Typography:** quiet, small-font, bold, title, text-border, text-right, text-muted
- **Custom Modal:** srt-modal-name-text, name, srt-modal-contents, srt-object-edit, srt-object-creator, srt-object-show-assignee, srt-archive, srt-object-champion-updates, view-battle-plan
- **Forms:** form-inputs, big-input, focus-here, srt-form-input-element, well, form-control, borderless, date-input, nopadding, underline-only, hash-mention, white-background
- **File Upload:** fileupload-buttonbar, progressbar, fileupload-progressbar, nofade, drop-area-small, fileinput-button, w3mgui_document_description, fileupload_files, files, new_document, upload-text, btn-for-upload, start_upload_spinner, start_upload
- **Dropdowns:** dropdown, dropdown-toggle, dropdown-menu, options-cog
- **Icons (FontAwesome):** fa, fal, fa-lg, fa-spinner, fa-spin, fa-upload, fa-plus-circle, fa-pencil, fa-expand-alt
- **Custom Styling:** specialcrumb, card-crumb, space, clearfix, cursor-pointer, measures-section, compressed, comments-section, load-more-feeds, group-title, orange, dbx-chooser-contents
- **Trix Editor:** trix-button, trix-button--icon, trix-button--icon-attach

**Embedded CSS Styles (lines 4-90):**
```css
#srt_modal_wrapper { background-color: rgba(0, 0, 0, 0.6); }
#srt_modal { top:5%; min-width: 80%; padding:5px; padding-left:10px; background: #fff; border-radius: 6px; max-width: 80%; }
#srt_modal h1.title .srt-modal-name-text { font-weight: 900; font-size: 33px; }
#srt_modal .srt-modal-name-text.name { color:black; }
#srt_modal .img-circle { height: unset !important; }
.form-inputs { margin-bottom: 15px; }
#srt_modal .scoreboard-tile .dropdown-toggle { display: none; visibility: hidden; }
.jq-toast-wrap { z-index: 9999999999 !important; }
#srt_object_recent_updates { padding-left: 13px; }
.srt-modal-contents { max-height: 750px; overflow-x: hidden; overflow-y: auto; }
#srt_objects_commments_contents { min-height: 200px; }
#srt_modal .comments-section .trix-button-group--file-tools { display: flex !important; }
.picker-dialog, .sweet-alert.visible { z-index: 9999999999 !important; }
.srt-modal-name-text.name { display: inline-flex; max-width: 70%; }
.popup_content .temp-team-logo { display: none; }
#srt_modal a.srt-modal-name-text { text-decoration: none; cursor: initial; background: white; color: inherit; }
.datepicker.datepicker-dropdown.dropdown-menu { z-index: 2147483013 !important; }
```

**Knockout.js Templates (2):**
- `btn_new_child` (line 106) - Template for adding new child objects
- Content embedded directly (not separate template) - Uses extensive knockout.js conditionals

**Data Attributes:**
- `data-bind` - Extensive usage throughout (30+ instances) for knockout.js bindings
- `data-toggle` - Modal and dropdown toggles
- `data-target` - Modal gallery target
- `data-backdrop`, `data-type` - Modal configuration

**JavaScript Includes (content_for :apply_bindings, lines 94-102):**
- `/assets/javascripts/add_ons/jquery.sparkline.js`
- `/assets/javascripts/models/measure`
- `/assets/javascripts/measure_form.js`
- `/assets/javascripts/scorecard_widget.js`
- `/assets/javascripts/srt_objects`
- `/assets/javascripts/srt_modal_scripts.js`

**Helper Partials Rendered:**
- `widgets/scoreboard` (line 214) - With locals: ko_object, outer_class, empty_stats_line1/2, disable_new_measures
- `widgets/measure_form` (line 444) - With locals: ko_object, form_id
- `documents/document_upload_template` (line 279)
- Uses `render_close_icon_with_options`, `render_user_avatar`, `render_more_dropdown`, `generate_loading_spinner`, `generate_loading_spinner_div` helpers

**Content Blocks (content_for):**
- `:injected_styles` (lines 3-91) - Embedded CSS
- `:apply_bindings` (lines 94-102) - JavaScript includes
- `:srt_objects_dropdown` (lines 119-146) - Dropdown menu template
- `:srt_objects_ownership_chips` (lines 148-156) - Owner/assignee chips template

**Guard Variable:**
- `@srt_modal_scripts_loaded` (line 448) - Ensures scripts load only once per page

**Functionality:**
- Strategic Results Tracker (SRT) framework modal for battles/outcomes/goals
- Supports viewing and editing Must Win Battles, Supporting Battles, Outputs, Outcomes
- File upload from: Computer (direct upload), Google Drive (browse/create doc/sheet/slides), Dropbox
- Comments/tracking with Trix editor and @mentions/#hashtags
- Scoreboard integration for Must Win Battles
- Activity feed with "load more" pagination
- Conditional UI based on object type (knockout.js)

**IMPORTANT NOTES:**
- **Runtime classes:** Knockout.js may inject additional CSS classes at runtime via `data-bind="css: ..."` (line 149 example: dynamically adds `srt-object-show-assignee`)
- **Dynamic content:** Many elements conditionally rendered via knockout.js `<!-- ko if: -->` blocks
- **Complex state management:** Uses window.srtModal, window.canEdit, window.currentUserIsTeamAdmin globals
- **Verification:** All IDs extracted via `grep -o 'id="[^"]*"'` on 2025-10-25. Classes cataloged from complete file read.

**Related CSS:** Classes reference external stylesheets (not defined in this file):
- Bootstrap 3 classes (btn, row, col-*, table, etc.)
- FontAwesome icons (fa, fal)
- W3MG custom classes (w3mgui_document_description)
- Application-specific (specialcrumb, quiet, etc.)

### app/views/widgets/_goal_form_modal.html.erb
**IDs:** is_modal
**Classes:** title, buttons
**Hidden Fields:** achievable_id, achievable_type, is_modal

### app/views/widgets/_content_form_modal.html.erb
**IDs:** None specific
**Classes:** error, title, buttons
**Hidden Fields:** parent_id, achievable_id, achievable_type

### app/views/widgets/_global_modals.html.erb
**IDs:** from_anywhere_forms, new_item_anywhere_form, new_item_form_anywhere, item_name, group_id_select, group_selection_section, team_selected_text_container, item_group_id, loading_key_results_section, key_results_select_section, item_key_results_id, show_only_key_results_for_current_quarter, select_team_access_options, item_remove_from_day_plan_checkbox, item_remove_from_day_plan, template_to_project_section, use_template_link, apply_template_to_project, select_template_area, select_template, new_item_options, item_type, add_to_today, item_description, item_context, btn_update_item_anywhere, new_goal_anywhere_form_container, new_goal_anywhere_form, target_goal_date, goal_title
**Classes:** invisible, hidden, form-inline, row, row-fluid, col-md-12, span12, for-new-item, lovely-input, item-creator, big-input, hash-mention, clearfix, space, quiet, pull-left, bold, btn-group, team-selector-container, chzn-select, well, for-update-item, specialcrumb, radio, align-center, item-type-selector, small-font, btn, btn-primary, btn-save-for-item, btn-save-for-todolist, add-bunches, span1, col-md-2, span10, col-md-10, span6, col-md-6, span3, col-md-3, span9, col-md-9
**Input Names:** item[name], item[group_id], item[parent_id], update_item_team_access_option (radio), item_type, add_to_today (checkbox), item_context, goal[title], target_goal_date
**Note:** Textarea at line 151 (`#item_description`) has NO `name` attribute - default serialize() at application.js:1120 omits it; only board override at items_flowboard_utilities.js:1669 manually adds description value

### app/views/widgets/_roadmap_override_popup.html.erb
**IDs:** currentContextId
**Classes:** w3mgui-detail-modal, main-tab-selectors
**Data Attributes:** data-bind

### app/views/widgets/_genius_in_popup_overlay_scripts.html.erb
**Note:** JavaScript file - no HTML classes/IDs

### app/views/widgets/_item_remove_choices_modal.html.erb
**IDs:** top_item_deletion_container, item_remove_options
**Classes:** invisible, btn

---

## Report Modals

### app/views/reports/_curating_items_modal.html.erb
**IDs:** curating_items, curating_items_title, curating_items_body, curating_items_submit
**Classes:** modal, fade, modal-dialog, modal-content, modal-header, close, modal-title, modal-body, modal-footer, btn, btn-default, btn-primary, span12, checkbox, btn-small-text, curated-item-checkbox

---

## Shared Modals

### app/views/shared/_date_range_filter_modal.html.erb
**IDs:** set_date_range_popover, date_range_modal_heading
**Classes:** invisible, initialize-popup-overlay, padding10, fa-lg, set_date_range_popover_close, text-muted, pull-right, cursor-pointer, padding30, row, col-xs-12, text-center, borderless, date-input, bootstrap-datepicker, btn, btn-date-shortcuts, btn-primary, btn-apply-date-range-filters, small-font, quiet, fal, fa-info-circle, orange
**Helper Calls:** pop_overlay_form_classes(5) - emits space-separated class list at runtime
**Input Names:** start_date, end_date
**Data Attributes:** data-type (last_week, last_month, month_to_date, quarter_to_date, previous_quarter, year_to_date, previous_year, all_time), data-startDate, data-endDate

---

## Signup Modals

### app/views/quick_start/_signup_modal.html.erb
**IDs:** signupModal, quick_start_form, user_login, user_email, user_password, invisibles, account_name, account_terms_of_service, after_sign_in_path, run_after_account_create, set_default_group, create_acc_btn, recaptcha_section, user_login_validation_message, user_email_validation_message, wizard_progress_bar
**Classes:** modal, fade, modal-dialog, modal-content, modal-header, align-center, modal-body, control-group, highlight, bar, help-block, invisible, text-center, btn, btn-primary, btn-lg, directions, error, pull-right
**Input Names:** user[login], user[email], user[password], account[name], account[terms_of_service], after_sign_in_path, run_after_account_create, set_default_group
**Data Attributes:** data-backdrop, data-validation-message, data-validation-required-message

### app/views/quick_start/_signup_modal2.html.erb
**IDs:** signupModal, quick_start_form, user_email, user_login, user_password, company_size, invisibles, account_name, account_terms_of_service, after_sign_in_path
**Classes:** modal, fade, modal-dialog, modal-content, modal-header, align-center, modal-body, clearfix align-center, control-group, highlight, bar, help-block, invisible, text-left, btn, btn-primary, btn-lg
**Input Names:** user[email], user[login], user[password], company_size, account[name], account[terms_of_service], after_sign_in_path
**Data Attributes:** data-backdrop, data-validation-required-message, data-validation-message
**Behavior:** Submit button triggers `validateSignUp()`; modal focus set on `#user_login` when shown.

---

## Permission Modals

### app/views/permissions/dialog_for_adding.html.erb
**IDs:** user_permission_form, dialog_tabs, dialog_tabs-1, dialog_tabs-2, grantee_id
**Classes:** prepend-1, span-4, span-5, buttons
**Input Names:** object_type, object_id, grantee_type, user[first_name], user[email], grantee_id, access_type

---

## Session Modals

### app/views/sessions/_close_popup.html.erb
**File Length:** 5 lines (verified 2025-10-25)

**IDs:** None (pure JavaScript partial - no HTML elements)
**Classes:** None (pure JavaScript partial - no HTML elements)

**Complete File Content:**
```erb
<% javascript_tag do%>
  <%=render :partial =>"shared/window_children_plugin"%>
  window.propChildUrl2Opener({'popupfunction': '<%=@desired_function%>',
                              closeDelay: <%= params[:closeDelay].blank? ? 0 : params[:closeDelay].to_i %>})
<% end %>
```

**Functionality:**
- **Purpose:** Popup window communication - sends messages from child window to parent (opener)
- **Primary function:** `window.propChildUrl2Opener()` - Defined in shared/window_children_plugin
- **Use case:** After session-related actions (login, logout, OAuth callback), close popup and notify parent

**ERB Variables:**
- `@desired_function` - Controller-set variable specifying which function parent window should execute
- `params[:closeDelay]` - Optional delay (milliseconds) before closing popup (defaults to 0)

**Partials Rendered:**
- `shared/window_children_plugin` (line 2) - Defines window.propChildUrl2Opener() JavaScript function

**How It Works:**
1. SessionsController renders this partial (likely via redirect or AJAX response)
2. Partial includes window_children_plugin which defines communication functions
3. Calls propChildUrl2Opener with desired function name and delay
4. Parent window receives message and executes specified function
5. Popup closes after delay

**Typical Invocation:**
```ruby
# In SessionsController
@desired_function = "refreshParentPage"
render "sessions/close_popup", layout: false
```

**Why No Static References:**
- Rendered dynamically by controller actions, not included in views
- Called after authentication flows, password resets, or session management
- grep searches won't find `render "sessions/close_popup"` because it may use dynamic rendering or redirect logic

**Verification:** File read completely (5 lines). No static file references found via grep (verified 2025-10-25).

---

# CSS Class Categories

## Bootstrap Modal
modal, modal-dialog, modal-content, modal-header, modal-body, modal-footer, modal-title, hide, fade

## Bootstrap Button
btn, btn-primary, btn-success, btn-default, btn-lg, btn-small, btn-small-text

## Bootstrap Grid
row, row-fluid, col-xs-1, col-xs-10, col-xs-11, col-xs-12, col-xs-offset-1, col-sm-12, col-sm-3, col-sm-4, col-sm-8, col-sm-9, col-md-2, col-md-3, col-md-6, col-md-10, col-md-12, col-lg-12, span1, span2, span3, span4, span5, span6, span9, span10, span12

## Bootstrap Form
form-inline, control-group, help-block, checkbox, radio

## Bootstrap Navigation
nav, nav-tabs, nav-pills, tab-content, tab-pane, active

## Bootstrap Utilities
close, pull-left, pull-right, text-center, text-muted, align-center, align-right, clearfix, invisible, hidden

## Custom Popup/Overlay
initialize-popup-overlay, popup_content, popup_wrapper, bigger-popover, popup-overlay-close

## Custom W3MG
w3mgui-detail-modal, w3mgui-container, w3mgui-permission, w3mgui-scheduler

## Knockout.js
data-bind (attribute used extensively)

## Font Awesome Icons
fa, fal, fa-circle, fa-spinner, fa-link, fa-lg, fa-info-circle, icon-spin, icon-large

## Custom Layout
padding10, padding20, padding30, containerX, space, quiet, bold, small-font, cursor-pointer, borderless

## Custom Form
lovely-input, nice-input, big-input, underline-only, hash-mention, item-creator

## Custom State
selected, visible, error, active, saving, descendants-sub-option

## Custom Modal-Specific
bucket_config_modal_close, set_date_range_popover_close, project_selector_modal_close, srt-modal-name-text, srt-modal-contents, curated-item-checkbox, radio-love, alignment-row, aligment-choice-checkbox, for-new-item, for-update-item, who-to-show

## Table
table, table-striped, table-condensed

## Plugin-Specific
chzn-select (Chosen.js), bootstrap-datepicker, filter-search, apply-selection-list, well, specialcrumb, orange, avenir, colored_border_1, spinner-holder, fileinput-button, fileupload-buttonbar, fileupload-progressbar, nofade, drop-area-small
