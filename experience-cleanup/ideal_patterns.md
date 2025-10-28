# Ideal Patterns

## Description Field in Item Popover
- **Location:** `app/views/shared/_item_card.html.erb:441-458` hosts the description UI. The read-only block `#show_item_card_description_form` renders the HTML body; the editable form `#item_card_description_form` contains the Trix editor `#item_card_description_editor`.
- **Behavior:** `public/assets/javascripts/w3mgui.js:820-868` wires up `itemPopoverOpenHandlers`. Clicking the description area copies the current value into `itemCardTarget.originalDescription`, shows the editor, and focuses it. Save (button or blur) calls `handleDelayedUpdateItemDescription`, hides the editor, and restores the read-only view. Cancel resets to the stored original description.
- **UX Note:** The modal screenshot (core values agent definition…) corresponds to that editor. Ensure future styling keeps the focus state obvious and respects the purple outline.
