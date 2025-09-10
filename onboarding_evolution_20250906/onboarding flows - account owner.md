# Onboarding Flows — Account Owner (Role + Framework)

- Scope: Account creators only (not invited teammates).
- "Vanilla" flow: `/accounts/new` → `/quick_start/choose_your_adventure` → `POST /quick_start/set_persona` → redirect. (sources: `app/controllers/accounts_controller.rb`, `app/controllers/quick_start_controller.rb`)
- Persisted on submit:
  - User: `subscriber_persona`, `choose_your_adventure_framework`, `choose_your_adventure_team_size`, onboarding completed flag, optional `time_zone`, Intercom tags. (sources: `app/models/setup.rb`, `app/controllers/quick_start_controller.rb`)
  - Group: `team_management_framework` = chosen framework. (source: `app/controllers/quick_start_controller.rb`)
  - EOS: If persona CEO(6) or Integrator(7), assigns those seats to the user when present. (source: `app/models/setup.rb`)
- Default redirect after submit: `/today/dashboard`, unless a special destination is queued (e.g., Vision Builder or partner startup assessment). (sources: `app/controllers/quick_start_controller.rb`, `app/models/setup.rb`)
- CURRENT RESULTMAPS HOME PAGE SENTENCE BUILDER: routes to /sentence_builder/next_steps (example: https://app.resultmaps.com/sentence_builder/next_steps?data=%7B%22primaryGoal%22%3A%22profitably%20scale%22%2C%22ownership%22%3A%22my%22%2C%22businessType%22%3A%22SaaS%20business%22%2C%22personalOutcome%22%3A%22work%20less%20and%20enjoy%20life%20more%22%2C%22additionalRequirement%22%3A%22Use%20a%20proven%20business%20operating%20system%22%2C%22timestamp%22%3A%222025-09-07T16%3A24%3A23.304Z%22%7D) 



## Entry Paths (Customer Experience Perspective)
### Scenario 1: Vanilla New Account Page
- this is the default state, thus the "vanilla" branding.  
- [include any query strings, session objects that can be read]
- allows for sign up via google, microsoft, slack

### Scenario 2: Home page sentence builder - "All cases"
- FIRST asks about business operating system first,  
- THEN asks headcount
- THEN confirms role based on original query string "my business/etc"

### Scenario 2A: Home page sentence builder - "my business" (owner/ceo case)
- [more information TBD]

### Scenario 2B: Home page sentence builder - "my client's business" (coach/consultant case)
- [more information TBD]


### Scenario 2C: Home page sentence builder - "my boss' business" (COO/integrator case)
- [more information TBD]





## Entry Points (Technical Perspective)

### `/sentence_builder/next_steps`
[TO BE DOCUMENTED]

### `/accounts/new`
- `utm_campaign`: stored and later consumed by chooser; can trigger auto-redirects. (source: `app/controllers/accounts_controller.rb` new; and consumed in `quick_start_controller.rb#choose_your_adventure`)
- `startup_code=vision_builder`: queues `/company_vision_workshop` after persona set. (source: `app/controllers/accounts_controller.rb` create)
- `from_signup_button=1`: immediately calls `Setup.choose_persona(@user, {persona_code: 1})` and redirects without showing the chooser (legacy “Personal” persona path). (source: `app/controllers/accounts_controller.rb` create)
- Prefill: `email`, `first_name`; personal email check enforced. (source: `app/controllers/accounts_controller.rb` new/create)
- On success, user is signed in and typically routed to `/quick_start/choose_your_adventure` unless immediate persona routing is triggered. (source: `app/controllers/accounts_controller.rb` create)

### `/quick_start/choose_your_adventure`
- UI defaults for first‑time account owners: framework `eos`, team_size `10`, persona `6`. (source: `app/controllers/quick_start_controller.rb#choose_your_adventure`)
- UTM handling: (source: `app/controllers/quick_start_controller.rb#choose_your_adventure`)
  - `partner_essentials`: auto choose persona 5 (Coach) and redirect.
  - `team_essentials`: default persona set to 2 (Manager), no auto‑redirect.
  - `free_trial|essentials|blackbelt`: auto choose persona 1 (legacy).
- Submits: `subscriber_persona` (int), `framework`, `team_size`, optional EOS strict/pure flags, optional `time_zone`. (view posts via hidden inputs bound to Knockout observables; source: `app/views/quick_start/choose_your_adventure_v2.html.erb`)

### `POST /quick_start/set_persona`
- Normalizes framework `'any'` → `'okr'`. (source: `app/controllers/quick_start_controller.rb#set_persona`)
- Persists persona + framework + team size; marks onboarding complete. (sources: `app/models/setup.rb`, `app/controllers/quick_start_controller.rb#set_persona`)
- Sets `Group.team_management_framework`; EOS: assigns Visionary/Integrator seats; updates EOS getting‑started items. (sources: `app/controllers/quick_start_controller.rb#set_persona`, `app/models/setup.rb`)
- Redirect resolution: (sources: `app/controllers/quick_start_controller.rb#set_persona`, `app/helpers/application_helper.rb#new_user_startup_page`, `app/controllers/application_controller.rb#new_user_startup_page`)
  - If queued: `/company_vision_workshop` (Vision Builder) or referral partner startup assessment URL.
  - Else default: `/today/dashboard`.

## Flows by Role and Framework

### CEO/Visionary (persona 6)
- EOS
  - Persisted: persona 6; user framework pref = `eos`; group framework = `eos`; optional `is_eos_strict` / `is_eos_pure` meta.
  - Extras: Assign Visionary seat to user if present; update EOS getting‑started items.
  - Redirect: `/today/dashboard` unless Vision Builder or partner assessment.
- OKR (includes “Any”, which normalizes to OKR)
  - Persisted: persona 6; user framework pref = `okr`; group framework = `okr`; team size stored.
  - Redirect: `/today/dashboard` unless Vision Builder or partner assessment.

### Integrator/COO (persona 7)
- EOS
  - Persisted: persona 7; user framework pref = `eos`; group framework = `eos`; optional strict/pure.
  - Extras: Assign Integrator seat to user if present; update EOS getting‑started items.
  - Redirect: `/today/dashboard` unless Vision Builder or partner assessment.
- OKR (includes “Any”)
  - Persisted: persona 7; user framework pref = `okr`; group framework = `okr`; team size stored.
  - Redirect: `/today/dashboard` unless Vision Builder or partner assessment.

### Coach/Consultant (persona 5)
- EOS
  - Persisted: persona 5; user framework pref = `eos`; group framework = `eos`.
  - Extras: `is_coach` set true; EOS getting‑started items updated.
  - Redirect: `/today/dashboard` unless Vision Builder or partner assessment.
- OKR (includes “Any”)
  - Persisted: persona 5; user framework pref = `okr`; group framework = `okr`; team size stored.
  - Extras: `is_coach` set true.
  - Redirect: `/today/dashboard` unless Vision Builder or partner assessment.

## Notes
- UI defaults vs. source of truth
  - Defaults shown on the chooser are UI‑only; nothing persists until submit.
  - Source of truth after submit: (sources: `app/models/setup.rb`, `app/models/user.rb`)
    - Persona: User ObjectMeta `subscriber_persona`.
    - Framework: User ObjectMeta `choose_your_adventure_framework` and `Group.team_management_framework`.
    - Team size: User ObjectMeta `choose_your_adventure_team_size`.
- OAuth new users may enter chooser directly (`?new_user=1`); redirect guard sends incomplete users to the chooser until completion.
- Invited teammates are out of scope here.

## UI Bindings (for clarity)
- Persona buttons set numeric codes directly: 6 (CEO), 7 (Integrator), 5 (Coach), 2 (Manager), 3 (Leadership), 4 (IC). Hidden input posts `subscriber_persona`. (source: `app/views/quick_start/choose_your_adventure_v2.html.erb`)
- Hidden inputs: `subscriber_persona`, `framework`, `team_size`, and EOS flags (`is_eos_strict`, `is_eos_pure`). (source: same view)
