import { BoardTile } from "./BoardTile";
import type { Tile } from "../types";

type BoardProps = {
  tiles: Tile[];
  completedTileIds: Set<string>;
  highlightedIds: Set<string>;
  hasFilters: boolean;
  prioritizedTilesMap: Record<string, number>;
  flashTileId: string | null;
  onToggleTile: (id: string) => void;
  onTileClick: (tile: Tile) => void;
};

export function Board({
  tiles,
  completedTileIds,
  highlightedIds,
  hasFilters,
  prioritizedTilesMap,
  flashTileId,
  onToggleTile,
  onTileClick,
}: BoardProps) {
  // Sort tiles into row-major order (y=0 first, then x within each row)
  const sorted = [...tiles].sort((a, b) => a.y - b.y || a.x - b.x);

  return (
    <main className="board">
      {sorted.map((tile) => (
        <BoardTile
          key={tile.id}
          tile={tile}
          isCompleted={completedTileIds.has(tile.id)}
          isHighlighted={hasFilters && highlightedIds.has(tile.id)}
          isDimmed={hasFilters && !highlightedIds.has(tile.id)}
          isFlashing={flashTileId === tile.id}
          priorityNumber={prioritizedTilesMap[tile.id]}
          onToggle={onToggleTile}
          onClick={onTileClick}
        />
      ))}
    </main>
  );
}
