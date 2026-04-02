# Visual Annotator

Chrome extension to annotate any web page and copy structured markdown — built for AI coding agents.

Annotate elements, capture screenshots, copy browser console logs, and paste everything into your agent of choice. The output is optimized for AI consumption: structured markdown with selectors, bounding boxes, computed styles, and file paths to screenshots.

**One-click console capture** — all `console.log`, `console.warn`, `console.error`, and unhandled exceptions are recorded in the background. Click the terminal icon in the toolbar to copy them as formatted markdown. A red dot on the icon alerts you when errors have occurred.

### Works with

| Agent | How |
|-------|-----|
| **Claude Code** | Paste markdown + screenshot paths directly into the CLI prompt |
| **Cursor** | Paste into chat or Cmd+K inline edit |
| **GitHub Copilot** | Paste into Copilot Chat in VS Code |
| **ChatGPT / OpenAI Codex** | Paste into conversation or API prompt |
| **Windsurf** | Paste into Cascade chat |
| **Pi / Inflection** | Paste into conversation |
| **Cline** | Paste into chat panel in VS Code |
| **Aider** | Paste into CLI prompt |
| Any other agent | If it reads markdown, it works |

No backend. No framework dependency. Works on every website.

## Demo

https://github.com/wernerstrauch/visual-annotator/raw/main/demo.mp4

## Install

### Mac

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. In the file dialog, navigate to the downloaded `visual-annotator` folder and select it
6. The extension icon appears in your toolbar — click the puzzle piece icon and pin **Visual Annotator** for quick access

### Windows

1. Download or clone this repository
2. Open Chrome and type `chrome://extensions` in the address bar
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Browse to the downloaded `visual-annotator` folder and select it
6. The extension icon appears in your toolbar — click the puzzle piece icon and pin **Visual Annotator** for quick access

### Updating

To update after pulling new changes:

1. Go to `chrome://extensions`
2. Find **Visual Annotator** and click the reload icon (circular arrow)

## Usage

1. **Toggle toolbar** — Click the extension icon or press `Cmd+Shift+.` (Mac) / `Ctrl+Shift+.` (Windows/Linux)
2. **Annotate** — Click the pen icon (or press `A`), then click any element on the page
3. **Comment** — Add a description, select intent (Fix/Change/Question/Approve) and severity (Blocking/Important/Suggestion)
4. **Screenshot** — Capture a cropped screenshot of the element directly in the annotation popup
5. **Copy** — Click the copy icon to get all annotations as structured markdown in your clipboard
6. **Console** — Click the terminal icon to copy all captured console logs as markdown
7. **Paste** — Into any AI agent prompt

## Extension Popup

Click the extension icon to open the popup with these options:

| Option | Description |
|--------|-------------|
| Show/Hide Toolbar | Toggle the annotation toolbar on the current page |
| Always On | Automatically show the toolbar on every page |
| Auto Copy | Automatically copy markdown to clipboard after each annotation |

## Toolbar Buttons

| Button | Key | Description |
|--------|-----|-------------|
| Annotate | `A` | Toggle element picker mode |
| Copy | — | Copy all annotations as markdown |
| Console | — | Copy browser console logs as markdown |
| Clear | `X` | Remove all annotations |
| Minimize | — | Collapse toolbar to a small floating button |

## Element Picker

When annotation mode is active:

- **Hover** elements to see a highlight and tooltip with tag, classes, dimensions
- **Alt/Option + Scroll** to cycle through parent elements
- **Click** to select an element and open the comment popup
- **Click a numbered marker** to edit an existing annotation
- **Escape** to exit annotation mode

## Markdown Output

The copy button generates markdown like this:

```markdown
# Visual Feedback — My App
**URL:** https://myapp.com/dashboard
**Viewport:** 1440x900
**Date:** 2025-01-15T10:30:00.000Z

---

## 1. `button.btn-primary` [fix · important]

- **Comment:** The button should use the design system blue (#3B82F6), not green.
- **URL:** https://myapp.com/dashboard
- **Element:** `<button class="btn-primary">`
- **Selector:** `main > div > button.btn-primary`
- **Text:** "Submit Form"
- **Bounding Box:** 120x40 at (350, 680)
- **Styles:** display: flex, backgroundColor: rgb(34, 197, 94)
- **Screenshot:** ![screenshot-1](/Users/.../Downloads/visual-annotator/myapp-com-dashboard-1743564000000.png)

---
```

## Console Output

The console button generates markdown like this:

```markdown
# Console Output — My App
**URL:** https://myapp.com/dashboard
**Messages:** 12 (2 errors, 1 warnings)

---

[ERROR] 10:30:15.123
Uncaught TypeError: Cannot read property 'foo' of undefined

[WARN] 10:30:16.456
Deprecation warning: componentWillMount has been renamed

[LOG] 10:30:17.789
App initialized
```

## Keyboard Shortcuts

All shortcuts only work when the toolbar is visible and no text input is focused.

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+Shift+.` | Toggle toolbar (global, works anywhere) |
| `A` | Toggle annotate mode |
| `X` | Clear all annotations |
| `Escape` | Exit annotate mode or close popup |

## Screenshots

Screenshots are saved as PNG files to your Downloads folder under `visual-annotator/`:

- Regular sites: `{domain-and-path}-{timestamp}.png` (e.g. `flow-digitalsprung-de-home-1743564000000.png`)
- Localhost: `localhost-{port}-{path}-{timestamp}.png` (e.g. `localhost-3000-dashboard-1743564000000.png`)

## Privacy

- All data stays in your browser — no network requests, no tracking, no analytics
- Screenshots are captured locally via Chrome's `captureVisibleTab` API and saved to your Downloads folder
- Console logs are captured in-page — nothing is sent to any server

## Development

```bash
# Make changes to content.js, background.js, popup.js, or manifest.json
# Then reload the extension in chrome://extensions
```

No build step required. The extension is plain JavaScript.

## License

MIT
