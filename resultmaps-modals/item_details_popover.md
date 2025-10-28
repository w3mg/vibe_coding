# Item Details Popover (`#item_details_popover`)

## Purpose
- Primary in-app popover for viewing and editing existing items.
- Shared across board, timeline, organizer, and other item-aware pages; this is the only form used for editing.

## Source and inclusion
- HTML defined at `app/views/shared/_item_card.html.erb:16`.
- Partial rendered by `app/views/shared/_w3mgui_elements.html.erb:1339` via `render_item_card_ko_update_due_dates`, which is included in layouts and feature views.
- Knockout binds the popover to `viewModel.w3mgWidget`, so the widget instance follows the user through all entry points.

## Activation flow
- UI triggers `$(window).trigger('showDetails', options)` when a user opens an item card.
- `public/assets/javascripts/w3mgui.js:242-923` handles the event: it resolves the target item, assigns `window.itemCardTarget`, resets widget observables, and initializes the jQuery `popup` plugin on `#item_details_popover`.
- `itemPopoverOpenHandlers` attaches inline editing, tab listeners, and optional callbacks; `afterClosePopup` recalculates child metrics and refreshes the caller (both in `w3mgui.js`).
- The popover is displayed with `$('#item_details_popover').popup('show')` and hidden via `popup('hide')` from multiple modules when saves complete.

## Data context
- Root div declares `data-bind="with: viewModel.w3mgWidget"`; all bindings read from the global widget instance.
- Key observables set on open:
  - `parentObjectOfDescendants()` holds the active `Item` model.
  - `objectDescendants()` powers the Steps tab.
  - `isLoadingObjectDescendants`, `isLoadingParentObjectsRecentActivity`, `isLoadingGoogleDriveFolder` gate spinners.
  - `quickCaptureNewItem` drives the inline add form.
- The open handler subscribes to `name`, `description`, `status`, `due`, `groupId`, `type`, `recentUpdates`, `allTagIds`, and `allCustomLabels`; subscriptions are pushed into `window.popOverSubscriptions` for cleanup.

## Layout overview
- Header (lines 16-200) shows the breadcrumb, toolbar, completion checkbox, inline name editor (`.title-edit`), due date picker, and assignee avatars. Permission classes (`hidden-if-not-viewable`, `hidden-if-viewable`) gate controls.
- Tab strip (`.nav.nav-pills.g-style`) exposes:
  - `#item_detail_steps`: descendant list with Knockout sortable, quick capture form, and optional "Refresh list" link.
  - `#item_detail_comments`: comment feed, Trix editor (`#item_card_comment_editor`), and activity history.
  - Attachments dropdown (paperclip icon) bootstraps Google Drive integration through `/widgets/result_impact_for_object`.
  - `#item_details_tags_more`: status widget or dropdown, long-term checkbox, skill/process tags (`#parent_object_utility_tags_select`), custom labels (`#parent_object_custom_labels_select`), and hashtag editor.
  - `#item_details_scheduling`: start/due date pickers (`#item_scheduling_*`), recurrence form (`/widgets/recurrence_form_contents`), optional ClickUp controls.
  - `#item_details_delegate`: Select2 multi-select for accountable users (`#parent_object_assignees_select`).
  - `#item_extras`: additional settings (type selector `#item_details_type`, save/cancel/delete buttons) plus result impact widget.
  - `#item_card_helper`: lazy-loads contextual help via `window.handleOnClickLoadItemCardArticle`.
- Footer shows accountable avatars (with spinner) and view/share dropdowns; `popup-no-access-message` replaces content when a user lacks permissions.

## Key controls and IDs
- `.title-edit` uses x-editable to update the item name via `handleDelayedUpdateItemName`.
- Description editor form (`#item_card_description_form`, `#item_card_description_editor`) saves on blur or Save, cancel restores `originalDescription`.
- Quick capture input `#w3mg_quick_capture_item_name` injects new descendants.
- Tag select `#parent_object_utility_tags_select` and label select `#parent_object_custom_labels_select` are upgraded to Select2 after async loads (`handleLoadCompletion`).
- Hashtag field lives inside `#item_details_hashtags_content`; Save button calls `saveHashtags` on the item model.
- Scheduling inputs (`#item_scheduling_start_date`, `#item_scheduling_due`) and Extras inputs (`#item_details_start_date`, `#item_details_due`) bind to `initItemDetailsDatePicker`.
- Delegate tab leverages `initDelegateAssignmentsSelectElement` to populate `#parent_object_assignees_select`.
- Extras tab Save button triggers `saveParentObjectSettings`; Cancel just closes the popover.

## JavaScript integration points
- `w3mgui.js` registers `ItemCardOpened` and `ItemUpdated` events on `#item_details_popover`; Flowboard listens for `ItemUpdated` to refresh cards (`public/assets/javascripts/items_flowboard_utilities.js:1302`).
- Select2 dropdowns use `dropdownParent: '#item_details_popover'` to stay clipped inside the overlay.
- `initRecurrenceContents` (default target `#item_details_scheduling`) wires recurrence radio/select inputs and Save buttons.
- Reusable helpers (`handleDelayedShowDetailsAjaxRequests`, `handleLoadCompletion`, `toggleBodyScrollbar`) maintain loading state and page scroll.
- External modules (`new_simple_checklist_utilities.js`, `items_flowboard_utilities.js`) call `$('#item_details_popover').popup('hide')` after completing their flows, so custom scripts must tolerate repeated hide calls.

## Permissions model
- `window.setItemCardPermissions` toggles `item-viewer-role` / `item-editor-role` classes on the root (`public/assets/javascripts/w3mgui.js:11230`), which CSS uses to hide or show form controls.
- When a user cannot view the item, `.popup-no-access-message` replaces the card with a Request access button wired to `requestAccess` (`app/views/shared/_item_card.html.erb:900`).

## Common extension points
- Pass `options.defaultOpenTab` or `options.tab` when triggering `showDetails` to redirect to a specific tab.
- Supply `options.onOpen` to run custom logic once the popover mounts.
- Override `window.handleOverrideAfterClosePopup` to replace the default close behavior.
- Provide `window.handleReloadItemCardChildren` to refresh descendants from the footer link.

## Known behaviors and gotchas
- Popover relies on global singletons (`window.itemCardTarget`, `window.popOverSubscriptions`); always clear subscriptions inside custom hooks to prevent leaks.
- Description save fires on blur; removing focus prematurely will commit changes.
- Spinner/content pairs (`#item_details_*_spinner` and `#item_details_*_content`) must call `handleLoadCompletion` after async work, otherwise the tab stays disabled.
- `saveParentObjectSettings` closes the popover before the PUT resolves; downstream UI updates depend on the `ItemUpdated` event.
- Board and checklist utilities assume the popover exists when hiding it. Guard new scripts if they run without the modal present.

## Testing checklist
- Open the popover from board, outline, today, and organizer views; verify the correct tab defaults.
- Edit name, description, status, type, dates, assignees, tags, labels, and hashtags; confirm changes persist and `ItemUpdated` fires.
- Exercise recurrence and ClickUp sections when enabled.
- Log in as a viewer-only user to ensure edit controls hide and the Request access message appears.
