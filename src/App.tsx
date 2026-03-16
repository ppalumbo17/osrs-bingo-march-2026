import { useState, useRef } from "react";
import { tiles, allBosses } from "./data/tiles";
import { STORAGE_KEYS } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Sidebar } from "./components/Sidebar";
import { Board } from "./components/Board";
import { TileModal } from "./components/TileModal";
import type { Tile } from "./types";

function App() {
  const [completedTileIdsArray, setCompletedTileIdsArray] = useLocalStorage<string[]>(
    STORAGE_KEYS.completedTiles,
    []
  );
  const [selectedBosses, setSelectedBosses] = useLocalStorage<string[]>(
    STORAGE_KEYS.selectedBosses,
    []
  );
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const lastClickedTileRef = useRef<HTMLElement | null>(null);

  function openTile(tile: Tile) {
    lastClickedTileRef.current = document.activeElement as HTMLElement;
    setActiveTile(tile);
  }

  function closeTile() {
    setActiveTile(null);
    lastClickedTileRef.current?.focus();
  }

  const completedTileIds = new Set(completedTileIdsArray);
  const completedTiles = tiles.filter((t) => completedTileIds.has(t.id));

  function toggleTile(id: string) {
    const next = new Set(completedTileIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedTileIdsArray(Array.from(next));
  }

  function toggleBoss(boss: string) {
    setSelectedBosses(
      selectedBosses.includes(boss)
        ? selectedBosses.filter((b) => b !== boss)
        : [...selectedBosses, boss]
    );
  }

  function clearFilters() {
    setSelectedBosses([]);
  }

  function resetProgress() {
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      setCompletedTileIdsArray([]);
    }
  }

  const hasFilters = selectedBosses.length > 0;
  const highlightedIds = hasFilters
    ? new Set(
        tiles
          .filter((t) => t.relatedBosses.some((b) => selectedBosses.includes(b)))
          .map((t) => t.id)
      )
    : new Set<string>();

  return (
    <div className="app-layout">
      <Sidebar
        completedTiles={completedTiles}
        totalTiles={tiles.length}
        allBosses={allBosses}
        selectedBosses={selectedBosses}
        onToggleBoss={toggleBoss}
        onClearFilters={clearFilters}
        onResetProgress={resetProgress}
      />
      <Board
        tiles={tiles}
        completedTileIds={completedTileIds}
        highlightedIds={highlightedIds}
        hasFilters={hasFilters}
        onToggleTile={toggleTile}
        onTileClick={openTile}
      />
      <TileModal tile={activeTile} onClose={closeTile} />
    </div>
  );
}

export default App;
