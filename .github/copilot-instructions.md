# Copilot Instructions for Nequi Receipt Generator

## Project Overview
This workspace contains two similar web apps (`PRUEBA 1`, `PRUEBA 2`) for generating and exporting Nequi-style payment receipts. Each app is a standalone HTML/CSS/JS project with a form for user input and a visual receipt preview.

## Architecture & Data Flow
- **Main UI:**
  - Left panel (`.controls`): Form inputs for recipient, amount, number, and date.
  - Right panel (`.canvas-wrap`): Receipt preview rendered with positioned overlay text on a background image (`base.jpg`).
- **Overlay Text:**
  - Text fields (`.overlay-text` classes) are absolutely positioned over the receipt image using pixel coordinates for precise placement.
  - Text updates live as the user types, and is also updated when clicking "Generar + Mostrar".
- **Image Generation & Export:**
  - Uses `html2canvas` to render the receipt preview (`.ticket-inner`) as a PNG.
  - Uses `FileSaver.js` to enable image download.
  - The preview is visually scaled down (`transform: scale(0.4)`), but export is always at full size (1080x2400).
  - Before export, the scale is temporarily removed in JS to ensure correct image size.

## Developer Workflow
- **Live Preview:**
  - All input fields update the overlay text in real time via JS event listeners.
- **Image Generation:**
  - Clicking "Generar + Mostrar" updates the overlay and generates a PNG preview below the receipt.
- **Image Download:**
  - Clicking "Descargar" triggers export at full resolution, regardless of on-screen scale.
- **Position Adjustments:**
  - Overlay text positions and font sizes are controlled in `style.css` using absolute pixel values. Adjust these for layout changes.
- **Adding/Modifying Fields:**
  - To add new fields, update both the HTML form and overlay text elements, and wire them in `script.js`.

## Key Files & Patterns
- `index.html`: Main structure, form, and preview container.
- `style.css`: Layout, scaling, and overlay text positioning. Critical for visual accuracy.
- `script.js`: Handles input events, overlay updates, image generation, and download logic.
- `base.jpg`: Receipt background image. Must be present for correct rendering.

## External Dependencies
- [html2canvas](https://html2canvas.hertzen.com/): For DOM-to-image conversion.
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/): For client-side image download.
- Google Fonts (Manrope): For consistent typography.

## Project-Specific Conventions
- **Absolute Positioning:** Overlay text uses pixel-based coordinates for precise placement. Responsive units are avoided for export accuracy.
- **Visual Scaling:** Receipt preview is scaled down for usability, but export logic always restores full size before image capture.
- **No Build Step:** Pure HTML/CSS/JS; no bundler or transpiler required.
- **No Test Suite:** Manual visual verification only.

## Example: Export Logic
```js
// Before export
const ticket = document.querySelector('.ticket-inner');
const originalTransform = ticket.style.transform;
ticket.style.transform = 'none';
html2canvas(ticket, { width: 1080, height: 2400, scale: 1 })
  .then(canvas => { /* ... */ })
  .finally(() => { ticket.style.transform = originalTransform; });
```

## Troubleshooting
- If overlay text is misaligned, adjust `.t-para`, `.t-cuanto`, etc. in `style.css`.
- If export size is wrong, verify `.ticket-inner` dimensions and export logic in JS.
- If `base.jpg` is missing, the receipt will not render correctly.

---

_If any section is unclear or incomplete, please provide feedback to improve these instructions._
