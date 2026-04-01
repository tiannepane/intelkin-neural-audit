import { useState } from "react";
import TopBar from "@/components/Header";
import type { ViewMode, ActiveView } from "@/components/Header";
import SummaryView from "@/components/SummaryView";
import AnalysisView from "@/components/AnalysisView";

const modes: { id: ViewMode; label: string }[] = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
];

const views: { id: ActiveView; label: string }[] = [
  { id: "summary", label: "SUMMARY" },
  { id: "analysis", label: "ANALYSIS" },
];

export default function AnalysisScreen() {
  const [activeView, setActiveView]       = useState<ActiveView>("summary");
  const [mode, setMode]                   = useState<ViewMode>("a");
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [openRegions, setOpenRegions]     = useState<Set<string>>(new Set());

  return (
    <div
      className="page-fade-enter"
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#000000",
      }}
    >
      {/* Fixed top bar */}
      <TopBar />

      {/* Controls bar below the fixed top bar */}
      <div
        style={{
          height: 44,
          marginTop: 48,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* A / B switcher */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4, padding: 4, gap: 2,
        }}>
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em",
                padding: "6px 24px", borderRadius: 3, border: "none", cursor: "pointer",
                transition: "all 150ms ease",
                background: mode === m.id ? "#4A8FE8" : "transparent",
                color: mode === m.id ? "#FFFFFF" : "#555555",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Summary / Analysis toggle */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4, padding: 4,
        }}>
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em",
                padding: "6px 16px", borderRadius: 2, border: "none", cursor: "pointer",
                transition: "background 150ms ease, color 150ms ease",
                background: activeView === v.id ? "rgba(255,255,255,0.08)" : "transparent",
                color: activeView === v.id ? "#FFFFFF" : "#666666",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* View container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          opacity: activeView === "summary" ? 1 : 0,
          transition: "opacity 200ms ease",
          pointerEvents: activeView === "summary" ? "auto" : "none",
        }}>
          <SummaryView
            mode={mode}
            hoveredRegion={hoveredRegion}
            setHoveredRegion={setHoveredRegion}
            openRegions={openRegions}
            setOpenRegions={setOpenRegions}
            onSwitchToAnalysis={() => setActiveView("analysis")}
          />
        </div>

        <div style={{
          position: "absolute", width: "100%", height: "100%",
          opacity: activeView === "analysis" ? 1 : 0,
          transition: "opacity 200ms ease",
          pointerEvents: activeView === "analysis" ? "auto" : "none",
        }}>
          <AnalysisView mode={mode} />
        </div>
      </div>
    </div>
  );
}
