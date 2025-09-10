# Background v2 - New User/Account Use Cases with Code Citations

## Persona Codes
**Source:** `app/models/setup.rb:4-10`
```
1 => PERSONAL
2 => MANAGER/DIRECTOR 
3 => LEADERSHIP TEAM MEMBER
4 => INDIVIDUAL CONTRIBUTOR
5 => COACH/CONSULTANT
6 => CEO or VISIONARY for EOS 
7 => INTEGRATOR for EOS
```

## Data Storage Locations

### Framework Storage
1. **Group attribute:** `team_management_framework`
   - Set: `app/controllers/quick_start_controller.rb:2469`
   - Values: 'eos' or 'okr' (if 'any' is passed, converts to 'okr' at line 2460)

2. **User ObjectMeta:** `choose_your_adventure_framework`
   - Set: `app/models/setup.rb:49`
   - Read: `app/models/user.rb:7466-7468`

### Subscriber Persona Storage
1. **User ObjectMeta:** `subscriber_persona`
   - Set: `app/models/user.rb:7439-7440` (via set_subscriber_persona method)
   - Read: `app/models/user.rb:7456-7459`
   - Default if not set: 3 (Leadership Team Member)

## Critical Code Flow for 'CEO' Persona

1. **QuickStartController#set_persona** (`app/controllers/quick_start_controller.rb:2424-2426`)
   - Converts string 'ceo' to integer code 3
   - Passes code 3 to Setup.choose_persona

2. **Setup.choose_persona** (`app/models/setup.rb:26`)
   - Receives integer code 3
   - Calls user.set_subscriber_persona(3)

3. **User#set_subscriber_persona** (`app/models/user.rb:7432-7436`)
   - Has logic to convert string 'ceo' to code 6 (lines 7432-7433)
   - BUT receives integer 3 from normal flow, so uses 3 (line 7435) [SCOTT SAYS, THIS IS HIGHLY SUSPECT AS A STATEMENT]
   - Stores 3 in ObjectMeta

**Result:** CEOs selected through normal onboarding get stored as code 3 (Leadership Team Member), NOT code 6 (CEO/Visionary for EOS)
[SL I DON'T BELIEVE THIS.  ]

## Framework/Role Combinations

### [EOS][CEO]
- **framework:** 'eos' (`app/controllers/quick_start_controller.rb:2469` → Group.team_management_framework)
- **subscriber_persona:** 3 (NOT 6 due to mapping at `app/controllers/quick_start_controller.rb:2425`)


### [EOS][Integrator]
- **framework:** 'eos' (`app/controllers/quick_start_controller.rb:2469`)
- **subscriber_persona:** 7 (`app/models/setup.rb:10`)

### [EOS][IC]
- **framework:** 'eos' (`app/controllers/quick_start_controller.rb:2469`)
- **subscriber_persona:** 4 (`app/models/setup.rb:7`)

### [OKR/No preference][CEO]
- **framework:** 'okr' (`app/controllers/quick_start_controller.rb:2469`)
- **subscriber_persona:** 3 (`app/controllers/quick_start_controller.rb:2425`)


### [OKR/No preference][IC]
- **framework:** 'okr' (`app/controllers/quick_start_controller.rb:2469`)
- **subscriber_persona:** 4 (`app/models/setup.rb:7`)

## Additional Framework-Specific Settings

### EOS Framework
When framework == 'eos' (`app/controllers/quick_start_controller.rb:2475-2483`):
- **is_eos_strict:** Stored in Group ObjectMeta if checkbox checked (line 2477)
- **is_eos_pure:** Stored in Group ObjectMeta if checkbox checked (line 2481)




## Entry Type Variations

### Account Creator
- Standard flow through `/accounts/new` → `/quick_start/choose_your_adventure` → `/quick_start/set_persona`

### Invited by Teammate
- OAuth flow: `sessions_controller.rb:86-90,146-150`
- New OAuth users redirect to `/quick_start/choose_your_adventure?new_user=1`
- Then follows same persona selection

## Creation Context Variations

### Vanilla Account Creation
- No special parameters
- Default routing through standard flow [SL WHAT IS THE STANDARD FLOW? BE SPECIFIC]

### Promotion-Triggered Account Creation
- **utm_campaign routing** (`app/controllers/quick_start_controller.rb`, line references from research_findings_v4.md):
  - 'free_trial', 'essentials', 'blackbelt' → persona_code: 1  [SL NEED MORE DETAIL WHAT DOES THIS MEAN]
  - 'partner_essentials' → persona_code: 5 [SL NEED MORE DETAIL WHAT DOES THIS MEAN]
  - 'team_essentials' → @default_subscriber_persona = 2  [SL NEED MORE DETAIL WHAT DOES THIS MEAN]