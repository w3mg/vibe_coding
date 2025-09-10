# ResultMaps Onboarding Query Parameters — Research Findings v5

Purpose: Provide precise, code‑backed documentation of query strings that affect onboarding for brand‑new users and the resulting behavior. No change recommendations are included.

Scope of analysis
- Codebase: ~/Development/resultmaps-web
- Focus: Query strings and session flags that control signup, first‑time routing, onboarding pages, and new‑user post‑login flows.
- Primary sources: accounts_controller.rb, sessions_controller.rb, quick_start_controller.rb, application_controller.rb, items_controller.rb, welcome_controller.rb, routes.rb, accounts/new.html.erb.

1) /accounts/new (AccountsController#new)
- after_sign_in_path: If present, stored in session as session[:after_sign_in_path]. Used after successful signup to redirect with first_time=1 appended. Also respected by ApplicationController#after_sign_in_path_for.
- utm_campaign: If present, saved to session[:utm_campaign] and clears any session[:after_sign_in_path]. Later consumed by /quick_start/choose_your_adventure (see below).
- stripe_session_id: Looks up a pending StripeSubscription and pre‑fills params[:email] from checkout_session_id when found.
- email, first_name: Used to prefill visible form copy/inputs on the view (accounts/new.html.erb).
- signup_source: Passed via hidden field to set User.signup_source (e.g., 17 for Typeform vision, 14 for G‑Suite add‑on). Interpreted downstream for analytics/flags.
- from_signup_button=1: View toggles copy/UI for CTA‑based signups; in create, this flag triggers immediate persona routing (see AccountsController#create below).
- source: Mapped to signup_type through Account.get_signup_type_by_code and included as hidden field; applied on create if present.
- referral_account_id: If present and valid, assigns @account[:referral_account_id] for referral partner logic.
- startup_code=vision_builder: Sets session[:after_set_persona_url] = '/company_vision_workshop' to control the post‑persona destination later.

2) POST /accounts (AccountsController#create)
- General: Creates Account and User. Sets onboarding flags: @user[:onboarding_survey_required] = true and [:onboarding_survey_completed] = false.
- signup_type: If provided from the form, applied to @user. If a Stripe subscription is linked (via prior stripe_session_id flow), sets @user.signup_type = 16.
- Personal email restriction: If User.is_personal_email?(email), redirects to a marketing URL; not a query param behavior but impacts flow.
- After‑sign‑in routing:
  - If session[:after_sign_in_path] present (and not '/'), it is used as redirect_url and the controller appends first_time=1 (as a query param) before storing user meta after_sign_up_url, then signs in and redirects.
  - Else, signs in and routes to /quick_start/choose_your_adventure by default.
  - Special case: from_signup_button=1 results in redirect_url = Setup.choose_persona(@user, { persona_code: 1 }) and immediate redirect to that page instead of showing the chooser. This is set at create time; not a separate page param. Operational note: Persona 1 is legacy in code and not used in current onboarding.
- Trials/Plans: If no active subscription and no admin token, sets a 14‑day trial. Not driven by query strings here.

3) /sessions/new and OmniAuth login (SessionsController#create)
- OmniAuth new users: If a user logs in for the first time via OAuth (e.g., Google/Slack) and params[:state] == 'resumeSignIn', redirect target uses a "fresh_start" (defaults to /prioritizer or session[:after_set_persona_url] if one was preset). Otherwise, route to /quick_start/choose_your_adventure?new_user=1.
- Existing users: Redirect to startup_view_url, with a special override to /prioritizer if the stored URL is a prioritizer page.
- session[:after_set_persona_url]: If present (e.g., set earlier by startup_code=vision_builder), overrides the "fresh_start" destination for OAuth.

4) Global onboarding redirect guard (ApplicationController#redirect_to_onboarding_if_required)
- Behavior: For any non‑JSON request while signed in, if current_user.onboarding_survey_required is true and onboarding_survey_completed is not true, redirect to /quick_start/choose_your_adventure. If the user’s signup_source is 18 (third‑party OAuth) and still not complete, the redirect includes new_user=1 (/quick_start/choose_your_adventure?new_user=1).
- Exceptions (no redirect): quick_start#set_persona, quick_start#choose_your_adventure, sessions#destroy, api/users#check_login_is_taken, and all JSON requests.

5) /quick_start/choose_your_adventure (QuickStartController#choose_your_adventure)
- new_user=1: If present, sets @new_user = true (affects UI/flow). Even without the param, the guard above may set the new user mode for OAuth signups.
- session[:utm_campaign] (consumed here):
  - 'free_trial', 'essentials', 'blackbelt' -> Immediately redirect to Setup.choose_persona(current_user, { persona_code: 1 }); then session[:utm_campaign] is cleared. Operational note: Persona 1 is legacy in code and not used in current onboarding.
  - 'partner_essentials' -> Immediately redirect to Setup.choose_persona(current_user, { persona_code: 5 }); then cleared.
  - 'team_essentials' -> Sets @default_subscriber_persona = 2 but does not auto‑redirect.
- Defaults for first‑time users (display only): If onboarding not completed, defaults `@framework = 'eos'` when nil, `@team_size = 10` when nil, `@subscriber_persona = 6`. These are UI defaults and not persisted until submit.

6) /quick_start/set_persona (QuickStartController#set_persona)
- Input acceptance: Allows persona values 1–7 and special case string 'ceo' (mapped to 3 for compatibility). The v2 UI posts numeric persona codes.
- Framework normalization: If framework == 'any', normalized to 'okr' before saving. Sets the group’s team_management_framework.
- Intercom tags: Optional framework_level_tags[] written to Intercom.
- Timezone handling: If time_zone param present, saves preference and clears the prompt_on_onboarding ObjectMeta.
- Redirect resolution: Defaults to startup page, can be overridden by OKR flow options or partner assessment/startup_code routes.
- Completion: Sets current_user.onboarding_survey_completed = true.

7) Storage locations
- Persona: User ObjectMeta 'subscriber_persona' set by Setup.choose_persona → User#set_subscriber_persona (defaults to 3 when missing).
- Team size: User ObjectMeta 'choose_your_adventure_team_size' set/read by Setup/User.
- Framework (user preference): User ObjectMeta 'choose_your_adventure_framework' set/read by Setup/User.
- Framework (active behavior): Group attribute team_management_framework set by set_persona.

8) Startup page
- Constant: User::NEW_USER_FIRST_PAGE = '/today/dashboard'. Helpers return this; default target after set_persona when no overrides apply.

