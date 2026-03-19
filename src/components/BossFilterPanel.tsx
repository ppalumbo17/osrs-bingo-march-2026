import { useState } from "react";

type BossFilterPanelProps = {
  allBosses: string[];
  selectedBosses: string[];
  fullyCompletedBosses: Set<string>;
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
};

export function BossFilterPanel({
  allBosses,
  selectedBosses,
  fullyCompletedBosses,
  onToggleBoss,
  onClearFilters,
}: BossFilterPanelProps) {
  const [open, setOpen] = useState(true);
  const hasFilters = selectedBosses.length > 0;

  return (
    <div className="boss-filter-panel">
      <button
        className="collapsible-panel-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="collapsible-panel-title">
          {open ? "▾" : "▸"} Filter by Boss
        </span>
        {hasFilters && (
          <button
            className="clear-filters-btn"
            onClick={(e) => { e.stopPropagation(); onClearFilters(); }}
          >
            Clear
          </button>
        )}
      </button>
      {open && (
        <div className="boss-filter-buttons">
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
      )}
    </div>
  );
}
