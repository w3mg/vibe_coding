# Background v4 — Current Onboarding Behavior (Code‑Backed, EOS Flags Removed)

This document updates v3 by removing all mentions of EOS strict/pure flags. It documents how onboarding currently works, with exact sources, focusing on persona (role), framework, and related onboarding flags.

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
  - Valid persona values are integers 1–7, plus the string "ceo".

- Storage (source: `resultmaps-web/app/models/user.rb:7439-7446,7456-7459`)
  - Stored in ObjectMeta on the User with key `subscriber_persona`.
  - Setter writes the value as a stringified integer; getter returns integer, defaulting to `3` if not set.

- Determination Paths (all used)
  - UTM campaign autodirect from Choose Your Adventure (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2339-2353`)
    - `free_trial`, `essentials`, `blackbelt` → redirects via `Setup.choose_persona(..., persona_code: 1)`.
    - `partner_essentials` → redirects via `Setup.choose_persona(..., persona_code: 5)`.
    - `team_essentials` → page renders with `@default_subscriber_persona = 2`.
  - Choose Your Adventure displayed defaults for first‑time users (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2400-2405`)
    - If onboarding not completed: `@framework = 'eos'` (if missing), `@team_size = 10` (if missing), `@subscriber_persona = 6`.
  - Form submission `QuickStartController#set_persona` (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2411-2510`)
    - Validates allowed persona values (2416-2420).
    - If `params[:subscriber_persona] == 'ceo'`, controller converts to integer `3` (2422-2426).
    - Calls `Setup.choose_persona(current_user, options)` with `persona_code`, `team_type`, `framework`, `team_size` (2438-2445).
  - Model setter special case for `'ceo'` (source: `resultmaps-web/app/models/user.rb:7431-7436`)
    - If invoked with the string `'ceo'`, maps to `6`; otherwise uses `to_i`.

- Setup applies persona (source: `resultmaps-web/app/models/setup.rb:25-26`)
  - `user.set_subscriber_persona(persona_code)` is invoked with an integer 1–7.

## Framework

- Group Framework (primary setting used across app)
  - Attribute: `groups.team_management_framework`.
  - Written during `set_persona` (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2467-2471`).
  - If the submitted `framework` is `'any'`, coerced to `'okr'` (2457-2461).

- User Framework (preference tracking via ObjectMeta)
  - Key: `choose_your_adventure_framework` on the User (ObjectMeta) (source: `resultmaps-web/app/models/setup.rb:47-49`).
  - Read via `User#choose_your_adventure_framework` (source: `resultmaps-web/app/models/user.rb:7466-7469`).

- Displayed Defaults on Choose Your Adventure (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2371-2377,2400-2405`)
  - If account owner: reads current_user’s stored team size/framework; else from account creator.
  - If onboarding not completed: defaults shown to user are `framework: 'eos'` and `team_size: 10` when nil.

- Helper/Reader Usage (examples)
  - Framework‑specific copy and behavior read `group.team_management_framework` or default to `'okr'` (examples: `resultmaps-web/app/frameworks_helper.rb:36-48`, `100-105`, `381-416`, `532-556`).

## Team Size

- Storage: `choose_your_adventure_team_size` on the User (ObjectMeta) (source: `resultmaps-web/app/models/setup.rb:47-49`).
- Read: `User#choose_your_adventure_team_size` (source: `resultmaps-web/app/models/user.rb:7461-7464`).
- Displayed default for first‑time users: `10` when missing (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2400-2405`).

## Setup.choose_persona Effects

- Validation: persona_code must be in `[1..7]` (source: `resultmaps-web/app/models/setup.rb:3`).
- Persona write: calls `user.set_subscriber_persona(persona_code)` (25-26).
- Startup view: sets `/today/dashboard` (via `update_startup_view_by_code_or_url(6, ...)`) (28-31).
- Preference tracking: writes `choose_your_adventure_team_size` and `choose_your_adventure_framework` ObjectMeta on the User (47-49).
- EOS seat assignment for framework='eos' (51-66):
  - persona 6 → Visionary seat owner set to the user.
  - persona 7 → Integrator seat owner set to the user.
- Redirect URL (71-80):
  - Default: "/today/dashboard?new_interest=1&interest={persona_code}".
  - If `framework == 'okr'` and `team_size <= 10`: `/quick_start/steps_tk_okr`.
- Marks onboarding complete: `user[:onboarding_survey_completed] = true` (82-84).

## QuickStartController#set_persona — Additional Effects

- New user details: when `new_user=1`, updates user/login/name and renames default account + default group (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2428-2436`).
- Execution filters reset: updates today dashboard and execution tracker filters to `All` (2491-2493).
- Time zone: if submitted, sets user preference and clears `prompt_for_timezone_on_onboarding` ObjectMeta (2498-2505).
- OKR flow override routing: options 1–3 set redirects to `/quick_start/simple_okr`, `/quick_start/goal_planner?...`, or `/quick_start/big_picture` (2528-2538).
- Partner assessment override: may redirect to partner’s assessment URL (2546-2550).
- After‑set‑persona routing: if `session[:after_set_persona_url] == '/company_vision_workshop'` redirects there; else to startup page (2555-2566).

## Choose Your Adventure (survey page)

- Entry and UTM handling (source: `resultmaps-web/app/controllers/quick_start_controller.rb:2339-2353`).
- New User param (2362-2364, 2389-2392): set via `?new_user=1` or forced when `signup_source == 18` and onboarding not finished.
- Prompt for timezone flag read (2359-2361): based on ObjectMeta `prompt_for_timezone_on_onboarding`.
- Render view: `choose_your_adventure_v2` (2407-2408).

## Startup Page

- Constant: `User::NEW_USER_FIRST_PAGE = "/today/dashboard"` (source: `resultmaps-web/app/models/user.rb:259`).
- Helper/Controller `new_user_startup_page` returns this constant (source: `resultmaps-web/app/helpers/application_helper.rb:3251-3254`, `resultmaps-web/app/controllers/application_controller.rb:1458-1461`).

## Onboarding Enforcement Redirect

- Logic (source: `resultmaps-web/app/controllers/application_controller.rb:778-816`).

## Account Creation and OAuth Paths

- Accounts#new (source: `resultmaps-web/app/controllers/accounts_controller.rb:104-112`).
- Accounts#create success (source: `resultmaps-web/app/controllers/accounts_controller.rb:314-334`).
- SessionsController OAuth flows (source: `resultmaps-web/app/controllers/sessions_controller.rb:118-137,173-184`).
- Auth0 new user initialization (source: `resultmaps-web/app/models/auth0.rb:96-104`).

