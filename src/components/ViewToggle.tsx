export type ViewMode = "board" | "list";

type ViewToggleProps = {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
};

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="tablist" aria-label="Board view selector">
      <button
        role="tab"
        aria-selected={view === "board"}
        className={`view-tab${view === "board" ? " view-tab--active" : ""}`}
        onClick={() => onChange("board")}
      >
        Board
      </button>
      <button
        role="tab"
        aria-selected={view === "list"}
        className={`view-tab${view === "list" ? " view-tab--active" : ""}`}
        onClick={() => onChange("list")}
      >
        List
      </button>
    </div>
  );
}
