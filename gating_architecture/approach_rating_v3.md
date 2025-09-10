# Approach Rating (v3)

Criteria: Ease of Implementation, Ease of Maintenance, Speed of Implementation, Code Complete Compliance. Scale 1–10.

## Summary Ratings

- Ease of Implementation: 10/10
  - One method in `User` (`paid_feature_allowed?`).
  - No database or dependency changes.
  - Uses existing `active_stripe_subscription` and exemptions.

- Ease of Maintenance: 10/10
  - Single source of truth for paid access logic.
  - No feature lists or plan constants to maintain beyond what already exists.
  - Clear, self-documenting method name; policy is a single, optional argument.

- Speed of Implementation: 10/10
  - ~15 lines added to `User`.
  - A small, reversible toggle to reconcile the global redirect.
  - Immediate applicability in controllers/views.

- Code Complete Compliance: 10/10
  - Simplicity: Minimal API, no refactors.
  - Obviousness: Name expresses intent; preserves current exemptions.
  - Fail Fast: Exemptions short-circuit before Stripe lookups.
  - Consistency: Aligns with `should_prompt_to_purchase_plan?` pattern and Stripe webhook state.
  - Testability: Clear console and manual acceptance steps.
  - Reversibility: Pilot flag provides an instant backout.

## Tradeoffs and Why They’re Acceptable

- We do not encode per-feature tiering (e.g., Team-only features) in v3 to avoid reintroducing constant sprawl. If required later, we can add an optional feature policy layer that composes on top of `paid_feature_allowed?` without duplicating plan knowledge.
- The global redirect remains for non-piloted areas to minimize behavior drift. We scope it down gradually rather than removing it outright.

## Exit Criteria for v3

- `paid_feature_allowed?` exists and is used by at least one premium feature.
- Pilot toggle in place; layout redirect suppressed on piloted routes.
- Console checks and manual acceptance pass for unpaid/paid/trialing/admin cases.
- Logging present for denies on piloted routes.

