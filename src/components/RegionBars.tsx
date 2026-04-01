import { useState } from "react";
import type { ViewMode } from "./Header";

/* ── Region data ── */
const REGIONS = [
  {
    scientific: "Visual Cortex", plain: "Layout Clarity",
    winner: "B" as const, delta: -14, aVal: 78, bVal: 64,
    explanation: "Users found the key elements fast. Low visual search effort means they reached the next step without friction.",
  },
  {
    scientific: "Prefrontal Cortex", plain: "Decision Effort",
    winner: "B" as const, delta: 9, aVal: 62, bVal: 71,
    explanation: "Moderate deliberation before acting. This is healthy unless it appears at steps where you want fast commitment.",
  },
  {
    scientific: "Amygdala", plain: "Emotional Response",
    winner: "B" as const, delta: -12, aVal: 45, bVal: 33,
    explanation: "Low stress response at this stage. Users felt safe enough to continue, with no hesitation triggers detected.",
  },
  {
    scientific: "Language Network", plain: "Content Clarity",
    winner: "B" as const, delta: -5, aVal: 53, bVal: 48,
    explanation: "Copy was processed with moderate effort. Simpler sentence structure at key moments would reduce this further.",
  },
  {
    scientific: "Fusiform Face Area", plain: "Recognition Speed",
    winner: "A" as const, delta: 13, aVal: 71, bVal: 58,
    explanation: "Strong recognition response. Brand elements or human imagery are landing and building trust.",
  },
];

/* ── Per-region color palette ── */
const REGION_COLORS: Record<string, { hex: string; rgb: string }> = {
  "Visual Cortex":      { hex: "#EF4444", rgb: "239,68,68"   },
  "Prefrontal Cortex":  { hex: "#F97316", rgb: "249,115,22"  },
  "Amygdala":           { hex: "#EAB308", rgb: "234,179,8"   },
  "Language Network":   { hex: "#3B82F6", rgb: "59,130,246"  },
  "Fusiform Face Area": { hex: "#A855F7", rgb: "168,85,247"  },
};

function glow(rgb: string, hovered: boolean) {
  return hovered
    ? `0 0 14px rgba(${rgb},0.8), 0 0 4px rgba(${rgb},1.0)`
    : `0 0 8px rgba(${rgb},0.6), 0 0 2px rgba(${rgb},0.9)`;
}

/* ── Bar ── */
function Bar({ region, mode, isRowHovered }: {
  region: typeof REGIONS[number]; mode: ViewMode; isRowHovered: boolean;
}) {
  const color = REGION_COLORS[region.scientific] ?? { hex: "#4A8FE8", rgb: "74,143,232" };
  const val = mode === "a" ? region.aVal : region.bVal;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
      <div style={{ position: "relative", flex: 1, height: 6 }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${val}%`, background: color.hex, borderRadius: 1,
          boxShadow: glow(color.rgb, isRowHovered),
          transition: "width 0.3s ease, box-shadow 150ms ease",
        }} />
      </div>
      <span style={{
        fontSize: 12, fontFamily: "monospace", color: color.hex,
        whiteSpace: "nowrap", minWidth: 36, textAlign: "right", flexShrink: 0,
      }}>
        {val}%
      </span>
    </div>
  );
}

/* ── Region row with accordion ── */
function RegionRow({ region, mode, isHovered, isExpanded, onEnter, onLeave, onClick }: {
  region: typeof REGIONS[number]; mode: ViewMode;
  isHovered: boolean; isExpanded: boolean;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
}) {
  return (
    <div className="glass-card" onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}
      style={{ flexShrink: 0, marginBottom: 2, background: isHovered ? "rgba(255,255,255,0.06)" : undefined, cursor: "pointer", transition: "background 0.15s ease" }}>
      <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ width: "38%", flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.25 }}>{region.plain}</div>
          <div style={{ fontSize: 10, color: "#666666", fontFamily: "monospace", lineHeight: 1.25 }}>{region.scientific}</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", minWidth: 0 }}>
          <Bar region={region} mode={mode} isRowHovered={isHovered} />
        </div>
      </div>
      <div style={{ overflow: "hidden", maxHeight: isExpanded ? 72 : 0, opacity: isExpanded ? 1 : 0, transition: "max-height 0.2s ease, opacity 0.2s ease" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />
        <p style={{ margin: 0, padding: "10px 16px 4px 16px", fontSize: 13, color: "#BBBBBB", lineHeight: 1.65 }}>{region.explanation}</p>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function RegionBars({ mode, setHoveredRegion }: {
  mode: ViewMode; setHoveredRegion: (r: string | null) => void;
}) {
  const [localHover, setLocalHover] = useState<string | null>(null);
  const [openRegions, setOpenRegions] = useState<Set<string>>(new Set());

  const handleEnter = (s: string) => { setLocalHover(s); setHoveredRegion(s); };
  const handleLeave = () => { setLocalHover(null); setHoveredRegion(null); };
  const handleClick = (s: string) => {
    setOpenRegions((prev) => { const n = new Set(prev); if (n.has(s)) n.delete(s); else n.add(s); return n; });
  };

  return (
    <div className="region-bars-scroll" style={{ width: "100%", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "8px 8px", boxSizing: "border-box" }}>
      {REGIONS.map((r) => (
        <RegionRow key={r.scientific} region={r} mode={mode}
          isHovered={localHover === r.scientific} isExpanded={openRegions.has(r.scientific)}
          onEnter={() => handleEnter(r.scientific)} onLeave={handleLeave} onClick={() => handleClick(r.scientific)} />
      ))}
    </div>
  );
}
