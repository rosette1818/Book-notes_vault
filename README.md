# Book & Notes Vault

A personal digital catalog for organizing the books you own or have read. Add, edit, delete, search (with regular expressions) and sort your books, track a reading goal, and back up your collection as JSON. Everything runs in the browser with plain HTML, CSS and vanilla JavaScript. There is no server and no framework.

- **Live site:** https://rosette1818.github.io/Book-notes_vault/ <!-- TODO: confirm this link opens before submitting -->
- **Demo video (unlisted):** https://www.loom.com/share/19e2e6fb181d4323847dd227b3d28217
- **Repository:** https://github.com/rosette1818/Book-notes_vault

## Theme

**Book & Notes Vault**, with an *Academic / Library* look: calm green-grey palette, serif type (Cambria), generous spacing and clear headings. It is designed mobile-first and tested at 360px, 768px and 1024px+. The original plan is in [M1.md](M1.md).

## Features

- **Dashboard:** total books, total pages, most common tag, books added this week, page target, pages remaining, and a bar chart of books added over the last 7 days.
- **Add / edit / delete books:** title, author, pages, tag and date, all validated with regular expressions. The same form switches to "Update Book" when you press Edit.
- **Delete all:** removes every book after a confirmation.
- **Live regex search:** type a regular expression to filter by title or author. Matches are highlighted with `<mark>`. A checkbox switches case-insensitive matching on or off, and invalid patterns show an error instead of crashing.
- **Sorting:** by title, date added, or number of pages.
- **Reading goal:** set a page target. A live message tells you how many pages remain, or that you reached or exceeded the goal.
- **Page converter (Settings):** pages to printed sheets, and sheets to pages (2 pages per sheet).
- **Import / export JSON:** export your collection to `my-books.json`, or import a file. Imports are validated first. **Importing replaces the current collection.**
- **Persistent storage:** books and the page target are saved in `localStorage`, so they survive a refresh.
- **Responsive layout:** a table on desktop (1024px and up), cards on tablet and mobile.
- **About page:** purpose, features and contact details.

## Regex catalog

All validation lives in [`scripts/validators.js`](scripts/validators.js). Searching lives in [`scripts/search.js`](scripts/search.js).

| What it checks | Pattern | Notes |
|---|---|---|
| Title / author is not blank | `/^\s*$/` (must **not** match) | Rejects empty and whitespace-only text |
| Pages | `/^\d+$/` + range check | Whole numbers only, 1 to 5000 |
| Tag | `/^[A-Za-z -]+$/` | Letters, spaces and hyphens only, no digits |
| Date | `/^\d{4}-\d{2}-\d{2}$/` + calendar check | `YYYY-MM-DD`. Also rejects impossible dates such as `2026-02-30` and `2025-02-29` |
| Repeated words in a title | `/\b(\w+)\s+\1\b/i` | Backreference. Rejects "Math Math" but allows "Math Science Math" |
| Search box | whatever you type | Compiled with `new RegExp(input, "i")`, or without `i` when the checkbox is off |

### Search edge cases handled

| Try typing | What happens |
|---|---|
| *(empty box)* | Shows every book |
| `[a-z` or `(` | Invalid regex: shows "Invalid expression!" and no results, no crash |
| `^clean` | Anchors to the start of the title or author |
| `\bcode\b` | Whole-word match |
| `(Atomic\|Clean)` | Alternation with a capture group: highlights correctly with no duplicated text |
| `a\|(b)` | Optional group: no "undefined" in the output |
| `a*` | Can match nothing: shows every book, with no empty highlights |
| Tick / untick "Search ignoring capitalization" | `^clean` matches "Clean Code" only when case-insensitive |

`seed.json` contains 10 sample books. Use **Import** to load it for testing.

## Keyboard map

The app uses native browser keyboard behavior and has **no custom shortcuts**. Every control can be reached and used without a mouse.

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move forward / backward through controls |
| `Enter` on **Skip to main content** | Jump past the navigation (first `Tab` stop on the page) |
| `Enter` on a nav link | Jump to Dashboard, Books, Add A Book, Settings or About |
| `Enter` or `Space` | Press the focused button (Edit, Delete, Export, Save, Clear, Delete All) |
| `Space` | Tick or untick the case-insensitive checkbox |
| `↑` / `↓` | Change the Sort or Conversion option when the select is focused |
| `Enter` in a form field | Submit the Add / Edit form |

Tab order follows the page: skip link → navigation → search → case checkbox → sort → export / delete all / import → each book's Edit and Delete → Add Book form → Settings → About.

## Accessibility notes

- **Semantic landmarks:** `header`, `nav` (labelled "Main navigation"), `main`, `section`, `footer`, with one `h1` and a logical heading order.
- **Skip link:** hidden until focused, then appears at the top of the page.
- **Labels:** every input and select has a visible `<label>`.
- **Visible focus:** a 3px outline on links, buttons, inputs and selects.
- **ARIA live regions:**
  - `#status-message` (`role="status"`, polite) announces added, updated and imported books.
  - `#search-error` (`role="alert"`) announces invalid regex patterns.
  - `#goal-status` (`aria-live`) announces goal progress. It switches to `assertive` when you exceed your goal.
  - `#conversion-result` (`aria-live="polite"`) announces the converter result.
- **Chart:** each bar has a text label ("date: N books") beside it, so the data does not depend on the bar length or colour alone.
- **Reduced motion:** `prefers-reduced-motion` turns off transitions and smooth scrolling.
- **Responsive:** no horizontal scrolling at 360px, 768px or 1024px+.

## Run the app

No build step. Open `index.html` in a browser, or use VS Code's *Live Server*.

## Run the tests

Open [`tests.html`](tests.html) in a browser. It runs automatically and lists **PASS** or **FAIL** for each check (52 tests):

- validators (title, author, pages, tag, date, repeated words)
- import validation
- regex search
- state helpers
- search highlighting

All lines should say PASS.

## Project structure

```
index.html            page structure
tests.html            browser test page
seed.json             sample data for importing
M1.md                 specification, data model, wireframes
scripts/
  state.js            shared app state (books, editing id, page target)
  storage.js          localStorage read / write
  validators.js       regex validation
  search.js           regex search
  ui.js               rendering, highlighting, sorting
  main.js             events, dashboard, import / export, settings
styles/               base, themes, components, sections, responsive CSS
```

## Data model

Each book is stored as:

```json
{
  "id": "unique id",
  "title": "Atomic Habits",
  "author": "James Clear",
  "pages": 320,
  "tag": "Self Help",
  "dateAdded": "2026-10-13",
  "createdAt": "2026-10-13T10:00:00.000Z",
  "updatedAt": "2026-10-13T10:00:00.000Z"
}
```

`localStorage` keys: `bookNotesVault` (the books) and `pageTarget` (the reading goal).

## Contact

r.umurerwa@alustudent.com

## AI assistance

<!-- TODO: edit this so it is accurate for what you actually did -->
Claude (Anthropic) helped draft this README and `.gitignore`, wrote the `state.js` module and the matching edits in `main.js` / `ui.js` / `index.html`, fixed the search-highlighting bug in `highlightText()`, and added the related tests in `tests.html`. I reviewed and tested these changes myself.