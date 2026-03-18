export type Tile = {
  id: string; // "x-y"
  x: number;
  y: number;
  content: string;
  points: number;
  relatedBosses: string[];
  relatedBossLinks: string[];
  cellLinks: string[];
};

export type LocalState = {
  completedTileIds: string[];
  selectedBosses: string[];
};

export const STORAGE_KEYS = {
  completedTiles: "osrs-bingo.completedTiles",
  selectedBosses: "osrs-bingo.selectedBosses",
  prioritizedTiles: "osrs-bingo.prioritizedTiles",
} as const;
