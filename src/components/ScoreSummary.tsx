import type { Tile } from "../types";

type ScoreSummaryProps = {
  completedTiles: Tile[];
  totalTiles: number;
};

export function ScoreSummary({ completedTiles, totalTiles }: ScoreSummaryProps) {
  const score = completedTiles.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="score-summary">
      <div className="score-row">
        <span>Tiles</span>
        <span>
          {completedTiles.length} / {totalTiles}
        </span>
      </div>
      <div className="score-row score-total">
        <span>Score</span>
        <span>{score}</span>
      </div>
    </div>
  );
}
