# Remove register_from_promo Flow - Action Plan

## Overview
The register_from_promo flow has multiple steps:
1. `register_from_promo` (POST) - Initial registration form submission
2. `register_from_promo_step2` (GET) - Step 2 view
3. `process_register_from_promo_step2` (POST) - Process step 2 data
4. `register_from_promo_step3` (GET) - Final confirmation view

## Files to DELETE:

1. `/Users/scottilevy/Development/resultmaps-web/app/views/users/register_from_promo.js.erb`
2. `/Users/scottilevy/Development/resultmaps-web/app/views/users/register_from_promo_step2.html.erb`
3. `/Users/scottilevy/Development/resultmaps-web/app/views/users/register_from_promo_step3.html.erb`

## Files to EDIT:

### 1. `config/routes.rb`
Remove these 3 lines from the `:users` resources collection (lines 330-332):
```ruby
:register_from_promo => :post,
:register_from_promo_step2 => :get,
:register_from_promo_step3 => :get,
```

### 2. `app/controllers/users_controller.rb`

Remove these 4 methods:

**Lines 356-377: `register_from_promo` method**
```ruby
def register_from_promo
  #logit("in register from promo")
  session[:created_user_id] = nil
  @user = User.new(params[:user])
  @user.confirmation_token = Devise.friendly_token
  @user.signup_type = 1
  #@user.skip_confirmation!
  # @user.confirmed_at = nil
  if @user.save
    # create object meta
    @user.set_meta_key_value( "signed_up_from", 1) #check this

    unless params[:account_name].blank?
     @account=Account.create!(:user_id=>@user.id, :name=>params[:account_name])  #sanitize account name?
    end

    @valid = true
    session[:created_user_id] = @user.id
      session[:created_account_id] = @account.id
    UserMailer.deliver_signup_summary([@user]) if RAILS_ENV != "test"
  end
end
```

**Lines 379-392: `register_from_promo_step2` method**
```ruby
def register_from_promo_step2
  #TODO move to quick_start

  if session[:created_user_id].blank?
    redirect_to "/welcome/get_started"
    return
  end

  user = User.find(session[:created_user_id])
  @signup_data = user.signup_data
  @logins = Hashtag.get_logins_from_text(@signup_data)

  render :layout => "promo"
end
```

**Lines 394-448: `process_register_from_promo_step2` method**
```ruby
def process_register_from_promo_step2
  errors = []
  users = []
  @author = User.find(session[:created_user_id])
  @account=@author.default_account

  signup_data = {
    :title => params[:title],
    :complete_notes => JSON.parse(params[:complete_notes].present? ? params[:complete_notes] : "{}"),
    :skip_delivering_notes => params[:skip_delivering_notes]
  }.to_json
  # ... rest of method (lines 394-448)
```

**Lines 461-475: `register_from_promo_step3` method**
```ruby
def register_from_promo_step3
  #email confimation link to author
  @user = User.find(session[:created_user_id])

  # Aditya : I commented this code below because this message : "Click the link in your email inbox to access your ResultMaps."
  # sign_in :user, @user


  #@user.send_confirmation_instructions
  render :layout => "promo"



  #session[:created_user_id] = nil
end
```

### 3. `test/functional/users_controller_test.rb`

Remove these 4 test methods:

**Lines 62-76: Test for `register_from_promo`**
```ruby
test "should able to process register_from_promo" do
  # ... test code
end
```

**Lines 96-100: Test for `register_from_promo_step2`**
```ruby
test "prove able to get register_from_promo2" do
  author = users(:quentin)
  get :register_from_promo_step2, {}, {'created_user_id' => author.id}
  assert_response :success
end
```

**Lines 102-124: Test for `process_register_from_promo_step2`**
```ruby
test "prove able to post process_register_from_promo_step2" do
  # ... test code
end
```

**Lines 126-132: Test for `register_from_promo_step3`**
```ruby
test "prove able to get register_from_promo_step3" do
  # ... test code
end
```

### 4. JavaScript Files with References

**These files reference `/users/register_from_promo` and may need updating:**

- `/Users/scottilevy/Development/resultmaps-web/public/javascripts/models_light_packaged.js` (line 480)
- `/Users/scottilevy/Development/resultmaps-web/public/javascripts/landing_page_package_packaged.js` (line 563)
- `/Users/scottilevy/Development/resultmaps-web/public/assets/javascripts/landing_page/index.js` (line 32)

**Note**: These are likely packaged/compiled files. The source files would need to be found and updated, then recompiled.

## Dependencies

**Important**: This removal is dependent on removing `/get_started` route first, since:
- `/get_started` view (app/views/welcome/get_started.html.erb) references register_from_promo (line 780)
- The register_from_promo flow redirects back to `/welcome/get_started` if session is missing

## Summary of Removals

### Controllers: 4 methods to remove
1. `register_from_promo`
2. `register_from_promo_step2`
3. `process_register_from_promo_step2`
4. `register_from_promo_step3`

### Views: 3 files to delete
1. `register_from_promo.js.erb`
2. `register_from_promo_step2.html.erb`
3. `register_from_promo_step3.html.erb`

### Routes: 3 routes to remove
1. `:register_from_promo => :post`
2. `:register_from_promo_step2 => :get`
3. `:register_from_promo_step3 => :get`

### Tests: 4 tests to remove
