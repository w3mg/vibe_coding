# Test Stability Fix Plan

You're right. The system has 7 pre-existing test failures. We can't add new functionality on top of broken tests.

**Analysis of failures:**

**Category 1: Our new tests (15 errors)** - Expected, `can_have_as_parent?` doesn't exist yet

**Category 2: Pre-existing failures (7 failures)** - THE PROBLEM:

1. ~~**AuditLog.seat_types** - Test expects 6 types, but code has 12. Code added more types after test was written.~~ **FIXED**

2. **Rock assignment test** (line 253) - Expects assignee NOT to include user2, but it does. Still investigating - the `next unless rock.responsible_seat_id == self.id` check was added but test still fails.

3. ~~**Audit log tests (5 failures)** - All audit-related:~~ **ALL FIXED**
   - ~~Line 607: Seat assignment change - "Failed assertion, no message given"~~ **FIXED**
   - ~~Line 627: Seat deletion - "deleted" vs "removed" string mismatch~~ **FIXED**
   - ~~Line 489: Seat name update - "Failed assertion, no message given"~~ **FIXED**
   - ~~Line 507: Seat description update - "Failed assertion, no message given"~~ **FIXED**
   - ~~Line 525: Seat wysiwyg description - "Failed assertion, no message given"~~ **FIXED**

**Root cause:** Audit logging code changed but tests weren't updated. The 4 "Failed assertion, no message given" errors suggest audit logs aren't being created at all.

---

## TODO: Resume TDD for can_have_as_parent? implementation

### Progress: can_have_as_parent? Implementation

**Status:** Input normalization complete - adding validation logic
**Last updated:** 2025-11-10

#### Test Progress Checklist (3/15 tests passing)

- [ ] **RULE 1: Visionary/CEO seats must be root (lines 724-741)** - 0/2 tests passing
  - [ ] Line 724-731: can_have_as_parent? always returns false for Visionary seat
  - [ ] Line 733-741: can_have_as_parent? always returns false for CEO seat in OKR framework (ERROR: stubs method)

- [ ] **RULE 2: Integrator/COO can only have Visionary/CEO as parent (lines 747-766)** - 0/2 tests passing
  - [ ] Line 747-755: can_have_as_parent for Integrator returns true only for Visionary seat
  - [ ] Line 757-766: can_have_as_parent for COO/President returns true only for CEO seat in OKR framework (ERROR: stubs method)

- [ ] **RULE 3: Self-parenting prevention (lines 772-777)** - 0/1 tests passing
  - [ ] Line 772-777: can_have_as_parent? returns false when seat is its own parent

- [ ] **RULE 4: Circular reference detection (lines 784-804)** - 0/2 tests passing
  - [ ] Line 784-795: can_have_as_parent? returns false when circular reference A->B->C->A would be created
  - [ ] Line 797-804: can_have_as_parent? returns false when circular reference A->B->A would be created

- [x] **Valid parent scenarios (lines 810-821)** - 1/2 tests passing ✅
  - [x] Line 810-815: can_have_as_parent? returns true when normal seat has valid parent ✅
  - [ ] Line 817-821: can_have_as_parent? returns true when normal seat becomes root

- [x] **Input type validation (lines 827-846)** - 2/3 tests passing ✅
  - [x] Line 827-832: can_have_as_parent? accepts Seat object as input ✅
  - [x] Line 834-839: can_have_as_parent? accepts integer ID as input ✅
  - [ ] Line 841-846: can_have_as_parent? accepts string ID as input

- [ ] **Edge cases and error handling (lines 852-874)** - 0/4 tests passing
  - [ ] Line 852-856: can_have_as_parent? returns false for invalid string input
  - [ ] Line 858-862: can_have_as_parent? returns false for array input
  - [ ] Line 864-868: can_have_as_parent? returns false for hash input
  - [ ] Line 870-874: can_have_as_parent? returns false for non-existent seat ID

---

### Next Steps

1. Start with input handling tests (lines 867-892) - foundation for all other tests
2. Implement method one test at a time
3. Follow TDD: Red -> Green -> (minimal refactor if needed)
4. Update this checklist after each test result
