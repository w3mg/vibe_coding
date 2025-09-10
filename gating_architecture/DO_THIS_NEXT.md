# DO_THIS_NEXT: Implement v3 Gating (Copy-Paste Prompt)

Use this prompt with your coding assistant to implement the v3 plan safely and reversibly.

---

CONTEXT
- Repo: `~/Development/resultmaps-web`
- Language/Framework: Rails 2.3
- Stripe model: `StripeSubscription`
- Current global hard gate: layout redirect when `@should_prompt_to_purchase_plan` is true
- v3 goal: Add a single-source-of-truth method for paid access and pilot per-feature gating by scoping the global redirect

TASK
1) Add `User#paid_feature_allowed?(require_active: false)` per spec below.
2) Add a pilot toggle to suppress the global layout redirect on selected routes.
3) Gate one low-risk action as proof (e.g., `ReportsController#dashboard`).
4) Add minimal logging and test instructions.

REQUIREMENTS
- Do not change DB schema.
- Preserve existing exemptions (admin, account paid, skip lists, member of a paid account).
- Default policy: trialing qualifies unless `require_active: true` is explicitly passed.
- Keep changes surgical and reversible.

EDITS
A) Add method to `app/models/user.rb` near other Stripe helpers:

```ruby
# Single source of truth for paid access
# - require_active: when true, trialing does NOT qualify.
# - default false maintains current behavior where trialing is acceptable.
def paid_feature_allowed?(require_active: false)
  # Exemptions (fast)
  return true if is_system_admin?
  return true if self.try(:default_account).try(:is_marked_as_paid)
  return true if StripeSubscription::SKIP_PROMPT_ACCOUNT_IDS.include?(self.default_account.id)
  return true if StripeSubscription::SKIP_PROMPT_USER_IDS.include?(self.id)
  return true if is_member_of_paid_account?

  # Subscription gate
  sub = active_stripe_subscription
  return false unless sub

  # Policy: trial vs active
  return true  if sub.subscription_status == 'active'
  return !require_active && sub.subscription_status == 'trialing'
end
```

B) Add pilot toggle and route scoping in `app/controllers/application_controller.rb` where `@should_prompt_to_purchase_plan` is set (non-JSON block):

```ruby
# After setting @should_prompt_to_purchase_plan
pilot_on = (ENV['FEATURE_GATING_V3'].to_s.downcase == 'on')

# Whitelist pilot routes for per-feature gating
# Keep small to start; expand later
@suppress_global_upgrade_redirect = false
if pilot_on
  controller = params[:controller].to_s
  action     = params[:action].to_s
  piloted_routes = [
    ['reports', 'dashboard'],
    ['reports', 'index']
  ]
  @suppress_global_upgrade_redirect = piloted_routes.include?([controller, action])
end
```

C) Update layout redirect condition in `app/views/layouts/_b3_application_side.html.erb`:

Find the block:
```erb
<% if @should_prompt_to_purchase_plan %>
  <script type="text/javascript">
    if (typeof window.navigateTo == 'function'){
      window.navigateTo('/accounts/upgrade');
    } else {
      window.location = '/accounts/upgrade';
    };
  </script>
<% end %>
```
Replace the opening line with:
```erb
<% if @should_prompt_to_purchase_plan && !@suppress_global_upgrade_redirect %>
```

D) Gate one low-risk action (proof) in `app/controllers/reports_controller.rb`:

Add near the top with other filters:
```ruby
before_filter :require_paid_access_v3, only: [:dashboard]
```

Add a private method:
```ruby
private

def require_paid_access_v3
  unless current_user.paid_feature_allowed?
    Rails.logger.info("paid_gate_deny user=#{current_user.id} account=#{current_user.default_account.id} reason=no_paid_access")
    redirect_to upgrade_path, :alert => 'This feature requires a subscription'
    return false
  end
end
```

E) Optional stricter policy example (do not enable yet):
- Where appropriate, call `current_user.paid_feature_allowed?(require_active: true)` if trialing users should be excluded for a specific feature.

ACCEPTANCE CRITERIA
- Unpaid user past trial navigating to `/reports/dashboard` with `FEATURE_GATING_V3=on` sees the controller-level gate (alert + redirect) instead of the global layout redirect.
- Paid user (active) and admin users access `/reports/dashboard` normally.
- Trialing user accesses `/reports/dashboard` by default (policy knob is available but off).
- With `FEATURE_GATING_V3` unset or set to `off`, the legacy global layout redirect remains in effect everywhere.

TEST PLAN
- Console sanity:
  - Admin: `User.first.paid_feature_allowed?` → true
  - Active sub: true; Trialing: true; Past trial/no sub: false
  - Skip lists / account paid / member of paid account: true
- Manual:
  - Set `FEATURE_GATING_V3=on`; visit `/reports/dashboard` as unpaid past-trial → alert + redirect (and log line present)
  - Visit same as paid/trialing/admin → allowed
  - Toggle off the env var → legacy behavior returns

ROLLBACK
- Set `FEATURE_GATING_V3=off` (or remove the env var) to restore the legacy global redirect everywhere.

NOTES
- Keep the pilot list minimal to reduce risk. Expand after validating UX.
- Do not add plan-specific feature matrices in v3; avoid constant sprawl and duplicate plan knowledge.

---

Please implement exactly as specified, keeping diffs minimal and focused on the files above.
