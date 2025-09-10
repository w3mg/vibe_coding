# Background v5 — Current Onboarding Behavior (Code‑Backed; Persona 1 Marked Unused)

This version supersedes v4. It documents current onboarding with exact sources and explicitly notes that Persona 1 (Personal) is unused in current data, while retaining where code still maps to it. EOS strict/pure are out of scope and not included.

## Persona (Role)

- Codes (source: `resultmaps-web/app/models/setup.rb:4-10`)
  - 1: Personal
  - 2: Manager/Director
  - 3: Leadership Team Member
  - 4: Individual Contributor
  - 5: Coach/Consultant
  - 6: CEO or Visionary (EOS)
  - 7: Integrator (EOS)

- Allowed Inputs (source: `resultmaps-web/app/models/user.rb:7413-7416`)
  - Valid persona values are 1–7, plus the string "ceo".

- Storage (source: `resultmaps-web/app/models/user.rb:7439-7446,7456-7459`)
  - ObjectMeta on User: key `subscriber_persona`; getter defaults to 3 when missing.

- Usage note (data reality)
  - Persona 1 (Personal): present in code but unused in recent data (no new assignments observed in 5+ years). Keep code mappings documented below for completeness.

- Determination paths
  - UTM auto‑redirects (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2339-2353`)
    - `free_trial`, `essentials`, `blackbelt` → `Setup.choose_persona(..., persona_code: 1)`
    - `partner_essentials` → `Setup.choose_persona(..., persona_code: 5)`
    - `team_essentials` → page renders with `@default_subscriber_persona = 2`
  - UI defaults for first‑time users (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2400-2405`)
    - `@framework = 'eos'` if nil, `@team_size = 10` if nil, `@subscriber_persona = 6`
  - Submission (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2411-2510`)
    - Validates allowed values; if `subscriber_persona == 'ceo'` then controller maps to 3 (2422-2426)
    - Calls `Setup.choose_persona(current_user, {persona_code, team_type, framework, team_size})` (2438-2445)
  - Model special case (source: `resultmaps-web/app/models/user.rb:7431-7436`)
    - If setter receives string 'ceo', maps to 6; otherwise uses integer

- Setup applies persona (source: `resultmaps-web/app/models/setup.rb:25-26`)
  - `user.set_subscriber_persona(persona_code)` with integer 1–7

## Current Usage (Operational)

- New account / account owner cases:
  - Personas 5 (Coach/Consultant), 6 (CEO/Visionary), and 7 (Integrator) are the typical selections for brand‑new users creating brand‑new accounts (i.e., the “account owner”).
- Teammate additions:
  - Personas 2 (Manager/Director), 3 (Leadership Team Member), and 4 (Individual Contributor) are added by the account owner or a designated team admin when inviting/adding team members.
- Not used:
  - Persona 1 (Personal) is not used in current onboarding.

## Framework

- Group framework (primary behavior switch)
  - Attribute `groups.team_management_framework`; set in `set_persona` (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2467-2471`)
  - `'any'` coerced to `'okr'` (2457-2461)

- User framework (preference tracking)
  - ObjectMeta `choose_your_adventure_framework` set by Setup (source: `resultmaps-web/app/models/setup.rb:47-49`)
  - Read via `User#choose_your_adventure_framework` (source: `resultmaps-web/app/models/user.rb:7466-7469`)

- Defaults shown on UI (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2371-2377,2400-2405`)
  - Owner uses own stored size/framework; members use account creator’s

## Team Size

- ObjectMeta `choose_your_adventure_team_size` set by Setup (source: `resultmaps-web/app/models/setup.rb:47-49`)
- Read via `User#choose_your_adventure_team_size` (source: `resultmaps-web/app/models/user.rb:7461-7464`)
- Default shown on UI for first‑time users: 10 (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2400-2405`)

## Setup.choose_persona Effects (source: `resultmaps-web/app/models/setup.rb`)

- Validates persona_code in 1–7 (line 3)
- Writes persona, startup view `/today/dashboard` (28-31)
- Tracks team size/framework on User (47-49)
- EOS seat owner assignment for persona 6/7 when framework='eos' (51-66)
- Redirect URL: default `/today/dashboard?new_interest=1&interest={persona_code}`; for OKR and team_size<=10 → `/quick_start/steps_tk_okr` (71-80)
- Marks onboarding complete (82-84)

## QuickStartController#set_persona Additional Effects (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2411-2566`)

- When `new_user=1`: updates user profile + renames default account/group (2428-2436)
- Resets execution filters (2491-2493)
- Saves time_zone and clears timezone prompt flag if provided (2498-2505)
- OKR flow option redirects (2528-2538)
- Partner assessment redirect if configured (2546-2550)
- After‑set‑persona routing: `/company_vision_workshop` (if session set) else startup page (2555-2566)

## Choose Your Adventure (survey page)

- Handles `session[:utm_campaign]` as above (2339-2353)
- `@new_user` set via param or forced for signup_source 18 (2362-2364, 2389-2392)
- Timezone prompt flag read from ObjectMeta (2359-2361)

## Startup Page

- `User::NEW_USER_FIRST_PAGE = "/today/dashboard"` (source: `resultmaps-web/app/models/user.rb:259`)
- Helper/controller `new_user_startup_page` returns this (sources: `resultmaps-web/app/helpers/application_helper.rb:3251-3254`, `app/controllers/application_controller.rb:1458-1461`)

## Enforcement Redirect

- `ApplicationController#redirect_to_onboarding_if_required` (source: `resultmaps-web/app/controllers/application_controller.rb:778-816`)

## Where Persona 1 Is Still Mapped in Code (but unused in data)

- UTM: `free_trial|essentials|blackbelt` → persona_code 1 (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2341-2344`)
- Account creation (vision‑builder path): when `from_signup_button=1`, calls `Setup.choose_persona(@user, {persona_code: 1})` (source: `resultmaps-web/app/controllers/accounts_controller.rb:314-323`)
