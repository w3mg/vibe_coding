# Background v6 — Onboarding Behavior (Clarified Usage and Setting of Personas)

This version clarifies which subscriber personas are used today and exactly how they get set, removing ambiguity between displayed defaults, posted values, and stored values. EOS strict/pure flags are out of scope.

## Subscriber Personas (Codes and Current Usage)

- Codes (source: `resultmaps-web/app/models/setup.rb:4-10`)
  - 1: Personal — Not used in current onboarding (kept in code only for legacy mappings)
  - 2: Manager/Director — Used (typically for teammates)
  - 3: Leadership Team Member — Used (typically for teammates)
  - 4: Individual Contributor — Used (typically for teammates)
  - 5: Coach/Consultant — Used; common for account owner in new accounts
  - 6: CEO or Visionary (EOS) — Used; common for account owner in new accounts
  - 7: Integrator (EOS) — Used; common for account owner in new accounts

Operational note
- New account/account owner: 5, 6, 7 are the typical selections.
- Teammates: 2, 3, 4 are added by the account owner or a team admin.
- Persona 1: not used.

## USE CASE ABSTRACTIONS: ACCOUNT CREATORS V INVITED TEAM MEMBERS

- **Account Creator**: User who signs up for a new ResultMaps account (creates the account entity)
- **Invited Team Member**: User added to an existing account by another user with admin privileges

## How Personas Are Set (All Sources)

1) UI selection (Choose Your Adventure v2)
- The form posts numeric persona codes via a hidden input bound to `subscriberPersona`.
  - Input: `<input type="hidden" name="subscriber_persona" data-bind="value: subscriberPersona"/>` (source: `app/views/quick_start/choose_your_adventure_v2.html.erb:335`)
- The buttons set numeric codes directly: 6 (CEO), 7 (Integrator), 5 (Coach), 2 (Manager), 3 (Leadership), 4 (IC).
  - Examples: (source: `app/views/quick_start/choose_your_adventure_v2.html.erb:753,764,775,788,799,810`)
    - `click: function(){$data.subscriberPersona(6)}`
    - `click: function(){$data.subscriberPersona(7)}`
    - `click: function(){$data.subscriberPersona(5)}`
    - `click: function(){$data.subscriberPersona(2)}`
    - `click: function(){$data.subscriberPersona(3)}`
    - `click: function(){$data.subscriberPersona(4)}`

2) UTM auto-redirect mappings (bypass form)
- In `QuickStartController#choose_your_adventure`, certain `session[:utm_campaign]` values immediately call `Setup.choose_persona`:
  - `free_trial|essentials|blackbelt` → `persona_code: 1` (legacy; present in code; persona 1 not used operationally) (source: `app/controllers/quick_start_controller.rb:2339-2344`)
  - `partner_essentials` → `persona_code: 5` (source: `app/controllers/quick_start_controller.rb:2346-2349`)
  - `team_essentials` → page renders with `@default_subscriber_persona = 2` (source: `app/controllers/quick_start_controller.rb:2351-2353`)

3) Account creation via vision‑builder path
- When `from_signup_button=1`, `AccountsController#create` calls `Setup.choose_persona(@user, {persona_code: 1})` (legacy mapping; persona 1 unused operationally) (source: `app/controllers/accounts_controller.rb:314-323`).

4) Submission handler (QuickStartController#set_persona)
- Validates persona values; receives a numeric code from the v2 UI and builds options for `Setup.choose_persona` (source: `app/controllers/quick_start_controller.rb:2416-2445`).
- Compatibility note: controller also accepts string `'ceo'` and maps it to `3` (source: `app/controllers/quick_start_controller.rb:2422-2426`), but the current v2 UI posts integers, not `'ceo'`.

5) Persisting the persona (Setup + User)
- `Setup.choose_persona` calls `user.set_subscriber_persona(persona_code)` (source: `app/models/setup.rb:25-26`).
- The setter writes ObjectMeta `subscriber_persona` on the User; getter defaults to 3 if missing (source: `app/models/user.rb:7439-7446,7456-7459`).

## Framework and Team Size (Context for Onboarding)

- Group framework (behavior switch): set on `Group.team_management_framework` during `set_persona`; `'any'` coerced to `'okr'` (source: `app/controllers/quick_start_controller.rb:2457-2471`).
- User tracking (preferences): `choose_your_adventure_framework` and `choose_your_adventure_team_size` set by `Setup.choose_persona` (source: `app/models/setup.rb:47-49`; reads: `app/models/user.rb:7461-7469`).
- Display defaults for first‑time users (UI only, not persisted until submit): framework `'eos'` if nil, team_size `10` if nil, persona `6` (source: `app/controllers/quick_start_controller.rb:2400-2405`).

## Source of Truth vs Display Defaults

- Display defaults on the Choose Your Adventure page are for UI only; they are not persisted until the form is submitted.
- The persisted “source of truth” after submission is:
  - Persona: User ObjectMeta `subscriber_persona` set by `Setup.choose_persona`.
  - Framework: Group attribute `team_management_framework` set in `set_persona`; user-level framework/team size tracked via ObjectMeta by `Setup.choose_persona`.

## Startup and Redirects (For completeness)

- Startup page: `User::NEW_USER_FIRST_PAGE = '/today/dashboard'` (source: `app/models/user.rb:259`; helpers return this).
- `Setup.choose_persona` returns redirect URL: default `/today/dashboard?new_interest=1&interest={persona_code}`, or `/quick_start/steps_tk_okr` for OKR and small team (source: `app/models/setup.rb:71-80`).
- After submission, `QuickStartController#set_persona` may override redirects for partner assessment or OKR flow options (source: `app/controllers/quick_start_controller.rb:2528-2550`).

