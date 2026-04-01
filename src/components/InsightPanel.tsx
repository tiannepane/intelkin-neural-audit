import { useState } from "react";
import type { ViewMode } from "./Header";

const COG_A = 61.8;
const COG_B = 54.8;
const BLUE = "#4A8FE8";

const Divider = () => (
  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "20px 0", flexShrink: 0 }} />
);

export default function InsightPanel({ mode }: { mode: ViewMode }) {
  const [btnHover, setBtnHover] = useState(false);

  const aColor = mode === "a" ? "#FFFFFF" : "#444444";
  const bColor = mode === "b" ? "#FFFFFF" : "#444444";

  return (
    <div style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Static recommendation */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#666666", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
          Audit Recommendation
        </p>
        <p style={{ fontSize: 22, fontWeight: 300, color: "#ffffff", lineHeight: 1.4, marginBottom: 10 }}>
          Design A processes layout and recognition faster. Design B reduces friction where users decide whether to trust you. For conversion-focused flows, B has the edge.
        </p>
        <p style={{ fontSize: 12, color: "#777777", fontStyle: "italic", lineHeight: 1.5 }}>
          Neural data frequently contradicts self-reported preference. This gap is what TRIBE v2 measures.
        </p>
      </div>

      <Divider />

      {/* Cognitive Load Score */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#777777", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Cognitive Load Score
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, transition: "opacity 0.3s ease" }}>
            <span style={{ fontSize: 13, color: "#666666" }}>A</span>
            <span style={{ fontSize: 36, fontFamily: "monospace", fontWeight: 700, lineHeight: 1, color: aColor, transition: "color 0.3s ease" }}>{COG_A}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, transition: "opacity 0.3s ease" }}>
            <span style={{ fontSize: 13, color: "#666666" }}>B</span>
            <span style={{ fontSize: 36, fontFamily: "monospace", fontWeight: 700, lineHeight: 1, color: bColor, transition: "color 0.3s ease" }}>{COG_B}</span>
          </div>
        </div>
      </div>

      <Divider />

      <div style={{ flexShrink: 0 }}>
        <button
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            width: "100%", padding: "12px",
            background: btnHover ? "rgba(74,143,232,0.06)" : "transparent",
            border: btnHover ? `1px solid rgba(74,143,232,0.4)` : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2, color: btnHover ? BLUE : "#666666",
            fontFamily: "monospace", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer",
            transition: "border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
          }}
        >
          Generate report
        </button>
      </div>
    </div>
  );
}
