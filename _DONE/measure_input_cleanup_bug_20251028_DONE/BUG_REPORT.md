# Bug Report: Cannot Create New Measures - parseNumberFromString TypeError

**Date:** October 28, 2025
**Severity:** CRITICAL
**Status:** Under Investigation
**Related Commit:** `70bf961de2a3b63f56aa3e13d59e5a671d1b99fb` by Patrick Angodung
**Bugfix Branch:** `bugfix/measure-creation-parsenumber-error`

---

## The Error

```
TypeError: str.replace is not a function.
(In 'str.replace(/[^\d.-]/g,'')', 'str.replace' is undefined)

Stack Trace:
  at parseNumberFromString (/javascripts/b3_stack_light_no_jq_packaged.js:2275:66)
  at None (/assets/javascripts/models/measure.js:407:43)
  at None (/assets/javascripts/knockout.js:62:204)
  at dispatch (/javascripts/b3_stack_jq_packaged.js:315:452)
  at None (/javascripts/b3_stack_jq_packaged.js:288:177)
  ... (1 additional frame(s) were not displayed)
```

---

## When Error Occurs

**Trigger:** User attempts to create a new measure

**Conditions:**
- Happens on any page with "Add New Measure" functionality
- Occurs for all new measures (currency and non-currency)
- Happens immediately when clicking SAVE button
- 100% reproduction rate (every new measure creation fails)

**Affected Workflows:**
- Group scoreboard measure creation
- Battle plan measure creation
- Personal dashboard measure creation
- Accountability chart measure creation
- Any page with measure creation functionality

---

## Impact

**Severity:** CRITICAL - Complete feature breakage

**What's Broken:**
- ❌ Cannot create any new measures
- ❌ All "Add New Measure" workflows fail
- ❌ Blocking core functionality across entire application

**What Still Works:**
- ✅ Editing existing measures (inline or via form)
- ✅ Viewing existing measures
- ✅ Deleting/archiving measures
- ✅ Patrick's inline editing fix for comma-separated values

---

## Context: Patrick's Commit

**Commit:** `70bf961de2a3b63f56aa3e13d59e5a671d1b99fb`
**Date:** Mon Oct 27 15:48:12 2025 +0800
**Author:** Patrick Angodung <patrick.angodung@gmail.com>
**Message:** "updates to measures - when using edit in place, make sure to parse the values correctly"

**File Changed:** `app/views/widgets/_scoreboard.html.erb`

**Change Made:**
```javascript
// Line 76-77 (added to jeditable callback):
// clean numbers
newValue = parseNumberFromString(newValue).toString();
```

**Purpose:** Clean user input during inline editing (remove commas, currency symbols, etc.)

**Status:** This change works correctly for its intended purpose (inline editing). The error occurs in a different code path (new measure creation).

---

## Technical Details

### Error Location

**Primary Error:** `public/assets/javascripts/models/measure.js` - Line 407

**Function:** `measure.save()` - called when user clicks SAVE button in measure creation form

**Code at error location (lines 402-412):**
```javascript
// clean commas on current/target value
var currentValue = self.currentValue();
var targetValue = self.targetValue();

if (typeof parseNumberFromString == 'function'){
  currentValue = parseNumberFromString(currentValue);  // ❌ Line 407 - ERROR HERE
  targetValue = parseNumberFromString(targetValue);    // Line 408
};

self.currentValue(currentValue.toString());
self.targetValue(targetValue.toString());
```

### The parseNumberFromString Function

**File:** `public/assets/javascripts/application.js`
**Lines:** 4698-4700

```javascript
function parseNumberFromString(str) {
  return parseFloat(str.replace(/[^\d.-]/g, ''));
}
```

**Expected Input:** String (e.g., `"1,000"`, `"$500"`, `"123.45"`)
**Actual Behavior:** Calls `str.replace()` method
**Problem:** `.replace()` only exists on strings - not on numbers, undefined, null, or other types

**What Causes Error:**
- If `str` is `undefined` → `undefined.replace()` throws TypeError
- If `str` is a number (e.g., `0`) → `(0).replace()` throws TypeError
- If `str` is `null` → `null.replace()` throws TypeError

---

## Related Code Sections

### 1. Measure Constructor

**File:** `public/assets/javascripts/models/measure.js`
**Lines:** 1-38

```javascript
function Measure(data={},context){
  var self = this;
  self.data = data;

  self.id = ko.observable(data.id);
  self.name = ko.observable(data.name);
  self.currentValue = ko.observable(data.current_value);  // Line 8
  self.targetValue = ko.observable(data.target_value);    // Line 9
  // ... more properties
}
```

**Fact:** When creating a new measure without specifying `current_value` or `target_value`, these observables contain `undefined`.

**Example new measure creation:**
```javascript
var newMeasure = new Measure({
  measurable_type: 'Group',
  measurable_id: 123,
  user_id: 456
});
// currentValue observable contains: undefined
// targetValue observable contains: undefined
```

### 2. Measure Form Initialization

**File:** `public/assets/javascripts/measure_form.js`
**Lines:** 13-27

```javascript
self.open = function(measure){
  // store current measure
  self.currentContext(measure);

  // get duplicate
  var copy = new Measure(measure.toJS({skip_roll_up_event_listeners: true}))

  // default copy.currentValue to zero if its not present
  if (isPresent(copy.currentValue())==false){
    copy.currentValue(0);  // ⚠️ Line 22: Sets to NUMBER 0, not string "0"
  };

  // ⚠️ Note: No initialization for targetValue

  // init custom reports
  copy.getCustomReport();
  // ... form continues
}
```

**Observation:**
- Line 22 sets `currentValue` to numeric `0` (not string `"0"`)
- No equivalent initialization for `targetValue` (remains `undefined`)

### 3. Null Check in save() Function

**File:** `public/assets/javascripts/models/measure.js`
**Lines:** 393-400

```javascript
// set null values
if (isNull(self.currentValue())){
  self.currentValue("0");  // Sets to string "0"
}

if (isNull(self.targetValue())){
  self.targetValue("0");   // Sets to string "0"
}
```

**Purpose:** Default null/undefined values to string `"0"` before processing

### 4. The isNull() Helper Function

**File:** `public/assets/javascripts/w3mg_utilities.js`
**Lines:** 10-21

```javascript
function isNull(thisValue){
  if (thisValue==undefined){
    return true
  }
  if (thisValue===null){
    return true
  }
  if (thisValue.length == 0){
    return true
  }
  return false
}
```

**Behavior:**
- Returns `true` for `undefined`
- Returns `true` for `null`
- Returns `true` for empty string `""` (via `.length === 0` check)
- Returns `true` for empty arrays `[]` (via `.length === 0` check)
- Returns `false` for everything else, including:
  - `0` (numeric zero - no `.length` property)
  - `false` (boolean - no `.length` property)
  - `NaN` (no `.length` property)
  - Non-empty strings
  - Non-empty arrays

**Important:** The length-based check at line 17 makes `isNull()` more defensive than a simple null/undefined check. It treats empty strings and empty arrays as "null" values.

---

## Execution Flow

### New Measure Creation (Where Error Occurs)

1. **User clicks "Add New Measure"**
   - `new Measure({measurable_type, measurable_id, user_id})` is created
   - `currentValue` = `undefined`
   - `targetValue` = `undefined`

2. **Form opens (`measure_form.js:open()`)**
   - Line 22: Sets `currentValue(0)` - numeric zero
   - `targetValue` remains `undefined`

3. **User enters measure name and clicks SAVE**
   - `measure.save()` function is called

4. **save() function executes null checks (lines 394-400)**
   - Checks: `isNull(self.currentValue())`
     - `currentValue` is `0` (number)
     - `isNull(0)` returns `false`
     - Line 395 does NOT execute
   - Checks: `isNull(self.targetValue())`
     - `targetValue` is `undefined`
     - `isNull(undefined)` returns `true`
     - Line 399 executes: `self.targetValue("0")` - sets to string

5. **save() captures values into local variables (lines 403-404)**
   - `var currentValue = self.currentValue()`
   - `var targetValue = self.targetValue()`

6. **parseNumberFromString is called (line 407)**
   - `currentValue = parseNumberFromString(currentValue)`
   - **If `currentValue` is not a string, this throws TypeError**
   - ❌ **ERROR OCCURS HERE**

### Inline Editing (Works Correctly)

1. **User clicks existing measure value to edit**
   - jeditable plugin activates

2. **User enters new value (e.g., "1,500")**
   - jeditable passes value as string to callback

3. **Scoreboard template callback (line 77) executes**
   - `newValue = parseNumberFromString(newValue).toString()`
   - `newValue` is always a string from user input
   - ✅ Works correctly

---

## What We Know

1. ✅ Error message and location are confirmed
2. ✅ Error occurs at line 407 in `models/measure.js`
3. ✅ `parseNumberFromString()` expects a string parameter
4. ✅ Error message indicates `str.replace` is undefined (parameter has no `.replace()` method)
5. ✅ measure_form.js initializes `currentValue` to numeric `0` (line 22)
6. ✅ measure_form.js does NOT initialize `targetValue`
7. ✅ `isNull(0)` returns `false` (numeric 0 is not null/undefined)
8. ✅ Patrick's commit works correctly for inline editing

---

## What We Don't Know (Needs Investigation)

1. ❓ What is the actual value and type of `currentValue` at the moment line 407 executes?
2. ❓ Does line 395 execute for new measures? (Does the null check convert numeric 0 to string "0"?)
3. ❓ Is the error happening on `currentValue` or `targetValue` (or both)?
4. ❓ Are there any user interactions with the form fields before clicking SAVE that might affect values?
5. ❓ Does the error occur if the user manually enters values in the current/target fields?
6. ❓ What does `ko.observable(0)()` return? (Type: number or string?)

---

## File Reference Map

### Files Involved in Bug

| File Path | Purpose | Key Lines | Notes |
|-----------|---------|-----------|-------|
| `public/assets/javascripts/models/measure.js` | Measure model and save() function | 1-38 (constructor), 393-412 (save logic), 407 (error) | Primary error location |
| `public/assets/javascripts/application.js` | Utility functions | 4698-4700 (parseNumberFromString) | Function that throws error |
| `public/assets/javascripts/measure_form.js` | Form initialization | 13-27 (open function), 22 (currentValue init) | Sets numeric 0 |
| `public/assets/javascripts/w3mg_utilities.js` | Helper functions | 10-20 (isNull) | Determines if null check triggers |
| `app/views/widgets/_scoreboard.html.erb` | Scoreboard widget template | 73-86 (jeditable callback), 77 (Patrick's change) | Inline editing (works) |

### Related Files (For Context)

| File Path | Purpose |
|-----------|---------|
| `app/views/widgets/_measure_form.html.erb` | Measure form HTML template |
| `public/assets/javascripts/scorecard_widget.js` | Scorecard widget (calls newMeasure) |
| `public/assets/javascripts/group_scorecard_utilities.js` | Group scorecard implementation |
| `app/controllers/api/measures_controller.rb` | Backend API for measure CRUD |
| `app/models/measure.rb` | Rails model for measures |

---

## Next Steps for Investigation

See `INVESTIGATION_NOTES.md` for:
- Hypotheses about root cause
- Diagnostic steps to verify each hypothesis
- Proposed solutions
- Testing approach

---

## Additional Notes

**Rollback Option:** Temporarily reverting commit `70bf961` would restore measure creation, but would lose Patrick's fix for inline editing with commas.

**Urgency:** CRITICAL - This blocks a core workflow. Requires immediate investigation and fix.

**Code Complete Principle Violated:** Function `parseNumberFromString()` does not validate input type (defensive programming failure).

---

**Document Version:** 1.0
**Last Updated:** October 28, 2025
**Author:** Claude (AI Code Architect)
