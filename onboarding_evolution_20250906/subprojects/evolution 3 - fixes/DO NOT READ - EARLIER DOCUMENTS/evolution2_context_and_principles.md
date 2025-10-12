# Evolution 2 - Architectural Context & Principles

**Date**: 2025-10-11
**Purpose**: Define architectural requirements for onboarding separation
**Related**: evolution2_execution_todos.md, session_flag_persistence_bug.md

---

## Current Problem

Old users see onboarding layout instead of normal layout.

**Root Cause:** Layout selection in view layer using session flags that leak between users.

---

## Future Requirements (Not Built Yet, But Architecture Must Support)

1. **Skippable Onboarding** - Skip during signup, access later from settings
2. **Standalone Screen** - Onboarding as its own page, not embedded in dashboard
3. **Multiple Onboarding Types** - Different flows for account owners, teammates, roles
4. **Settings Access** - Return to onboarding anytime from help menu

---

## Why Separate Controller Now

**Could we just patch TodayController?** Yes, would fix the bug.

**Why we're not:** Patching makes future requirements harder. Separate controller makes them trivial.

**Architecture first, features later.** Build the right structure now, add features incrementally.

---

## Non-Negotiable Principles

### Code Complete
Simple over complex. Clear over clever. Maintainable over convenient. Obvious over elegant.

### MVC Separation
**Controller:** Business logic, routing, layout decisions
**View:** Presentation only
**Model:** Data, state, domain methods

### Testability
Every decision testable. Test behavior not implementation. Simple tests.

### No Shared State
No session flags for business logic. Each request independent. No user contamination.

---

## Correct Patterns

### Controller Decides Layout
```ruby
# CORRECT
render :onboarding, layout: "b3_application_onboarding"

# WRONG
if session[:is_onboarding]
  partial_to_use = '/layouts/b3_application_onboarding'
end
```

### Controller Decides Routing
```ruby
# CORRECT
if current_user.should_show_account_onboarding?
  redirect_to onboarding_path
else
  render :dashboard
end

# WRONG - one action, two views
if @should_show_onboarding
  render 'onboarding'
else
  render 'dashboard'
end
```

### Model Provides State
```ruby
# CORRECT
current_user.should_show_account_onboarding?

# WRONG
session[:is_onboarding]
```

---

## Target Architecture

**TodayController#dashboard** - Dashboard only. Redirects to onboarding if needed.
**OnboardingController#show** - Onboarding only. Redirects to dashboard if complete.
**One controller, one job.**

Why this enables future:
- Skip onboarding? Don't redirect from dashboard.
- Multiple types? Add OnboardingController#teammate.
- Settings access? Link to onboarding_path.

Clean separation makes everything simple.

---

## Testing Requirements

**Test:** Controller routing, layout selection, user sees correct content, no contamination
**Don't Test:** Implementation details, view internals, CSS

**Pattern:**
```ruby
test "old user sees dashboard" do
  sign_in old_user
  get :dashboard
  assert_response :success
  assert_template :dashboard
  assert_template layout: "b3_application"
end
```

---

## Success Criteria

### Technical
- [ ] OnboardingController exists
- [ ] OnboardingController uses onboarding layout
- [ ] TodayController only handles dashboard with normal layout
- [ ] Controllers decide layouts not views
- [ ] No session flags for business logic
- [ ] Old users see dashboard with normal layout
- [ ] New users are redirected to onboarding based on existing model flags
- [ ] Redirect/routing logic respects onboarding state (incomplete, skipped, dismissed)
- [ ] All existing tests pass
- [ ] New tests verify behavior
- [ ] MVC principles followed
- [ ] Future requirements possible (skip, dismiss, settings access)

### Process
- [ ] Todos are easy to track by human or LLM
- [ ] Easy to hand off any stage to different developer or LLM
- [ ] All work proceeds step-by-step with approvals for 100% alignment
- [ ] Easy to implement
- [ ] Easy to maintain by person or LLM

---

## Files Modified

- `config/routes.rb` - Add route
- `app/controllers/onboarding_controller.rb` - CREATE
- `app/controllers/today_controller.rb` - Remove onboarding
- `app/views/layouts/b3_application.html.erb` - Remove session flags
- `app/views/today/_onboard_account_owners.html.erb` - Remove session flags
- `test/functional/onboarding_controller_test.rb` - CREATE
- `test/functional/user_onboarding_today_controller_test.rb` - Update

---

## Not Doing Yet

Multiple onboarding types, skip functionality, settings access, invited teammate flow.

Future evolutions. Architecture supports them now.

---

## Rollback

1. Delete OnboardingController
2. Restore TodayController logic
3. Restore session flags
4. Restore tests

**Risk:** Low - isolated, reversible
