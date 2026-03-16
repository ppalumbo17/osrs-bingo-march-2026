
# OSRS Boss Bingo — Project Summary

## Overview

This project converts a custom **Old School RuneScape (OSRS) bingo board** into a structured dataset and system that can eventually power a **web or mobile application** for clan events.

The original board is a **9×9 grid (81 tiles)** where each tile represents:

- A boss kill
- A boss-related item
- A combat achievement
- A boss-related challenge

Players complete tiles during a competition and receive **points based on tile position**.

Current outputs produced so far:

1. A **Google Sheets prototype board**
2. A **JSON dataset representing every tile**
3. **Wiki link mappings** to bosses, items, and combat achievements
4. Defined **point-ring scoring logic**

The next goal is building an **interactive app version of the board**.

---

# Board Structure

## Grid

- 9 columns
- 9 rows
- 81 tiles total

Coordinates are **0-based**:

```
XCell = column index (0 → 8)
YCell = row index (0 → 8)
```

Example:

```
Top-left tile
XCell: 0
YCell: 0
```

---

# Tile Content

Each tile contains **human-readable text describing a task**, for example:

```
Why Cook? OR Why Fletch?
```

This means the tile can be completed by **either of two combat achievements**.

Example mapping:

| Achievement | Boss |
|---|---|
Why Cook? | Tempoross |
Why Fletch? | Wintertodt |

---

# Point System

The board uses **ring-based scoring**.

Outer tiles are easier → fewer points  
Inner tiles are harder → more points.

## Ring Layout

| Ring | Condition | Points |
|-----|-----|-----|
Outer ring | `x==0 OR x==8 OR y==0 OR y==8` | **1** |
Second ring | `((x==1 OR x==7) AND (0 < y < 8)) OR ((y==1 OR y==7) AND (0 < x < 8))` | **4** |
Third ring | `((x==2 OR x==6) AND (1 < y < 7)) OR ((y==2 OR y==6) AND (1 < x < 7))` | **8** |
Fourth ring | `((x==3 OR x==5) AND (2 < y < 6)) OR ((y==3 OR y==5) AND (2 < x < 6))` | **12** |
Center | `(x==4 AND y==4)` | **30** |

Example:

```
XCell: 8
YCell: 1
Points: 1
```

---

# JSON Tile Dataset

A **complete JSON dataset was generated for all 81 tiles**.

Each tile contains metadata including:

- Position
- Related bosses
- Wiki links
- Content
- Points

## JSON Schema

```json
{
  "XCell": number,
  "YCell": number,
  "RelatedBosses": string[],
  "RelatedBossesLinks": string[],
  "CellContent": string,
  "CellLinks": string[],
  "Points": number
}
```

---

## Example Tile Object

```json
{
  "XCell": 8,
  "YCell": 1,
  "RelatedBosses": [
    "Tempoross",
    "Wintertodt"
  ],
  "RelatedBossesLinks": [
    "https://oldschool.runescape.wiki/w/Tempoross",
    "https://oldschool.runescape.wiki/w/Wintertodt"
  ],
  "CellContent": "Why Cook? OR Why Fletch?",
  "CellLinks": [
    "https://oldschool.runescape.wiki/w/Why_Cook%3F",
    "https://oldschool.runescape.wiki/w/Why_Fletch%3F"
  ],
  "Points": 1
}
```

---

# Data Semantics

### OR tasks

```
A OR B
```

Either task completes the tile.

### AND tasks

```
A AND B
```

Both tasks must be completed.

### ANY tasks

```
ANY: Perfect ___ in TOA
```

Any qualifying achievement counts.

---

# Current Tools Built

## Google Sheets Bingo Board

Features:

- Color rings
- Dropdown completion status
- Auto scoring
- Repeat penalty rules

Status options:

```
Open
Done
Repeat
```

Repeat halves the points for **4 / 8 / 12 tiles**.

---

## JSON Lookup Dataset

Contains **all tiles with wiki links**.

Used for:

- Boss lookup
- Achievement lookup
- App generation
- Automation

---

# OSRS Wiki Link Pattern

Boss:

```
https://oldschool.runescape.wiki/w/{Boss_Name}
```

Achievement:

```
https://oldschool.runescape.wiki/w/{Achievement_Name}
```

Item:

```
https://oldschool.runescape.wiki/w/{Item_Name}
```

Spaces become `_`.

Example:

```
https://oldschool.runescape.wiki/w/Vorkath%27s_head
```

---

# Planned App Version

Goal: Build an **interactive OSRS Bingo tracker**.

## Board UI

- Render 9×9 board
- Color rings
- Click tiles to complete
- Tooltip with wiki links

---

## Team Tracking

Multiple teams:

```
Team A
Team B
Team C
```

Each tile stores:

```
team
timestamp
proof screenshot
```

---

## Claim Logic

```
FIRST CLAIM
FASTEST TIME
MULTIPLE CLAIMS
```

Configurable rules.

---

## Proof System

Tiles may require:

- Screenshot
- Killcount
- Item drop
- CA completion

Possible integrations:

- RuneLite screenshot upload
- Discord bot submission
- Manual admin validation

---

# Suggested App Architecture

## Frontend

Possible stack:

- React
- Next.js
- Tailwind
- Zustand / Redux
- TanStack Query

Board rendering:

```
9x9 grid
dynamic coloring
tile modal
```

---

## Backend

Possible stack:

- Node.js
- Postgres
- Prisma
- tRPC / REST

---

## Database Models

### Tiles

```
Tile
id
x
y
content
points
```

### Bosses

```
Boss
id
name
wikiUrl
```

### TileBoss

```
tileId
bossId
```

### Claims

```
Claim
tileId
teamId
proofUrl
timestamp
```

---

# Future Dataset Improvements

Recommended next step: create **normalized task objects**.

Example:

```json
tasks: [
 {
   "type": "combat_achievement",
   "name": "Why Cook?",
   "boss": "Tempoross"
 },
 {
   "type": "combat_achievement",
   "name": "Why Fletch?",
   "boss": "Wintertodt"
 }
]
```

This makes rule validation easier.

---

# Potential Advanced Features

### Automatic CA detection

Using RuneLite logs or screenshots.

### Boss kill verification

Possible sources:

- RuneLite
- WiseOldMan
- Hiscores API

### Discord Integration

Commands:

```
/claim tile 4,6
/board
/score
```

---

# Key Goals

Build an app that allows:

- Clan events
- Automated scoring
- Wiki integration
- Proof submission
- Real-time leaderboard

---

# Files Generated So Far

```
osrs_bingo_board_google_sheets_ready.xlsx
osrs_bingo_board_styled_scoring.xlsx
osrs_bingo_lookup_dataset.json
```

---

# Next Recommended Step

Generate a **fully normalized task dataset**:

```
tiles
tasks
bosses
combatAchievements
items
```

This would allow the app to automatically validate:

- Boss kills
- Item drops
- Combat achievements
