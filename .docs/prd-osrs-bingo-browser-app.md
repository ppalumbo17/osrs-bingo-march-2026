# PRD — OSRS Bingo Browser App

## Introduction / Overview

This document defines the requirements for a browser-only **Old School RuneScape (OSRS) Bingo** application. The app replaces the current spreadsheet-based workflow with an interactive visual board that runs entirely in the browser and stores all user state locally using `localStorage`.

The app is intended for clan bingo events based on a fixed **9×9 board (81 tiles)**. Each tile represents one or more OSRS boss-related objectives such as boss kills, combat achievements, item drops, or challenge tasks. The board already has a supporting JSON lookup dataset containing tile text, point values, related bosses, and wiki links.

The core purpose of this feature is to provide a self-contained app that lets users:

- View and interact with the full bingo board
- Check off completed tiles
- Automatically calculate score
- Filter and visually highlight tiles by boss
- Open a tile details modal showing bosses, items, achievements, and wiki links
- Persist progress locally without requiring a database or API

This PRD is based on the supplied PRD-generation rules file and the clarified feature decisions from the user.

---

## Product Goal

Build a polished, client-side React application that works fully in-browser, uses no backend services, and makes it significantly easier to track and understand an OSRS bingo board than the current spreadsheet version.

---

## Goals

1. Allow a user to view a 9×9 bingo board with all 81 tiles rendered on screen.
2. Allow a user to mark any tile complete using a checkbox shown in the upper-right corner of the tile.
3. Recalculate score dynamically whenever tile completion changes.
4. Persist completion state, filter state, and relevant UI state in `localStorage`.
5. Provide boss filter buttons in a left sidebar so users can highlight all tiles related to one or more bosses.
6. When boss filters are active, highlight matching tiles and dim non-matching tiles.
7. Allow a user to click any tile to open a modal showing structured details and wiki links for related bosses, items, and combat achievements.
8. Keep the application fully self-contained in the browser with no API calls, server state, or database dependency.
9. Make the app understandable and implementable by a junior developer.

---

## User Stories

### Core usage
- As a player, I want to see the full bingo board in one place so I can understand what objectives are available.
- As a player, I want to check off completed tiles so I can track progress during the event.
- As a player, I want the score to update automatically when I complete or uncomplete a tile so I do not have to calculate points manually.
- As a player, I want my progress to remain after refresh or closing the browser so I do not lose my work.

### Filtering and exploration
- As a player, I want to select one or more boss filters so I can see which tiles correspond to a given boss.
- As a player, I want non-matching tiles to dim when filters are active so the matching tiles are easier to identify.
- As a player, I want tiles with multiple bosses to highlight if **any** selected boss matches the tile.

### Details and reference
- As a player, I want to click a tile and open a details modal so I can understand exactly what the tile means.
- As a player, I want the modal to separate bosses, items, and achievements into clear sections so it is easier to scan.
- As a player, I want direct wiki links in the modal so I can quickly look up the relevant content.

### Non-technical operation
- As an organizer, I want the app to run entirely in-browser with no setup beyond opening the site so it is easy to share and use.
- As an organizer, I want no backend or login requirements so the app remains lightweight and inexpensive to host.

---

## Functional Requirements

### Board rendering
1. The app must render a **9×9 bingo board** using the existing tile dataset.
2. The board must occupy approximately **4/5 of the horizontal screen width** on desktop layouts.
3. The board must display each tile’s main text content.
4. Each tile must display a checkbox in the **upper-right corner**.
5. Each tile must visually reflect its point-ring color based on its board position.
6. The board must be responsive enough to remain usable on smaller screens, even if layout changes are needed.

### Tile completion
7. The checkbox for a tile must toggle that tile between incomplete and complete.
8. Scoring must recalculate immediately when a checkbox is toggled.
9. A completed tile must have a clear visual completed state.
10. The completion state for each tile must persist in `localStorage`.
11. Reloading the page must restore completed tile state from `localStorage`.

### Scoring
12. The app must compute score from completed tiles only.
13. The score must update dynamically with no manual recalculate action.
14. The point values must follow the ring logic already defined for the 9×9 board:
    - Outer ring = 1 point
    - Second ring = 4 points
    - Third ring = 8 points
    - Fourth ring = 12 points
    - Center tile = 30 points
15. The score display must appear in the left sidebar.
16. The app should display at minimum:
    - Total completed tiles
    - Total score

### Sidebar layout
17. The left sidebar must occupy approximately **1/5 of the horizontal screen width** on desktop layouts.
18. The sidebar must display score summary information.
19. The sidebar must display boss filter controls.
20. Boss filters must be rendered as selectable buttons.
21. Boss filter buttons must support multi-select behavior.
22. The sidebar must provide a way to clear all active filters.

### Filter behavior
23. If no boss filter buttons are selected, the board must render normally.
24. If one or more boss filters are selected, tiles matching at least one selected boss must be highlighted.
25. When filters are active, non-matching tiles must be visually dimmed.
26. A tile with multiple related bosses must highlight if **any selected boss** matches the tile’s related boss list.
27. Boss filter state must persist in `localStorage`.
28. Reloading the page must restore active filters from `localStorage`.

### Tile interaction and modal
29. Clicking a tile must open a modal.
30. Clicking the checkbox should not unintentionally trigger the modal if the user is only toggling completion.
31. The modal must display the tile’s main text.
32. The modal must display structured sections for:
    - Bosses
    - Items
    - Combat achievements
33. The modal must include direct wiki links for each listed entity when links are available.
34. The modal must use icons for bosses, items, and achievements to improve scannability.
35. The modal must support closing by:
    - close button
    - clicking outside the modal
    - pressing Escape
36. The currently opened tile modal does not need to persist after page refresh.

### Data handling
37. The app must load board data from a static local dataset bundled with the app.
38. The app must not make network requests to fetch gameplay data or store user progress.
39. The tile dataset must include at least:
    - cell coordinates
    - tile text
    - points
    - related bosses
    - related links
40. The app should support a future normalized dataset structure without major rewrites.

### Local storage
41. The app must use `localStorage` for persistence.
42. The app must save and restore:
    - completed tile states
    - selected boss filters
43. The app should namespace storage keys clearly to avoid collisions.
44. The app should handle corrupted or missing localStorage values gracefully by falling back to defaults.

### Accessibility and UX
45. Tile checkboxes must be keyboard accessible.
46. Boss filter buttons must be keyboard accessible.
47. The modal must trap focus or otherwise maintain reasonable keyboard usability.
48. Color should not be the only indicator of state; completion and filtering should also have additional visible cues where practical.
49. External wiki links must open safely in a new tab.

---

## Non-Goals / Out of Scope

This version of the app will **not** include:

1. Any backend server
2. Any database
3. Any user accounts or login system
4. Any multiplayer synchronization
5. Any real-time collaboration
6. Any Discord bot integration
7. Any external API calls
8. Any screenshot submission or proof validation flow
9. Any admin panel
10. Any editing of the board content from inside the app
11. Any importing from RuneLite, Wise Old Man, hiscores, or game logs
12. Any automatic verification of kills, drops, or combat achievements
13. Any mobile-native app packaging in this phase
14. Any cloud save or cross-device sync in this phase

---

## Design Considerations

### Layout
- Desktop-first layout:
  - **Left sidebar:** ~20% width
  - **Main board area:** ~80% width
- The board should feel dense but readable.
- The app should preserve the ring-based visual identity from the spreadsheet/image version.

### Tile styling
- Each tile should show:
  - main text content
  - upper-right checkbox
  - point-ring coloring
- Tiles should visually support these states:
  - default
  - completed
  - highlighted by filter
  - dimmed by filter
  - hovered
- Completion styling should remain readable even when filtering is active.

### Ring colors
Use the established board style:
- Outer ring: lightest green
- Second ring: slightly darker green
- Third ring: darker green
- Fourth ring: darker again
- Center: darkest / most emphasized

Exact shades can be refined during implementation, but the visual ring distinction must remain obvious.

### Sidebar
The sidebar should include:
1. App title / board context
2. Score summary
3. Completed tile count
4. Boss filters
5. Clear-filters control
6. Optional reset-progress control

### Modal structure
The modal should include:
- Tile title / text
- Points for the tile
- Boss section with links
- Item section with links
- Combat achievement section with links
- Related links grouped and easy to scan
- Icons next to section labels or list items

---

## Technical Considerations

### Tech stack
The chosen implementation stack is:

- **React**
- Browser-only client application
- `localStorage` for persistence
- No backend
- No database
- No API calls

This could be implemented with React + Vite or a static React build system. The important requirement is that the finished app runs entirely client-side.

### Recommended frontend structure
Suggested component breakdown:

- `App`
- `Sidebar`
- `ScoreSummary`
- `BossFilterPanel`
- `Board`
- `BoardTile`
- `TileCheckbox`
- `TileModal`
- `LinkSection`
- `ResetProgressButton` (optional but recommended)

### Recommended data model
The current dataset already includes:
- `XCell`
- `YCell`
- `RelatedBosses`
- `RelatedBossesLinks`
- `CellContent`
- `CellLinks`
- `Points`

For the app UI, the developer should derive or extend a front-end friendly structure such as:

```ts
type Tile = {
  id: string; // e.g. "x-y"
  x: number;
  y: number;
  content: string;
  points: number;
  relatedBosses: string[];
  relatedBossLinks: string[];
  itemLinks: string[];
  achievementLinks: string[];
  allLinks: string[];
};
```

Because the current JSON groups some links broadly under `CellLinks`, the developer may need a small normalization step to split links into boss, item, and achievement sections where possible.

### Suggested localStorage schema

```ts
type LocalState = {
  completedTileIds: string[];
  selectedBosses: string[];
};
```

Recommended keys:

```ts
const STORAGE_KEYS = {
  completedTiles: "osrs-bingo.completedTiles",
  selectedBosses: "osrs-bingo.selectedBosses"
};
```

### Filtering algorithm
A tile is considered a filter match when:

```ts
tile.relatedBosses.some((boss) => selectedBosses.includes(boss))
```

Behavior:
- No selected bosses → normal board
- One or more selected bosses → matching tiles highlighted, others dimmed

### Score algorithm

```ts
totalScore = sum(points for each completed tile)
completedCount = number of completed tiles
```

Checkbox behavior:
- Checked → tile becomes complete
- Unchecked → tile becomes incomplete
- Score recalculates immediately

### Board ring logic
Point values must use the existing ring logic:

```ts
function getPoints(x: number, y: number): number {
  if (x === 0 || x === 8 || y === 0 || y === 8) return 1;

  if (((x === 1 || x === 7) && y > 0 && y < 8) ||
      ((y === 1 || y === 7) && x > 0 && x < 8)) return 4;

  if (((x === 2 || x === 6) && y > 1 && y < 7) ||
      ((y === 2 || y === 6) && x > 1 && x < 7)) return 8;

  if (((x === 3 || x === 5) && y > 2 && y < 6) ||
      ((y === 3 || y === 5) && x > 2 && x < 6)) return 12;

  return 30;
}
```

### Event handling guidance
- Tile click opens modal
- Checkbox click toggles completion
- Checkbox click should stop propagation so it does not open modal accidentally

### Error handling
- Invalid or missing localStorage data should not crash the app
- The app should fall back to empty completion/filter state
- Missing modal data should degrade gracefully

---

## Success Metrics

Because this is a local browser app, success should be measured primarily through implementation quality and usability rather than analytics.

### Primary success metrics
1. A user can open the app and interact with the board without any backend setup.
2. A user can complete and uncomplete tiles and see score update instantly.
3. A user can refresh the page and retain their progress.
4. A user can select boss filters and clearly see matching tiles.
5. A user can click a tile and understand its related bosses, items, and combat achievements from the modal.
6. The board remains readable and visually organized.

### Acceptance-style metrics
- 100% of 81 tiles render correctly
- 100% of checkboxes persist after refresh
- 100% of boss filters persist after refresh
- Score always equals the sum of checked tile points
- Matching tile highlight logic works for single and multi-select boss filters
- Modal opens for all tiles and displays relevant grouped link information

---

## Open Questions

These questions do not block initial implementation, but should be considered during build-out:

1. Should there be a dedicated **Reset Board** button that clears all checkbox progress?
2. Should there be a separate **Clear Filters** button and a **Reset Progress** button?
3. Should completed tiles display their point values visibly on the tile itself?
4. Should the app include a compact/mobile layout now, or is desktop-first sufficient for V1?
5. Should the modal show raw URLs, labeled links, or both?
6. Should there be a search field for bosses in addition to filter buttons if the list grows?
7. Should future versions support multiple saved board states in localStorage?
8. Should future versions distinguish between bosses, items, and achievements at dataset-build time rather than UI-normalization time?

---

## Implementation Notes for Junior Developer

1. Start by loading the static tile dataset into React state or a memoized constant.
2. Normalize each tile into a front-end shape with a stable `id`.
3. Build the layout shell first:
   - sidebar
   - board grid
4. Add checkboxes and scoring next.
5. Add localStorage persistence once interaction works.
6. Add boss filters after the board is stable.
7. Add highlight/dim logic for selected bosses.
8. Add the tile modal last.
9. Keep the data flow simple:
   - dataset is static
   - completed tile IDs are local state + localStorage
   - selected boss names are local state + localStorage
   - score is derived state
10. Avoid overengineering. This is a fully client-side app with no server concerns.

---

## Proposed Deliverables

### V1 deliverables
1. Static React app
2. 9×9 board
3. Tile checkboxes
4. Dynamic scoring
5. Boss filter sidebar
6. Highlight + dim filter behavior
7. Tile details modal
8. localStorage persistence
9. Basic responsive behavior
10. Clean visual styling matching the green-ring board concept

### Optional V1.1 deliverables
1. Reset progress button
2. Clear filters button
3. Export/import local progress JSON
4. Improved dataset normalization
5. Better mobile layout

---

## Recommended Filename

`prd-osrs-bingo-browser-app.md`
