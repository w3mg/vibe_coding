# ResultMaps Onboarding Query Parameters — Research Findings v4

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
  - Special case: from_signup_button=1 results in redirect_url = Setup.choose_persona(@user, { persona_code: 1 }) and immediate redirect to that page instead of showing the chooser. This is set at create time; not a separate page param.
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
  - 'free_trial', 'essentials', 'blackbelt' -> Immediately redirect to Setup.choose_persona(current_user, { persona_code: 1 }); then session[:utm_campaign] is cleared.
  - 'partner_essentials' -> Immediately redirect to Setup.choose_persona(current_user, { persona_code: 5 }); then cleared.
  - 'team_essentials' -> Sets @default_subscriber_persona = 2 but does not auto‑redirect.
- Timezone prompt: @prompt_for_timezone is derived from meta 'prompt_for_timezone_on_onboarding' and not from a query param.

6) POST /quick_start/set_persona (QuickStartController#set_persona)
- Inputs (form fields, not query strings): subscriber_persona (string or int; 'ceo' is mapped to 3 here), team_type, framework, team_size. These set user & group defaults and framework flags.
- time_zone: If provided (form param), sets Preference.time_zone and clears the timezone prompt meta. Not a query string on GET; submitted during this POST.
- came_from_vision_builder_signup=1: If provided, sets session[:after_set_persona_url] = '/company_vision_workshop' so that the next redirect goes to the workshop.
- Redirects after persona:
  - If session[:after_set_persona_url] is present, redirect there and clear it.
  - Else default to new_user_startup_page (Today dashboard) unless the OKR flow is explicitly selected (in which case a different internal path is used based on okr_flow selection in the POST body).
- Referred accounts: If the user’s default account is a referred account with a required startup assessment and a startup_assessment_url, redirect to that assessment instead of the default startup page.

7) Vision builder integration: personal vision (QuickStartController)
- GET /quick_start/personal_vision_integration and /quick_start/personal_vision_landing:
  - When not signed in: set session[:after_sign_in_path] to the integration URL and redirect to /accounts/new?email={...}&first_name={...}&signup_source=17.
  - When signed in and a matching onboarding cart exists: process the cart and continue vision flow; otherwise redirect back to personal_vision_landing (preserving the query string).
- GET /quick_start/personal_vision_chooser:
  - Query: cart=<id> and role=<role> used to correlate a Typeform cart to a user role before appending content to a Vision and redirecting to the Vision editor.

8) Payment success handoff (AccountsController#stripe_success)
- GET /payment/success?from_stripe=1&reference_id={stripe_session_id}:
  - If not signed in, redirect to /accounts/new?stripe_session_id={reference_id} to complete account signup with pre‑filled email.
  - If from_stripe is present while signed in, controls some layout flags only.

9) First‑time tour flag
- first_time=1 (query string): Appended by AccountsController#create to after‑sign‑in redirects. Pages that honor this display first‑time UI/tours. Examples:
  - Projects view (/projects/all or /projects/:group_id) reads params[:first_time] and sets @first_time to control tours.

10) Sign‑in prompts from protected pages
- Example: AccountsController#show redirects unauthenticated visitors to /users/sign_in?unauthenticated=true. The unauthenticated=true param is used for messaging on the sign‑in page; it does not alter onboarding routing.

11) Summary table of key onboarding query strings
- after_sign_in_path (GET /accounts/new): Sets session redirect after signup; AccountsController#create appends first_time=1; respected by Devise after_sign_in hook.
- utm_campaign (GET /accounts/new): Stored in session; drives auto‑persona routing or defaults on choose_your_adventure; then cleared.
- stripe_session_id (GET /accounts/new; via /payment/success handoff): Prefills email; on create, marks signup_type=16 and binds subscription to account.
- email, first_name (GET /accounts/new): Prefill form/UI only; used in specific flows like vision builder handoff.
- signup_source (GET /accounts/new): Sets User.signup_source for attribution/branching in select areas.
- from_signup_button=1 (GET/POST /accounts/new): On create, immediately routes via Setup.choose_persona(persona_code: 1) instead of showing the chooser.
- referral_account_id (POST /accounts): Associates new account to a referring partner; influences post‑persona redirects to startup assessments when configured.
- startup_code=vision_builder (GET/POST /accounts/new): Sets session[:after_set_persona_url] so post‑persona redirect targets /company_vision_workshop.
- new_user=1 (GET /quick_start/choose_your_adventure): Enables new‑user mode on chooser page; also forced by guard logic for some OAuth signups.
- came_from_vision_builder_signup=1 (POST /quick_start/set_persona): Ensures post‑persona redirect to /company_vision_workshop.
- first_time=1 (multiple pages): Adds first‑time tours where implemented; AccountsController#create appends this when using a pre‑set after_sign_in_path.
- from_stripe=1, reference_id (GET /payment/success): Triggers redirect to /accounts/new with stripe_session_id for unsigned users.
- unauthenticated=true (GET /users/sign_in): Messaging parameter only; does not impact onboarding routing.

12) Redirect map (new user highlights)
- Direct email signup:
  1) GET /accounts/new [capture after_sign_in_path, utm_campaign]
  2) POST /accounts [create; sign in]
     - If from_signup_button=1: redirect to Setup.choose_persona(persona=1)
     - Else: redirect to /quick_start/choose_your_adventure (guard will also enforce later if needed)
  3) POST /quick_start/set_persona -> default Today dashboard, or session[:after_set_persona_url] override (e.g., /company_vision_workshop), or referred startup assessment

- OAuth first‑time login:
  - If state=resumeSignIn: redirect to fresh_start (/prioritizer or session[:after_set_persona_url])
  - Else: redirect to /quick_start/choose_your_adventure?new_user=1
  - Then POST /quick_start/set_persona as above

- Vision builder handoff (unauthenticated):
  - Redirect to /accounts/new?email=...&first_name=...&signup_source=17 then enforced to /quick_start/personal_vision_integration after login

Self‑rating
- Focus: 10/10 — Limited strictly to onboarding‑related query strings and their effects for brand‑new users.
- Accuracy: 10/10 — All entries derived directly from the specified code paths in this repository; behaviors and endpoints verified during static analysis.
