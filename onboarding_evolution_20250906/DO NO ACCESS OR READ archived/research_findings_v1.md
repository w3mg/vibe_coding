# ResultMaps Onboarding Flow Research Findings - V1

## Current Implementation Analysis

### 1. User Signup Flow

#### Primary Controllers
- **AccountsController** (`app/controllers/accounts_controller.rb`)
  - `new` action (lines 74-122): Handles signup page
  - `create` action (lines 127-321): Processes new account creation
  
- **SessionsController** (`app/controllers/sessions_controller.rb`)
  - `create` action (lines 39-176): Handles login and OAuth

- **QuickStartController** (`app/controllers/quick_start_controller.rb`)
  - `choose_your_adventure` (lines 2338-2409): Main onboarding flow
  - `set_persona` (lines 2411-2487): Sets user role and framework

#### Key Models
- **User** (`app/models/user.rb`)
  - `set_meta_key_value` (line 1301): Stores metadata via ObjectMeta
  - `subscriber_persona` (line 7456): Gets user role
  - `choose_your_adventure_framework` (line 7467): Gets framework choice
  - `choose_your_adventure_team_size` (line 7462): Gets team size

- **Setup** module (`app/models/setup.rb`)
  - `choose_persona` (lines 2-88): Core logic for persona/role assignment

### 2. Current Query String/URL Parameter Handling

#### Existing Parameters Found

**AccountsController#new (lines 74-122):**
- `after_sign_in_path`: Redirect URL after signin
- `utm_campaign`: Marketing campaign tracking (line 105-108)
- `stripe_session_id`: Stripe payment integration
- `email`: Pre-fill email field

**AccountsController#create (lines 127-321):**
- `referral_account_id`: Referral tracking (lines 141-146)
- `startup_code`: Special flows like 'vision_builder' (lines 149-151)
- `signup_type`: Type of signup (lines 166-168)
- `from_signup_button`: Vision builder flag (line 302)
- `skip_onboarding`: Skip onboarding flag (line 247)

**QuickStartController#choose_your_adventure (lines 2338-2409):**
- `new_user`: Flag for new users (line 2363)
- Uses session `utm_campaign` for routing decisions (lines 2340-2354)

### 3. Framework Choice Capture

**Location:** `app/controllers/quick_start_controller.rb:2457-2487`
- Framework set in `set_persona` action
- Stored via ObjectMeta: `choose_your_adventure_framework`
- Options: 'eos', 'okr', 'any' (converts to 'okr')
- Applied to default group's `team_management_framework` (line 2469)

**EOS-specific:**
- Sets `is_strict` and `is_eos_pure` flags (lines 2476-2483)
- Updates day plan actions for EOS (line 2487)
- Sets accountability seats (Setup.rb lines 53-69)

### 4. Role (CEO/IC/Leader) Setting

**Subscriber Personas (Setup.rb lines 4-10):**
1. Personal
2. Manager/Director  
3. Leadership Team Member
4. Individual Contributor
5. Coach/Consultant
6. CEO or Visionary (EOS)
7. Integrator (EOS)

**Setting Process:**
- QuickStartController#set_persona (lines 2422-2427)
- Stored via `user.set_subscriber_persona(code)`
- Special handling for CEO persona: converts 'ceo' to code 3

### 5. Invited Users vs Direct Signups

**Direct Signup Flow:**
- AccountsController#create
- Sets `signup_type` based on context
- Creates account and default group
- Redirects to `/quick_start/choose_your_adventure`

**Invited User Flow:**
- GroupsController#invite_users (lines 1430-1554)
- Creates user with `signup_type = 4` (line 1502)
- Sets `signed_up_from = 6` metadata (line 1508)
- Can set `after_sign_up_url` metadata (line 1509)
- Sends invitation email with confirmation token
- Can be in "draft mode" for admin-created users (lines 1512-1514)

### 6. Existing Tracking Mechanisms

**ObjectMeta System:**
Used for storing user metadata including:
- `signed_up_from`: Numeric codes for signup source
- `after_sign_up_url`: Post-signup redirect
- `choose_your_adventure_framework`: Framework choice
- `choose_your_adventure_team_size`: Team size
- `subscriber_persona`: User role/persona
- `utm_campaign`: Campaign tracking (stored in session)
- `prompt_for_timezone_on_onboarding`: Timezone setup flag

**Signup Type Codes (found in controllers):**
- 1: Promo signup
- 3: Mentioned in notes
- 4: Invited by team member  
- 15: Limited signup
- 16: Stripe subscription
- 17: Vision builder
- 18: OAuth (Slack/Google/Microsoft)

**signed_up_from Codes:**
- 1: Promo
- 2: Account creation
- 5: Mentioned user
- 6: Invited to group
- 7: Single project
- 8: Multi project
- 10: Big picture planner
- 11: Unknown
- 12: VTO
- 19: Unknown
- 20: Sandbox

## Current Query String Parameter Support

### What's Currently Supported

1. **Framework:**
   - Captured via form selection in choose_your_adventure
   - No direct query string parameter support

2. **Role:**
   - Captured via form selection (subscriber_persona)
   - No direct query string parameter support

3. **Entry Type:**
   - signup_type exists internally but not exposed via query string

4. **Campaign/Context:**
   - utm_campaign parameter is captured and stored in session
   - Used for some routing decisions

5. **Other Parameters:**
   - `email`: Pre-fills email field
   - `after_sign_in_path`: Post-signin redirect
   - `stripe_session_id`: Payment integration
   - `referral_account_id`: Referral tracking
   - `startup_code`: Special flows like 'vision_builder'

## Code References

- User signup: `app/controllers/accounts_controller.rb:127-321`
- Choose adventure: `app/controllers/quick_start_controller.rb:2338-2409`
- Set persona: `app/controllers/quick_start_controller.rb:2411-2487`
- Invite users: `app/controllers/groups_controller.rb:1430-1554`
- Setup persona: `app/models/setup.rb:2-88`
- User metadata: `app/models/user.rb:1301-1330`
- Subscriber persona: `app/models/user.rb:7418-7457`
- Framework storage: `app/models/user.rb:7467`
- Team size storage: `app/models/user.rb:7462`