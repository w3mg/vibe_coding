# Legacy Group Model Test Failures

- **Status**: Backlog
- **Owner**: Onboarding Evolution Team (relay to broader engineering once bandwidth opens)
- **Repos**: `resultmaps-web`

## Problem
Running `bundle exec ruby test/unit/group_test.rb` surfaces dozens of failures/errors (missing fixtures, stale expectations, nil accesses). The suite is too noisy to validate new onboarding helpers that touch group-level logic.

## Why It Matters
Group-level permissions are central to onboarding visibility; without a clean baseline we can’t safely expand `Group#configurable_by?` or refactor controller wiring.

## Next Steps
1. Catalogue failing groups specs, flag ones caused by missing fixtures vs. genuine regressions.
2. Restore core setup helpers (fixtures, factories) so canonical paths like EOS defaults, visible assignments, and weekly focus have deterministic data.
3. Update `doc/testing-strategy.md` with any remaining gaps or intentionally skipped tests.

### Known Failing Tests (2025‑09‑28 run)
Use these names to run targeted reproductions while triaging:

- `bundle exec ruby test/unit/group_test.rb -n "configurable_by? allows creators and account owners"`
- `bundle exec ruby test/unit/group_test.rb -n "test_[For_4dx/okr_teams]_prove_that_team_goals_owned_by_user_does_not_return_archived_objects"`
- `bundle exec ruby test/unit/group_test.rb -n "test_[For_4dx/okr_teams]_prove_that_team_goals_owned_by_user_returns_objects_assigned_to_user_or_created_by_user_and_not_assigned_to_anybody_else_or_assigned_to_multiple_teammates_including_user"`
- `bundle exec ruby test/unit/group_test.rb -n "test_[For_EOS_teams]_prove_that_team_goals_owned_by_user_does_not_return_archived_methods"`
- `bundle exec ruby test/unit/group_test.rb -n "test_[For_EOS_teams]_prove_that_team_goals_owned_by_user_returns_rocks_assigned_to_user_or_created_by_user_and_not_assigned_to_anybody_else_or_assigned_to_multiple_teammates_including_user"`
- `bundle exec ruby test/unit/group_test.rb -n "test_[For_v2mom_teams]_prove_that_team_goals_owned_by_user_does_not_return_archived_methods"`
- `bundle exec ruby test/unit/group_test.rb -n "test_[For_v2mom_teams]_prove_that_team_goals_owned_by_user_returns_methods_assigned_to_user_or_created_by_user_and_not_assigned_to_anybody_else_or_assigned_to_multiple_teammates_including_user"`
- `bundle exec ruby test/unit/group_test.rb -n "test_all_key_results_quick_test"`
- `bundle exec ruby test/unit/group_test.rb -n "test_all_owned_goals_returns_only_owned_goals"`
- `bundle exec ruby test/unit/group_test.rb -n "test_efforts_for_person_by_day_returns_only_shared_items"`
- `bundle exec ruby test/unit/group_test.rb -n "test_list_of_resultarea_children_returns_all_group_result_areas_2_missions"`
- `bundle exec ruby test/unit/group_test.rb -n "test_list_of_resultarea_children_returns_only_owned_group_result_areas"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_Weekly_focus_for_date_returns_weekly_focus_correctly_on_a_thursday"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_create_default_eos_seats_creates_the_5_eos_default_seats"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_create_default_eos_seats_sets_the_associated_team_id_of_visionary_and_itegrator_to_the_leadership_team_id"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_eos_is_enabled_when_the_account_of_the_parent_group_has_it"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_get_check_in_for_user_by_date_doesn_not_return_report_from_a_different_day"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_get_check_in_gets_the_json_content_of_the_status_report_for_a_user"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_for_v2mom_filters_by_year_and_quarter_correctly"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_method_when_only_assigned_=_false,_admin_can_still_view_all_goals_he_created"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_method_when_only_assigned_=_false,_member_can_only_view_all_key_results_which_user_has_viewing_rights_to"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_method_when_only_assigned_=_true,_member_can_only_view_key_results_that_are_assigned"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_returns_goals_for_the_team_admin_when_only_assigned_=_true"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_is_eos_enabled?_returns_true_if_purchased_add_ons_exists_and_eos_key_is_true"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_is_leadership_team_returns_true_if_group_is_set_as_leadership_team"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_method_can_use_eos?_returns_fakse_if_group_owners_account_does_not_have_EOS_enabeled"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_method_load_or_create_seats_doesn_not_create_eos_seats_if_no_option_is_passed"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_method_load_or_create_seats_returns_the_array_of_newly_created_seats"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_organizer_items_due_this_week_returns_items_for_this_week_only"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_organizer_print_time_settings_returns_defaults_when_no_meta_exists"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_set_leadership_team_removes_object_meta_of_old_leadership_team_and_creates_a_new_one_for_the_new_team_selected"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_set_leadership_team_updates_the_associated_team_id_of_visionary_and_integrator_seats_for_each_group_under_that_account"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_setup_sample_data_creates_default_mission_for_okr"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_should_redirect_to_vto?_returns_false_when_team_is_neither_eos_pure_or_leadership_team"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_should_redirect_to_vto?_returns_true_when_team_is_eos_pure"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_should_redirect_to_vto?_returns_true_when_team_is_leadership_team"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_4th_column_data_for_4dx_teams_include_items_aligned_to_key_results_and_the_descendants_of_projects_that_are_aligned_to_these_key_results"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_column_four_aligned_actions_filters_children_by_date_range"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_column_four_aligned_actions_filters_grandchildren_by_date_range_when_default_view_==_board"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_column_four_aligned_actions_include_only_grand_children_of_projects_where_default_view_==_board_"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_column_four_aligned_actions_return_4th_column_items_which_are_due_8days_ago"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_core_value_names_returns_an_array_of_core_value_names_when_core_values_exist"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_core_value_names_returns_an_empty_array_when_no_core_values_exist"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_display_scorecard_on_weekly_will_always_return_false_when_there_are_no_measure_yet_(prevents_error_on_rendering)"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_end_of_meeting_data_returns_only_#next_items_for_each_member"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_end_of_meeting_data_returns_top_3_only_for_each_member"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_end_of_meeting_data_returns_top_items_assigned_to_a_specific_user_only"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_end_of_meeting_data_returns_top_items_assigned_to_the_user"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_end_of_meeting_data_returns_top_items_created_by_the_user_but_not_assigned_to_anyone"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_goal_collection_does_not_return_persisent_rock_that_is_already_realized"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_goal_collection_includes_rocks_for_an_EOS_team_that_are_persistent_regardless_of_the_year/quarter_dates_passed"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_inherit_from_group_defaults_to_returning_itself_when_it's_not_inheriting_from_any_group"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_inherit_from_group_returns_the_group_it_inherits_from_which_is_it's_parent_group"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_inherit_from_group_returns_the_root_group_if_inheritance_are_cascading"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_is_inherit_from_parent_team?_returns_only_true_when_object_meta_is_inherit_parent_team_is_true"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_load_or_create_seats_creates_default_seats_and_the_first_and_2nd_level_seat_names_for_OKR_teams_are_'CEO'_and_'COO/President'"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_load_or_create_seats_creates_default_seats_and_the_first_and_2nd_level_seat_names_for_all_other_frameworks_are_'Visionary'_and_'Integrator'"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_logo_thumb_returns_an_empty_div_with_class_temp-team-logo_when_no_url_is_present_yet"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_rocks_with_duplicate_year_plan_id_objectmetas_will_not_return_duplicate_rocks_on_the_goal_collection"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_save_accountability_chart_creates_new_accountability_chart_data_when_data_is_present"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_save_accountability_chart_creates_new_accountability_chart_when_children_data_is_an_array"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_save_accountability_chart_removes_previous_accountability_chart"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_update_check_in_updates_the_status_of_items_added_to_done_section_to_realized/review"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_use_parent_goals_returns_false_when_team_is_not_eos_and_object_meta_is_false_(defaults_to_true)"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_visible_team_assignments_for_user_only_returns_items_from_members"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_visible_team_assignments_for_user_returns_anything_someone_has_on_their_day_plan_with_a_group_id_set"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_visible_team_assignments_for_user_returns_anything_user_has_assigned_where_group_id_is_set_to_the_the_current_group"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_visible_team_assignments_for_user_returns_items_on_day_plan_not_on_the_current_date_should_not_be_included"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_weekly_headlines_can_filter_by_date_range"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_weekly_headlines_include_comments/kudos_for_that_group_that_are_not_expired_yet_(if_obect_meta_exists)"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_weekly_headlines_returns_comments_which_are_kudos_related_to_the_group"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_weekly_headlines_skips_kudos_for_a_90second_practice"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_weekly_headlines_with_options[:include_existin]_set_to_true_includes_high5s_for_90s_practice"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_that_weekly_headlines_with_options[:include_existin]_when_set_to_true_ONLY_returns_existing_high5s_for_items_that_is_for_group(i.e_group_id)"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_visible_team_assignments_for_user_does_not_reutrn_duplicate_items"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_visible_team_assignments_for_user_is_subject_to_the_team_filter_on_the_page"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_visible_team_assignments_for_user_orders_assignments_by_position"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_visible_team_assignments_for_user_returns_assignments_created_by_other_team_members_are_returned_if_the_group_id_matches"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_weekly_focus_current_object_saves_this_weeks_focus_using_the_most_recent_weekly_focus"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_weekly_focus_save_No_other_logic_doesnt_set_to_defaults"`
- `bundle exec ruby test/unit/group_test.rb -n "test_prove_when_running_setup_sample_data_twice,_no_duplicate_Mission_records_are_created"`
- `bundle exec ruby test/unit/group_test.rb -n "test_provevisible_team_assignments_for_user_can_filter_by_status"`
- `bundle exec ruby test/unit/group_test.rb -n "test_test_list_of_group_descendants(user)_method_for_syntax_errors"`
- `bundle exec ruby test/unit/group_test.rb -n "test_visible_projects_for_quick_test"`
- `bundle exec ruby test/unit/group_test.rb -n "test_weekly_focus_by_name_Returns_prior_week_if_value_is_'last'_or_'previous'_and_one_is_present"`

## Risks / Dependencies
- Touching group fixtures affects other suites (assignments, missions, EOS). Pace the cleanup to avoid cascading failures.
- Some tests rely on legacy plugins (Timecop, ObjectMeta). Stabilizing them may require targeted refactors.

## Acceptance Criteria
- `bundle exec ruby test/unit/group_test.rb` completes with no unexpected failures/errors on a clean DB snapshot.
- All onboarding-related group helpers have trustworthy coverage (especially config rights, EOS toggles, visible assignments).
