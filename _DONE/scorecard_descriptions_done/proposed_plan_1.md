# Plan: Measure Description Tab

## Goal
Add a "Description" tab to the measure form modal using Trix editor with click-to-edit behavior.

## Reference Files

### Pattern to Copy (Trix editor with click-to-edit)
- HTML structure: `resultmaps-web/app/views/items/show.html.erb` lines 244-269
- JavaScript handlers: `resultmaps-web/app/views/items/_heading_b3.html.erb` lines 146-166

### File to Modify
- `resultmaps-web/app/views/widgets/_measure_form.html.erb`

### Existing Infrastructure
- Database field: `measures.description` (text) - already exists
- Knockout observable: `measure.description` defined in `resultmaps-web/public/assets/javascripts/models/measure.js` line 7
- Hidden textarea (to be removed): `resultmaps-web/app/views/widgets/_measure_form.html.erb` lines 62-70

## Changes Required

1. Add "Description" tab link (after CONFIG tab at line 23)
2. Add tab pane copying the pattern from `items/show.html.erb` lines 244-269
3. Add JavaScript handlers copying the pattern from `items/_heading_b3.html.erb` lines 146-166
4. Remove hidden description textarea from CONFIG tab (lines 62-70)
