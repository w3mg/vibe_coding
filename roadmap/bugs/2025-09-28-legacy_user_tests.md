# Legacy User Model Test Failures

- **Status**: Backlog
- **Owner**: Onboarding Evolution Team (assign once bandwidth opens)
- **Repos**: `resultmaps-web`

## Problem
`test/unit/user_test.rb` in the legacy Rails 2.3 app has multiple failing cases unrelated to the onboarding evolution work. The suite is noisy enough that it obscures regressions when we touch `User::OnboardingMeta`.

## Why Now
Bringing the new onboarding helpers online requires a clean safety net. Until we fix the existing failures, every TDD loop on `User`-level helpers requires manual triage to isolate real regressions from legacy breakage.

## Proposed Next Steps
1. Catalogue the failing assertions and group them by root cause (stale fixtures, brittle expectations, auth plugin callbacks, etc.).
2. Stabilize the fixtures and helper methods so the baseline suite passes under Ruby 1.9.3 / Rails 2.3.
3. Add lightweight documentation in `doc/testing-strategy.md` noting any intentional skips or known gaps.

## Dependencies / Risks
- Legacy plugins (`rails-authorization-plugin`) still hook into parts of `User`; changes must be coordinated with auth flows.
- Some fixes may require fixture refreshes that touch other suites (account, group, billing); stage carefully.

## Acceptance Criteria
- `bundle exec ruby test/unit/user_test.rb` passes without unrelated failures on a clean database snapshot.
- No new flaky behaviour introduced; if certain tests remain unstable, they’re isolated with clear TODO comments and follow-up tickets.
