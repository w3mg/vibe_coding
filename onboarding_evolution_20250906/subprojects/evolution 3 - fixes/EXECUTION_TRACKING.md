
  [ ] Write failing test: onboarding_controller#show renders onboarding partial
  [ ] confirm failures with user (user runs docker)
  [ ] Create app/controllers/onboarding_controller.rb with show action
  [ ] Implement onboarding#show to pass test (render _onboard_account_owners)
  [ ] Write failing test: onboarding#show sets session[:is_onboarding] = true
  [ ] Implement session flag setting in onboarding#show to pass test
  [ ] Write failing test: onboarding#show sets @should_show_account_onboarding
  [ ] Implement @should_show_account_onboarding in onboarding#show to pass test
  [ ] Add route: get '/today/onboarding' => 'onboarding#show'
  [ ] Write failing test: today#dashboard redirects to /today/onboarding when
  should_show_account_onboarding?
  [ ] Implement redirect in today#dashboard to pass test
  [ ] Write failing test: today#dashboard clears session[:is_onboarding] when should NOT
  show
  [ ] Verify session clearing logic passes test (already exists at line 144)
  [ ] Write failing test: layout uses @use_onboarding_layout not session flag
  [ ] Replace session check with @use_onboarding_layout if found
  [ ] Implement @use_onboarding_layout in onboarding controller to pass test
  [ ] user not llm - Run user_onboarding_today_controller_test.rb verify all tests pass
  [ ] Code Complete review: complexity minimal, naming clear, hard to break
  [ ] Update doc/resultmaps_onboarding_evolution.md with Evolution 3 notes
  [ ] Manual QA Docker: new user sees onboarding
  [ ] Manual QA Docker: old user sees dashboard even after same browser is used for a new user signup