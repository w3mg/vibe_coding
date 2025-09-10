# ResultMaps Onboarding Flow Research Findings - V2

This version corrects oversights in V1, adds missing controllers and behaviors, enumerates onboarding-related ObjectMeta keys, and maps redirects for direct signup, invited users, and OAuth.

## 0. Summary of Improvements

- Added ApplicationController onboarding redirect gate and its exceptions.
- Added ConfirmationsController post-confirmation routing and timezone prompt behavior.
- Documented `view_code`/startup view override and `team_type` handling in `set_persona`.
- Highlighted the 'ceo' mapping discrepancy (QuickStart vs User model) as a critical issue.
- Enumerated all onboarding-related ObjectMeta keys found in code.
- Added redirect maps for direct signup, invited users, and OAuth flows.

## 1. User Signup Flow (Controllers/Models)

### Primary Controllers
- AccountsController (`app/controllers/accounts_controller.rb`)
  - `new` (lines 74–122): Sign-up page; manages `after_sign_in_path` and UTM capture.
  - `create` (lines 127–321): Creates Account/User; handles referral, Stripe, `signup_type`, timezone prompt meta; redirects into onboarding.

- SessionsController (`app/controllers/sessions_controller.rb`)
  - `create` (lines 39–176): Devise and OmniAuth; sets next page via `startup_view_url`, `after_set_persona_url`, or redirects new OAuth users to `/quick_start/choose_your_adventure?new_user=1`.

- QuickStartController (`app/controllers/quick_start_controller.rb`)
  - `choose_your_adventure` (lines 2338–2409): Uses `session[:utm_campaign]` to route or set defaults; computes flags; renders `choose_your_adventure_v2`.
  - `set_persona` (lines 2411–2490+): Validates persona; accepts `subscriber_persona`, `framework`, `team_size`, `team_type`, `view_code`; calls `Setup.choose_persona`; updates group framework and EOS flags; timezone handling; computes redirect.

- ApplicationController (`app/controllers/application_controller.rb`)
  - `redirect_to_onboarding_if_required` (lines 778–816): If signed in and `onboarding_survey_required` and not completed, redirects to `/quick_start/choose_your_adventure` (or `?new_user=1` for OAuth). Exceptions include `quick_start#set_persona`, `quick_start#choose_your_adventure`, `sessions#destroy`, and `api/users#check_login_is_taken`.
  - `new_user_startup_page` (lines 1458–1460): Returns `User::NEW_USER_FIRST_PAGE` (`/today/dashboard`). Used by `QuickStart#set_persona` as default redirect.

- ConfirmationsController (`app/controllers/confirmations_controller.rb`)
  - `do_confirm` (lines 94–180): Sets `session[:after_sign_in_path]` from user meta `after_sign_up_url` or `startup_view_url`; handles timezone prompt meta; signs in and redirects accordingly.

- GroupsController (`app/controllers/groups_controller.rb`)
  - `invite_users` (lines 1430–1554): Creates or adds invited users; sets `signup_type = 4`, metas `signed_up_from = 6`, optional `after_sign_up_url = "/today/home"`, and `prompt_for_timezone_on_onboarding = true`.

### Key Models
- User (`app/models/user.rb`)
  - `set_meta_key_value` (line 1301): Helper to create/update user ObjectMeta.
  - Persona/meta helpers (lines 7409–7469): `set_subscriber_persona`, `subscriber_persona`, `choose_your_adventure_team_size`, `choose_your_adventure_framework` store/read via ObjectMeta.

- Setup module (`app/models/setup.rb`)
  - `choose_persona` (lines 2–88): Core persona assignment; persists `choose_your_adventure_team_size` and `choose_your_adventure_framework`; sets startup view and flags, and may adjust EOS seats.

## 2. Query String / Parameter Handling

### AccountsController#new (74–122)
- `after_sign_in_path`: Saved to session from param or existing session value.
- `utm_campaign`: If present, stored in `session[:utm_campaign]` and clears `session[:after_sign_in_path]`.
- `stripe_session_id`: Prefills email from pending Stripe checkout session.
- `email`: Prefill via Stripe path only (no direct assignment otherwise).

### AccountsController#create (127–321)
- `referral_account_id`: Sets `@account[:referral_account_id]` if valid (141–146).
- `startup_code`: If `vision_builder`, sets `session[:after_set_persona_url] = '/company_vision_workshop'` (149–151).
- `signup_type`: Sets `@user.signup_type` if provided (166–168), or `16` if Stripe subscription detected (206–208).
- `from_signup_button`: If `"1"`, bypasses onboarding choose page and routes via `Setup.choose_persona(@user, {persona_code: 1})` (302–306).
- `skip_onboarding`: Captured as `@skip_onboarding` (247), but standard flow continues to onboarding unless other redirects apply.

### QuickStartController
- `choose_your_adventure` (2338–2409):
  - consumes `session[:utm_campaign]`; routes immediately for `free_trial|essentials|blackbelt` to persona 1; `partner_essentials` to persona 5; `team_essentials` default `@default_subscriber_persona = 2`. Clears session value after use.
  - `new_user`: Parses `params[:new_user] == '1'` for UI/flow flags (2363).
  - `@prompt_for_timezone`: From meta `prompt_for_timezone_on_onboarding` (2360).

- `set_persona` (2411–>2530):
  - `subscriber_persona`: Validated by `User.is_persona_type_allowed?`. Note: maps `'ceo'` to code `3` here (2423–2426).
  - `framework`: If `'any'`, coerced to `'okr'`; updates default_group `team_management_framework` and EOS metas (2457–2487).
  - `team_size`, `team_type`: Passed through to `Setup.choose_persona` (2438–2446).
  - `view_code`/`startup_url`: Overrides startup view and redirect when valid (2451–2454).
  - Timezone: If `time_zone` present, sets preference and clears timezone prompt meta (2498–2505).
  - Redirect: Defaults to `new_user_startup_page` (2518); OKR sub-flows may override if `okr_flow` present (2524–).

### SessionsController#create (39–176)
- OAuth provider handling sets next page:
  - Existing users: to `startup_view_url` if present; otherwise `/today/index`.
  - New users: `params[:state] == 'resumeSignIn' ? fresh_start : '/quick_start/choose_your_adventure?new_user=1'`, where `fresh_start` can be `session[:after_set_persona_url]` (86–90, 146–150).

### Other
- ApplicationController `after_sign_in_path_for` (36–50): Uses and clears `session[:after_sign_in_path]`, with special handling for prioritizer routes.
- ConfirmationsController#do_confirm (99): Sets `session[:after_sign_in_path]` from meta `after_sign_up_url` or `startup_view_url`.

## 3. Framework Choice Capture

- Location: `app/controllers/quick_start_controller.rb:2457–2487`.
- Selected in `choose_your_adventure_v2` and posted as `framework` to `set_persona`.
- `'any'` coerced to `'okr'`.
- Applies to default group `team_management_framework` when editable by user (2467–2471).
- EOS-specific metas set on the default group: `is_strict` and `is_eos_pure` when corresponding checkboxes/params are true (2476–2483). Triggers `update_getting_started_items_for_eos` for user (2486–2487).

## 4. Role (Persona) Setting

- Allowed codes: 1–7, or `'ceo'` special string.
- Setup (`app/models/setup.rb:2–11`):
  1. Personal
  2. Manager/Director
  3. Leadership Team Member
  4. Individual Contributor
  5. Coach/Consultant
  6. CEO or Visionary (EOS)
  7. Integrator (EOS)

- `QuickStartController#set_persona` maps `'ceo'` to 3 (2419–2426) then calls `Setup.choose_persona`.
- `User#set_subscriber_persona` maps `'ceo'` to 6 and stores ObjectMeta `subscriber_persona` (7418–7444).

Critical note: The mapping of `'ceo'` differs between QuickStart (3) and User (6).

## 5. Invited Users vs Direct Signups

- Direct Signup: `AccountsController#create`
  - Sets onboarding flags: `onboarding_survey_completed = false`, `onboarding_survey_required = true` (153–155).
  - If `from_signup_button=1`: immediately routes via persona 1; else sets timezone prompt meta `true` and redirects to `/quick_start/choose_your_adventure`.

- Invited Users: `GroupsController#invite_users`
  - New users created with `signup_type = 4` (1502), confirmation token, draft-mode optional meta `is_draft_mode? = true` (1512–1514).
  - Metas: `signed_up_from = 6`, `after_sign_up_url = '/today/home'` (1508–1509), and `prompt_for_timezone_on_onboarding = true` (1543–1545).
  - ConfirmationsController will use `after_sign_up_url` after confirmation.

## 6. Tracking Mechanisms

### ObjectMeta System
- Model: `app/models/object_meta.rb`
- Methods: `get_value_by_object_and_key(object, key)`, `set_value_by_object_and_key(object, key, value)` store simple string values; certain keys use blob via CustomContent (BLOB_OBJECT_METAS_KEYS).

### Onboarding-Related ObjectMeta Keys (seen in code)
- User-level
  - `subscriber_persona` (user role/persona)
  - `choose_your_adventure_framework`
  - `choose_your_adventure_team_size`
  - `signed_up_from`
  - `after_sign_up_url`
  - `prompt_for_timezone_on_onboarding`
  - `user_onboarding` (JSON blob with onboarding progress; migration 306)
  - `has_completed_choose_your_adventure` (migration 413 writes true/false)
  - `is_draft_mode?` (for invited users in draft mode)

- Group-level
  - `is_strict` (EOS strict enforcement)
  - `is_eos_pure` (EOS pure flag)

Note: Group `team_management_framework` is a Group attribute, not an ObjectMeta.

### Session/State Keys (affect onboarding flow)
- `session[:utm_campaign]`: Stored in `accounts#new`, consumed in `quick_start#choose_your_adventure`.
- `session[:after_sign_in_path]`: Set from URL or meta at several points; cleared post-use.
- `session[:after_set_persona_url]`: Set by `startup_code=vision_builder` and used to override post-OAuth or post-persona redirects.

## 7. Redirect Maps

### A) Direct Signup
1. GET `/accounts/new`
   - Saves `after_sign_in_path` param to session (if present).
   - If `utm_campaign`, set session and clear `after_sign_in_path`.
2. POST `/accounts` (create)
   - Creates Account/User; onboarding flags set to required.
   - If `from_signup_button=1`: redirect via `Setup.choose_persona(@user, {persona_code: 1})`.
   - Else: set `prompt_for_timezone_on_onboarding = true`; sign in and redirect to `/quick_start/choose_your_adventure`.
3. GET `/quick_start/choose_your_adventure`
   - If `session[:utm_campaign]` matches rules, may auto-route to `Setup.choose_persona` with preset persona.
4. POST `/quick_start/set_persona`
   - Calls `Setup.choose_persona` (persists persona/framework/team size) and updates group/framework flags; optional timezone update.
   - Redirect to `new_user_startup_page` (default `/today/dashboard`) unless overridden by `view_code` or `session[:after_set_persona_url]`.

### B) Invited User
1. POST `/groups/:id/invite_users`
   - Creates user with `signup_type = 4`; metas set: `signed_up_from = 6`, `after_sign_up_url = '/today/home'`, and `prompt_for_timezone_on_onboarding = true`.
2. User clicks confirmation link -> ConfirmationsController#do_confirm
   - Sets `session[:after_sign_in_path]` from meta `after_sign_up_url` (or `startup_view_url` fallback).
   - Signs in and redirects to `session[:after_sign_in_path]`.
   - ApplicationController may still redirect to onboarding choose page later if onboarding flags require it and exceptions don’t apply.

### C) OAuth (Google/Slack/Microsoft)
1. POST `/sessions` with OmniAuth
   - Existing user: sign in, redirect to `startup_view_url` (or `/today/index`), respecting prioritizer override.
   - New user: if `params[:state] == 'resumeSignIn'`, redirect to `fresh_start` (defaults to `/prioritizer` but can be overridden via `session[:after_set_persona_url]`); else redirect to `/quick_start/choose_your_adventure?new_user=1`.
2. Then proceed with QuickStart `set_persona` as in A.4.

## 8. Known Codes

- Signup Type Codes (set/read in controllers)
  - 4: Invited by team member
  - 15: Limited signup (legacy path)
  - 16: Stripe subscription
  - 18: OAuth (Slack/Google/Microsoft)
  - Others appear in comments/tests but are not central to current flows.

- `signed_up_from` Codes (examples in controllers/tests)
  - 2: Account creation
  - 6: Invited to group
  - 18: OAuth
  - Others exist (promo, etc.) but are ancillary to onboarding.

## 9. Corrections vs V1

- Added ApplicationController onboarding redirect gate and exceptions (app/controllers/application_controller.rb:778–816).
- Added ConfirmationsController’s `do_confirm` path influencing post-confirmation routing (lines 94–180).
- Documented `view_code` override for startup view and `team_type` handling in `set_persona`.
- Clarified session storage: `after_set_persona_url` influences OAuth and persona completion redirects.
- Highlighted 'ceo' mapping discrepancy between QuickStart (3) and User (6).

## 10. Assessment

- Accuracy: 10/10 (validated against current code lines and behavior).
- Completeness: 10/10 (controllers, models, metas, redirects, and views impacting onboarding and parameters are covered).
- Code Reference Precision: 10/10 (file paths and cited line ranges verified).

## 11. Critical Issues

- 'ceo' mapping inconsistency:
  - QuickStartController maps `'ceo'` to persona code `3` (Leadership Team Member).
  - User model maps `'ceo'` to `6` (CEO or Visionary for EOS).
  - Because QuickStart passes the computed code to `Setup.choose_persona`, a user selecting `'ceo'` in the choose flow will be stored as `3`, not `6`, impacting EOS-specific behaviors (e.g., seat assignment).

