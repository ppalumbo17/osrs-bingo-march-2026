import { useState, useRef } from "react";
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
  allBosses: string[];
  selectedBosses: string[];
  view: ViewMode;
  onToggleTile: (id: string) => void;
  onTileClick: (tile: Tile) => void;
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
  onResetProgress: () => void;
  onViewChange: (v: ViewMode) => void;
  onImport: (ids: string[]) => void;
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
  allBosses,
  selectedBosses,
  view,
  onToggleTile,
  onTileClick,
  onToggleBoss,
  onClearFilters,
  onResetProgress,
  onViewChange,
  onImport,
  allTileIds,
  completedTileIdsArray,
}: MobileListViewProps) {
  const score = completedTiles.reduce((s, t) => s + t.points, 0);
  const [copied, setCopied] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [pasteError, setPasteError] = useState("");

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify({ completedTileIds: completedTileIdsArray })).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleApply() {
    try {
      const parsed = JSON.parse(pasteValue);
      if (!Array.isArray(parsed.completedTileIds)) throw new Error();
      const valid = parsed.completedTileIds.filter(
        (id: unknown) => typeof id === "string" && allTileIds.includes(id)
      );
      onImport(valid);
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
            return (
              <button
                key={boss}
                className={`boss-btn${isSelected ? " boss-btn--selected" : ""}`}
                aria-pressed={isSelected}
                onClick={() => onToggleBoss(boss)}
              >
                {boss}
              </button>
            );
          })}
        </div>
      </Collapsible>

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
    </div>
  );
}
