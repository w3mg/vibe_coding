# Assignee Display Refactoring - Enhanced with Profile Images

**Date**: 2025-11-01
**Status**: Implemented

## Summary

Created a flexible Knockout binding handler that displays assignees with configurable options for images, names, and click actions. Eliminates repetitive conditional logic in templates.

## Implementation

**File**: `public/assets/javascripts/knockout-custom-binding-handlers.js` (lines 1035-1119)

**Template Usage**: `app/views/groups/organizer.html.erb:1631`

## Usage Examples

### Basic Usage (Name Only - Default)

```erb
<!-- Shows login names only -->
<span data-bind="assigneeDisplay: $data"></span>

<!-- Shows full names only -->
<span data-bind="assigneeDisplay: $data, useFullName: true"></span>
```

### With Profile Images

```erb
<!-- Image only -->
<a data-bind="assigneeDisplay: $data, showImage: true, showName: false"></a>

<!-- Image + login name -->
<a data-bind="assigneeDisplay: $data, showImage: true, showName: true"></a>

<!-- Image + full name -->
<a data-bind="assigneeDisplay: $data, showImage: true, showName: true, useFullName: true"></a>

<!-- Custom image size -->
<a data-bind="assigneeDisplay: $data, showImage: true, imageSize: 24"></a>
```

### With Click Actions

```erb
<!-- Click opens item card with assignment tab -->
<a data-bind="assigneeDisplay: $data, showImage: true, showName: true, clickAction: 'assignment'"></a>

<!-- Click navigates to user profile -->
<a data-bind="assigneeDisplay: $data, showImage: true, showName: true, clickAction: 'profile'"></a>

<!-- No click action -->
<span data-bind="assigneeDisplay: $data, showImage: true, showName: true, clickAction: 'none'"></span>
```

### Current Organizer Implementation

```erb
<a class="specialcrumb orange"
   data-bind="assigneeDisplay: $data,
              showImage: true,
              showName: true,
              useFullName: true,
              clickAction: 'assignment',
              imageSize: 20"></a>
```

## Available Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `showImage` | boolean | `false` | Display profile images |
| `showName` | boolean | `true` | Display name text |
| `useFullName` | boolean | `false` | Use full name vs login |
| `clickAction` | string | `'none'` | Click behavior: `'none'`, `'profile'`, `'assignment'` |
| `imageSize` | number | `20` | Profile image height in pixels |

## Click Actions Explained

### `clickAction: 'none'`
No click behavior. Display only.

### `clickAction: 'profile'`
Navigates to user's profile page (`/users/{id}`).
- For images: Each image is clickable
- For names: Name text is clickable (single user only)

### `clickAction: 'assignment'`
Opens item card modal with assignment tab active.
- Adds `w3mgui-delegator` class to element
- Must use `<a>` tag (not `<span>`)
- Opens assignment/delegation interface for the item

## Technical Details

### User Data Source
- Uses `item.assignees.assigneesOrOwner()` to get user list
- Falls back to `item.itemOwner` if no assignees
- User objects have `profilePhotoThumbPath` property

### Profile Image Fallback
Default image: `/assets/images/profile.jpg`

### CSS Classes Applied
- `img-circle` - Makes images circular
- `person-avatar` - Standard avatar styling
- `w3mgui-delegator` - Triggers assignment modal (when `clickAction: 'assignment'`)

## Files Modified

1. **Enhanced**: `public/assets/javascripts/knockout-custom-binding-handlers.js:1035-1119`
2. **Updated**: `app/views/groups/organizer.html.erb:1631`

## Potential Future Uses

### Timeline View
```erb
<a data-bind="assigneeDisplay: $data, showImage: true, showName: false, imageSize: 15"></a>
```

### Item Cards
```erb
<a data-bind="assigneeDisplay: $data, showImage: true, useFullName: true, clickAction: 'profile'"></a>
```

### Inbox Organizer (app/views/groups/inbox_organizer.html.erb:240-246)
```erb
<a data-bind="assigneeDisplay: $data, showImage: true, showName: true, clickAction: 'assignment'"></a>
```

### Meeting Mode (app/views/groups/meeting_mode.html.erb:903-907)
```erb
<a data-bind="assigneeDisplay: $data, showImage: true, showName: true, useFullName: true, clickAction: 'assignment'"></a>
```

## Drop-In Ready

No additional JavaScript required. Just add the binding to any template where you have access to an item/goal object with assignees.

---

**Last Updated**: 2025-11-01
