import { useState } from "react";

type ImportExportControlsProps = {
  completedTileIds: string[];
  allTileIds: string[];
  onImport: (ids: string[]) => void;
};

export function ImportExportControls({
  completedTileIds,
  allTileIds,
  onImport,
}: ImportExportControlsProps) {
  const [copied, setCopied] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [pasteError, setPasteError] = useState("");

  function handleCopy() {
    const json = JSON.stringify({ completedTileIds });
    navigator.clipboard.writeText(json).then(() => {
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
      setPasteValue("");
      setPasteError("");
      setPasteOpen(false);
    } catch {
      setPasteError("Invalid format — paste an exported progress string.");
    }
  }

  return (
    <div className="import-export-controls">
      <span className="import-export-label">Progress</span>
      <div className="import-export-buttons">
        <button className="ie-btn" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          className="ie-btn"
          onClick={() => { setPasteOpen((o) => !o); setPasteError(""); }}
        >
          {pasteOpen ? "Cancel" : "Import"}
        </button>
      </div>
      {pasteOpen && (
        <div className="ie-paste-area">
          <textarea
            className="ie-textarea"
            placeholder="Paste progress JSON here…"
            value={pasteValue}
            onChange={(e) => { setPasteValue(e.target.value); setPasteError(""); }}
            rows={3}
            autoFocus
          />
          {pasteError && <p className="ie-error">{pasteError}</p>}
          <button className="ie-btn ie-apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
