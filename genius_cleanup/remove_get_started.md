# Remove /get_started Route - Action Plan

## Files to DELETE:
1. `app/views/welcome/get_started.html.erb`
2. `app/views/welcome/get_started_old.html.erb`

## Files to EDIT:

### 1. `config/routes.rb`
Remove 2 route lines (462-463):
```ruby
map.connect '/get_started', :controller => 'welcome', :action => 'get_started'
map.connect '/getstarted', :controller => 'welcome', :action => 'get_started'
```

### 2. `app/controllers/welcome_controller.rb`
Remove get_started method (lines 41-48):
```ruby
def get_started
  #Need to auto logout anyone visiting "get_started"
  if current_user
    sign_out(:user)
  end

  render :layout => "promo"
end
```

### 3. `test/functional/welcome_controller_test.rb`
Remove get_started test (lines 21-24):
```ruby
test "prove able to get get_started" do
  get :get_started
  assert_response :success
end
```

### 4. `app/views/layouts/promo.html.erb`
Remove conditional section for get_started (lines 370-433):
```erb
<%if controller.action_name=="get_started"%>
  <!-- entire section from line 370 to 433 -->
<%end%>
```

### 5. `app/controllers/users_controller.rb`
Update redirect at line 383 (needs new destination):
```ruby
redirect_to "/welcome/get_started"  # <- UPDATE THIS TO NEW DESTINATION
```
