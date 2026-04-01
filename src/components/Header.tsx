export type ViewMode = "a" | "b";
export type ActiveView = "summary" | "analysis";

const TopBar = () => (
  <div
    style={{
      height: 48,
      width: "100%",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      background: "transparent",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
    }}
  >
    <span
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#FFFFFF",
        fontFamily: "sans-serif",
        letterSpacing: "-0.01em",
      }}
    >
      Intelkin
    </span>
  </div>
);

export default TopBar;
