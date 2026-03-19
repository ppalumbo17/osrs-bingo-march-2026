import { useState } from "react";
import type { Tile } from "../types";

type PriorityPanelProps = {
  prioritizedTilesMap: Record<string, number>;
  tiles: Tile[];
  completedTileIds: Set<string>;
  onPriorityClick: (tile: Tile) => void;
};

export function PriorityPanel({ prioritizedTilesMap, tiles, completedTileIds, onPriorityClick }: PriorityPanelProps) {
  const [open, setOpen] = useState(true);

  const entries = Object.entries(prioritizedTilesMap)
    .sort(([, a], [, b]) => a - b)
    .map(([id, num]) => ({ tile: tiles.find((t) => t.id === id), num }))
    .filter((e): e is { tile: Tile; num: number } => e.tile != null);

  if (entries.length === 0) return null;

  const pendingPts = entries
    .filter(({ tile }) => !completedTileIds.has(tile.id))
    .reduce((sum, { tile }) => sum + tile.points, 0);

  return (
    <div className="priority-panel">
      <button
        className="collapsible-panel-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="collapsible-panel-title">
          {open ? "▾" : "▸"} Priority ({entries.length})
        </span>
        <span className="priority-panel-header-pts">{pendingPts} pts</span>
      </button>
      {open && (
        <ul className="priority-panel-list">
          {entries.map(({ tile, num }) => {
            const isCompleted = completedTileIds.has(tile.id);
            return (
              <li key={tile.id}>
                <button
                  className={`priority-panel-item${isCompleted ? " priority-panel-item--completed" : ""}`}
                  onClick={() => onPriorityClick(tile)}
                >
                  <span className="priority-panel-num">{num}</span>
                  <span className="priority-panel-name">{tile.content}</span>
                  <span className="priority-panel-pts">{tile.points} pts</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
