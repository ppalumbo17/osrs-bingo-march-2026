import { TierSection } from "./TierSection";
import { TIERS } from "./PointsLegend";
import type { Tile } from "../types";

type ListViewProps = {
  tiles: Tile[];
  completedTileIds: Set<string>;
  highlightedIds: Set<string>;
  hasFilters: boolean;
  onToggleTile: (id: string) => void;
  onTileClick: (tile: Tile) => void;
};

export function ListView({
  tiles,
  completedTileIds,
  highlightedIds,
  hasFilters,
  onToggleTile,
  onTileClick,
}: ListViewProps) {
  return (
    <main className="list-view">
      {TIERS.map((tier) => (
        <TierSection
          key={tier.points}
          label={tier.label}
          colorVar={tier.colorVar}
          tiles={tiles.filter((t) => t.points === tier.points)}
          completedTileIds={completedTileIds}
          highlightedIds={highlightedIds}
          hasFilters={hasFilters}
          onToggleTile={onToggleTile}
          onTileClick={onTileClick}
        />
      ))}
    </main>
  );
}
