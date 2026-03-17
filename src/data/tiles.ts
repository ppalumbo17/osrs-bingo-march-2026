import rawData from "./bingoData.json";
import type { Tile } from "../types";

type RawTile = {
  XCell: number;
  YCell: number;
  RelatedBosses: string[];
  RelatedBossesLinks: string[];
  CellContent: string;
  CellLinks: string[];
  Points: number;
};

export function getPoints(x: number, y: number): number {
  if (x === 0 || x === 8 || y === 0 || y === 8) return 1;

  if (
    ((x === 1 || x === 7) && y > 0 && y < 8) ||
    ((y === 1 || y === 7) && x > 0 && x < 8)
  )
    return 4;

  if (
    ((x === 2 || x === 6) && y > 1 && y < 7) ||
    ((y === 2 || y === 6) && x > 1 && x < 7)
  )
    return 8;

  if (
    ((x === 3 || x === 5) && y > 2 && y < 6) ||
    ((y === 3 || y === 5) && x > 2 && x < 6)
  )
    return 12;

  return 30;
}

export const tiles: Tile[] = (rawData as RawTile[]).map((raw) => ({
  id: `${raw.XCell}-${raw.YCell}`,
  x: raw.XCell,
  y: raw.YCell,
  content: raw.CellContent,
  points: raw.Points,
  relatedBosses: raw.RelatedBosses,
  relatedBossLinks: raw.RelatedBossesLinks,
  cellLinks: raw.CellLinks,
}));

export const allBosses: string[] = Array.from(
  new Set(tiles.flatMap((t) => t.relatedBosses))
).sort();
