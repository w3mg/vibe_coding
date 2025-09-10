# Current Payment & Gating State (v3)

This document summarizes how ResultMaps currently determines paid access and where gates are enforced. It is code-accurate but avoids brittle line numbers.

## Core Data & Models

- `StripeSubscription` (app/models/stripe_subscription.rb)
  - Key fields: `customer_id`, `subscription_status` (e.g., `trialing`, `active`), `product_id`, `current_period_end`, `related_account_id`, `related_user_id`.
  - Plan helpers: `is_pro_plan?`, `is_team_plan?`, `is_enterprise_plan?`.
  - Pro user limit: `max_allowed_users` (5 for Pro, effectively unlimited otherwise), `max_new_users_count`, `max_new_users_reached`.
  - Overrides: `SKIP_PROMPT_ACCOUNT_IDS`, `SKIP_PROMPT_USER_IDS`.
  - Stripe webhooks: `StripeSubscription.process_event(event)` updates subscription status, period dates, product info, invoice details, and associates to `Account`/`User`.

- `User` (app/models/user.rb)
  - `active_stripe_subscription`: first non-archived subscription for the default account, with status in [`trialing`, `active`] and `current_period_end >= today`.
  - `should_prompt_to_purchase_plan?`: returns `true` when the user should be prompted, `false` otherwise. Short-circuits to `false` (no prompt) if any exemptions are true:
    - User is system admin.
    - User is member of a paid account (`is_member_of_paid_account?`).
    - Default account `is_marked_as_paid`.
    - Account/user is in `SKIP_PROMPT_*` arrays.
    - Trial has not expired (`is_expired_trial? == false`).
    - Otherwise: prompts unless `active_stripe_subscription` exists.
  - Trial helpers: `is_active_trial`, `days_left_in_trial`, `trial_days_left`, `trial_expiration_date`, `is_expired_trial?`.

- `Account` (app/models/account.rb)
  - `active_stripe_subscription` similar to user-level but scoped to the account.
  - `can_add_more_users_to_account` via subscription user limits (Pro cap).
  - Admin-visible `is_marked_as_paid` toggle.

## Where Gating Happens

1) Application-wide variables (app/controllers/application_controller.rb)
- For non-JSON requests, sets:
  - `@stripe_subscription = current_user.active_stripe_subscription`
  - `@should_prompt_to_purchase_plan = current_user.should_prompt_to_purchase_plan?`
  - `@max_new_users_count` if Pro
  - Trial indicators: `@is_active_trial`, `@days_left_in_trial`

2) Global hard gate in layout (app/views/layouts/_b3_application_side.html.erb)
- If `@should_prompt_to_purchase_plan` is true, forces redirect to `/accounts/upgrade` via JS.
- Effect: blocks most of the app when a user is past trial and unpaid, regardless of feature.

3) Feature-specific checks
- Example: Adding users (app/controllers/groups_controller.rb) denies when `@group_account.can_add_more_users_to_account` is false (Pro plan cap enforcement).
- Controllers may also set `@should_prompt_to_purchase_plan = false` to avoid redirect loops for specific flows (e.g., plan changes in `accounts_controller`).

## Effective Flow (Today)

Request → ApplicationController sets Stripe/trial vars → Layout checks `@should_prompt_to_purchase_plan`
  - If true → Redirect to `/accounts/upgrade` (global hard gate)
  - If false → Page renders → Controllers may perform additional plan/limit checks

## Observations & Implications

- Multiple exemption paths already exist and are used in `User#should_prompt_to_purchase_plan?`:
  - Admin, account paid flag, skip lists, member of a paid account, trial not expired.
- The layout-level redirect is coarse-grained and overrides per-feature gating.
- Stripe state is authoritative; logic already accounts for timezone and period end via `today_date` and `in_users_timezone` usage in `StripeSubscription#count_days`.
- Webhook-driven updates reduce drift between Stripe and local state.

## Constraints to Respect in Any New Approach

- Maintain and centralize exemptions/overrides; do not re-encode plan knowledge.
- Avoid DB changes; re-use `active_stripe_subscription` and existing trial helpers.
- Reconcile with the global layout redirect for any per-feature gating to be visible.

