# Legacy Landing Page CSS Usage Analysis

## Files Using Classes from genius_landing.scss and genius_landing2.scss

### Actively Used (Confirmed)
5. `/Users/scottilevy/Development/resultmaps-web/app/views/hashtags/genius.html.erb`
6. `/Users/scottilevy/Development/resultmaps-web/app/views/hashtags/genius_step2.html.erb`

### Investigation Required

## Routes and Controllers for Files Using Legacy CSS (excluding hashtags files)

### 1. `app/views/welcome/get_started.html.erb`
- **Route**: `/get_started` or `/getstarted`
- **Controller**: `WelcomeController#get_started` (app/controllers/welcome_controller.rb:41)

### 2. `app/views/users/register_from_promo_step2.html.erb`
- **Route**: `/users/register_from_promo_step2`
- **Controller**: `UsersController#register_from_promo_step2` (app/controllers/users_controller.rb:379)

### 3. `app/views/shared/_welcome_genius_ui.html.erb` (partial - rendered by):
   - `app/views/welcome/get_started2.html.erb`
     - **Route**: `/getstarted2`
     - **Controller**: `WelcomeController#get_started2` (app/controllers/welcome_controller.rb:50)

   - `app/views/welcome/genius_sandbox.html.erb`
     - **Route**: `/genius_sandbox`
     - **Controller**: `WelcomeController#genius_sandbox`

### 4. `app/views/layouts/promo.html.erb` (layout - used by):
   - `WelcomeController#get_started`
   - `UsersController#register_from_promo_step2`
   - `UsersController#register_from_promo_step3`

## CSS Files Location
- `/Users/scottilevy/Development/resultmaps-web/public/assets/scss/genius_landing.scss`
- `/Users/scottilevy/Development/resultmaps-web/public/assets/scss/genius_landing2.scss`
