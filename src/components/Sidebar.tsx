import { ScoreSummary } from "./ScoreSummary";
import { BossFilterPanel } from "./BossFilterPanel";
import { ResetProgressButton } from "./ResetProgressButton";
import { PointsLegend } from "./PointsLegend";
import { ImportExportControls } from "./ImportExportControls";
import { ViewToggle } from "./ViewToggle";
import { PriorityPanel } from "./PriorityPanel";
import type { ViewMode } from "./ViewToggle";
import type { Tile } from "../types";

type SidebarProps = {
  completedTiles: Tile[];
  totalTiles: number;
  allBosses: string[];
  selectedBosses: string[];
  completedTileIds: string[];
  allTileIds: string[];
  fullyCompletedBosses: Set<string>;
  prioritizedTilesMap: Record<string, number>;
  tiles: Tile[];
  view: ViewMode;
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
  onResetProgress: () => void;
  onImport: (ids: string[]) => void;
  onViewChange: (v: ViewMode) => void;
  onPriorityClick: (tile: Tile) => void;
};

export function Sidebar({
  completedTiles,
  totalTiles,
  allBosses,
  selectedBosses,
  completedTileIds,
  allTileIds,
  fullyCompletedBosses,
  prioritizedTilesMap,
  tiles,
  view,
  onToggleBoss,
  onClearFilters,
  onResetProgress,
  onImport,
  onViewChange,
  onPriorityClick,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h1 className="sidebar-title">OSRS Bingo</h1>
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
      <ScoreSummary completedTiles={completedTiles} totalTiles={totalTiles} />
      <PointsLegend />
      <PriorityPanel
        prioritizedTilesMap={prioritizedTilesMap}
        tiles={tiles}
        completedTileIds={new Set(completedTileIds)}
        onPriorityClick={onPriorityClick}
      />
      <BossFilterPanel
        allBosses={allBosses}
        selectedBosses={selectedBosses}
        fullyCompletedBosses={fullyCompletedBosses}
        onToggleBoss={onToggleBoss}
        onClearFilters={onClearFilters}
      />
      <ImportExportControls
        completedTileIds={completedTileIds}
        allTileIds={allTileIds}
        onImport={onImport}
      />
      <ResetProgressButton onReset={onResetProgress} />
    </aside>
  );
}
