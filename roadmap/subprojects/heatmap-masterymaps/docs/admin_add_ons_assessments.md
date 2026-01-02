# Admin Add-Ons Assessments (resultmaps-web)

This document explains the code path behind the admin pages that surface MasteryMaps assessment submissions from unauthenticated users (pre-account/lead capture). It is intended for another AI agent or a novice developer who needs to understand how data is collected, stored, and rendered by `admin/add_ons/assessments/:id`.

## Overview
- Purpose: Inspect individual assessment submissions captured before a user creates an account.
- Storage: Records live in `custom_contents` with `content_type_code: 10` (“MasteryMaps integration (No user/account yet)”).
- Admin UI:
  - List: `/admin/add_ons/assessments` → `AdminController#list_assessments`
  - Detail: `/admin/add_ons/assessments/:id` → `AdminController#view_assessment`

## Routes
Defined in `config/routes.rb`:
```ruby
map.connect "/admin/add_ons/assessments",     :controller=>:admin, :action=>:list_assessments
map.connect "/admin/add_ons/assessments/:id", :controller=>:admin, :action=>:view_assessment
```

## Controller
File: `app/controllers/admin_controller.rb`

Authentication and access:
- `prepend_before_filter :authenticate_user!`
- `before_filter :admin_permission` restricts access to system admins (user `ren` is explicitly allowed as a special case).

Actions:
1) `list_assessments`
```ruby
conditions = { content_type_code: 10 }
conditions[:body] = params[:flow_id] if params[:flow_id]
@custom_contents = CustomContent.find(:all, :conditions => conditions)
```
- Lists all pre-account assessment submissions (type 10).
- Optional `?flow_id=...` narrows to a specific assessment flow (stored in `custom_contents.body`).

2) `view_assessment`
```ruby
@custom_content = CustomContent.find(params[:id])
if @custom_content.content_type_code == 10
  @flow_id = @custom_content[:body]
  mm_object_type, mm_object_id = MasteryMap.parse_mm_object_from_flow_id(@flow_id)
  @flow_source  = MasteryMap.load_flow_source(mm_object_type, mm_object_id)
  @json_content = JSON.parse(@custom_content[:json_content] || '{}') rescue {}
else
  # under construction
end
```
- Loads the selected submission, resolves its MasteryMaps “flow” via `flow_id`, then fetches the corresponding flow schema/content from MasteryMaps for display.

## Views

1) List view: `app/views/admin/list_assessments.html.erb`
- Renders a table with columns: ID, Email, Team/company, Flow ID, Assessment, Date submitted.
- Data derivations:
  - Email → `custom_content.title`
  - Team/company → `JSON.parse(custom_content.json_content)["team_name"]` (if present)
  - Flow ID → `custom_content.body` (e.g., `1mm282`)
  - Assessment name → via MasteryMaps API (`MasteryMap.load_flow_source`) cached per-flow during render.
  - Assessment link → `https://masterymaps.herokuapp.com/<mm_type_plural>/<mm_id>`

2) Detail view: `app/views/admin/view_assessment.html.erb`
- Header shows the MasteryMaps article/guide name and description from `@flow_source`.
- If available, shows:
  - Email entered (`@custom_content.title`)
  - Team/company name (`@json_content["team_name"]`)
- Iterates `@flow_source['assessment_prompts']` (sorted by `position`) and prints each prompt’s description and the user’s answer from `@json_content`.
  - For boolean prompts, uses `answer_meta_data` labels (`labelForTrue`/`labelForFalse`).

## Data Model
Table: `custom_contents` (see `db/schema.rb`)
- Key fields used here:
  - `id`: primary key
  - `title`: stores the entered email address for pre-account submissions
  - `body`: stores the MasteryMaps `flow_id` (e.g., `1mm282`)
  - `json_content`: JSON blob of answers
  - `content_type_code`: `10` for unauthenticated MasteryMaps assessment responses
  - `created_at`: used to show submission date

Content types (excerpt from `app/models/custom_content.rb`):
```ruby
CONTENT_TYPES = {
  7  => "MasteryMaps integration",
  10 => "MasteryMaps integration(No user/account yet)",
  # ... others omitted
}
```
- Logged-in users’ assessment responses are usually stored with `content_type_code: 7` and linked to a `User`/`Group` via `ObjectMeta`.
- This admin page focuses on `content_type_code: 10` (no account yet).

## Where Type 10 records come from
Submission flow (guest user) lives in `AddOnsController`:
- `add_ons#assess` (GET) sets up flow, and for guests calls `get_custom_content_for_assessment`:
  ```ruby
  @custom_content = CustomContent.find_by_id(session[@flow_id])
  unless @custom_content.present?
    @custom_content = CustomContent.new(content_type_code: 10)
    @custom_content[:title] = params[:email]   # email entered
    @custom_content[:body]  = @flow_id         # e.g., "1mm282"
  end
  @json_content = JSON.parse(@custom_content[:json_content] || '{}') rescue {}
  ```
- `add_ons#complete_assessment` (POST) persists answers:
  ```ruby
  if params[:form_answer].present? && @custom_content.present?
    @custom_content[:json_content] = params[:form_answer].to_json.to_s
    @custom_content.save
    @json_content = params[:form_answer]

    if current_user.present? == false
      session[@flow_id] = @custom_content.id    # remember last guest submission
      UserMailer.try(:deliver_mastery_maps_assessment, @custom_content.id)
    end
  end
  ```

Email integration:
- `UserMailer#mastery_maps_assessment(custom_content_id)` loads the same `@flow_source` and `@json_content` and emails results to the provided email (`custom_content.title`).

## MasteryMaps Integration
File: `app/models/mastery_map.rb`
- `MM_URL = "https://masterymaps.herokuapp.com"`
- `load_flow_source(mm_object_type, mm_object_id)`
  - Calls `GET #{MM_URL}/api/2.1/integrations/mastery_step?object_type=<type>&object_id=<id>`
  - Returns a JSON with keys such as `name`, `description`, and `assessment_prompts`.
- `parse_mm_object_from_flow_id(flow_id)` → returns `[mm_object_type, mm_object_id]`
  - Example: `"1mm282"` → `["content_article", "282"]`
  - Codes: `1 => content_article`, `3 => chapter`, `4 => guide` (see source for mapping)

## Data Shapes
1) Flow source (subset; fields used by admin views):
```json
{
  "name": "Define impact and success",
  "description": "Be specific about impact and measures.",
  "assessment_prompts": [
    {
      "id": 10,
      "position": 1,
      "description": "Purpose",
      "hint": "",
      "answer_meta_data": "{\"type\":\"text\"}"
    },
    {
      "id": 371,
      "position": 2,
      "description": "Revenue target",
      "answer_meta_data": "{\"type\":\"range\",\"maxScore\":10,\"labelForMinimum\":\"Low\",\"labelForMaximum\":\"High\"}"
    },
    {
      "id": 999,
      "position": 3,
      "description": "Is this a priority?",
      "answer_meta_data": "{\"type\":\"boolean\",\"labelForTrue\":\"Yes\",\"labelForFalse\":\"No\"}"
    }
  ]
}
```

2) Saved answers in `custom_contents.json_content` (guest submission):
- Keys are strings of prompt IDs; values vary by type. The admin list also expects an optional `team_name`.
```json
{
  "team_name": "Smooth Selling Forever",
  "46": "true",
  "45": "false",
  "47": "8"
}
```
- Example payload used in tests for guest POST:
```ruby
post :complete_assessment, {
  mm_object_id: "414",
  mm_object_type: "content_article",
  email: "craig@smoothsellingforever.com",
  form_answer: {
    team_name: "Smooth Selling Forever",
    "644"=>"2", "645"=>"3", "646"=>"3", ...
  }
}
```

## Rendering Logic Highlights (detail page)
- Answers are read from `@json_content[prompt_id_as_string]`.
- For booleans, the label from `answer_meta_data` is displayed instead of raw `true/false`.
- Missing answers render as “No answer”.
- Prompts are ordered by `position`.

## Access Control
- Only authenticated users with `is_system_admin? == true` can access these admin pages.
- Special-case bypass: user with login `"ren"`.

## Key Files and Paths
- Routes: `config/routes.rb`
- Controller: `app/controllers/admin_controller.rb`
- Views: `app/views/admin/list_assessments.html.erb`, `app/views/admin/view_assessment.html.erb`
- Guest assessment flow: `app/controllers/add_ons_controller.rb` (`assess`, `complete_assessment`, and helpers)
- Model: `app/models/custom_content.rb` (type codes), `app/models/mastery_map.rb` (API integration)
- Tests and examples: `test/functional/add_ons_controller_test.rb` (guest submission cases)

## End-to-End Flow (Guest)
- GET `/add_ons/assess?...` → renders assessment wizard based on MasteryMaps `assessment_prompts`.
- POST `/add_ons/complete_assessment` with `form_answer` → stores a `CustomContent` (type 10), saves `json_content`, remembers the record in `session[@flow_id]`, emails results.
- Admin visits `/admin/add_ons/assessments` to list all such records; clicks through to `/admin/add_ons/assessments/:id` to view one submission with prompt-by-prompt answers.

## Implementation Notes and Edge Cases
- `@custom_content.content_type_code != 10` path in `view_assessment` is currently “under construction”.
- `@json_content` parsing is wrapped in `rescue {}` to guard malformed JSON.
- `MasteryMap.load_flow_source` depends on external API; handle failures gracefully in any new consumer.
- The admin list view caches per-flow lookups during a single render to avoid repeated API calls.

---
This documentation should be sufficient to build a spec or a new API endpoint that exposes the same data currently accessible only via these admin pages.
