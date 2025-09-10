# Feature Gating: The Simplest Solution (9/10)

## Core Principle (Code Complete)
**Manage complexity by choosing the most obvious solution.**

## The Solution: One Method, One Check

### Add ONE method to User model:

```ruby
# app/models/user.rb
def paid_feature_allowed?
  # Order matters: cheapest checks first (fail fast)
  return true if is_system_admin?
  return false unless active_stripe_subscription
  true
end
```

### Use it EXACTLY like existing pattern:

```ruby
# In any controller:
unless current_user.paid_feature_allowed?
  redirect_to upgrade_path, alert: "This feature requires a subscription"
  return
end
```

```erb
<!-- In any view: -->
<% if current_user.paid_feature_allowed? %>
  <%= link_to "Premium Feature", premium_path %>
<% end %>
```

## Why This Rates 9/10

### Ease of Implementation: 10/10
- Add 5 lines to User model
- Uses existing `active_stripe_subscription` method
- Follows existing `should_prompt_to_purchase_plan?` pattern
- **5 minutes to implement**

### Ease of Maintenance: 9/10
- Single source of truth
- No constants to update
- No feature lists to maintain
- Self-documenting method name
- Follows existing code patterns

### Speed of Implementation: 10/10
- Copy-paste ready
- No database changes
- No new dependencies
- Works immediately

### Code Complete Compliance: 9/10
- **Simplicity**: Cannot be simpler
- **Obvious**: Name says what it does
- **Fail Fast**: Admin check first (cheapest)
- **Consistent**: Matches existing patterns
- **No Magic**: No hidden complexity

## Total: 9.5/10

## Implementation Checklist

1. [ ] Add `paid_feature_allowed?` to User model (5 lines)
2. [ ] Test in console: `User.first.paid_feature_allowed?`
3. [ ] Use in one controller as proof
4. [ ] Done

## That's it. No more complexity needed.