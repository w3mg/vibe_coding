# File and Functionality Locations - Scorecard Measurables

## Documentation
- `doc/llm_scorecard_measurables.md` - Design doc for scorecard LLM agent
  - Defines MEASURABLES terminology (line 219)
  - Documents system prompts and markers

## LLM System
- `app/models/llm.rb` - LLM prompts and system messages
  - Contains `build_system_prompt_for_scorecard_measurables` method
- `app/controllers/api/llm_controller.rb` - API endpoint handling LLM chat
  - Handles `/api/llm/message` POST requests
- `app/views/shared/_llm_chatbot.html.erb` - Chatbot widget
  - Line 29-30: "Scorecard Measurables" quick action button

## Scorecard Onboarding
- `app/views/agents/scorecard.html.erb` - Scorecard onboarding page
  - Renders LLM chatbot for scorecard agent
- `app/controllers/agents_controller.rb` - Agents controller
  - Line 68-69: `scorecard` action (GET /agents/scorecard)

## Data Model
- `app/models/measure.rb` - Measure model (stores measurables)
  - Model for scorecard measurables
- `app/models/user/onboarding_meta.rb` - Onboarding completion tracking
  - Line 449: `scorecard_step_complete_from_data?` helper

## Issue
LLM sometimes generates "metrics" instead of "measurables" in responses.
Need to verify prompts in `llm.rb` enforce EOS terminology.
