# Feature Gating v3: Single Source of Truth + Redirect Reconciliation

Goal: Provide a minimal, obvious, reversible approach that leverages existing Stripe state and exemptions, without adding feature flag sprawl or duplicating plan knowledge.

## Core Principle
One method in `User` is the single source of truth for “paid access,” preserving today’s exemptions and with a tiny policy knob for trial vs. active.

## Proposed API

Add to `app/models/user.rb`:

```ruby
# Single source of truth for paid access
# - require_active: when true, trialing does NOT qualify.
# - default false maintains current behavior where trialing is acceptable for premium access.
def paid_feature_allowed?(require_active: false)
  # Exemptions (fast, already present in codebase)
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

Usage in controllers:

```ruby
unless current_user.paid_feature_allowed?
  redirect_to upgrade_path, alert: 'This feature requires a subscription'
  return
end
```

Usage in views:

```erb
<% if current_user.paid_feature_allowed? %>
  <%= link_to 'Premium Feature', premium_path %>
<% end %>
```

Optional stricter policy for select features:

```ruby
unless current_user.paid_feature_allowed?(require_active: true)
  redirect_to upgrade_path, alert: 'Upgrade to an active subscription to use this feature'
  return
end
```

## Reconcile the Global Redirect

Today, the layout forces a redirect when `@should_prompt_to_purchase_plan` is true, masking any per-feature checks. We’ll stage a safe, reversible change:

Option A (pilot flag, minimal risk):
- Introduce an environment flag (e.g., `FEATURE_GATING_V3=on`).
- In `ApplicationController`, when the flag is on, set `@should_prompt_to_purchase_plan = false` for pages we want to gate per-feature (or skip setting the layout redirect altogether).
- Gate specific features using `paid_feature_allowed?`.

Option B (route whitelist):
- Allow the global redirect only on a small set of pages (e.g., dashboard/home) and disable it on feature routes migrating to per-feature checks.

Both options are small, reversible, and avoid invasive refactors.

## Rollout Plan

1) Add `paid_feature_allowed?` to `User` (no DB changes).
2) Introduce a pilot switch (ENV or simple constant) to suppress the layout redirect where needed.
3) Convert one low-risk feature to use `paid_feature_allowed?` and validate UX.
4) Gradually extend to other premium features.
5) Optionally retire or permanently scope the global redirect once coverage is sufficient.

## Test Plan (No new frameworks required)

- Console checks:
  - Admin user → `paid_feature_allowed?` returns true.
  - User with active subscription → true.
  - User with trialing subscription → true (default policy), false with `require_active: true`.
  - User past trial with no sub → false.
  - Users in skip lists / account marked as paid / member of paid account → true.

- Manual acceptance:
  - With pilot enabled, navigate to a per-feature gated page as an unpaid user → see gate message, not global redirect.
  - As paid/trialing user → feature is available per policy.
  - Verify Pro user cap logic remains unchanged for adding users.

## Observability & Safety

- Add a single `Rails.logger.info` in the controller gate path to record denies (user id, account id, reason: no sub/trial policy).
- Backout: flip the pilot flag off to restore global redirect behavior.

## Why This Is Minimal and Durable

- Centralizes the access decision; no duplicated plan lists.
- Respects existing override mechanisms.
- Zero schema changes, tiny code footprint, and reversible rollout.
- Clear policy knob for trial vs active without sprinkling conditionals.

