# measurables_ux

## Success Markers

1. **Quick Filters** - Easy-to-use filters that don't disrupt the display; filter by person or measurable name

2. **Weekly Scorecard Totals** - Totals added to the weekly scorecard view that make sense, are easy to use, and look great

## Current State

The team scorecard displays measures with historical data across time periods.

### Existing Filters
- Year
- Status (active/archived)
- Period (weekly/monthly/quarterly)

### What's Missing
- No way to filter by owner/person
- No way to search by measurable name
- No totals shown for weekly data

## Ideas to Explore

*These are potential approaches - need to be tested for UX fit*

### Quick Filters
- Inline search/filter bar above the scorecard that filters as you type
- Dropdown or pill selectors for owner that don't take up much space
- Filter chips that show active filters and can be dismissed
- Subtle filter icon that expands to reveal options

### Weekly Totals
- Summary row at bottom showing column totals
- Only sum measures that make sense to sum (same unit type, or user-selected)
- Subtotals by category/grouping if measures are grouped
- Toggle to show/hide totals

## Key Files
- `doc/team_scorecard.md` - full architecture documentation
- Widget partial: `app/views/widgets/_team_scorecard.html.erb`
- Widget JS: `public/assets/javascripts/team_scorecard_widget.js`

