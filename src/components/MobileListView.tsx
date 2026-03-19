import { useState } from "react";
import { TierSection } from "./TierSection";
import { TIERS } from "./PointsLegend";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";
import type { Tile } from "../types";

type CollapsibleProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function Collapsible({ title, defaultOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mobile-collapsible">
      <button
        className="mobile-collapsible-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{open ? "▾" : "▸"} {title}</span>
      </button>
      {open && <div className="mobile-collapsible-body">{children}</div>}
    </div>
  );
}

type MobileListViewProps = {
  tiles: Tile[];
  completedTiles: Tile[];
  totalTiles: number;
  completedTileIds: Set<string>;
  highlightedIds: Set<string>;
  hasFilters: boolean;
  prioritizedTilesMap: Record<string, number>;
  allBosses: string[];
  selectedBosses: string[];
  fullyCompletedBosses: Set<string>;
  view: ViewMode;
  onToggleTile: (id: string) => void;
  onTileClick: (tile: Tile) => void;
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
  onResetProgress: () => void;
  onViewChange: (v: ViewMode) => void;
  onImport: (ids: string[], priorities: Record<string, number>) => void;
  onPriorityClick: (tile: Tile) => void;
  allTileIds: string[];
  completedTileIdsArray: string[];
};

export function MobileListView({
  tiles,
  completedTiles,
  totalTiles,
  completedTileIds,
  highlightedIds,
  hasFilters,
  prioritizedTilesMap,
  allBosses,
  selectedBosses,
  fullyCompletedBosses,
  view,
  onToggleTile,
  onTileClick,
  onToggleBoss,
  onClearFilters,
  onResetProgress,
  onViewChange,
  onImport,
  onPriorityClick,
  allTileIds,
  completedTileIdsArray,
}: MobileListViewProps) {
  const score = completedTiles.reduce((s, t) => s + t.points, 0);
  const [copied, setCopied] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [pasteError, setPasteError] = useState("");

  const priorityEntries = Object.entries(prioritizedTilesMap)
    .sort(([, a], [, b]) => a - b)
    .map(([id, num]) => ({ tile: tiles.find((t) => t.id === id), num }))
    .filter((e): e is { tile: Tile; num: number } => e.tile != null);

  const priorityPendingPts = priorityEntries
    .filter(({ tile }) => !completedTileIds.has(tile.id))
    .reduce((sum, { tile }) => sum + tile.points, 0);

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify({ completedTileIds: completedTileIdsArray, prioritizedTilesMap })).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleApply() {
    try {
      const parsed = JSON.parse(pasteValue);
      if (!Array.isArray(parsed.completedTileIds)) throw new Error();
      const validIds = parsed.completedTileIds.filter(
        (id: unknown) => typeof id === "string" && allTileIds.includes(id)
      );
      const validPriorities: Record<string, number> = {};
      if (parsed.prioritizedTilesMap && typeof parsed.prioritizedTilesMap === "object") {
        for (const [id, num] of Object.entries(parsed.prioritizedTilesMap)) {
          if (typeof id === "string" && allTileIds.includes(id) && typeof num === "number" && num > 0) {
            validPriorities[id] = num;
          }
        }
      }
      onImport(validIds, validPriorities);
      setPasteValue(""); setPasteError(""); setPasteOpen(false);
    } catch {
      setPasteError("Invalid format — paste an exported progress string.");
    }
  }

  return (
    <div className="mobile-list-view">
      <div className="mobile-header">
        <span className="mobile-title">OSRS Bingo</span>
        <ViewToggle view={view} onChange={onViewChange} />
      </div>

      <Collapsible title={`Score — ${completedTiles.length} / ${totalTiles} tiles · ${score} pts`} defaultOpen>
        <div className="score-summary">
          <div className="score-row">
            <span>Tiles complete</span>
            <span>{completedTiles.length} / {totalTiles}</span>
          </div>
          <div className="score-row score-total">
            <span>Score</span>
            <span>{score}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="ie-btn" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
          <button className="ie-btn" onClick={() => { setPasteOpen((o) => !o); setPasteError(""); }}>
            {pasteOpen ? "Cancel" : "Import"}
          </button>
          <button className="reset-progress-btn" style={{ marginTop: 0 }} onClick={onResetProgress}>Reset</button>
        </div>
        {pasteOpen && (
          <div className="ie-paste-area">
            <textarea className="ie-textarea" placeholder="Paste progress JSON here…" value={pasteValue}
              onChange={(e) => { setPasteValue(e.target.value); setPasteError(""); }} rows={3} autoFocus />
            {pasteError && <p className="ie-error">{pasteError}</p>}
            <button className="ie-btn ie-apply-btn" onClick={handleApply}>Apply</button>
          </div>
        )}
      </Collapsible>

      {priorityEntries.length > 0 && (
        <Collapsible title={`Priority (${priorityEntries.length}) · ${priorityPendingPts} pts`} defaultOpen>
          <ul className="priority-panel-list">
            {priorityEntries.map(({ tile, num }) => {
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
        </Collapsible>
      )}

      <Collapsible title={`Boss Filters${hasFilters ? ` (${selectedBosses.length} active)` : ""}`}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          {hasFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              Clear all
            </button>
          )}
        </div>
        <div className="boss-filter-buttons" style={{ maxHeight: 240, overflowY: "auto" }}>
          {allBosses.map((boss) => {
            const isSelected = selectedBosses.includes(boss);
            const isFullyDone = fullyCompletedBosses.has(boss);
            return (
              <button
                key={boss}
                className={[
                  "boss-btn",
                  isSelected ? "boss-btn--selected" : "",
                  isFullyDone ? "boss-btn--completed" : "",
                ].filter(Boolean).join(" ")}
                aria-pressed={isSelected}
                onClick={() => onToggleBoss(boss)}
              >
                {boss}
              </button>
            );
          })}
        </div>
      </Collapsible>

      <ul className="tier-list">
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
            defaultOpen={false}
          />
        ))}
      </ul>
    </div>
  );
}
