import { ScoreSummary } from "./ScoreSummary";
import { BossFilterPanel } from "./BossFilterPanel";
import { ResetProgressButton } from "./ResetProgressButton";
import { PointsLegend } from "./PointsLegend";
import { ImportExportControls } from "./ImportExportControls";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";
import type { Tile } from "../types";

type SidebarProps = {
  completedTiles: Tile[];
  totalTiles: number;
  allBosses: string[];
  selectedBosses: string[];
  completedTileIds: string[];
  allTileIds: string[];
  view: ViewMode;
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
  onResetProgress: () => void;
  onImport: (ids: string[]) => void;
  onViewChange: (v: ViewMode) => void;
};

export function Sidebar({
  completedTiles,
  totalTiles,
  allBosses,
  selectedBosses,
  completedTileIds,
  allTileIds,
  view,
  onToggleBoss,
  onClearFilters,
  onResetProgress,
  onImport,
  onViewChange,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h1 className="sidebar-title">OSRS Bingo</h1>
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
      <ScoreSummary completedTiles={completedTiles} totalTiles={totalTiles} />
      <PointsLegend />
      <BossFilterPanel
        allBosses={allBosses}
        selectedBosses={selectedBosses}
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
