# Evolution 5: Expose Onboarding Features Post-Completion

## SUCCESS RESULTS

1. **Users can always go back to the onboarding walkthroughs even once they are finished**
2. **We don't lose our ability to see if people completed**
3. **It's easy to navigate for people using ResultMaps**
4. **It's easy to test and code for developers**
5. **It's hard to break**

---

## Problem Statement

Once a user completes onboarding, the helpful agent-guided experiences disappear:
- Vision builder (`/agents/vision`)
- Core values setup (`/agents/core_values`)
- Scorecard creation (`/agents/scorecard`)
- Yearly targets/goals (`/agents/goals`)

These are valuable tools users may want to revisit. Currently there's no way to get back to them.

## Current State

### URLs Exist But Are Tied to Onboarding
```
/agents/vision
/agents/core_values
/agents/scorecard
/agents/goals
```

### Current Constraints (AgentsController)
1. `before_filter :get_onboarding_group` - gets group from onboarding meta, not params
2. `layout "b3_application_onboarding"` - uses onboarding-specific layout

### What Happens If User Hits URL Directly Today?
**To be tested.** We need to confirm or rule out whether these routes work in different scenarios.

---

## How Users Will Access (Decided)

Access is simple and direct:
- **From Today/Dashboard**: Via tab or Quick Win button
- **From Vision page**: Direct link to vision feature
- **From Scorecard page**: Direct link to scorecard feature

These go directly to the feature. Not complicated.

This approach will be the same for any module (e.g., Rocks too).

---

## References

### Code References (feature/onboarding_managers branch)
- [Learn to Get Around - line 805](https://github.com/w3mg/resultmaps/blob/feature/onboarding_managers/app/models/user/onboarding_meta.rb#L805)
- [Get Clarity - line 821](https://github.com/w3mg/resultmaps/blob/feature/onboarding_managers/app/models/user/onboarding_meta.rb#L821)
- [Get Aligned - line 837](https://github.com/w3mg/resultmaps/blob/feature/onboarding_managers/app/models/user/onboarding_meta.rb#L837)

### Production URLs (Agent Features)
- https://app.resultmaps.com/agents/vision
- https://app.resultmaps.com/agents/core_values
- https://app.resultmaps.com/agents/goals
- https://app.resultmaps.com/agents/scorecard

---

## BDD Specs

### Scenario: Account owner returns to edit vision after completing onboarding

#### Original quote
> "as a new user who is the account owner and a CEO after I've completed all of my own boarding steps. I'm able to click a button and go back to edit my vision using the agent workflow when I do that, it should show me my previous answers and be able to pull from those previous answers and ask me what I want to update in a way that that's easy to navigate and doesn't feel like a lot of work."

#### BDD Spec
**Given** a new user who is the account owner and a CEO
**And** they have completed all of their onboarding steps
**When** they click a button to go back to edit their vision using the agent workflow
**Then** it should show their previous answers
**And** be able to pull from those previous answers
**And** ask what they want to update
**And** be easy to navigate
**And** not feel like a lot of work

---

## Questions to Answer

### 1. Can We Show These Currently Without Breaking?
Two scenarios to test:
- When no onboarding meta exists for the user
- When onboarding meta shows completed

**Hypothesis:** Evidence suggests the routes may break when no onboarding meta exists. Source: `get_onboarding_group` in AgentsController calls `@group_id = @group.id` before checking if `@group.blank?`.

**Action required:** Test these routes to confirm or rule out this hypothesis.

We may have to do work to make that happen.

### 2. Group Context
When accessed standalone, how do we know which group?
- From URL param (`?group_id=123`)?
- From last group context?
- From onboarding meta (current)?

### 3. Layout/UI
Should the standalone experience look different?
- Same as onboarding (familiar)?
- Standard app layout (integrated)?
- Minimal differences (just remove progress indicators)?

### 4. Tracking
Do we track usage when accessed standalone?
- Same completion tracking?
- Separate "revisit" tracking?
- No tracking needed?

### 5. Implementation Approach
Direction: Param-based approach is the right direction.
Exact mechanism TBD after behaviors are documented - otherwise we'll cycle through hacks.

---

## Existing Pattern: weekly_prep

The `weekly_prep` action in AgentsController already does something similar:
- Uses `b3_application` layout (not onboarding)
- Gets group from `params[:group_id]` or `last_group_or_default`
- Excluded from `get_onboarding_group` before_filter

```ruby
before_filter :get_onboarding_group, :except => :weekly_prep
```

This is an existing pattern in the codebase.

---

## Next Steps

1. [x] Decide on entry point for users (Decided: tab + quick win + direct links)
2. [ ] Test routes to confirm/rule out hypothesis about breaking scenarios
3. [ ] Decide on group context approach
4. [ ] Decide on layout approach
5. [ ] Document specific changes required
6. [ ] Implement
7. [ ] Test against SUCCESS RESULTS
