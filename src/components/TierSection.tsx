import { useState } from "react";
import { TileCheckbox } from "./TileCheckbox";
import type { Tile } from "../types";

type TierSectionProps = {
  label: string;
  colorVar: string;
  tiles: Tile[];
  completedTileIds: Set<string>;
  highlightedIds: Set<string>;
  hasFilters: boolean;
  onToggleTile: (id: string) => void;
  onTileClick: (tile: Tile) => void;
  defaultOpen?: boolean;
};

export function TierSection({
  label,
  colorVar,
  tiles,
  completedTileIds,
  highlightedIds,
  hasFilters,
  onToggleTile,
  onTileClick,
  defaultOpen = true,
}: TierSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const completedCount = tiles.filter((t) => completedTileIds.has(t.id)).length;

  return (
    <div className="tier-section">
      <button
        className="tier-section-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="tier-section-name" style={{ color: `var(${colorVar})` }}>
          {open ? "▾" : "▸"} {label}
        </span>
        <span className="tier-section-count">
          {completedCount} / {tiles.length}
        </span>
      </button>

      {open && (
        <ul className="tier-tile-list">
          {tiles.map((tile) => {
            const isCompleted = completedTileIds.has(tile.id);
            const isHighlighted = hasFilters && highlightedIds.has(tile.id);
            const isDimmed = hasFilters && !highlightedIds.has(tile.id);

            const rowClasses = [
              "tier-tile-row",
              isCompleted ? "tier-tile-row--completed" : "",
              isHighlighted ? "tier-tile-row--highlighted" : "",
              isDimmed ? "tier-tile-row--dimmed" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={tile.id}>
                <div
                  className={rowClasses}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest(".tile-checkbox")) return;
                    onTileClick(tile);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onTileClick(tile);
                  }}
                >
                  <TileCheckbox
                    checked={isCompleted}
                    tileLabel={tile.content}
                    onChange={() => onToggleTile(tile.id)}
                  />
                  <span className="tier-tile-content">{tile.content}</span>
                  <span
                    className="tier-tile-pts"
                    style={{ color: `var(${colorVar})` }}
                  >
                    {tile.points} pts
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
