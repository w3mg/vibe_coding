# Add Skip Functionality to Onboarding

## Objective
Implement ability for users to skip onboarding entirely from the dashboard.

## Requirements

### Backend Changes
**File**: `app/controllers/onboarding_controller.rb` (lines 45-48)

Update `skip_onboarding` method to:
1. Delete ObjectMeta record with key "user_onboarding"
2. Set `should_show_onboarding = false`
3. Redirect to `/today/dashboard`

**Current Implementation**:
```ruby
def skip_onboarding
  current_user.update_attribute(:should_show_onboarding, false)
  redirect_to "/today/dashboard"
end
```

**New Implementation**:
```ruby
def skip_onboarding
  # Delete onboarding ObjectMeta record
  record = current_user.get_onboarding_meta_record
  record.destroy if record.present?

  # Set flag to false
  current_user.update_attribute(:should_show_onboarding, false)

  redirect_to "/today/dashboard"
end
```

### Frontend Changes
**File**: `app/views/onboarding/dashboard.html.erb`

Add a text link labeled "skip" that POSTs to `/onboarding/skip_onboarding`

**Location**: Dashboard only (not on individual step pages)

**Styling**: Subtle text link (not a button)

## Technical Details

- Route already exists: `POST /onboarding/skip_onboarding` (config/routes.rb:48)
- ObjectMeta key: `"user_onboarding"` (defined in User::OnboardingMeta)
- Method `get_onboarding_meta_record` available in User::OnboardingMeta concern

## Files Modified
1. `app/controllers/onboarding_controller.rb`
2. `app/views/onboarding/dashboard.html.erb`

## Testing Considerations
- Verify ObjectMeta record is deleted
- Verify `should_show_onboarding` flag is set to false
- Verify redirect to dashboard works
- Verify user does not see onboarding after skip
