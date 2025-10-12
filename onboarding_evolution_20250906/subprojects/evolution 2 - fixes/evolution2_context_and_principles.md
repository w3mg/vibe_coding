# Layout Selection Fix - Implementation Plan

**Date**: 2025-10-11
**Status**: Ready for Implementation
**Related**: session_flag_persistence_bug.md

---

## Problem Summary

Old users (pre-onboarding system) see the WRONG LAYOUT. They see correct dashboard content but wrapped in the onboarding layout instead of the normal layout.

**Root Cause**: Layout selection logic lives in the VIEW layer (b3_application.html.erb:33) based on a session flag that persists across user logins.

**Architectural Flaw**: The layout file is making business logic decisions about which wrapper to render. This violates MVC separation of concerns.

---

## Solution Architecture

### Core Principle: Move Layout Selection to Controller

**The controller should decide which layout to use, not the view.**

Rails provides the `layout` option in the `render` method specifically for this purpose. We should use it.

---

## Implementation Steps

### Step 1: Controller - Explicit Layout Selection
**File**: `app/controllers/today_controller.rb:141`

**Current Code**:
```ruby
render '_onboard_account_owners', :layout => "b3_application"
```

**Fixed Code**:
```ruby
render '_onboard_account_owners', :layout => "b3_application_onboarding"
```

**Why**: Explicitly tells Rails to use the onboarding layout wrapper. No ambiguity, no session flags needed.

---

### Step 2: Remove Session Flag from Controller
**File**: `app/controllers/today_controller.rb`

**Remove Line 130**:
```ruby
session[:is_onboarding] = true  # DELETE THIS
```

**Remove Line 144**:
```ruby
session[:is_onboarding] = nil  # DELETE THIS
```

**Why**: Session flag is no longer needed. Layout is explicitly set by controller.

---

### Step 3: Clean Up Layout File Logic
**File**: `app/views/layouts/b3_application.html.erb:33-35`

**Remove These Lines**:
```ruby
if session[:is_onboarding] or params[:onboarding] == "1"
  partial_to_use = '/layouts/b3_application_onboarding'
end
```

**Why**: Layout file should not make business logic decisions. Controller handles this now.

---

### Step 4: Handle `params[:onboarding]=1` Override
**File**: `app/controllers/today_controller.rb:125`

**Current Logic** (keep this):
```ruby
@should_show_account_onboarding = current_user.should_show_account_onboarding? ? true : (params[:onboarding] == '1' ? true : false)
```

This already handles the QA override case. When `params[:onboarding]=1`, the controller will render the onboarding partial with the onboarding layout (from Step 1).

**No additional changes needed** - the explicit layout in Step 1 handles this case.

---

### Step 5: Clean Up Onboarding Partial
**File**: `app/views/today/_onboard_account_owners.html.erb:326`

**Remove This Line**:
```ruby
<% session[:is_onboarding] = nil %>
```

**Why**: Session flag no longer exists. Controller manages layout selection.

---

### Step 6: Clean Up Layout File - Session Flag Clear Logic
**File**: `app/views/layouts/b3_application.html.erb:29-31`

**Remove These Lines**:
```ruby
if session[:is_onboarding] and current_user.onboarding_complete?
  session[:is_onboarding] = nil
end
```

**Why**: Session flag no longer exists.

---

## Updated Test Strategy

### Update Existing Tests
**File**: `test/functional/user_onboarding_today_controller_test.rb`

#### Remove Session Flag Tests (Lines 116-139)
These tests are no longer relevant:
- `test "prove onboarding session flag is set for new account owners"`
- `test "prove session flag resets based on the current user"`

**Delete both tests entirely.**

#### Add Layout Verification Tests

**Test 1: Old users get normal layout**
```ruby
test "prove old users get normal layout (not onboarding layout)" do
  old_user = users(:quentin)  # Pre-dates onboarding system
  sign_in :user, old_user

  get :dashboard

  assert_response :success
  assert_template layout: "layouts/b3_application"
  assert_not_equal "layouts/b3_application_onboarding", @response.layout
end
```

**Test 2: New users get onboarding layout**
```ruby
test "prove new users get onboarding layout" do
  new_user = setup_user_with_onboarding_incomplete
  sign_in :user, new_user

  get :dashboard

  assert_response :success
  assert_template layout: "layouts/b3_application_onboarding"
end
```

**Test 3: params[:onboarding]=1 forces onboarding layout**
```ruby
test "prove params onboarding forces onboarding layout for any user" do
  old_user = users(:quentin)
  sign_in :user, old_user

  get :dashboard, :onboarding => '1'

  assert_response :success
  assert_template layout: "layouts/b3_application_onboarding"
end
```

**Test 4: Completed users get normal layout**
```ruby
test "prove completed onboarding users get normal layout" do
  completed_user = setup_user_with_onboarding_complete
  sign_in :user, completed_user

  get :dashboard

  assert_response :success
  assert_template layout: "layouts/b3_application"
end
```

---

## Why This Solution Works

### 1. MVC Compliant
- **Controller**: Decides which layout to use (business logic)
- **View**: Just renders the chosen layout (presentation)
- **Model**: Determines onboarding status (`should_show_account_onboarding?`)

### 2. No Session Contamination
- No shared state between users
- Each request independently determines layout
- No persistence issues in Docker/browser sessions

### 3. Explicit & Clear
- Layout choice is obvious in controller code
- Easy to understand and debug
- No hidden logic in view files

### 4. Rails Best Practice
- Uses Rails' built-in `layout` option
- Follows convention over configuration
- Testable with `assert_template`

### 5. Works Across All Pages
- Any controller can use same pattern
- Explicit layout selection prevents leakage
- No global session state to manage

---

## Files Changed Summary

| File | Change | Reason |
|------|--------|--------|
| `app/controllers/today_controller.rb:141` | Change layout to `b3_application_onboarding` | Explicit layout selection |
| `app/controllers/today_controller.rb:130` | Remove `session[:is_onboarding] = true` | No longer needed |
| `app/controllers/today_controller.rb:144` | Remove `session[:is_onboarding] = nil` | No longer needed |
| `app/views/layouts/b3_application.html.erb:29-31` | Remove session flag clear logic | Session flag removed |
| `app/views/layouts/b3_application.html.erb:33-35` | Remove onboarding layout decision | Controller decides layout |
| `app/views/today/_onboard_account_owners.html.erb:326` | Remove session flag clear | Session flag removed |
| `test/functional/user_onboarding_today_controller_test.rb` | Remove 2 session tests, add 4 layout tests | Test new behavior |

---

## Testing Checklist

Before deploying to production:

- [ ] Run all existing onboarding tests (125 unit + 5 functional)
- [ ] Verify old user (quentin fixture) sees normal layout
- [ ] Verify new user sees onboarding layout
- [ ] Verify `params[:onboarding]=1` forces onboarding layout
- [ ] Verify completed user sees normal layout
- [ ] Test in Docker: Login as User A (onboarding), logout, login as User B (old) - verify no contamination
- [ ] Test QA workflow: `?onboarding=1` works for testing
- [ ] Verify no other controllers use `session[:is_onboarding]` (search codebase)

---

## Rollback Plan

If issues arise:

1. Revert controller change (restore `layout => "b3_application"`)
2. Restore session flag logic (lines 130, 144)
3. Restore layout file logic (lines 29-31, 33-35)
4. Restore onboarding partial clear (line 326)
5. Revert test changes

**Rollback Complexity**: Low - all changes are isolated and reversible

---

## Future Considerations

### Other Controllers Using Session Flag
Search for `session[:is_onboarding]` in:
- Other controller actions
- Other view files
- Helper methods

**Action**: Audit and update any other occurrences using same pattern.

### Layout Selection Helper
Consider creating a helper method:
```ruby
def layout_for_onboarding_state
  @should_show_account_onboarding ? "b3_application_onboarding" : "b3_application"
end
```

Then use in controller:
```ruby
render action, layout: layout_for_onboarding_state
```

**Benefit**: Single source of truth for layout logic

---

## Code Complete Checklist

- [x] **Simplicity**: Removes session flag complexity
- [x] **Clarity**: Explicit layout selection is obvious
- [x] **Correctness**: Follows MVC principles
- [x] **Maintainability**: Easy to understand and modify
- [x] **Testability**: Controller behavior is directly testable
- [x] **No Side Effects**: No global state contamination

---

## Implementation Order

1. **Update tests first** (TDD approach)
   - Add new layout verification tests
   - Run tests (will fail)

2. **Implement controller changes**
   - Change render layout (Step 1)
   - Remove session flags (Step 2)
   - Run tests (should pass)

3. **Clean up view files**
   - Remove layout logic (Step 3)
   - Remove partial session clear (Step 5)
   - Remove layout session clear (Step 6)
   - Run tests (still pass)

4. **Remove obsolete tests**
   - Delete session flag tests
   - Run all tests (pass)

5. **Manual verification**
   - Test in Docker with multiple users
   - Verify QA workflow with `?onboarding=1`

---

## Success Criteria

- [ ] Old users see normal layout (b3_application)
- [ ] New users see onboarding layout (b3_application_onboarding)
- [ ] Completed users see normal layout
- [ ] `params[:onboarding]=1` forces onboarding layout for any user
- [ ] No session contamination between users
- [ ] All 125 unit tests pass
- [ ] All functional tests pass (updated count after changes)
- [ ] Code follows MVC principles
- [ ] Solution is simple and maintainable
- [ ] **Future-proof**: Onboarding can later be moved to its own dedicated page/route and skipped entirely without breaking layout logic

---

**Estimated Implementation Time**: 30-45 minutes
**Risk Level**: Low (isolated changes, easily reversible)
