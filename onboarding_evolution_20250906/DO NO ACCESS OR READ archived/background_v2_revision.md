# Background v2 (Revision) — New User/Account Use Cases with Code Citations

## Persona Codes
Source: `resultmaps-web/app/models/setup.rb:4-10`

1 => PERSONAL
2 => MANAGER/DIRECTOR
3 => LEADERSHIP TEAM MEMBER
4 => INDIVIDUAL CONTRIBUTOR
5 => COACH/CONSULTANT
6 => CEO or VISIONARY for EOS
7 => INTEGRATOR for EOS

## Data Storage Locations

### Framework Storage
1. Group attribute: `team_management_framework`
   - Set: `resultmaps-web/app/controllers/quick_start_controller.rb:2469`
   - Values: 'eos' or 'okr' (if 'any' is passed, converts to 'okr' at 2460-2461)

2. User ObjectMeta: `choose_your_adventure_framework`
   - Set: `resultmaps-web/app/models/setup.rb:47-49`
   - Read: `resultmaps-web/app/models/user.rb:7466-7469`

### Subscriber Persona Storage
1. User ObjectMeta: `subscriber_persona`
   - Set: `resultmaps-web/app/models/user.rb:7439-7446` (via set_subscriber_persona)
   - Read: `resultmaps-web/app/models/user.rb:7456-7459` (defaults to 3 if not set)

## Critical Code Flow for 'CEO' Persona

1. QuickStartController#set_persona (`resultmaps-web/app/controllers/quick_start_controller.rb:2422-2426`)
   - Converts string 'ceo' to integer code 3
   - Passes code 3 to Setup.choose_persona

2. Setup.choose_persona (`resultmaps-web/app/models/setup.rb:25-26`)
   - Receives integer code 3
   - Calls user.set_subscriber_persona(3)

3. User#set_subscriber_persona (`resultmaps-web/app/models/user.rb:7431-7436`)
   - Special case converts string 'ceo' to code 6
   - In normal flow receives integer 3 and stores 3 in ObjectMeta

Result: CEOs selected through normal onboarding are stored as code 3 (Leadership Team Member), not 6 (CEO/Visionary for EOS).

## Framework/Role Combinations

### [EOS][CEO]
- framework: 'eos' (QuickStartController:2469 → Group.team_management_framework)
- subscriber_persona: 3 (QuickStartController:2425 mapping)

### [EOS][Integrator]
- framework: 'eos' (QuickStartController:2469)
- subscriber_persona: 7 (Setup.rb:10)

### [EOS][IC]
- framework: 'eos' (QuickStartController:2469)
- subscriber_persona: 4 (Setup.rb:7)

### [OKR/No preference][CEO]
- framework: 'okr' (QuickStartController:2469)
- subscriber_persona: 3 (QuickStartController:2425)

### [OKR/No preference][IC]
- framework: 'okr' (QuickStartController:2469)
- subscriber_persona: 4 (Setup.rb:7)

## Entry Type Variations

### Account Creator
- Flow: `/accounts/new` → `/quick_start/choose_your_adventure` → `/quick_start/set_persona`

### Invited by Teammate / OAuth
- OAuth flow (sessions_controller): new OAuth users redirect to `/quick_start/choose_your_adventure?new_user=1` and then follow persona selection.

## Creation Context Variations

### Vanilla Account Creation
- No special parameters
- Default routing through standard flow

### Promotion-Triggered Account Creation
- utm_campaign routing (QuickStartController):
  - 'free_trial', 'essentials', 'blackbelt' → persona_code: 1
  - 'partner_essentials' → persona_code: 5
  - 'team_essentials' → `@default_subscriber_persona = 2`

