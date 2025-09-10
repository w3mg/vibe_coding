# Current Payment & Subscription State

## Core Models

### StripeSubscription Model
Location: `app/models/stripe_subscription.rb`

**Key Fields:**
- `customer_id` - Stripe customer ID
- `subscription_status` - 'trialing', 'active', etc.
- `product_id` - Links to plan type (PRO_PLAN_ID, TEAM_PLAN_ID, ENT_PLAN_ID)
- `current_period_end` - When subscription expires
- `related_account_id` - Links to Account model
- `related_user_id` - Links to User model

**Plan Types:**
- Pro Plan - Max 5 users
- Team Plan - Unlimited users
- Enterprise Plan - Custom

### Account Model
Location: `app/models/account.rb:425-455`

**Key Methods:**
- `active_stripe_subscription` - Gets current active/trialing subscription
- `can_add_more_users_to_account` - Checks if account can add users based on plan limits

### User Model  
Location: `app/models/user.rb:9653-9896`

**Key Methods:**
- `active_stripe_subscription` - User's active subscription
- `should_prompt_to_purchase_plan?` - Main gating check
- `is_expired_trial?` - Check if trial has expired
- `is_member_of_paid_account?` - Check if user belongs to paid account

## Current Gating Logic

The system uses this decision tree for feature access:

```ruby
def should_prompt_to_purchase_plan?
  return false if:
    - User is member of paid account
    - User is system admin
    - Account is marked as paid
    - Account/User ID is in skip lists
    - Trial hasn't expired
    - Has active Stripe subscription
  
  return true (needs to pay)
end
```

## Key Observations

1. **Multiple Override Points:**
   - SKIP_PROMPT_ACCOUNT_IDS array
   - SKIP_PROMPT_USER_IDS array
   - CONSIDER_PAID arrays
   - is_marked_as_paid flag

2. **Trial Logic:**
   - 14-day default trial
   - Can create temporary trials
   - Checks both Stripe status and local trial_expiration_date

3. **User Limits:**
   - Pro Plan: 5 users max
   - Team/Enterprise: No limit (9999999)

4. **Webhook Integration:**
   - `StripeSubscription.process_event` handles Stripe webhooks
   - Updates subscription status automatically

## Where Gating Actually Happens

### 1. Application Controller (Global Check)
Location: `app/controllers/application_controller.rb:843`

Sets instance variables for every request:
```ruby
@stripe_subscription = current_user.active_stripe_subscription
@should_prompt_to_purchase_plan = current_user.should_prompt_to_purchase_plan?
@max_new_users_count = @stripe_subscription.max_new_users_count # Pro plan only
```

### 2. Layout File (Forces Redirect)
Location: `app/views/layouts/_b3_application_side.html.erb:58-70`

**Hard gate - redirects to upgrade page:**
```erb
<% if @should_prompt_to_purchase_plan %>
  <script>
    window.location = '/accounts/upgrade';
  </script>
<% end %>
```

### 3. Adding Users Gate
Location: `app/controllers/groups_controller.rb:1438`

**Blocks adding users to groups based on plan:**
```ruby
unless @group_account.can_add_more_users_to_account
  render :json => {error: "If you are seeing this in error. Please contact us."}
  return
end
```

### 4. Account Management
Location: `app/controllers/accounts_controller.rb:562,579`

Sets `@should_prompt_to_purchase_plan = false` when coming from Stripe or changing plans to prevent redirect loops.

## Current Gating Pattern

```
Every Request
    ↓
ApplicationController sets @should_prompt_to_purchase_plan
    ↓
Layout checks variable
    ↓
If true → Force redirect to /accounts/upgrade
If false → Allow page to render
    ↓
Individual actions may have additional checks (like user limits)
```