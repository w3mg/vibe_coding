ObjectMeta Specification for Onboarding

Key: completed_onboarding

## Role-Specific Step Architecture

```ruby
# In User model - role-specific step configurations with dependencies
ONBOARDING_CONFIGS = {
  visionary: {
    steps: [:vision, :core_values, :customer_flow, :scorecard, :yearly_targets],
    dependencies: {
      customer_flow: [:vision, :core_values],
      scorecard: [:customer_flow],
      yearly_targets: [:scorecard]
    }
  },
  integrator: {
    steps: [:scorecard, :process_docs, :meeting_rhythm, :issues_list, :rocks],
    dependencies: {
      meeting_rhythm: [:process_docs],
      issues_list: [:meeting_rhythm],
      rocks: [:scorecard, :issues_list]
    }
  }
}
```

## Storage Structure

Store in ObjectMeta as simple JSON array plus persona and context identifiers:
```json
{
  "completed_onboarding": ["vision", "core_values"],
  "role_name": "visionary",
  "account_id": 42,
  "group_id": 7
}
```

## Access Control / Visibility Rules

- **Current Context Rule**: Show onboarding only when the user is the creator of the current account/team context recorded in onboarding meta (`account_id` + `group_id`) and `should_show_onboarding = true`.
- **Configuration Rights Hook**: Permit access when `group.configurable_by?(user)` returns true; implementation starts with creator checks and will expand once config user lists are available (Phase 2+).
- **Invited Helper Rule (Phase 2)**: Support granting non-creators access via an invitation flag stored in a future ObjectMeta key (documented but not yet implemented).

## Helper Responsibilities

- `Group#configurable_by?(user)`
  - Return true when `group.creator == user`.
  - Return true once group-level `config_users` are implemented and include the user (Phase 2 will define storage, likely via ObjectMeta; until then this branch can safely return false).
  - Return true when `group.account.creator == user` (or equivalent association).
  - Return false in all other cases.

## Core Helper Methods (in User model):

```ruby
def onboarding_config
  # GET configuration for this user's persona/role
  ONBOARDING_CONFIGS[persona_type.to_sym] || ONBOARDING_CONFIGS[:visionary]
end

def completed_onboarding_steps
  # FETCH completed steps from database
  # CONVERT to symbols for consistency
  Array(object_meta['completed_onboarding'] || []).map(&:to_sym)
end

def mark_onboarding_step_complete(step)
  # VALIDATE step exists in configuration
  return false unless onboarding_config[:steps].include?(step.to_sym)

  # GET current completed steps
  completed = completed_onboarding_steps
  # CHECK if already complete (idempotent)
  return true if completed.include?(step.to_sym)

  # ADD step to completed list
  completed << step.to_sym
  # SAVE back to database as strings
  object_meta['completed_onboarding'] = completed.map(&:to_s)
  save
end

def onboarding_step_unlocked?(step)
  # GET prerequisites for this step
  step = step.to_sym
  prerequisites = onboarding_config[:dependencies][step] || []
  completed = completed_onboarding_steps

  # CHECK all prerequisites are complete
  prerequisites.all? { |prereq| completed.include?(prereq) }
end

def next_onboarding_step
  # FIND first step that needs doing and can be done
  onboarding_config[:steps].find do |step|
    # NEEDS DOING: not complete yet
    # CAN BE DONE: all prerequisites met
    !completed_onboarding_steps.include?(step) && onboarding_step_unlocked?(step)
  end
end

def onboarding_all_prerequisites_met?(step)
  # GET dependencies for this step
  prerequisites = onboarding_config[:dependencies][step.to_sym] || []
  completed = completed_onboarding_steps
  # VERIFY all are complete
  prerequisites.all? { |prereq| completed.include?(prereq) }
end

def onboarding_complete?
  # CHECK if user finished all steps for their role
  completed_onboarding_steps.size == onboarding_config[:steps].size
end

def should_show_onboarding?
  # SHOW if not complete
  !onboarding_complete?
end
```

Issues and Questions:

1. Should we delete completed ObjectMetas?
   - Question: Is it better to delete completed onboarding_data ObjectMetas or keep them for historical tracking?

2. Timing of deletion
   - If we do delete, need to consider timing carefully to avoid race conditions or data loss

3. Move from synchronous to asynchronous data creation
   - Currently: Sample data created when user is created (synchronous)
   - Goal: Move to async call for creating initial onboarding data

TODOs for the architecture:

1. Create table for version 1 step completion triggers
   - Define when each step should be marked complete
   - Map user actions to step completion

2. Decide on final function set
   - Review proposed helpers (checkForOnboarding, migrateOnboarding, updateOnboarding)
   - Determine if additional helpers needed
   - Define exact function signatures

3. Determine model placement
   - Decide which model should contain these functions (User model vs separate concern)

## Function Stubs

### 1. initializeOnboardingMeta
```ruby
# In User model
# Creates the initial ObjectMeta structure for onboarding
def initializeOnboardingMeta
  # Create initial onboarding_data structure in ObjectMeta
  # Set version, completion flags, and step states
  # Persist persona role name so downstream flows can use it without extra joins
end
```
