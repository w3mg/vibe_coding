# Session Flag Persistence Bug Analysis

**Date**: 2025-10-11
**Severity**: High
**Impact**: Old users see onboarding layout instead of normal dashboard layout

---

## Analysis Ratings

- **Accuracy**: 9/10
- **Completeness**: 9/10
- **Thoroughness**: 9/10

---

## Problem Description

Old users (those who signed up before the new onboarding system) are seeing the correct dashboard page content but wrapped in the **wrong layout** - they see the onboarding layout (`_b3_application_onboarding.html.erb`) instead of the standard `b3_application.html.erb` layout.

---

## Root Cause: Session Flag Persistence

### The Bug Chain

**1. Session Flag Gets Set**
- Location: `app/controllers/today_controller.rb:130`
- Code: `session[:is_onboarding] = true`
- This flag persists across different user logins in the same Docker container/browser session

**2. Session Flag Never Gets Cleared for Non-Onboarding Users**
- The controller sets the flag when onboarding should show
- **The controller does NOT clear the flag when onboarding should NOT show**
- This causes the flag to persist indefinitely

**3. Layout Selection Logic (Independent of Controller Logic)**
- Location: `app/views/layouts/b3_application.html.erb`
- Code:
```ruby
if session[:is_onboarding] or params[:onboarding] == "1"
  partial_to_use = '/layouts/b3_application_onboarding'
end
```

**4. Why Old Users Are Affected**
1. Old user logs into system
2. `should_show_account_onboarding?` returns `false` (line 271: column check fails because `users.should_show_onboarding` is not set)
3. Controller sets `@should_show_account_onboarding = false`
4. Dashboard renders normally (no onboarding partial shown on page)
5. **BUT** the layout independently checks `session[:is_onboarding]`
6. If flag was set by previous testing session or another user, layout switches to onboarding mode
7. **Result**: Correct page content with wrong layout wrapper

---

## Current Clearing Logic (Inadequate)

### Where Session Flag IS Cleared

1. **Layout cleanup** (partial, doesn't help old users):
```ruby
# app/views/layouts/b3_application.html.erb
if session[:is_onboarding] and current_user.onboarding_complete?
  session[:is_onboarding] = nil
end
```
- Only clears when user both has flag AND is complete
- Old users never have `onboarding_complete?` return true

2. **Onboarding partial** (only on completion):
```ruby
# app/views/today/_onboard_account_owners.html.erb:326
<% session[:is_onboarding] = nil %>
```
- Only executed when onboarding completes with confetti
- Never reached by old users

### What's Missing

**Controller never clears the flag for users who shouldn't see onboarding.**

---

## Trigger Scenarios

### Scenario 1: QA Testing Contamination
1. QA tests with `?onboarding=1` parameter
2. Flag gets set: `session[:is_onboarding] = true`
3. QA navigates away without completing onboarding
4. Flag persists in session
5. Different user logs in on same container/browser
6. Old user now sees onboarding layout

### Scenario 2: Abandoned Onboarding
1. New user starts onboarding flow
2. User gets distracted, navigates to different page
3. Flag remains set in session
4. User logs out
5. Old user logs in on same browser/container
6. Old user inherits the flag, sees wrong layout

### Scenario 3: Cross-User Contamination (Docker)
1. New user completes onboarding in Docker container
2. Session is shared at container level (not properly isolated)
3. Old user logs in to same container
4. Flag still set from previous user's session
5. Old user sees onboarding layout

---

## The Fix

### Controller Change Required

**Location**: `app/controllers/today_controller.rb:125-143`

**Current Code**:
```ruby
@should_show_account_onboarding = current_user.should_show_account_onboarding? ? true : (params[:onboarding] == '1' ? true : false)

if @should_show_account_onboarding == true
  @is_today_dashboard = true
  session[:is_onboarding] = true

  # get onboarding group
  group = current_user.get_onboarding_group
  if group.present?
    @group = group
    set_group_context_to(@group.id)
  end

  # skip remaning code below to make it load faster
  @sidebar_hidden = true
  render '_onboard_account_owners',:layout => "b3_application"
  return
end
```

**Fixed Code**:
```ruby
@should_show_account_onboarding = current_user.should_show_account_onboarding? ? true : (params[:onboarding] == '1' ? true : false)

if @should_show_account_onboarding == true
  @is_today_dashboard = true
  session[:is_onboarding] = true

  # get onboarding group
  group = current_user.get_onboarding_group
  if group.present?
    @group = group
    set_group_context_to(@group.id)
  end

  # skip remaning code below to make it load faster
  @sidebar_hidden = true
  render '_onboard_account_owners',:layout => "b3_application"
  return
else
  # CRITICAL FIX: Clear session flag for users who shouldn't see onboarding
  session[:is_onboarding] = nil
end
```

### Why This Fix Works

1. **Positive Case**: Users who should see onboarding → flag gets set
2. **Negative Case**: Users who should NOT see onboarding → flag gets cleared
3. **Isolation**: Each user's dashboard load explicitly manages the flag state
4. **No Contamination**: Previous user's onboarding state cannot leak to next user

---

## Testing Strategy

### Test Case 1: Old User After QA Testing
1. QA tests with `?onboarding=1`
2. Log out
3. Log in as old user (pre-onboarding account)
4. **Expected**: Normal dashboard layout
5. **Verify**: Check browser DevTools → Application → Session Storage for `is_onboarding`

### Test Case 2: Old User After New User
1. Create new user, start onboarding
2. Navigate away mid-onboarding
3. Log out
4. Log in as old user
5. **Expected**: Normal dashboard layout

### Test Case 3: Old User After Completed Onboarding
1. New user completes full onboarding flow
2. Log out
3. Log in as old user
4. **Expected**: Normal dashboard layout

### Test Case 4: New User Still Works
1. Create brand new account
2. Complete signup
3. **Expected**: Onboarding layout and cards show
4. Complete all steps
5. **Expected**: Confetti, then redirect to normal dashboard

---

## Additional Recommendations

### 1. Session Isolation in Docker
Consider using separate session stores per user to prevent cross-contamination in Docker environments.

### 2. Defensive Layout Check
The layout could add an additional safety check:
```ruby
# app/views/layouts/b3_application.html.erb
if (session[:is_onboarding] or params[:onboarding] == "1") and current_user.should_show_account_onboarding?
  partial_to_use = '/layouts/b3_application_onboarding'
end
```

This makes the layout decision match the controller logic, providing defense in depth.

### 3. Session Flag Documentation
Add comment in controller explaining the flag lifecycle:
```ruby
# session[:is_onboarding] controls which layout wrapper is used
# - Set to true when onboarding should show
# - MUST be explicitly cleared when onboarding should NOT show
# - Layout selection depends on this flag (b3_application.html.erb)
```

---

## Files Involved

### Controllers
- `app/controllers/today_controller.rb` (lines 124-143) - **PRIMARY FIX LOCATION**

### Views
- `app/views/layouts/b3_application.html.erb` - Layout selection logic
- `app/views/layouts/_b3_application_onboarding.html.erb` - Onboarding layout
- `app/views/today/_onboard_account_owners.html.erb` (line 326) - Completion flag clear

### Models
- `app/models/user/onboarding_meta.rb` (line 269-293) - `should_show_account_onboarding?` method

---

## Code References

- Entry point check: `today_controller.rb:124`
- Flag set: `today_controller.rb:130`
- **Missing flag clear**: After line 143 (in else branch)
- Layout decision: `b3_application.html.erb` (search for `session[:is_onboarding]`)
- Completion clear: `_onboard_account_owners.html.erb:326`
- Visibility logic: `user/onboarding_meta.rb:269`

---

## Impact Assessment

### Users Affected
- All users who created accounts before onboarding system was deployed
- Estimated: Any user with `users.should_show_onboarding != true`

### Business Impact
- **High**: Old users see broken/confusing UI
- **Brand Damage**: Looks like application bug/regression
- **Support Burden**: Users may report as bug or get confused

### Technical Debt
- Session management is fragile
- Layout logic is decoupled from controller logic
- No session hygiene between user logins

---

## Related Documentation

- Main onboarding doc: `resultmaps-web/doc/resultmaps_onboarding_evolution.md`
- Architecture: `vibe_coding/onboarding_evolution_20250906/subprojects/evolution 1/architecture_v2.md`
- Implementation tracking: `vibe_coding/onboarding_evolution_20250906/subprojects/evolution 1/implementation_plan_and_tracking.md`
