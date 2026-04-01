export type ViewMode = "a" | "b";
export type ActiveView = "summary" | "analysis";

interface HeaderProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const modes: { id: ViewMode; label: string }[] = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
];

const views: { id: ActiveView; label: string }[] = [
  { id: "summary", label: "SUMMARY" },
  { id: "analysis", label: "ANALYSIS" },
];

const Header = ({ mode, onModeChange, activeView, onViewChange }: HeaderProps) => (
  <header
    className="flex items-center justify-between px-6 shrink-0"
    style={{ height: "48px", borderBottom: "1px solid #1A1A1A" }}
  >
    <span className="text-white font-semibold text-xl tracking-tight">
      Intelkin
    </span>

    {/* Center: A / B switcher */}
    <div style={{
      display: "flex",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 4,
      padding: 4,
      gap: 2,
    }}>
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "6px 24px",
            borderRadius: 3,
            border: "none",
            cursor: "pointer",
            transition: "all 150ms ease",
            background: mode === m.id ? "#4A8FE8" : "transparent",
            color: mode === m.id ? "#FFFFFF" : "#555555",
          }}
        >
          {m.label}
        </button>
      ))}
    </div>

    {/* Right: Summary / Analysis toggle */}
    <div style={{
      display: "flex",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 4,
      padding: 4,
    }}>
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => onViewChange(v.id)}
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "6px 16px",
            borderRadius: 2,
            border: "none",
            cursor: "pointer",
            transition: "background 150ms ease, color 150ms ease",
            background: activeView === v.id ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeView === v.id ? "#FFFFFF" : "#666666",
          }}
        >
          {v.label}
        </button>
      ))}
    </div>
  </header>
);

export default Header;
