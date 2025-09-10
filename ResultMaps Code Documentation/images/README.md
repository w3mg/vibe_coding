# Images and Screenshots

This folder holds screenshots and small diagrams embedded in the ResultMaps Code Documentation.

Recommended structure

- images/
  - accountability_chart/
    - sidebar_label_eos.png
    - sidebar_label_non_eos.png
    - chart_main_eos.png
    - chart_main_non_eos.png
    - snapshots_modal.png
    - print_filename_dialog.png (optional if shown)

Capture guidelines

- Use a consistent viewport: 1440×900 (or 1280×800) for desktop.
- Light theme where possible for contrast; crop to relevant UI region.
- File names: lowercase, hyphen/underscore separated, include framework when relevant.
- Keep PNGs under ~400–800 KB; JPG for large backgrounds if needed.

Manual capture (quick)

1) Open the page in Chrome.
2) Use Cmd/Ctrl+Shift+P → “Capture full size screenshot” or region crop.
3) Save into `images/accountability_chart/` with the names above.

Programmatic capture (optional)

- You can use a headless browser (e.g., Playwright or Puppeteer) to log in and capture `/team_seats` for different frameworks. This requires local app running and installing the toolchain.
- Prefer manual for now to avoid adding runtime deps to this repo.

