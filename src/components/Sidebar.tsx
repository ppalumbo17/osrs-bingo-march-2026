import { ScoreSummary } from "./ScoreSummary";
import { BossFilterPanel } from "./BossFilterPanel";
import { ResetProgressButton } from "./ResetProgressButton";
import { PointsLegend } from "./PointsLegend";
import type { Tile } from "../types";

type SidebarProps = {
  completedTiles: Tile[];
  totalTiles: number;
  allBosses: string[];
  selectedBosses: string[];
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
  onResetProgress: () => void;
};

export function Sidebar({
  completedTiles,
  totalTiles,
  allBosses,
  selectedBosses,
  onToggleBoss,
  onClearFilters,
  onResetProgress,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">OSRS Bingo</h1>
      <ScoreSummary completedTiles={completedTiles} totalTiles={totalTiles} />
      <PointsLegend />
      <BossFilterPanel
        allBosses={allBosses}
        selectedBosses={selectedBosses}
        onToggleBoss={onToggleBoss}
        onClearFilters={onClearFilters}
      />
      <ResetProgressButton onReset={onResetProgress} />
    </aside>
  );
}
