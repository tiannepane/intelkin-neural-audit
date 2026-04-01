import { useRef, useCallback } from "react";
import Brain3D from "./Brain3D";
import type { Brain3DProps, RegionScreenData } from "./Brain3D";
import type { ViewMode } from "./Header";

/* ── Name mapping ── */
const PLAIN: Record<string, string> = {
  "Visual Cortex": "Layout Clarity",
  "Prefrontal Cortex": "Decision Effort",
  Amygdala: "Emotional Response",
  "Language Network": "Content Clarity",
  "Fusiform Face Area": "Recognition Speed",
};

const DATA_A: Record<string, number> = {
  "Visual Cortex": 78, "Prefrontal Cortex": 62, Amygdala: 45,
  "Language Network": 53, "Fusiform Face Area": 71,
};
const DATA_B: Record<string, number> = {
  "Visual Cortex": 64, "Prefrontal Cortex": 71, Amygdala: 33,
  "Language Network": 48, "Fusiform Face Area": 58,
};
const DELTAS: Record<string, { winner: string; delta: number }> = {
  "Visual Cortex": { winner: "B", delta: -14 },
  "Prefrontal Cortex": { winner: "B", delta: 9 },
  Amygdala: { winner: "B", delta: -12 },
  "Language Network": { winner: "B", delta: -5 },
  "Fusiform Face Area": { winner: "A", delta: 13 },
};

const REGION_ORDER = [
  "Visual Cortex", "Prefrontal Cortex", "Amygdala",
  "Language Network", "Fusiform Face Area",
];

/* ── Floating label card ── */
function LabelCard({
  name,
  mode,
  isHovered,
}: {
  name: string;
  mode: ViewMode;
  isHovered: boolean;
}) {
  const plain = PLAIN[name] ?? name;

  const metric = mode === "a" ? `${DATA_A[name]}%` : `${DATA_B[name]}%`;

  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(6,6,6,0.82)",
        padding: "8px 12px",
        minWidth: "120px",
        // Border brightens on hover — overrides glass-card's border
        border: isHovered
          ? "1px solid rgba(74,143,232,0.4)"
          : undefined,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Line 1: Plain English name */}
      <div style={{
        fontSize: "14px", color: "#ffffff", fontFamily: "monospace",
        fontWeight: 500, lineHeight: 1.3,
      }}>
        {plain}
      </div>
      {/* Line 2: Scientific name */}
      <div style={{
        fontSize: "10px", color: "#555555", fontFamily: "monospace",
        fontWeight: "normal", lineHeight: 1.3,
      }}>
        {name}
      </div>
      {/* Line 3: Active metric — brightens to white when hovered */}
      <div style={{
        fontSize: "16px",
        color: isHovered ? "#ffffff" : "#4A8FE8",
        fontFamily: "monospace",
        fontWeight: 500,
        lineHeight: 1.3,
        marginTop: "2px",
        transition: "color 0.2s ease",
      }}>
        {metric}
      </div>
    </div>
  );
}

/* ── Main component ── */
interface Props extends Omit<Brain3DProps, "hoveredRegion"> {
  mode: ViewMode;
  hoveredRegion: string | null;
}

export default function BrainVisualization({ mode, hoveredRegion, ...brainProps }: Props) {
  // Outer div refs: position + rotation-visibility opacity (set imperatively from useFrame)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleRegionUpdate = useCallback((regions: RegionScreenData[]) => {
    regions.forEach((r, i) => {
      const el = labelRefs.current[i];
      if (!el) return;
      el.style.left   = `${(r.x * 100).toFixed(2)}%`;
      el.style.top    = `${(r.y * 100).toFixed(2)}%`;
      el.style.opacity = String(Math.max(0, r.visibility).toFixed(3));
      el.style.filter  = `blur(${((1 - r.visibility) * 6).toFixed(1)}px)`;
    });
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Brain canvas + floating labels */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <Brain3D
          {...brainProps}
          hoveredRegion={hoveredRegion}
          onRegionUpdate={handleRegionUpdate}
        />

        {/* Floating annotations: [card][──16px──][●]
            Outer div is positioned at anchor; transform places the dot AT the anchor.
            display:flex + translate(-100%, -50%) = right edge (dot) sits on anchor point. */}
        {REGION_ORDER.map((name, i) => (
          <div
            key={name}
            ref={(el) => { labelRefs.current[i] = el; }}
            className="absolute pointer-events-none"
            style={{
              opacity: 0,
              display: "flex",
              alignItems: "center",
              transform: "translate(-100%, -50%)",
              transition: "opacity 0.3s, filter 0.3s",
            }}
          >
            {/* Dim entire annotation when another region is active */}
            <div style={{
              display: "flex",
              alignItems: "center",
              opacity: hoveredRegion !== null && hoveredRegion !== name ? 0.35 : 1,
              transition: "opacity 0.25s ease",
            }}>
              <LabelCard name={name} mode={mode} isHovered={hoveredRegion === name} />

              {/* Connecting line */}
              <div style={{
                width: 16, height: 1,
                background: "rgba(255,255,255,0.12)",
                flexShrink: 0,
              }} />

              {/* Anchor dot */}
              <div style={{
                width: 4, height: 4,
                borderRadius: "50%",
                background: "#4A8FE8",
                flexShrink: 0,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Credit line */}
      <div className="shrink-0 py-1.5 text-center">
        <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#222222", letterSpacing: "0.1em" }}>
          TRIBE v2 · 752 baseline scans · Meta FAIR open source
        </span>
      </div>
    </div>
  );
}
