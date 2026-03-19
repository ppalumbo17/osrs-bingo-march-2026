import { TileCheckbox } from "./TileCheckbox";
import type { Tile } from "../types";

type BoardTileProps = {
  tile: Tile;
  isCompleted: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  isFlashing: boolean;
  priorityNumber?: number;
  onClick: (tile: Tile) => void;
  onToggle: (id: string) => void;
};

const RING_CLASS: Record<number, string> = {
  1: "ring-1",
  4: "ring-4",
  8: "ring-8",
  12: "ring-12",
  30: "ring-30",
};

export function BoardTile({
  tile,
  isCompleted,
  isHighlighted,
  isDimmed,
  isFlashing,
  priorityNumber,
  onClick,
  onToggle,
}: BoardTileProps) {
  const ringClass = RING_CLASS[tile.points] ?? "ring-1";

  const classes = [
    "board-tile",
    ringClass,
    isCompleted ? "board-tile--completed" : "",
    isHighlighted ? "board-tile--highlighted" : "",
    isDimmed ? "board-tile--dimmed" : "",
    isFlashing ? "board-tile--flashing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest(".tile-checkbox")) return;
        onClick(tile);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(tile);
      }}
    >
      {priorityNumber != null && (
        <span className="tile-priority-badge" aria-label={`Priority ${priorityNumber}`}>
          {priorityNumber}
        </span>
      )}
      <TileCheckbox
        checked={isCompleted}
        tileLabel={tile.content}
        onChange={() => onToggle(tile.id)}
      />
      <span className="tile-content">{tile.content}</span>
      {isCompleted && <span className="tile-complete-mark" aria-hidden="true">✓</span>}
    </div>
  );
}
