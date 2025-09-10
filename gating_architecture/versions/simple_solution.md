# Simple Feature Gating Solution

## The Current Problem

Right now, you have an all-or-nothing gate:
- If trial expired + no subscription → User gets redirected to upgrade page for EVERYTHING
- This blocks access to the entire application

## The Simplest Solution

### Pattern 1: Feature-Specific Gates (Least Invasive)

Instead of blocking everything, check specific features:

```ruby
# In any controller action:
def export_reports
  if current_user.should_prompt_to_purchase_plan?
    render json: { error: "This feature requires a paid plan" }, status: 403
    return
  end
  # ... normal export logic
end
```

### Pattern 2: Plan-Based Features

Check what plan they have:

```ruby
# In User or Account model:
def can_use_feature?(feature_name)
  return true if is_system_admin?
  
  subscription = active_stripe_subscription
  return false unless subscription
  
  case feature_name
  when :advanced_reports
    subscription.is_team_plan? || subscription.is_enterprise_plan?
  when :bulk_import
    subscription.is_enterprise_plan?
  when :basic_features
    true # Available to all paid plans
  else
    false
  end
end

# Usage in controller:
unless current_user.can_use_feature?(:advanced_reports)
  render json: { error: "Upgrade to Team plan for this feature" }
  return
end
```

### Pattern 3: Soft Gates (Show but Disable)

For UI elements, show them but disabled:

```erb
<% if current_user.can_use_feature?(:advanced_reports) %>
  <%= link_to "Export Report", export_path, class: "btn btn-primary" %>
<% else %>
  <button class="btn btn-disabled" data-toggle="tooltip" 
          title="Upgrade to Team plan for this feature">
    Export Report 🔒
  </button>
<% end %>
```

## Implementation Steps

### Step 1: Add Feature Flags

```ruby
# app/models/stripe_subscription.rb
FEATURE_GATES = {
  pro: [:basic_reports, :5_users, :api_access],
  team: [:basic_reports, :unlimited_users, :api_access, :advanced_reports],
  enterprise: [:everything]
}

def allowed_features
  case product_id
  when PRO_PLAN_ID
    FEATURE_GATES[:pro]
  when TEAM_PLAN_ID
    FEATURE_GATES[:team]
  when ENT_PLAN_ID
    FEATURE_GATES[:enterprise]
  else
    []
  end
end
```

### Step 2: Add Helper Method

```ruby
# app/models/user.rb
def has_feature?(feature)
  # Admins get everything
  return true if is_system_admin?
  
  # Skip lists get everything
  return true if SKIP_PROMPT_USER_IDS.include?(id)
  
  # Check subscription
  subscription = active_stripe_subscription
  return false unless subscription
  
  subscription.allowed_features.include?(feature)
end
```

### Step 3: Use in Controllers

```ruby
# app/controllers/reports_controller.rb
before_action :check_reporting_access, only: [:advanced_export]

private

def check_reporting_access
  unless current_user.has_feature?(:advanced_reports)
    respond_to do |format|
      format.html { redirect_to upgrade_path, alert: "This feature requires Team plan" }
      format.json { render json: { error: "Feature requires upgrade" }, status: 403 }
    end
  end
end
```

## Migration Path

1. **Keep existing hard gate** for trial expiration (no breaking changes)
2. **Add soft gates** for new premium features
3. **Gradually convert** features to use `has_feature?` checks
4. **Remove hard gate** when ready (optional)

## Quick Win Example

To gate a single new feature TODAY without breaking anything:

```ruby
# In any controller:
if current_user.active_stripe_subscription&.is_pro_plan?
  flash[:alert] = "This feature requires Team plan or higher"
  redirect_to current_plan_path
  return
end
```

That's it. No model changes, no complex refactoring.