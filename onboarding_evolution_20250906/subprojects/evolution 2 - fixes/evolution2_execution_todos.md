# Layout Selection Fix - TDD Implementation Plan

**Date**: 2025-10-11
**Status**: Planning Phase

---

## Problem

Old users see onboarding layout when they should see normal dashboard layout.

## Root Cause

Layout file makes business logic decisions instead of controller. View layer shouldn't decide which layout to use - this violates MVC separation of concerns.

---

## TDD Implementation Order

### Phase 1: Write Tests (All Should Fail)

**File**: `test/functional/user_onboarding_today_controller_test.rb`

**Test 1: Old user accessing dashboard**
- User: fixture user (pre-dates onboarding)
- Action: GET `/today/dashboard`
- Assert: Response is success (200)
- Assert: Renders normal dashboard view
- Assert: Does NOT redirect

**Test 2: New user accessing dashboard**
- User: new account owner with incomplete onboarding
- Action: GET `/today/dashboard`
- Assert: Redirects to `/today/onboarding`
- Assert: HTTP 302

**Test 3: New user accessing onboarding directly**
- User: new account owner with incomplete onboarding
- Action: GET `/today/onboarding`
- Assert: Response is success (200)
- Assert: Renders onboarding partial
- Assert: Uses onboarding layout

**Test 4: Old user accessing onboarding with QA param**
- User: fixture user (old)
- Action: GET `/today/onboarding?onboarding=1`
- Assert: Response is success (200)
- Assert: Renders onboarding partial
- Assert: Uses onboarding layout

**Test 5: Completed user accessing dashboard**
- User: user with all onboarding steps complete
- Action: GET `/today/dashboard`
- Assert: Response is success (200)
- Assert: Renders normal dashboard view
- Assert: Does NOT redirect

**Test 6: Old user cannot force onboarding without param**
- User: fixture user (old)
- Action: GET `/today/onboarding` (no param)
- Assert: Redirects to `/today/dashboard`
- Assert: HTTP 302

**Test 7: Layout uses controller variable not session**
- User: new account owner
- Action: GET `/today/onboarding`
- Assert: `@should_show_account_onboarding` is true
- Assert: Layout renders onboarding wrapper
- Assert: No session flag set

**Run tests** → All should FAIL (routes/actions don't exist yet)

---

### Phase 2: Add Route

**File**: `config/routes.rb`

**Add route for today/onboarding**
- Maps GET request to TodayController#onboarding
- Creates named route helper

**Run tests** → Some routing tests should pass, action tests still fail

---

### Phase 3: Create Onboarding Action

**File**: `app/controllers/today_controller.rb`

**Add new action: onboarding**
- Calculate `@should_show_account_onboarding`
- If false, redirect to dashboard
- If true, set up onboarding group context
- Render onboarding partial with onboarding layout

**Run tests** → Tests 3, 4, 6 should pass

---

### Phase 4: Update Dashboard Action

**File**: `app/controllers/today_controller.rb`

**Modify dashboard action (lines 124-145)**
- Keep calculation of `@should_show_account_onboarding`
- Add redirect to onboarding if true
- Remove onboarding rendering logic
- Continue with normal dashboard

**Run tests** → Tests 1, 2, 5 should pass

---

### Phase 5: Fix Layout Logic

**File**: `app/views/layouts/b3_application.html.erb`

**Change line 33**
- Replace session check with `@should_show_account_onboarding` check

**Run tests** → Test 7 should pass, all layout tests pass

---

### Phase 6: Remove Session Flag References

**File**: `app/views/layouts/b3_application.html.erb`
- Delete session cleanup logic (lines 29-31)

**File**: `app/views/today/_onboard_account_owners.html.erb`
- Delete session flag clear (line 326)

**Run tests** → All tests should still pass

---

### Phase 7: Remove Obsolete Session Tests

**File**: `test/functional/user_onboarding_today_controller_test.rb`

**Delete these tests** (no longer relevant):
- `test "prove onboarding session flag is set for new account owners"`
- `test "prove session flag resets based on the current user"`

**Run all tests** → All remaining tests should pass

---

## Success Criteria

- [ ] All 7 new tests written and initially fail
- [ ] All 7 new tests pass after implementation
- [ ] 2 session flag tests removed
- [ ] All existing unit tests (125) still pass
- [ ] All existing functional tests still pass
- [ ] No session flag references remain in codebase

---

## Files Modified

1. `test/functional/user_onboarding_today_controller_test.rb` - Add 7 tests, remove 2
2. `config/routes.rb` - Add onboarding route
3. `app/controllers/today_controller.rb` - Add onboarding action, modify dashboard
4. `app/views/layouts/b3_application.html.erb` - Fix line 33, remove lines 29-31
5. `app/views/today/_onboard_account_owners.html.erb` - Remove line 326

---

## Implementation Notes

**This is a planning document. Implementation happens collaboratively:**
- Review each phase
- Discuss specific implementation details
- Write code together
- Verify assumptions
- Run tests after each phase
