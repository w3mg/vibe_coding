# Implementation Plan: Parent Changes for Seats

## Status
Backend validation complete ✅ - All tests passing

## Next Steps (in order)

### Step 1: Add API endpoint to fetch valid parent options for a seat

**Why this before frontend dropdown:**
1. Backend validation (`can_have_as_parent?`) is done ✅
2. Frontend needs to know which seats are valid parents
3. Can't build dropdown without knowing what options to show
4. This lets you test the business logic via API before touching UI

**New endpoint:**
```
GET /api/seats/:id/valid_parents
```

Returns filtered list of seats the current seat can have as parent, respecting:
- Framework rules (Visionary/CEO/Integrator/COO)
- Same group only
- No circular references
- Uses existing `can_have_as_parent?` method

**After this:** Frontend can call this endpoint to populate dropdown in edit modal.
