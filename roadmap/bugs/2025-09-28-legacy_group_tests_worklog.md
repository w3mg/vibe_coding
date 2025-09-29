# Legacy Group Tests Worklog

Each failing case has its own mini-task entry so developers can work one-at-a-time without cross-polluting context.

```
 bundle exec ruby test/unit/group_test.rb -n configurable_by_allows_creators_and_account_owners
```

_Status_: Failures observed after recent onboarding visibility update. Ground truth to confirm delegate logic. 

```
 bundle exec ruby test/unit/group_test.rb -n "test_[For_4dx/okr_teams]_prove_that_team_goals_owned_by_user_does_not_return_archived_objects"
```

_Status_: Regression originally flagged 2025-09-28. Investigate archived items filtering vs. fixture state.

```
 bundle exec ruby test/unit/group_test.rb -n "test_[For_4dx/okr_teams]_prove_that_team_goals_owned_by_user_returns_objects_assigned_to_user_or_created_by_user_and_not_assigned_to_anybody_else_or_assigned_to_multiple_teammates_including_user"
```

_Status_: Regression originally flagged 2025-09-28. Investigate assignment filters.

```
 bundle exec ruby test/unit/group_test.rb -n "test_[For_EOS_teams]_prove_that_team_goals_owned_by_user_does_not_return_archived_methods"
```

_Status_: Regression originally flagged 2025-09-28. Examine EOS-specific method filtering.

```
 bundle exec ruby test/unit/group_test.rb -n "test_[For_EOS_teams]_prove_that_team_goals_owned_by_user_returns_rocks_assigned_to_user_or_created_by_user_and_not_assigned_to_anybody_else_or_assigned_to_multiple_teammates_including_user"
```

_Status_: Regression originally flagged 2025-09-28. Examine EOS rock filtering.

```
 bundle exec ruby test/unit/group_test.rb -n "test_[For_v2mom_teams]_prove_that_team_goals_owned_by_user_does_not_return_archived_methods"
```

_Status_: Regression originally flagged 2025-09-28. Check V2MOM filtering.

```
 bundle exec ruby test/unit/group_test.rb -n "test_[For_v2mom_teams]_prove_that_team_goals_owned_by_user_returns_methods_assigned_to_user_or_created_by_user_and_not_assigned_to_anybody_else_or_assigned_to_multiple_teammates_including_user"
```

_Status_: Regression originally flagged 2025-09-28. Check V2MOM assignment filters.

```
 bundle exec ruby test/unit/group_test.rb -n "test_all_key_results_quick_test"
```

_Status_: Regression originally flagged 2025-09-28. Inspect quick test aggregator.

```
 bundle exec ruby test/unit/group_test.rb -n "test_all_owned_goals_returns_only_owned_goals"
```

_Status_: Regression originally flagged 2025-09-28. Inspect ownership scoping.

```
 bundle exec ruby test/unit/group_test.rb -n "test_efforts_for_person_by_day_returns_only_shared_items"
```

_Status_: Error due to placeholder “no test yet”; document expected behavior.

```
 bundle exec ruby test/unit/group_test.rb -n "test_list_of_resultarea_children_returns_all_group_result_areas_2_missions"
```

_Status_: Regression originally flagged 2025-09-28. Validate fixture seeds.

```
 bundle exec ruby test/unit/group_test.rb -n "test_list_of_resultarea_children_returns_only_owned_group_result_areas"
```

_Status_: Regression originally flagged 2025-09-28. Validate fixture seeds.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_Weekly_focus_for_date_returns_weekly_focus_correctly_on_a_thursday"
```

_Status_: Regression originally flagged 2025-09-28. Weekly focus Meta failing, likely fixture missing.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_create_default_eos_seats_creates_the_5_eos_default_seats"
```

_Status_: Regression originally flagged 2025-09-28. EOS seat seeding now failing; inspect `Group#load_or_create_seats`.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_create_default_eos_seats_sets_the_associated_team_id_of_visionary_and_itegrator_to_the_leadership_team_id"
```

_Status_: Regression originally flagged 2025-09-28. EOS seat association failing.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_eos_is_enabled_when_the_account_of_the_parent_group_has_it"
```

_Status_: Placeholder "no test" – confirm expectation, convert to real test or document.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_get_check_in_for_user_by_date_doesn_not_return_report_from_a_different_day"
```

_Status_: Error from Timecop/CustomContent interplay. Investigate nil date formatting.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_get_check_in_gets_the_json_content_of_the_status_report_for_a_user"
```

_Status_: Similar to above; inspect CustomContent callbacks around string vs. date.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_for_v2mom_filters_by_year_and_quarter_correctly"
```

_Status_: Regression originally flagged 2025-09-28. Check fixture year/quarter data.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_method_when_only_assigned_=_false,_admin_can_still_view_all_goals_he_created"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#goal_collection` branch.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_method_when_only_assigned_=_false,_member_can_only_view_all_key_results_which_user_has_viewing_rights_to"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#goal_collection` branch.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_method_when_only_assigned_=_true,_member_can_only_view_key_results_that_are_assigned"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#goal_collection` branch.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_goal_collection_returns_goals_for_the_team_admin_when_only_assigned_=_true"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#goal_collection` branch.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_is_eos_enabled?_returns_true_if_purchased_add_ons_exists_and_eos_key_is_true"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#is_eos_enabled?` vs fixtures.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_is_leadership_team_returns_true_if_group_is_set_as_leadership_team"
```

_Status_: Regression originally flagged 2025-09-28. Fixtures or metadata missing.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_method_can_use_eos?_returns_fakse_if_group_owners_account_does_not_have_EOS_enabeled"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#can_use_eos?`.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_method_load_or_create_seats_doesn_not_create_eos_seats_if_no_option_is_passed"
```

_Status_: Regression originally flagged 2025-09-28. Inspect seat creation logic.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_method_load_or_create_seats_returns_the_array_of_newly_created_seats"
```

_Status_: Regression originally flagged 2025-09-28. Seats not returned; inspect logic.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_organizer_items_due_this_week_returns_items_for_this_week_only"
```

_Status_: Regression originally flagged 2025-09-28. Check item due filtering.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_organizer_print_time_settings_returns_defaults_when_no_meta_exists"
```

_Status_: Regression originally flagged 2025-09-28. Validate default meta creation.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_set_leadership_team_removes_object_meta_of_old_leadership_team_and_creates_a_new_one_for_the_new_team_selected"
```

_Status_: Error due to missing `group4` fixture alias.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_set_leadership_team_updates_the_associated_team_id_of_visionary_and_integrator_seats_for_each_group_under_that_account"
```

_Status_: Error due to missing `group4` fixture alias.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_setup_sample_data_creates_default_mission_for_okr"
```

_Status_: Regression originally flagged 2025-09-28. Mission seeding not incrementing.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_should_redirect_to_vto?_returns_false_when_team_is_neither_eos_pure_or_leadership_team"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#should_redirect_to_vto?`.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_should_redirect_to_vto?_returns_true_when_team_is_eos_pure"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#should_redirect_to_vto?`.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_should_redirect_to_vто?_returns_true_when_team_is_leadership_team"
```

_Status_: Regression originally flagged 2025-09-28. Inspect `Group#should_redirect_to_vto?`.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_that_4th_column_data_for_4dx_teams_include_items_aligned_to_key_results_and_the_descendants_of_projects_that_are_aligned_to_these_key_results"
```

_Status_: Regression originally flagged 2025-09-28. Investigate 4th column filtering.

```
 bundle exec ruby test/unit/group_test.rb -n "test_prove_that_column_four_aligned_actions_filters_children_by_date_range"
```

_Status_: Regression originally flagged 2025-09-28. Investigate date filtering.

...

(Continue documenting each test run from the master list to individual blocks as time allows.)
