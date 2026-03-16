export const TIERS = [
  { label: "Tier 1",           points: 1,  colorVar: "--tier-common"    },
  { label: "Tier 2",           points: 4,  colorVar: "--tier-uncommon"  },
  { label: "Tier 3",           points: 8,  colorVar: "--tier-rare"      },
  { label: "Tier 4",           points: 12, colorVar: "--tier-epic"      },
  { label: "Hespori Speedster",points: 30, colorVar: "--tier-legendary" },
] as const;

export function PointsLegend() {
  return (
    <div className="points-legend">
      <span className="points-legend-heading">Point Tiers</span>
      <table className="points-legend-table">
        <tbody>
          {TIERS.map((tier) => (
            <tr key={tier.points}>
              <td
                className="points-legend-name"
                style={{ color: `var(${tier.colorVar})` }}
              >
                {tier.label}
              </td>
              <td className="points-legend-pts">{tier.points} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
