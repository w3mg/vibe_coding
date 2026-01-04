# Framework Terminology Cleanup

This document tracks hardcoded framework terminology in dropdown menus and action items that should potentially use framework helpers instead.

## Background

The resultmaps-web project supports multiple business operating frameworks (OKR, EOS, V2MOM, 4DX, SRT, SVEP). Each framework has its own terminology that should be rendered dynamically using helpers rather than hardcoded strings.

### Key Framework Helpers

| Helper | Purpose | Example Output |
|--------|---------|----------------|
| `render_team_weekly_name(input)` | Weekly meeting name | "Weekly L10" (EOS), "Team Priorities" (SRT), "Weekly Sync" (default) |
| `render_wow_headings(column, group)` | Column/section names | Issues, To-dos, Headlines, Done |
| `render_stat_card_name(input)` | Scorecard terminology | "Scorecard" vs "Scoreboard" |
| `render_framework_action_text(input)` | Action item terminology | Framework-specific action labels |
| `render_goal_name(input)` | Goal terminology | "objective" (OKR), "rock" (EOS) |
| `render_outcome_name(input)` | Outcome terminology | "key results" (OKR), "milestones" (EOS) |

---

## Items to Vet and Fix

### HIGH PRIORITY

#### 1. "My Team Priorities" in alignment dropdown
- **File**: `app/views/shared/_w3mgui_elements.html.erb`
- **Line**: 2990
- **Find command**:
  ```bash
  grep -n "My Team Priorities" ~/Development/resultmaps-web/app/views/shared/_w3mgui_elements.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 2. "Add to team to-dos" in ideas context menu
- **File**: `app/views/groups/ideas.html.erb`
- **Lines**: 123, 208
- **Find command**:
  ```bash
  grep -n "Add to team to-dos" ~/Development/resultmaps-web/app/views/groups/ideas.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 3. "Add to the team issue list" in ideas context menu
- **File**: `app/views/groups/ideas.html.erb`
- **Lines**: 126, 211
- **Find command**:
  ```bash
  grep -n "Add to the team issue list" ~/Development/resultmaps-web/app/views/groups/ideas.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 4. "Team Priorities" button label (common top buttons)
- **File**: `app/views/items/_common_top_buttons.html.erb`
- **Line**: 163
- **Find command**:
  ```bash
  grep -n "Team Priorities" ~/Development/resultmaps-web/app/views/items/_common_top_buttons.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 5. "Team Priorities" button label (heading v3)
- **File**: `app/views/items/_heading_v3.html.erb`
- **Line**: 281
- **Find command**:
  ```bash
  grep -n "Team Priorities" ~/Development/resultmaps-web/app/views/items/_heading_v3.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 6. "issues + challenges" in meeting mode organizer
- **File**: `app/views/groups/meeting_mode.html.erb`
- **Line**: 867
- **Find command**:
  ```bash
  grep -n "issues + challenges" ~/Development/resultmaps-web/app/views/groups/meeting_mode.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 7. "Scorecard Measurables" in AI chatbot
- **File**: `app/views/shared/_llm_chatbot.html.erb`
- **Lines**: 29-30, 425, 644
- **Find command**:
  ```bash
  grep -n -i "scorecard" ~/Development/resultmaps-web/app/views/shared/_llm_chatbot.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

### MEDIUM PRIORITY

#### 8. "Focus here this week" in missions grid
- **File**: `app/views/missions/grid.html.erb`
- **Line**: 49
- **Find command**:
  ```bash
  grep -n "Focus here this week" ~/Development/resultmaps-web/app/views/missions/grid.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 9. "Focus here this week" in result areas grid
- **File**: `app/views/result_areas/grid.html.erb`
- **Line**: 56
- **Find command**:
  ```bash
  grep -n "Focus here this week" ~/Development/resultmaps-web/app/views/result_areas/grid.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 10. "Scorecard" / "Scoreboard" toggle in dashboard
- **File**: `app/views/today/dashboard.html.erb`
- **Line**: 348
- **Find command**:
  ```bash
  grep -n "Scorecard\|Scoreboard" ~/Development/resultmaps-web/app/views/today/dashboard.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 11. "Scorecard" in SRT dashboard
- **File**: `app/views/today/dashboard_srt.html.erb`
- **Line**: 270
- **Find command**:
  ```bash
  grep -n "Scorecard" ~/Development/resultmaps-web/app/views/today/dashboard_srt.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 12. "Scorecard" in team subnav
- **File**: `app/views/groups/_subnav_team.html.erb`
- **Line**: 207
- **Find command**:
  ```bash
  grep -n "Scorecard" ~/Development/resultmaps-web/app/views/groups/_subnav_team.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 13. "Scorecard (KPIs)" in sidebar team selector
- **File**: `app/views/groups/_sidebar_team_selector.html.erb`
- **Lines**: 51, 68
- **Find command**:
  ```bash
  grep -n "Scorecard" ~/Development/resultmaps-web/app/views/groups/_sidebar_team_selector.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

#### 14. "scorecard measurables" in onboarding wizard
- **File**: `app/views/today/_onboard_account_owners_v2.html.erb`
- **Lines**: 351, 358
- **Find command**:
  ```bash
  grep -n -i "scorecard" ~/Development/resultmaps-web/app/views/today/_onboard_account_owners_v2.html.erb
  ```
- **Status**: [ ] Vetted | [ ] Fixed
- **Notes**:

---

### LIKELY OK (EOS-specific)

#### 15. "Headlines" in weekly preparation
- **File**: `app/views/groups/weekly_preparation.html.erb`
- **Lines**: 640, 712
- **Find command**:
  ```bash
  grep -n "Headlines" ~/Development/resultmaps-web/app/views/groups/weekly_preparation.html.erb
  ```
- **Status**: [x] Likely OK - Headlines is EOS-specific terminology
- **Notes**: Only appears in EOS context, probably intentional

---

## Bulk Search Commands

Find all potential hardcoded terms in views:

```bash
# Search for common hardcoded terms in ERB files
cd ~/Development/resultmaps-web

# Team Priorities
grep -rn "Team Priorities" app/views/

# Scorecard variations
grep -rn -i "scorecard" app/views/ | grep -v "render_stat"

# Issues terminology
grep -rn "issue list" app/views/

# To-dos terminology
grep -rn "to-dos\|to-do" app/views/ | grep -i "add to"

# Weekly meeting names
grep -rn "Weekly L10\|Weekly Sync\|Weekly Tactical" app/views/
```

---

## Resolution Checklist

For each item above:

1. [ ] Verify the file is still in use (check git blame, search for references)
2. [ ] Confirm the hardcoded string is problematic (not framework-specific by design)
3. [ ] Identify the correct helper to use
4. [ ] Make the fix
5. [ ] Test with multiple frameworks (OKR, EOS at minimum)
6. [ ] Mark as complete in this document

---

## Reference Files

- **Framework helpers**: `app/frameworks_helper.rb`
- **Framework constants**: `app/models/group.rb` (lines 204-271)
- **JavaScript functions**: `public/assets/javascripts/application.js` (lines 3328-3526)
- **Framework test suite**: `test/unit/helpers/frameworks_helper_test.rb`
