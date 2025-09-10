# Deprecated Features

This document tracks deprecated features discovered during the onboarding evolution project. Each entry includes file references with line numbers for complete traceability.

## startTour() Function

**Status**: DEPRECATED  
**Date Identified**: 2025-01-07  
**Original Purpose**: Trigger Intercom product tours  
**Evolution**: Later repurposed for Appcues integration  
**Current State**: Non-functional (Appcues calls are commented out)  

### Background
The `startTour()` function was originally created to trigger Intercom product tours using `Intercom('startTour', tourID)`. It was later overridden in various views to integrate with Appcues for product tours. Currently, the Appcues integration is commented out, making these functions effectively dead code.

### File References

#### Global Definition
- **File**: `/public/assets/javascripts/application.js:19`
  - Original Intercom implementation
  - `function startTour(tourID){ Intercom('startTour', tourID);}`

#### Function Calls
- **File**: `/public/assets/javascripts/lists_by_status_utilities.js:501`
  - Calls `window.startTour()`
  - Part of tour initialization logic

#### View Overrides (Appcues - Commented Out)
- **File**: `/app/views/items/lists_by_status.html.erb:248-250`
  ```javascript
  window.startTour=function(){ 
    //  Appcues.show('-KjreBR6cS7P5KWE9zJb');
  };
  ```

- **File**: `/app/views/items/lists_by_status_tiled.html.erb:320-322`
  ```javascript
  window.startTour=function(){ 
    //  Appcues.show('-KjreBR6cS7P5KWE9zJb');
  };
  ```

#### Different Implementation
- **File**: `/app/views/visions/index2.html.erb:92`
  - HTML link: `<a href="javascript:startTour(overlay)">`
  
- **File**: `/app/views/visions/index2.html.erb:198-201`
  ```javascript
  function startTour(source){
    alert('clicked startTour should be starting now');
    window.tour.start(true);
  }
  ```

#### Helper Partial References
- **File**: `/app/views/layouts/_helper_global_help.html.erb:19`
  - Menu item: `<a href="javascript:window.startTour()">Launch a tour of this page</a>`

- **File**: `/app/views/layouts/_helper_global_help_bottom.html.erb:13`
  - Menu item: `<a href="javascript:window.startTour()">Launch a tour of this page</a>`

### Recommendation
This function and all its references should be removed in a future cleanup task, as they serve no current purpose and may confuse developers.