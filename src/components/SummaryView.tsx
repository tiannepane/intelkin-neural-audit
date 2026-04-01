import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import BrainVisualization from "./BrainVisualization";
import type { ViewMode } from "./Header";

/* ── Activation data ── */
const activationA: Record<string, number> = {
  "Visual Cortex": 0.78, "Prefrontal Cortex": 0.62,
  Amygdala: 0.45, "Language Network": 0.53, "Fusiform Face Area": 0.71,
};
const activationB: Record<string, number> = {
  "Visual Cortex": 0.64, "Prefrontal Cortex": 0.71,
  Amygdala: 0.33, "Language Network": 0.48, "Fusiform Face Area": 0.58,
};

/* ── Region data ── */
const REGIONS = [
  { scientific: "Visual Cortex",     plain: "Layout Clarity",     aVal: 78, bVal: 64 },
  { scientific: "Prefrontal Cortex", plain: "Decision Effort",    aVal: 62, bVal: 71 },
  { scientific: "Amygdala",          plain: "Emotional Response",  aVal: 45, bVal: 33 },
  { scientific: "Language Network",  plain: "Content Clarity",     aVal: 53, bVal: 48 },
  { scientific: "Fusiform Face Area",plain: "Recognition Speed",   aVal: 71, bVal: 58 },
];

const COLORS: Record<string, { hex: string; rgb: string }> = {
  "Visual Cortex":      { hex: "#EF4444", rgb: "239,68,68"  },
  "Prefrontal Cortex":  { hex: "#F97316", rgb: "249,115,22" },
  "Amygdala":           { hex: "#EAB308", rgb: "234,179,8"  },
  "Language Network":   { hex: "#3B82F6", rgb: "59,130,246" },
  "Fusiform Face Area": { hex: "#A855F7", rgb: "168,85,247" },
};

/* ── Frame thumbnail renderers ── */
function FrameA({ variant }: { variant: number }) {
  const cardShift = 14 + (variant % 3) * 8;
  const accentW = 6 + (variant % 4);
  return (
    <svg viewBox="0 0 80 50" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="80" height="50" fill="#F8F8F8" />
      <rect width="80" height="7" fill="#E0E0E0" />
      <rect y="7" width="18" height="43" fill="#EBEBEB" />
      <rect x="22" y={cardShift} width="24" height="10" rx="1" fill="#D8D8D8" />
      <rect x="50" y={cardShift + 4} width="20" height="8" rx="1" fill="#D8D8D8" />
      <rect x={80 - accentW - 4} y="2" width={accentW} height="3" rx="1" fill="#EF4444" />
    </svg>
  );
}

function FrameB({ variant }: { variant: number }) {
  const hi = variant % 3;
  return (
    <svg viewBox="0 0 80 50" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="80" height="50" fill="#F4F4F4" />
      <rect width="80" height="8" fill="#1A1A2E" />
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <rect x={4 + c * 26} y="12" width="22" height="16" rx="1" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
          <rect x={4 + c * 26} y="12" width="22" height="3" rx="1" fill={c === hi ? "#3B82F6" : "#C8D4E8"} />
          <rect x={6 + c * 26} y="18" width="14" height="2" rx="0.5" fill="#E0E0E0" />
          <rect x={6 + c * 26} y="22" width="10" height="2" rx="0.5" fill="#ECECEC" />
        </g>
      ))}
    </svg>
  );
}

const FRAME_COLORS = ["#8B5CF6","#06B6D4","#EF4444","#F97316","#4A8FE8","#8B5CF6","#06B6D4","#EF4444"];
const TIMESTAMPS = ["00:00","00:04","00:08","00:12","00:16","00:20","00:24","00:28"];

const COG_A = 61.8;
const COG_B = 54.8;

/* ── Right column ── */
function RightColumn({ mode, onSwitchToAnalysis }: { mode: ViewMode; onSwitchToAnalysis: () => void }) {
  const [btnHover, setBtnHover] = useState(false);
  const aColor = mode === "a" ? "#FFFFFF" : "#444444";
  const bColor = mode === "b" ? "#FFFFFF" : "#444444";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "28px 24px", gap: 24, boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#444444", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, marginBottom: 14 }}>
          Audit Recommendation
        </p>
        <p style={{ fontSize: 18, fontWeight: 300, color: "#FFFFFF", lineHeight: 1.4, margin: 0 }}>
          Design A processes layout and recognition faster. Design B reduces friction where users decide whether to trust you. For conversion-focused flows, B has the edge.
        </p>
        <p style={{ fontSize: 12, color: "#555555", fontStyle: "italic", lineHeight: 1.6, margin: 0, marginTop: 10 }}>
          Neural data frequently contradicts self-reported preference. This gap is what TRIBE v2 measures.
        </p>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }} />

      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#444444", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, marginBottom: 14 }}>
          Cognitive Load Score
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#444444", marginRight: 6 }}>A</span>
            <span style={{ fontSize: 48, fontWeight: 300, lineHeight: 1, color: aColor, transition: "color 0.3s ease" }}>{COG_A}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#444444", marginRight: 6 }}>B</span>
            <span style={{ fontSize: 48, fontWeight: 300, lineHeight: 1, color: bColor, transition: "color 0.3s ease" }}>{COG_B}</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }} />

      <div style={{ marginTop: "auto", flexShrink: 0 }}>
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={onSwitchToAnalysis}
          style={{
            width: "100%", padding: 12,
            background: btnHover ? "rgba(255,255,255,0.04)" : "transparent",
            border: btnHover ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.10)",
            borderRadius: 4, color: "#FFFFFF", fontFamily: "monospace", fontSize: 11,
            letterSpacing: "0.08em", cursor: "pointer",
            transition: "background 150ms ease, border-color 150ms ease",
          }}
        >
          See full analysis
        </button>
      </div>
    </div>
  );
}

/* ── Main export ── */
interface SummaryViewProps {
  mode: ViewMode;
  hoveredRegion: string | null;
  setHoveredRegion: (r: string | null) => void;
  openRegions: Set<string>;
  setOpenRegions: Dispatch<SetStateAction<Set<string>>>;
  onSwitchToAnalysis: () => void;
}

export default function SummaryView({
  mode, hoveredRegion, setHoveredRegion, onSwitchToAnalysis,
}: SummaryViewProps) {
  const [localHover, setLocalHover] = useState<string | null>(null);
  const [activeFrame, setActiveFrame] = useState(0);

  const { brainData, colorScheme } = useMemo(() => {
    if (mode === "a") return { brainData: activationA, colorScheme: "warm" as const };
    return { brainData: activationB, colorScheme: "cool" as const };
  }, [mode]);

  const handleEnter = (s: string) => { setLocalHover(s); setHoveredRegion(s); };
  const handleLeave = () => { setLocalHover(null); setHoveredRegion(null); };

  const fillPct = (activeFrame / 7) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── Band 1: Brain + Right Column (52%) ── */}
      <div style={{ height: "52%", display: "flex", flexDirection: "row", overflow: "hidden" }}>
        {/* Brain (60%) */}
        <div style={{ width: "60%", height: "100%", overflow: "hidden", minHeight: 0 }}>
          <BrainVisualization activationData={brainData} colorScheme={colorScheme} mode={mode} hoveredRegion={hoveredRegion} />
        </div>
        {/* Right column (40%) */}
        <div style={{ width: "40%", height: "100%", overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "#000" }}>
          <RightColumn mode={mode} onSwitchToAnalysis={onSwitchToAnalysis} />
        </div>
      </div>

      {/* ── Band 2: Bar chart (22%) ── */}
      <div style={{
        height: "22%", padding: "12px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        {REGIONS.map((r) => {
          const c = COLORS[r.scientific] ?? { hex: "#4A8FE8", rgb: "74,143,232" };
          const val = mode === "a" ? r.aVal : r.bVal;
          const hovered = localHover === r.scientific;
          return (
            <div
              key={r.scientific}
              onMouseEnter={() => handleEnter(r.scientific)}
              onMouseLeave={handleLeave}
              style={{
                display: "flex", alignItems: "center", gap: 12, height: "18%",
                padding: "0 4px", borderRadius: 3, cursor: "pointer",
                background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
                transition: "background 150ms ease",
              }}
            >
              {/* Label (18%) */}
              <div style={{ width: "18%", flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: "#FFFFFF", lineHeight: 1.2 }}>{r.plain}</div>
                <div style={{ fontSize: 9, color: "#444444", fontFamily: "monospace", lineHeight: 1.2 }}>{r.scientific}</div>
              </div>
              {/* Bar track (74%) */}
              <div style={{ width: "74%", position: "relative", height: 3 }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${val}%`, background: c.hex, borderRadius: 2,
                  boxShadow: hovered
                    ? `0 0 14px rgba(${c.rgb},0.8), 0 0 4px rgba(${c.rgb},1.0)`
                    : `0 0 8px rgba(${c.rgb},0.6), 0 0 2px rgba(${c.rgb},0.9)`,
                  transition: "width 0.3s ease, box-shadow 150ms ease",
                }} />
              </div>
              {/* Percentage (8%) */}
              <div style={{ width: "8%", textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: c.hex }}>{val}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Band 3: Static timeline (26%) ── */}
      <div style={{
        height: "26%", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)", padding: "12px 20px",
        display: "flex", flexDirection: "column", gap: 8, overflow: "hidden",
      }}>
        {/* Label row */}
        <div style={{ display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#666666", letterSpacing: "0.12em" }}>
            DESIGN {mode.toUpperCase()} PLAYBACK
          </span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#555555" }}>
            {(activeFrame * 4).toFixed(1)}s / 30s
          </span>
        </div>

        {/* Frame thumbnails */}
        <div style={{ display: "flex", gap: 8, flex: 1, minHeight: 0 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const isActive = i === activeFrame;
            const borderColor = FRAME_COLORS[i];
            return (
              <div
                key={i}
                onClick={() => setActiveFrame(i)}
                style={{
                  flex: 1, aspectRatio: "16/10", borderRadius: 3, overflow: "hidden", cursor: "pointer",
                  border: isActive ? `1px solid ${borderColor}` : "none",
                  borderTop: isActive ? undefined : `2px solid ${borderColor}`,
                  boxSizing: "border-box",
                  opacity: mode === "a" ? 1 : 1,
                  transition: "opacity 200ms ease",
                }}
              >
                <div style={{ width: "100%", height: "100%", transition: "opacity 200ms ease" }}>
                  {mode === "a" ? <FrameA variant={i} /> : <FrameB variant={i} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ position: "relative", height: 8, flexShrink: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 3, height: 1, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
          <div style={{ position: "absolute", left: 0, top: 3, height: 1, width: `${fillPct}%`, background: "rgba(74,143,232,0.6)", borderRadius: 1, transition: "width 0.2s ease" }} />
          <div style={{
            position: "absolute", top: 0, width: 8, height: 8, borderRadius: "50%",
            background: "#4A8FE8", left: `calc(${fillPct}% - 4px)`, transition: "left 0.2s ease",
          }} />
        </div>

        {/* Timestamps */}
        <div style={{ display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
          {TIMESTAMPS.map((t, i) => (
            <span key={i} style={{ fontSize: 9, fontFamily: "monospace", color: "#555555", width: "calc(100%/8)", textAlign: "center" }}>{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
