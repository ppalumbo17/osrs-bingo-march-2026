## Relevant Files

- `src/main.tsx` - React entry point, mounts the app.
- `src/App.tsx` - Root component, holds global state (completedTileIds, selectedBosses), renders Sidebar + Board.
- `src/data/bingoData.json` - The existing JSON tile dataset (81 tiles).
- `src/data/tiles.ts` - Normalizes raw JSON into the front-end `Tile[]` type; also exports the `getPoints` ring logic and the full boss list.
- `src/types.ts` - Shared TypeScript types: `Tile`, `LocalState`, `STORAGE_KEYS`.
- `src/hooks/useLocalStorage.ts` - Generic hook for reading/writing a namespaced localStorage key with fallback to a default value.
- `src/components/Sidebar.tsx` - Left sidebar shell; composes ScoreSummary, BossFilterPanel, and ResetProgressButton.
- `src/components/ScoreSummary.tsx` - Displays total completed tiles and total score.
- `src/components/BossFilterPanel.tsx` - Boss filter buttons (multi-select) and clear-filters control.
- `src/components/ResetProgressButton.tsx` - Optional button to wipe all completion state.
- `src/components/Board.tsx` - Renders the 9×9 grid of BoardTile components.
- `src/components/BoardTile.tsx` - Single tile: ring color, text, checkbox, completed/highlighted/dimmed states.
- `src/components/TileCheckbox.tsx` - Accessible checkbox inside a tile; stops click propagation.
- `src/components/TileModal.tsx` - Modal showing tile title, points, boss/item/achievement sections, wiki links, and icons.
- `src/components/LinkSection.tsx` - Reusable section component used inside TileModal for bosses, items, and achievements.
- `src/index.css` - Global styles, CSS variables for ring colors, layout.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/osrs-bingo-browser-app`)

- [x] 1.0 Project scaffold and data setup
  - [x] 1.1 Initialise a new React + Vite + TypeScript project in the repository root (e.g., `npm create vite@latest . -- --template react-ts`)
  - [x] 1.2 Install any needed dependencies (no extra libraries required beyond what Vite scaffolds; optionally add a small icon library if desired for modal icons)
  - [x] 1.3 Copy the existing JSON tile dataset into `src/data/bingoData.json`
  - [x] 1.4 Create `src/types.ts` and define the `Tile` type, `LocalState` type, and `STORAGE_KEYS` constants as described in the PRD
  - [x] 1.5 Create `src/data/tiles.ts`: import `bingoData.json`, implement the `getPoints(x, y)` ring logic function, and export a normalised `tiles: Tile[]` array with a stable `id` (`"x-y"`) for each tile
  - [x] 1.6 Create `src/data/tiles.ts`: also derive and export a sorted `allBosses: string[]` list from the tile dataset (deduplicated boss names for the filter panel)
  - [x] 1.7 Verify the output by logging `tiles.length` (should be 81) and `allBosses` in a temporary console statement, then remove it

- [x] 2.0 Core layout — sidebar and board shell
  - [x] 2.1 Replace the Vite boilerplate in `src/App.tsx` with a two-column flex layout: left sidebar (~20% width) and right board area (~80% width)
  - [x] 2.2 Create `src/components/Sidebar.tsx` as an empty shell with a placeholder heading ("OSRS Bingo") and render it inside `App`
  - [x] 2.3 Create `src/components/Board.tsx` that accepts `tiles: Tile[]` as a prop and renders a 9×9 CSS grid container; for now render a simple `<div>` for each tile showing its `content` text
  - [x] 2.4 Pass the normalised `tiles` array from `App` down to `Board` and confirm all 81 tiles render on screen
  - [x] 2.5 Add basic CSS in `src/index.css`: CSS variables for the five ring colors (outer → center), body/page background, and the two-column layout

- [x] 3.0 Tile rendering, completion, and scoring
  - [x] 3.1 Create `src/components/TileCheckbox.tsx`: a `<input type="checkbox">` that accepts `checked` and `onChange` props; add `e.stopPropagation()` inside its click handler so it does not bubble up to the tile
  - [x] 3.2 Create `src/components/BoardTile.tsx`: accepts a `Tile`, `isCompleted`, `isHighlighted`, `isDimmed`, and `onClick` prop; renders the tile text, applies the correct ring-color CSS class based on `tile.points`, and renders `TileCheckbox` in the upper-right corner
  - [x] 3.3 In `App.tsx`, add `completedTileIds` state (initially an empty `Set<string>`) and a `toggleTile(id: string)` handler that adds or removes the id
  - [x] 3.4 Update `Board.tsx` to render `BoardTile` components; pass `isCompleted` based on whether the tile id is in `completedTileIds`; wire `onClick` to open a modal (stub for now) and pass the `toggleTile` handler to the checkbox
  - [x] 3.5 Add completed-tile visual styling: e.g., a green checkmark overlay or strikethrough text so the completed state is visually obvious beyond the checkbox alone
  - [x] 3.6 Create `src/components/ScoreSummary.tsx`: accepts `completedTiles: Tile[]` as a prop and displays "Tiles complete: X / 81" and "Score: Y"
  - [x] 3.7 Derive `completedTiles` in `App.tsx` (filter `tiles` by `completedTileIds`) and pass it to `ScoreSummary`; confirm score updates live when checkboxes are toggled

- [x] 4.0 localStorage persistence
  - [x] 4.1 Create `src/hooks/useLocalStorage.ts`: a generic hook `useLocalStorage<T>(key: string, defaultValue: T)` that reads the initial value from localStorage on mount, returns `[value, setValue]`, and writes to localStorage whenever the value changes; wrap reads in a try/catch and fall back to `defaultValue` if the stored value is missing or invalid JSON
  - [x] 4.2 In `App.tsx`, replace the plain `useState` for `completedTileIds` with `useLocalStorage` using the key `"osrs-bingo.completedTiles"`; store as a `string[]` (array of ids) and convert to/from a `Set` as needed
  - [x] 4.3 In `App.tsx`, add `selectedBosses` state using `useLocalStorage` with the key `"osrs-bingo.selectedBosses"`; initialise to an empty array
  - [ ] 4.4 Verify persistence: check a few tiles, refresh the page, and confirm completed state and score are restored correctly

- [x] 5.0 Boss filter sidebar
  - [x] 5.1 Create `src/components/BossFilterPanel.tsx`: accepts `allBosses: string[]`, `selectedBosses: string[]`, `onToggleBoss`, and `onClearFilters` props; renders one button per boss that shows as "selected" when the boss is in `selectedBosses`
  - [x] 5.2 Implement multi-select logic in `App.tsx`: `toggleBoss(bossName)` adds or removes the boss name from `selectedBosses`
  - [x] 5.3 Derive `highlightedTileIds` and `dimmedTileIds` in `App.tsx`: when `selectedBosses` is non-empty, a tile is highlighted if `tile.relatedBosses.some(b => selectedBosses.includes(b))`; all other tiles are dimmed
  - [x] 5.4 Pass `isHighlighted` and `isDimmed` props to `BoardTile` and apply the appropriate CSS classes (e.g., reduced opacity for dimmed, bright border/glow for highlighted)
  - [x] 5.5 Add a "Clear filters" button inside `BossFilterPanel` that calls `onClearFilters`; only show it (or enable it) when at least one filter is active
  - [x] 5.6 Render `BossFilterPanel` and `ScoreSummary` inside `Sidebar.tsx`; pass all required props down from `App`
  - [x] 5.7 Confirm filter state persists across page refresh (already covered by step 4.3)

- [x] 6.0 Tile details modal
  - [x] 6.1 Create `src/components/LinkSection.tsx`: accepts a `title: string`, `items: { label: string; url?: string }[]` and an optional `icon` prop; renders a labelled list where each item is either a plain text label or a `<a>` link that opens in a new tab with `rel="noopener noreferrer"`
  - [x] 6.2 Create `src/components/TileModal.tsx`: accepts a `tile: Tile | null` and an `onClose` prop; when `tile` is null render nothing; otherwise render a modal overlay with the tile title, point value, and three `LinkSection` components (Bosses, Items/Cell links, Combat Achievements — use the data available in `tile.relatedBosses`, `tile.relatedBossLinks`, and `tile.cellLinks`)
  - [x] 6.3 Add modal close behaviour: clicking the backdrop calls `onClose`; an "×" close button calls `onClose`; pressing Escape calls `onClose` (add a `keydown` event listener in a `useEffect`)
  - [x] 6.4 In `App.tsx`, add `activeTile: Tile | null` state; set it when a tile is clicked (not the checkbox); pass it and an `onClose` handler to `TileModal`; render `TileModal` at the top level of `App`
  - [x] 6.5 Add icons (emoji or simple SVG) next to each section heading inside the modal to improve scannability (e.g., ⚔️ Bosses, 🎒 Items, 🏆 Achievements)
  - [x] 6.6 Style the modal: centred overlay with a semi-transparent backdrop, scrollable content area if the list is long, and a readable font size

- [ ] 7.0 Polish, accessibility, and error handling
  - [ ] 7.1 Ensure all `TileCheckbox` inputs have a visually-hidden `<label>` or `aria-label` describing the tile (e.g., "Mark Scurrius Spine Drop as complete")
  - [ ] 7.2 Ensure all boss filter buttons have descriptive `aria-pressed` attributes to communicate selected state to screen readers
  - [ ] 7.3 Add focus trapping inside `TileModal`: when the modal is open, Tab should cycle only through modal elements; implement with a simple `focusTrap` pattern or a small utility
  - [ ] 7.4 Confirm Escape key closes the modal (covered in 6.3) and that focus returns to the tile that was clicked after closing
  - [ ] 7.5 Add a `ResetProgressButton` component to the sidebar that clears `completedTileIds` from state and localStorage after a confirmation prompt (`window.confirm`)
  - [ ] 7.6 Review all ring-color and completed/filtered states to ensure color is not the only visual cue (e.g., add a checkmark icon or text decoration for completed tiles, not just a color change)
  - [ ] 7.7 Test on a narrower viewport; add basic responsive CSS so the board remains scrollable/usable on smaller screens (horizontal scroll or reduced tile size)
  - [ ] 7.8 Do a final review: remove any console.log statements, check for obvious TypeScript errors, and ensure the app builds cleanly with `npm run build`
