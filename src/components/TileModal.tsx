import { useEffect, useRef } from "react";
import { LinkSection } from "./LinkSection";
import type { Tile } from "../types";

type TileModalProps = {
  tile: Tile | null;
  onClose: () => void;
};

/** Turns a wiki URL into a readable label, e.g. ".../w/Vorkath%27s_head" → "Vorkath's head" */
function labelFromUrl(url: string): string {
  try {
    const raw = decodeURIComponent(url.split("/w/").pop() ?? url);
    return raw.replace(/_/g, " ");
  } catch {
    return url;
  }
}

export function TileModal({ tile, onClose }: TileModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus the close button when the modal opens
  useEffect(() => {
    if (tile) closeButtonRef.current?.focus();
  }, [tile]);

  // Close on Escape
  useEffect(() => {
    if (!tile) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tile, onClose]);

  // Basic focus trap: keep Tab cycling within the modal
  useEffect(() => {
    if (!tile || !modalRef.current) return;
    const modal = modalRef.current;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'a, button, input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    modal.addEventListener("keydown", onKeyDown);
    return () => modal.removeEventListener("keydown", onKeyDown);
  }, [tile]);

  if (!tile) return null;

  const bossItems = tile.relatedBosses.map((name, i) => ({
    label: name,
    url: tile.relatedBossLinks[i],
  }));

  const cellItems = tile.cellLinks.map((url) => ({
    label: labelFromUrl(url),
    url,
  }));

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={tile.content}
    >
      <div
        className="modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">{tile.content}</h2>
            <span className="modal-points">{tile.points} pts</span>
          </div>
          <button
            className="modal-close-btn"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close tile details"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <LinkSection icon="⚔️" title="Bosses" items={bossItems} />
          <LinkSection icon="🎒" title="Items &amp; Achievements" items={cellItems} />
        </div>
      </div>
    </div>
  );
}
