# Onboarding Flows — Invited Teammate

- Scope: Users invited to an existing account/team by an admin or owner.
- Typical result: Join team and land on a working page (no chooser). Persona may be set via invite or left at default. (source: `app/controllers/groups_controller.rb#invite_users`)

## How Invitations Work
- Initiation: Team admin/owner calls `GroupsController#invite_users` with one or more emails. (source: `app/controllers/groups_controller.rb#invite_users`)
- Existing email:
  - User is added to the group and emailed a notification. (source: same action)
  - No onboarding survey is forced; no chooser step by default. (onboarding flags not set in this action)
  - Next login redirects to the user’s `startup_view_url`. (source: `app/controllers/application_controller.rb#after_sign_in_path_for`)
- New email (no account yet):
  - A user record is created with a confirmation token and emailed an “accept invitation” link. (sources: `groups_controller.rb#invite_users`, `app/views/user_mailer/notify_of_joined_group_for_new_user.html.erb`)
  - On confirmation, user sets password (and optionally time zone) and is then signed in and redirected. (source: `app/controllers/confirmations_controller.rb#do_confirm`)

## New Invited User — Data and Redirects
- Created user setup (server-side on invite): (source: `app/controllers/groups_controller.rb#invite_users`)
  - Flags/Meta: `signup_type=4`, `signed_up_from=6`, `after_sign_up_url` (context‑based or `/today/home`), optional `is_draft_mode`.
  - Optional persona: If the invite payload includes `subscriber_persona`, it is saved immediately. If not provided, the getter defaults to `3` until changed. (sources: `groups_controller.rb#invite_users`, `app/models/user.rb#subscriber_persona`)
  - Time zone prompt: Sets `prompt_for_timezone_on_onboarding=true`; saving a time zone clears it. (sources: `groups_controller.rb#invite_users`, `app/controllers/confirmations_controller.rb#do_confirm`)
  - Group membership: User is added to the account and team; intercom contact is created. (source: `groups_controller.rb#invite_users`)
- Confirmation flow: (source: `app/controllers/confirmations_controller.rb`)
  - Page: Password setup (and time zone prompt if flagged).
  - Post‑confirm redirect: Uses `after_sign_up_url` meta when present; otherwise falls back to `startup_view_url`. (sources: `confirmations_controller.rb#do_confirm`, `app/controllers/application_controller.rb#after_sign_in_path_for`)
  - Common redirect targets: (source: `groups_controller.rb#invite_users` context mapping)
    - Default: `/today/home`.
    - Contextual: Vision Map team page, Big Picture canvas, or Team Organizer (when invite specified a context).

## Framework and Persona Behavior
- Framework: Invited teammates do not set framework; they inherit the team’s existing framework (e.g., EOS or OKR) through group context. (group framework is typically set by owners in `quick_start#set_persona` and used broadly; sources: `app/controllers/quick_start_controller.rb#set_persona`, `app/models/group.rb` helpers)
- Persona for invited teammates:
  - If provided in the invite, persisted immediately. (source: `groups_controller.rb#invite_users`)
  - If not provided, remains unset (defaults to `3` at read time) until the user changes it later. (source: `app/models/user.rb#subscriber_persona` default)
  - If an invited user visits `/quick_start/choose_your_adventure` manually, the UI shows teammate personas only (2=Manager, 3=Leadership, 4=Individual Contributor). Submitting will persist persona and optional preferences. (source: `app/views/quick_start/choose_your_adventure_v2.html.erb` conditional blocks for non‑owners)

## Existing Users Invited to a Team
- Added directly as group members; receive a notification email. (source: `groups_controller.rb#invite_users`)
- No onboarding chooser is forced; no change to existing startup page or preferences. (onboarding flags unchanged)
- Next login routes to their `startup_view_url` as usual. (source: `application_controller.rb#after_sign_in_path_for`)

## Email and Acceptance Link
- Invitation email template includes an “accept invitation” link based on Devise confirmation token. (source: `app/views/user_mailer/notify_of_joined_group_for_new_user.html.erb`)

