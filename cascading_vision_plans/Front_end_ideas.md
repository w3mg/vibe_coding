# Cascading Vision Plans - Frontend Evaluation

## What We're Building

Two tree views showing vision data across team hierarchy:
1. **3-Year Pictures Tree** - future_date, revenue, profit, measurables, description
2. **1-Year Plans Tree** - text, date, revenue, profit, measures

---

## Current Pattern: Accountability Chart

| Aspect | Implementation |
|--------|---------------|
| Tree Layout | D3.js v3 (`d3.layout.tree()`) |
| Data Binding | Knockout.js observables |
| DOM | jQuery + D3 SVG |
| Editing | Trix editor, inline forms |
| Lines | ~1800 JS + ~743 ERB |

**Why move away from Knockout?**
- Reactive overhead for what may be read-only views
- Tight coupling makes maintenance difficult
- Observable pattern adds complexity

---

## Options to Evaluate

### Option 1: D3.js (v7)

**What it is**: Low-level visualization library, industry standard for data viz

**Strengths**:
- Already used in codebase (v3)
- Full control over layout algorithm
- Built-in zoom/pan
- Handles large datasets well

**Weaknesses**:
- Verbose for simple cases
- Learning curve
- Manual DOM updates
- v3→v7 has breaking changes

**Best for**: Complex layouts, large trees, custom interactions

---

### Option 2: Pure CSS Tree

**What it is**: HTML structure + CSS for connecting lines

```css
.tree-node::before { /* vertical line */ }
.tree-node::after { /* horizontal line */ }
```

**Strengths**:
- Zero JavaScript for basic display
- Simple to understand

**Weaknesses**:
- No zoom/pan
- Fixed layout only
- Struggles with deep hierarchies
- Lines get complex

**Best for**: Shallow trees (<3 levels), simple display

---

### Option 3: Existing `tree_maker.js`

**What it is**: Already in codebase at `public/assets/javascripts/tree_maker.js`

**Strengths**:
- Already available (~100 lines minified)
- Draws SVG connecting lines
- Lightweight

**Weaknesses**:
- Minified, hard to modify
- Unknown capabilities/limitations
- No documentation found

**Best for**: Quick prototype if it fits requirements

---

### Option 4: OrgChart Libraries

Examples: OrgChart.js, Treant.js, GoJS

**Strengths**:
- Purpose-built for org/hierarchy charts
- Often include export features
- Less code to write

**Weaknesses**:
- External dependency
- May not match existing UI
- Some are commercial (GoJS)

**Best for**: If standard org-chart look is acceptable

---

### Option 5: Canvas-based (Konva, Fabric.js)

**What it is**: Draw to HTML5 Canvas instead of SVG/DOM

**Strengths**:
- Best performance for very large trees
- Smooth zoom/pan

**Weaknesses**:
- Accessibility challenges
- Text rendering quirks
- Different mental model

**Best for**: Thousands of nodes, performance-critical

---

## Key Questions to Decide

### 1. Interactivity Level

| Level | Description | Implications |
|-------|-------------|--------------|
| **Read-only** | Just display the tree | Simplest, many options work |
| **Expand/collapse** | Show/hide branches | Need state management |
| **Click to view** | Modal/panel with details | Moderate complexity |
| **Inline editing** | Edit values in tree | Highest complexity |

---

### 2. Expected Tree Size

| Size | Nodes | Consideration |
|------|-------|---------------|
| Small | <20 | Any approach works |
| Medium | 20-100 | Need efficient rendering |
| Large | 100+ | May need virtualization |

---

### 3. Layout Requirements

| Aspect | Options |
|--------|---------|
| Orientation | Vertical (top-down) vs Horizontal (left-right) |
| Zoom/Pan | Required vs Nice-to-have vs Not needed |
| Responsive | Mobile support needed? |
| Print/Export | PDF output required? |

---

### 4. Integration Constraints

- Must work with existing jQuery (`$j`)
- Should match current UI look/feel
- Any browser support requirements (IE11?)
- Build process limitations?

---

## Data Flow (Backend)

**API Approach**: Tree structure endpoint + lazy-load node details

```
GET /api/groups/:id/vision_tree
  → Returns hierarchy structure (ids, names, parent relationships)

GET /api/groups/:id/three_year_picture
  → Returns 3-year picture data for specific group

GET /api/groups/:id/one_year_plan?year=2025
  → Returns 1-year plan data for specific group
```

**Existing methods to use**:
```ruby
# Hierarchy traversal
group.self_and_internal_teams  # from group.rb:4031

# 3-Year Picture
AddsOnEOS::VTO.find_three_year_picture(user, team)  # adds_on_eos.rb:40

# 1-Year Plan
AddsOnEOS::VTO.get_year_and_quarter_planning(user, team, year, 0)  # adds_on_eos.rb:62
```

---

## Unknowns

1. How many groups typically in a hierarchy?
2. How often does this data change?
3. Are there existing similar tree views in the app to reference?
4. Performance expectations?
5. Who will maintain this code long-term?

---

## Next Steps

1. Clarify requirements - Answer questions above
2. Prototype 2-3 approaches - Quick spike to compare
3. Evaluate fit - Which feels right for the codebase?
4. Decide together
