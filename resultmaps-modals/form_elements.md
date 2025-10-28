# ResultMaps Form Elements Documentation

## Item Modal Description Field - Location and CSS

### 1. **Modal Location**

**File**: `/Users/scottilevy/Development/resultmaps-web/app/views/widgets/_global_modals.html.erb`

This modal handles item creation and editing throughout the application.

### 2. **Description Field Location**

The description textarea is on **line 151** of `_global_modals.html.erb`:

```html
<textarea id="item_description" cols="2" rows="2" class="col-md-12 span12 lovely-input" style="height:50px;width:100%"></textarea>
```

**Context** (lines 147-153):
```erb
<div class="row<%=b2_row%>" style="margin-top:1em">
    <div class="col-md-12 span12 quiet small-font">
        <span class="quiet">Notes / more info:</span><br/>
        <textarea id="item_description" cols="2" rows="2" class="col-md-12 span12 lovely-input" style="height:50px;width:100%"></textarea>
    </div>
</div>
```

**Key attributes:**
- **ID**: `item_description`
- **Name**: **NOT SET** - Missing `name` attribute
- **Classes**: `col-md-12 span12 lovely-input`
- **Inline styles**: `height:50px; width:100%`

### 3. **CRITICAL: Form Serialization Behavior**

**The textarea lacks a `name` attribute**, which means default jQuery `.serialize()` omits it from form submissions.

**Default serialization** at `public/assets/javascripts/application.js:1120`:
```javascript
data = $j('#new_item_form_anywhere').serialize()
```
This **DOES NOT** include `item_description` because it has no `name` attribute.

**Board view override** at `public/assets/javascripts/items_flowboard_utilities.js:1669`:
```javascript
var args = {
  'description':  $j('#new_item_form_anywhere #item_description').val(),
  'type': $j('#new_item_form_anywhere #item_type').val(),
  'addToToday':$j('#new_item_form_anywhere #add_to_today').is(':checked'),
}
```
Only the board view **manually extracts** the description value by directly calling `.val()` on `#item_description`.

**Implications:**
- Default item creation flows: Description is NOT submitted
- Board/flowboard views: Description IS submitted via manual extraction
- To fix globally: Add `name="item[description]"` to the textarea element

### 4. **CSS/SCSS Location**

**File**: `/Users/scottilevy/Development/resultmaps-web/public/assets/scss/w3mg/global-helpers.scss`

#### Base Textarea Styling (lines 638-639):

```scss
textarea {
    border-radius: $map_border_radius;
    border: 1px solid #E7E7E7;
}

textarea:focus, textarea:focus-visible {
    border: 3px solid $purple-electric;
}
```

**Visual Effect:**
- Default: Light gray border (`#E7E7E7`) with rounded corners
- On focus: Bold 3px electric purple border (`$purple-electric`)

#### Lovely-Input Class Styling (lines 1867-1872):

```scss
input.lovely-input {
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid $purple_electric;
}

input.lovely-input:focus {
    box-shadow: none !important;
    outline: none !important;
}
```

**Note**: Defined for `input.lovely-input` but textarea inherits the class name. Textarea gets base `textarea` styles plus any `.lovely-input` styles that apply to all elements.

#### Item Creator Specific Styling (lines 2085-2099):

```scss
.lovely-input.item-creator {
    background-color: transparent;
    border-bottom: 1px solid $purple_electric !important;
    font-weight: bold;
}

.modal-body #new_item_anywhere_form {
    input[type="text"].lovely-input.item-creator {
        background-color: transparent;
        border-radius: 0px;
        border: 0px;
        border-bottom: 1px solid $purple_electric !important;
        font-size: 20px;
        line-height: 22px;
    }
}
```

**Applies to**: Item name input field (not description), which has `lovely-input` and `item-creator` classes.

### 5. **How It's Included in the Application**

`_global_modals.html.erb` is included in **7 main layout files**:

1. `app/views/layouts/_b3_application.html.erb`
2. `app/views/layouts/_b3_application_side.html.erb`
3. `app/views/layouts/application.html.erb`
4. `app/views/layouts/b3_minimal.html.erb`
5. `app/views/layouts/board_common.html.erb`
6. `app/views/layouts/perspective.html.erb`
7. `app/views/layouts/table_common.html.erb`

The item creation/editing modal is accessible from anywhere in the application.

### 6. **CSS Variables Reference**

Variables defined in `/Users/scottilevy/Development/resultmaps-web/public/assets/scss/variables.scss`:

- **`$purple_electric`** (line 16): `#6C63FF` - Electric purple for focus states and borders
- **`$map_border_radius`**: Border radius for map elements (typically `5px`)

**Correct path**: `public/assets/scss/variables.scss:16`, NOT `_variables.scss`

### 7. **Comparison: Other Textarea Fields in the Same Modal**

#### Goal Description Field (line 206) - HAS name attribute ✓
```html
<textarea id="goal_description" name="goal[description]" cols="2" rows="2" class="span10 col-md-10" style="height:50px;;margin-right:8px"></textarea>
```
**Key differences:**
- **Has name attribute:** `name="goal[description]"` - will serialize correctly
- **Different classes:** Uses `span10 col-md-10` (no `lovely-input`)
- **Location:** Goal creation form (line 206) vs Item creation form (line 151)

#### Realization Notes Field (line 234) - HAS name attribute ✓
```html
<textarea id="realization_notes" placeholder="Add a quick note on why this is a win." name="realization[notes]" cols="2" rows="2" class="span10 col-md-10" style="height:50px;width:100%"></textarea>
```
**Has name attribute:** `name="realization[notes]"` - will serialize correctly

#### Feedback Notes Field (line 270) - HAS name attribute ✓
```html
<textarea id="feedback_notes" placeholder="Add a quick note on why this accomplishment is good" name="feedback_notes" cols="2" rows="2" class="col-xs-12 col-md-12" style="height:50px;border:1px solid #AEB0B8;border-radius: 5px;"></textarea>
```
**Has name attribute:** `name="feedback_notes"` - will serialize correctly

**CONCLUSION:** The item description field at line 151 is the **ONLY** textarea in `_global_modals.html.erb` missing a name attribute. This appears to be an oversight, as all other textareas properly include the name attribute for form serialization.

---

### 9. **Related Form Elements in the Item Creation Form**

#### Item Name Field (line 19):
```html
<input type="text" class="col-md-12 span12 lovely-input item-creator big-input hash-mention"
       name="item[name]" id="item_name" placeholder="" />
```

#### Group Selection (lines 31-38):
```html
<select id="item_group_id" name="item[group_id]" class="chzn-select"
        data-display_disabled_options="false" data-width="100%"
        onchange="generateKeyResultOptions(this)">
    <!-- Options populated dynamically -->
</select>
```

#### Item Type Selection (lines 130-136):
```html
<select style="margin: 5px 0px 0px;" class="item-type-selector"
        name="item_type" id="item_type">
    <option value="Outcome">One action item ("to-do" or "task")</option>
    <option value="TodoList">Project / list with multiple steps</option>
    <option value="Outcome">I don't know yet</option>
</select>
```

#### Add to Today Checkbox (line 143):
```html
<input type="checkbox" name="add_to_today" id="add_to_today"
       checked="checked" style="margin-top:3px">
```

### 10. **JavaScript Interaction**

**Save Functions** (referenced in `_global_modals.html.erb`):
- `handleClickSaveItemAnywhere()` - Saves and closes modal
- `handleClickSaveAndViewItemAnywhere()` - Saves and navigates to item view
- `handleCreateNewProjectAndRedirect()` - Creates project and redirects

**Default serialization** (application.js:1120):
```javascript
data = $j('#new_item_form_anywhere').serialize()
```
Omits `item_description` because textarea lacks `name` attribute.

**Board override** (items_flowboard_utilities.js:1669):
```javascript
'description': $j('#new_item_form_anywhere #item_description').val()
```
Manually extracts description value for board views only.

### 11. **Compilation Notes**

SCSS compilation is handled via separate Docker container.

**SCSS Compiler Repository**: https://github.com/w3mg/resultmaps-scss-compiler

**To compile SCSS changes:**
1. Clone compiler repository
2. Run Docker container
3. SCSS files compile to CSS

**Compiled CSS Output**: `/Users/scottilevy/Development/resultmaps-web/public/stylesheets/`

---

## Summary

- **Modal File**: `app/views/widgets/_global_modals.html.erb:151`
- **Field ID**: `item_description`
- **Field Name**: **NONE** - Missing `name` attribute causes default serialization to omit description
- **CSS File**: `public/assets/scss/w3mg/global-helpers.scss:638-639`
- **CSS Variables**: `public/assets/scss/variables.scss:16` (`$purple_electric`)
- **Key CSS Classes**: `lovely-input`, `col-md-12`, `span12`
- **Focus Behavior**: 1px gray border → 3px electric purple border
- **Globally Available**: Included in 7 main layouts
- **Serialization Quirk**: Only board override at `items_flowboard_utilities.js:1669` manually extracts description; default serialize() omits it

---

## 12. **Impact Analysis & Recommendations**

### Current State
The `#item_description` textarea at line 151 of `_global_modals.html.erb` is **missing the name attribute**, causing form serialization issues:

**Impact:**
- ✗ Default item creation flows (using `.serialize()`) - Description NOT submitted
- ✓ Board/flowboard views (using manual extraction) - Description IS submitted
- ✗ Inconsistent behavior across different parts of the application

### Recommended Fix
Add `name="item[description]"` to the textarea at line 151:

**Before:**
```html
<textarea id="item_description" cols="2" rows="2" class="col-md-12 span12 lovely-input" style="height:50px;width:100%"></textarea>
```

**After:**
```html
<textarea id="item_description" name="item[description]" cols="2" rows="2" class="col-md-12 span12 lovely-input" style="height:50px;width:100%"></textarea>
```

**Benefits:**
1. Consistent behavior across all item creation flows
2. Matches pattern used by all other textareas in the same file
3. Eliminates need for board-specific workaround
4. Follows Rails conventions for nested attributes

### Testing Checklist
After applying the fix:
- [ ] Test item creation from main modal (non-board views)
- [ ] Test item creation from board/flowboard views
- [ ] Verify description persists in both cases
- [ ] Check that board override at `items_flowboard_utilities.js:1669` still works (backward compatibility)

---

*Last Updated: 2025-10-25*
*Verification Status: All line numbers verified against source code*
*Related Files: modal-files-with-references.md, modal-css-classes.md*
