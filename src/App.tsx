import { useState, useRef } from "react";
import { tiles, allBosses } from "./data/tiles";
import { STORAGE_KEYS } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useIsMobile } from "./hooks/useIsMobile";
import { Sidebar } from "./components/Sidebar";
import { Board } from "./components/Board";
import { ListView } from "./components/ListView";
import { MobileListView } from "./components/MobileListView";
import { TileModal } from "./components/TileModal";
import type { ViewMode } from "./components/ViewToggle";
import type { Tile } from "./types";

const allTileIds = tiles.map((t) => t.id);

function App() {
  const isMobile = useIsMobile();

  const [completedTileIdsArray, setCompletedTileIdsArray] = useLocalStorage<string[]>(
    STORAGE_KEYS.completedTiles,
    []
  );
  const [selectedBosses, setSelectedBosses] = useLocalStorage<string[]>(
    STORAGE_KEYS.selectedBosses,
    []
  );
  const [prioritizedTilesMap, setPrioritizedTilesMap] = useLocalStorage<Record<string, number>>(
    STORAGE_KEYS.prioritizedTiles,
    {}
  );
  const [view, setView] = useState<ViewMode>(() =>
    window.matchMedia("(max-width: 768px)").matches ? "list" : "board"
  );
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const [flashTileId, setFlashTileId] = useState<string | null>(null);
  const lastClickedTileRef = useRef<HTMLElement | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completedTileIds = new Set(completedTileIdsArray);
  const completedTiles = tiles.filter((t) => completedTileIds.has(t.id));

  const fullyCompletedBosses = new Set(
    allBosses.filter((boss) =>
      tiles
        .filter((t) => t.relatedBosses.includes(boss))
        .every((t) => completedTileIds.has(t.id))
    )
  );

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

  function setPriority(id: string, priority: number | null) {
    const next = { ...prioritizedTilesMap };
    if (priority === null || priority <= 0) {
      delete next[id];
    } else {
      next[id] = priority;
    }
    setPrioritizedTilesMap(next);
  }

  function flashTile(id: string) {
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    setFlashTileId(id);
    flashTimeoutRef.current = setTimeout(() => setFlashTileId(null), 4000);
  }

  function handlePriorityClick(tile: Tile) {
    if (view === "board") {
      flashTile(tile.id);
    } else {
      openTile(tile);
    }
  }

  function handleImport(ids: string[]) {
    setCompletedTileIdsArray(ids);
  }

  function openTile(tile: Tile) {
    lastClickedTileRef.current = document.activeElement as HTMLElement;
    setActiveTile(tile);
  }

  function closeTile() {
    setActiveTile(null);
    lastClickedTileRef.current?.focus();
  }

  const hasFilters = selectedBosses.length > 0;
  const highlightedIds = hasFilters
    ? new Set(
        tiles
          .filter((t) => t.relatedBosses.some((b) => selectedBosses.includes(b)))
          .map((t) => t.id)
      )
    : new Set<string>();

  const sharedBoardProps = {
    tiles,
    completedTileIds,
    highlightedIds,
    hasFilters,
    onToggleTile: toggleTile,
    onTileClick: openTile,
  };

  // Mobile list view: single-column layout, no separate sidebar
  if (isMobile && view === "list") {
    return (
      <>
        <MobileListView
          {...sharedBoardProps}
          completedTiles={completedTiles}
          totalTiles={tiles.length}
          allBosses={allBosses}
          selectedBosses={selectedBosses}
          fullyCompletedBosses={fullyCompletedBosses}
          prioritizedTilesMap={prioritizedTilesMap}
          view={view}
          onToggleBoss={toggleBoss}
          onClearFilters={clearFilters}
          onResetProgress={resetProgress}
          onViewChange={setView}
          onImport={handleImport}
          onPriorityClick={handlePriorityClick}
          allTileIds={allTileIds}
          completedTileIdsArray={completedTileIdsArray}
        />
        <TileModal
          tile={activeTile}
          priorityNumber={activeTile ? (prioritizedTilesMap[activeTile.id] ?? null) : null}
          onSetPriority={(p) => activeTile && setPriority(activeTile.id, p)}
          onClose={closeTile}
        />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        completedTiles={completedTiles}
        totalTiles={tiles.length}
        allBosses={allBosses}
        selectedBosses={selectedBosses}
        completedTileIds={completedTileIdsArray}
        allTileIds={allTileIds}
        fullyCompletedBosses={fullyCompletedBosses}
        prioritizedTilesMap={prioritizedTilesMap}
        tiles={tiles}
        view={view}
        onToggleBoss={toggleBoss}
        onClearFilters={clearFilters}
        onResetProgress={resetProgress}
        onImport={handleImport}
        onViewChange={setView}
        onPriorityClick={handlePriorityClick}
      />
      {view === "board" ? (
        <Board
          {...sharedBoardProps}
          prioritizedTilesMap={prioritizedTilesMap}
          flashTileId={flashTileId}
        />
      ) : (
        <ListView {...sharedBoardProps} />
      )}
      <TileModal
        tile={activeTile}
        priorityNumber={activeTile ? (prioritizedTilesMap[activeTile.id] ?? null) : null}
        onSetPriority={(p) => activeTile && setPriority(activeTile.id, p)}
        onClose={closeTile}
      />
    </div>
  );
}

export default App;
