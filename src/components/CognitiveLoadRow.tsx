import type { ViewMode } from "./Header";

const CognitiveLoadRow = ({ mode }: { mode: ViewMode }) => (
  <div className="flex items-center gap-8 w-full">
    <p className="font-mono text-[11px] uppercase shrink-0" style={{ color: "#666", letterSpacing: "0.12em" }}>
      Cognitive Load Score
    </p>
    <div className="flex items-baseline gap-8">
      <div className="flex items-baseline gap-2" style={{ transition: "opacity 0.3s", opacity: mode === "b" ? 0.35 : 1 }}>
        <span className="text-[13px]" style={{ color: "#666" }}>A</span>
        <span className="text-3xl font-mono font-bold leading-none" style={{ color: mode === "a" ? "#FFFFFF" : "#444444", transition: "color 0.3s" }}>61.8</span>
      </div>
      <div className="flex items-baseline gap-2" style={{ transition: "opacity 0.3s", opacity: mode === "a" ? 0.35 : 1 }}>
        <span className="text-[13px]" style={{ color: "#666" }}>B</span>
        <span className="text-3xl font-mono font-bold leading-none" style={{ color: mode === "b" ? "#FFFFFF" : "#444444", transition: "color 0.3s" }}>54.8</span>
      </div>
    </div>
  </div>
);

export default CognitiveLoadRow;
