interface FunnelData {
  label: string;
  value: number;
  displayValue: string;
}

interface FunnelGradient {
  from: string;
  to: string;
}

interface FunnelChartProps {
  data: FunnelData[];
  orientation?: "vertical" | "horizontal";
  layers?: number;
  edges?: "straight" | "curved";
  gradient?: FunnelGradient[];
  showLabels?: boolean;
  showValues?: boolean;
  showPercentage?: boolean;
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  className?: string;
}

function segmentPath(
  cx: number, topW: number, bottomW: number,
  topY: number, bottomY: number, curved: boolean
): string {
  const tl = cx - topW / 2, tr = cx + topW / 2;
  const bl = cx - bottomW / 2, br = cx + bottomW / 2;
  if (!curved)
    return `M${tl},${topY} L${tr},${topY} L${br},${bottomY} L${bl},${bottomY}Z`;
  const c = (bottomY - topY) * 0.42;
  return [
    `M${tl},${topY}`, `L${tr},${topY}`,
    `C${tr},${topY + c} ${br},${bottomY - c} ${br},${bottomY}`,
    `L${bl},${bottomY}`,
    `C${bl},${bottomY - c} ${tl},${topY + c} ${tl},${topY}`, "Z",
  ].join(" ");
}

function topEdgePath(cx: number, w: number, y: number): string {
  return `M${cx - w / 2},${y} L${cx + w / 2},${y}`;
}

export default function FunnelChart({
  data, edges = "curved", gradient,
  showLabels = true, showValues = true, showPercentage = true,
  hoveredIndex, className,
}: FunnelChartProps) {
  const VW = 340, VH = 500, CX = VW / 2, MAX_W = 300, GAP = 3;
  const maxVal = Math.max(...data.map((d) => d.value));
  const widths = data.map((d) => (d.value / maxVal) * MAX_W);
  widths.push(widths[widths.length - 1] * 0.4);
  const segH = (VH - GAP * (data.length - 1)) / data.length;
  const curved = edges === "curved";

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className={className}
      width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        {gradient?.map((g, i) => (
          <linearGradient key={i} id={`funnel-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={g.from} />
            <stop offset="100%" stopColor={g.to} />
          </linearGradient>
        ))}
      </defs>

      {data.map((d, i) => {
        const topY = i * (segH + GAP);
        const bottomY = topY + segH;
        const fill = gradient?.[i] ? `url(#funnel-grad-${i})` : "#B8884A";
        const isHovered = hoveredIndex === i;

        return (
          <g key={i} style={{
            animation: "segmentIn 0.45s ease-out forwards",
            animationDelay: `${0.6 + i * 0.15}s`, opacity: 0,
          }}>
            <path
              d={segmentPath(CX, widths[i], widths[i + 1], topY, bottomY, curved)}
              fill={fill}
              opacity={isHovered === false && hoveredIndex !== null ? 0.5 : 1}
            />
            {/* Inner top edge highlight */}
            <path
              d={topEdgePath(CX, widths[i], topY)}
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
            />

            {showLabels && (
              <text x={CX} y={topY + segH / 2 - 6} textAnchor="middle"
                fill="white" fontSize="12" fontFamily="monospace">{d.label}</text>
            )}
            {showValues && (
              <text x={CX} y={topY + segH / 2 + 10} textAnchor="middle"
                fill="white" fontSize="11" fontFamily="monospace" opacity={0.7}>{d.displayValue}</text>
            )}
            {showPercentage && i > 0 && (
              <text x={CX + widths[i] / 2 + 8} y={topY + 4}
                fill="white" fontSize="10" fontFamily="monospace" opacity={0.5}>{d.displayValue}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
