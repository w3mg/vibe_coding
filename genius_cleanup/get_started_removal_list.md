# Files to Remove for /get_started Route

## Routes to Remove

**File**: `/Users/scottilevy/Development/resultmaps-web/config/routes.rb`
- Line 462: `map.connect '/get_started', :controller => 'welcome', :action => 'get_started'`
- Line 463: `map.connect '/getstarted', :controller => 'welcome', :action => 'get_started'`

## Controller Method to Remove

**File**: `/Users/scottilevy/Development/resultmaps-web/app/controllers/welcome_controller.rb`
- Lines 41-48: The `get_started` method

```ruby
def get_started
  #Need to auto logout anyone visiting "get_started"
  if current_user
    sign_out(:user)
  end

  render :layout => "promo"
end
```

## View Files to Remove

1. `/Users/scottilevy/Development/resultmaps-web/app/views/welcome/get_started.html.erb` (PRIMARY)
2. `/Users/scottilevy/Development/resultmaps-web/app/views/welcome/get_started_old.html.erb` (appears to be old backup)

## Test File to Update/Remove

**File**: `/Users/scottilevy/Development/resultmaps-web/test/functional/welcome_controller_test.rb`
- Lines 21-24: Remove test for `get_started`

```ruby
test "prove able to get get_started" do
  get :get_started
  assert_response :success
end
```

## Layout File References to Review

**File**: `/Users/scottilevy/Development/resultmaps-web/app/views/layouts/promo.html.erb`
- Line 370: Conditional check `<%if controller.action_name=="get_started"%>`
- Lines 370-433: Section that renders special content only for get_started action

**Note**: This layout is also used by other actions (register_from_promo_step2, register_from_promo_step3), so only the conditional section specific to get_started should be removed or reviewed.

## Redirect References to Update

**File**: `/Users/scottilevy/Development/resultmaps-web/app/controllers/users_controller.rb`
- Line 383: `redirect_to "/welcome/get_started"` in `register_from_promo_step2` method
  - This redirect needs to be updated to point to a different page

## Summary

### Files to DELETE:
1. `app/views/welcome/get_started.html.erb`
2. `app/views/welcome/get_started_old.html.erb`

### Files to EDIT:
1. `config/routes.rb` - Remove 2 route lines
2. `app/controllers/welcome_controller.rb` - Remove get_started method
3. `test/functional/welcome_controller_test.rb` - Remove get_started test
4. `app/views/layouts/promo.html.erb` - Remove or update conditional section for get_started
5. `app/controllers/users_controller.rb` - Update redirect to different page
