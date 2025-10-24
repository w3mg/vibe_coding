# Onboarding Project - File Reference

**Last Updated**: 2025-10-24
**Last Commit**: 64a025847dedfdeeab27b018a46284eb51d68fae

Quick reference for all key files when working on ResultMaps onboarding.

## Project Context (vibe_coding)
- `CLAUDE.md` - Project charter and guidelines
- `resultmaps_onboarding_evolution.md` - Implementation status (Evolution 1 & 3 complete)
- `subprojects/evolution_4_eos_fixes/` - Latest work (EOS terminology fixes)

## Documentation (resultmaps-web/doc)
- `onboarding_controller.md` - OnboardingController documentation
- `agents_controller.md` - AgentsController documentation
- `llm_scorecard_measurables.md` - LLM agent design

## Controllers (resultmaps-web/app/controllers)
- `onboarding_controller.rb` - Navigation/flow (96 lines)
- `agents_controller.rb` - Step implementation (148 lines)
- `api/llm_controller.rb` - LLM API endpoint

## Models (resultmaps-web/app/models)
- `user/onboarding_meta.rb` - Business logic (765 lines)
- `llm.rb` - LLM prompts and system messages
- `measure.rb` - Scorecard measurables data

## Views (resultmaps-web/app/views)
- `agents/` - Agent step views (vision, core_values, scorecard, etc.)
- `shared/_llm_chatbot.html.erb` - Chatbot widget

## Full Paths
All resultmaps-web paths: `/Users/scottlevy/Development/resultmaps-web/`
All vibe_coding paths: `/Users/scottlevy/Development/vibe_coding/onboarding_evolution_20250906/`
