## Evolution 3 - COMPLETE ✅

**Implemented Controllers:**
- `OnboardingController` (98 lines): `dashboard`, `skip`, `skip_onboarding` actions
- `AgentsController` (148 lines): `vision`, `core_values`, `yearly_targets`, `scorecard` + 2 API endpoints
- Both use `b3_application_onboarding` layout

**Implementation Details:**
- Main action is `dashboard` (not `show` as originally proposed)
- Full test coverage in functional tests
- Documented in resultmaps-web/doc/

  [x] Write failing test: onboarding_controller renders onboarding partial
  [x] confirm failures with user (user runs docker)
  [x] Create app/controllers/onboarding_controller.rb with actions
  [x] Implement onboarding#dashboard to pass test (render _onboard_account_owners)
  [x] Write failing test: onboarding sets appropriate instance variables
  [x] Implement instance variables in onboarding#dashboard to pass test
  [x] Write failing test: onboarding sets @should_show_account_onboarding
  [x] Implement @should_show_account_onboarding in onboarding#dashboard to pass test
  [x] Add route: get '/today/onboarding' => 'onboarding#dashboard'
  [x] Write failing test: today#dashboard redirects to /today/onboarding when should_show_account_onboarding?
  [x] Implement redirect in today#dashboard to pass test
  [x] Write failing test: today#dashboard clears session[:is_onboarding] when should NOT show
  [x] Verify session clearing logic passes test
  [x] Write failing test: layout uses b3_application_onboarding
  [x] Implement layout in onboarding controller to pass test
  [x] user not llm - Run user_onboarding_today_controller_test.rb verify all tests pass
  [x] Code Complete review: complexity minimal, naming clear, hard to break
  [x] Update doc/resultmaps_onboarding_evolution.md with Evolution 3 notes
  [x] Manual QA Docker: new user sees onboarding
  [x] Manual QA Docker: old user sees dashboard even after same browser is used for a new user signup