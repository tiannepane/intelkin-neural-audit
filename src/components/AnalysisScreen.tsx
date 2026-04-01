import { useState } from "react";
import Header from "@/components/Header";
import type { ViewMode, ActiveView } from "@/components/Header";
import SummaryView from "@/components/SummaryView";
import AnalysisView from "@/components/AnalysisView";

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
      <Header
        mode={mode}
        onModeChange={setMode}
        activeView={activeView}
        onViewChange={setActiveView}
      />

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
