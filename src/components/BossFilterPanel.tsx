type BossFilterPanelProps = {
  allBosses: string[];
  selectedBosses: string[];
  onToggleBoss: (boss: string) => void;
  onClearFilters: () => void;
};

export function BossFilterPanel({
  allBosses,
  selectedBosses,
  onToggleBoss,
  onClearFilters,
}: BossFilterPanelProps) {
  const hasFilters = selectedBosses.length > 0;

  return (
    <div className="boss-filter-panel">
      <div className="boss-filter-header">
        <span className="boss-filter-label">Filter by Boss</span>
        {hasFilters && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear
          </button>
        )}
      </div>
      <div className="boss-filter-buttons">
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
    </div>
  );
}
