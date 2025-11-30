# Technical Analysis: Enabling Parent Changes for Seats

## What EXISTS

### Database Model
`app/models/seat.rb`

- `parent_id` column exists
- `belongs_to :parent, :class_name => 'Seat'`
- `has_many :child_seats, :class_name => 'Seat', :foreign_key => 'parent_id'`
- Parent changes tracked in audit logs
- Hierarchical permissions via `editable_by?(user)`

### API Backend
`app/controllers/api/seats_controller.rb`

- Line 37: `@seat.update_attributes(params[:seat])` accepts ANY attributes including `parent_id`
- No validation preventing invalid parent assignments
- Returns `accountability_map_format` with updated `parentId`

### Frontend Data Model
`public/assets/javascripts/accountability_chart.js`

- `self.parentId = ko.observable(data.parentId || undefined)` exists
- `update()` method sends to `/api/seats/update`
- Currently sends: name, description, accountability_owner_id, associated_team_id
- Does NOT send `parent_id`

### D3 Visualization

- Tree layout rebuilds from data
- `addNode(d)` and `deleteNode(d)` exist
- No `moveNode()` function

### Tests
`test/functional/api/seats_controller_test.rb`

- Line 826: `@sales_mgr_seat.update_attributes(:parent_id => @ceo_seat.id)`
- Line 1197: `@sales_mgr.update_attributes(:parent_id => @ceo.id)`
- Tests pass

---

## What's MISSING

### Frontend
`public/assets/javascripts/accountability_chart.js`

- `parent_id` not included in `Seat.update()` data payload

### UI

- No parent selector in edit modal

### Validation

**Special Seats Identified By Name:**
- EOS framework: "Visionary" and "Integrator"
- OKR framework: "CEO" and "COO/President"
- Determined via `group.is_eos?` or `group.is_okr?`

**Rules to enforce in `can_have_parent?(proposed_parent)` method:**
1. Visionary/CEO cannot have a parent (must remain root)
2. Integrator/COO can only have Visionary/CEO as parent
3. Self-parenting prevention (seat cannot be its own parent)
4. Circular reference detection (prevents A→B→C→A loops that break recursive methods)
