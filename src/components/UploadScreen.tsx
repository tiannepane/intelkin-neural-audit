import { useState, useEffect, useRef } from "react";
import { Upload, ChevronRight } from "lucide-react";
import GhostBrain from "./GhostBrain";

type AuditMode = "ab" | "single" | null;
interface DemoFile { name: string; size: string; }

/* ── Drop zone (demo-driven) ── */
function DropZone({
  label,
  demoFile,
  hovered,
  zoneRef,
}: {
  label: string;
  demoFile: DemoFile | null;
  hovered: boolean;
  zoneRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex-1 max-w-[280px]">
      <p
        className="font-mono mb-2 text-center"
        style={{ fontSize: 11, letterSpacing: "0.1em", color: "#666666" }}
      >
        {label}
      </p>
      <div
        ref={zoneRef}
        className="h-[140px] flex flex-col items-center justify-center gap-2 relative"
        style={{
          border: demoFile
            ? "1px dashed rgba(74,143,232,0.35)"
            : hovered
            ? "1px dashed rgba(74,143,232,0.4)"
            : "1px dashed rgba(255,255,255,0.15)",
          background: demoFile || hovered
            ? "rgba(74,143,232,0.03)"
            : "rgba(255,255,255,0.03)",
          borderRadius: "4px",
          transition: "border-color 300ms ease, background 300ms ease",
        }}
      >
        {demoFile ? (
          <>
            {/* Checkmark badge top-right */}
            <div style={{
              position: "absolute", top: 8, right: 8,
              width: 16, height: 16, borderRadius: "50%",
              background: "#4A8FE8", color: "#FFFFFF",
              fontSize: 10, display: "grid", placeItems: "center",
            }}>
              ✓
            </div>

            {/* Video preview card */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 3,
              width: "80%",
              aspectRatio: "16/9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}>
              {/* CSS triangle play icon */}
              <div style={{
                width: 0, height: 0,
                borderStyle: "solid",
                borderWidth: "5px 0 5px 9px",
                borderColor: "transparent transparent transparent #4A8FE8",
                marginBottom: 2,
              }} />
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#777777" }}>
                {demoFile.name}
              </span>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: "#444444" }}>
                {demoFile.size}
              </span>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" style={{ color: "#555555" }} />
            <span className="font-mono" style={{ fontSize: 13, color: "#777777" }}>
              Drop any file
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Mode card (demo-driven, no user interaction) ── */
function ModeCard({
  title,
  description,
  selected,
  hovered,
  clicking,
  cardRef,
}: {
  title: string;
  description: string;
  selected: boolean;
  hovered: boolean;
  clicking: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
}) {
  const borderColor = selected ? "#4A8FE8" : hovered ? "rgba(255,255,255,0.2)" : "#2A2A2A";
  const boxShadow   = selected ? "0 0 24px rgba(74,143,232,0.08)" : "none";

  return (
    <div
      ref={cardRef}
      className="flex-1 max-w-[280px] text-left p-7 relative"
      style={{
        border: `1px solid ${borderColor}`,
        background: "transparent",
        borderRadius: "2px",
        boxShadow,
        transform: clicking ? "scale(0.98)" : "scale(1)",
        transition: "border-color 300ms ease, box-shadow 300ms ease, transform 120ms ease",
      }}
    >
      {selected && (
        <div
          className="absolute top-3 right-3 rounded-full"
          style={{ background: "#4A8FE8", width: 8, height: 8 }}
        />
      )}
      <h3 className="text-[18px] text-white mb-2">{title}</h3>
      <p className="text-[14px] leading-[1.6]" style={{ color: "#666" }}>
        {description}
      </p>
    </div>
  );
}

/* ── Page 2 — demo auto-plays on mount ── */
export default function UploadScreen({ onNext }: { onNext: () => void }) {
  const [mode, setMode]                   = useState<AuditMode>(null);
  const [hoveredCard, setHoveredCard]     = useState<"ab" | "single" | null>(null);
  const [clickingCard, setClickingCard]   = useState<"ab" | "single" | null>(null);
  const [demoFileA, setDemoFileA]         = useState<DemoFile | null>(null);
  const [demoFileB, setDemoFileB]         = useState<DemoFile | null>(null);
  const [hoveredZone, setHoveredZone]     = useState<"a" | "b" | null>(null);
  const [showRunButton, setShowRunButton] = useState(false);
  const [btnHovered, setBtnHovered]       = useState(false);
  const [btnClicking, setBtnClicking]     = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos]         = useState({ x: 0, y: 0 });

  const abCardRef     = useRef<HTMLDivElement>(null);
  const singleCardRef = useRef<HTMLDivElement>(null);
  const zoneARef      = useRef<HTMLDivElement>(null);
  const zoneBRef      = useRef<HTMLDivElement>(null);
  const runBtnRef     = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const s = (fn: () => void, ms: number) => { const id = setTimeout(fn, ms); ids.push(id); };

    const moveTo = (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setCursorPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };

    // Step 2 — 1.0s: cursor appears at screen center
    s(() => {
      setCursorPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setCursorVisible(true);
    }, 1000);

    // Step 3 — 1.4s: move to Single Audit + hover
    s(() => { moveTo(singleCardRef); setHoveredCard("single"); }, 1400);

    // Step 4 — 2.0s: click Single Audit
    s(() => {
      setClickingCard("single");
      setTimeout(() => setClickingCard(null), 120);
      setMode("single");
      setHoveredCard(null);
    }, 2000);

    // Step 5 — 3.2s: move to A/B Test + hover
    s(() => { moveTo(abCardRef); setHoveredCard("ab"); }, 3200);

    // Step 6 — 3.8s: click A/B Test
    s(() => {
      setClickingCard("ab");
      setTimeout(() => setClickingCard(null), 120);
      setMode("ab");
      setHoveredCard(null);
    }, 3800);

    // Step 7 — 4.8s: move to Design A zone + hover
    s(() => { moveTo(zoneARef); setHoveredZone("a"); }, 4800);

    // Step 8 — 5.4s: drop file into Design A
    s(() => { setHoveredZone(null); setDemoFileA({ name: "design_a.mp4", size: "24.3 MB" }); }, 5400);

    // Step 9 — 6.6s: move to Design B zone + hover
    s(() => { moveTo(zoneBRef); setHoveredZone("b"); }, 6600);

    // Step 10 — 7.2s: drop file into Design B
    s(() => { setHoveredZone(null); setDemoFileB({ name: "design_b.mp4", size: "31.7 MB" }); }, 7200);

    // Step 11 — 8.4s: show run button
    s(() => { setShowRunButton(true); }, 8400);

    // 8.8s: move cursor to run button (400ms after it renders)
    s(() => { moveTo(runBtnRef); setBtnHovered(true); }, 8800);

    // Step 12 — 9.6s: click run button → navigate
    s(() => {
      setBtnClicking(true);
      setBtnHovered(false);
      setTimeout(() => { setCursorVisible(false); onNext(); }, 300);
    }, 9600);

    return () => ids.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-screen flex flex-col bg-black relative overflow-hidden">
      <GhostBrain />

      {/* Simulated cursor dot */}
      {cursorVisible && (
        <div style={{
          position: "fixed",
          left: cursorPos.x - 6,
          top: cursorPos.y - 6,
          width: 12, height: 12,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.7)",
          boxShadow: "0 0 8px rgba(255,255,255,0.4)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "left 400ms cubic-bezier(0.25,0.1,0.25,1), top 400ms cubic-bezier(0.25,0.1,0.25,1)",
        }} />
      )}

      {/* Top bar */}
      <div className="flex items-center px-6 py-4 shrink-0 relative z-10">
        <span className="text-white font-semibold text-xl tracking-tight">Intelkin</span>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-[640px] w-full px-6 text-center">

          <p className="font-mono uppercase mb-5"
            style={{ fontSize: 11, letterSpacing: "0.15em", color: "#4A8FE8" }}>
            Select Mode
          </p>

          <h2 className="text-[28px] font-light text-white leading-[1.3] mb-10">
            How would you like to run this audit?
          </h2>

          {/* Mode cards */}
          <div className="flex gap-6 justify-center mb-8">
            <ModeCard
              title="A/B Test"
              description="Compare two designs against each other. See which one creates less cognitive friction across every measured region."
              selected={mode === "ab"}
              hovered={hoveredCard === "ab"}
              clicking={clickingCard === "ab"}
              cardRef={abCardRef}
            />
            <ModeCard
              title="Single Audit"
              description="Analyze one design on its own. Get a full neural breakdown of where attention goes and where friction builds."
              selected={mode === "single"}
              hovered={hoveredCard === "single"}
              clicking={clickingCard === "single"}
              cardRef={singleCardRef}
            />
          </div>

          {/* Upload zones */}
          {mode && (
            <div className="page-fade-enter">
              <div className="flex gap-6 justify-center mb-3">
                <DropZone
                  label={mode === "ab" ? "Design A" : "Your Design"}
                  demoFile={demoFileA}
                  hovered={hoveredZone === "a"}
                  zoneRef={zoneARef}
                />
                {mode === "ab" && (
                  <DropZone
                    label="Design B"
                    demoFile={demoFileB}
                    hovered={hoveredZone === "b"}
                    zoneRef={zoneBRef}
                  />
                )}
              </div>

              <p className="font-mono mb-8"
                style={{ fontSize: 11, letterSpacing: "0.08em", color: "#666666" }}>
                Max 60s · MP4, MOV, PNG, PDF · Under 500MB
              </p>

              {/* Run Audit button */}
              <div className="h-16 flex items-center justify-center">
                {showRunButton && (
                  <button
                    ref={runBtnRef}
                    onClick={onNext}
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => { setBtnHovered(false); setBtnClicking(false); }}
                    onMouseDown={() => setBtnClicking(true)}
                    onMouseUp={() => setBtnClicking(false)}
                    className="page-fade-enter font-mono"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.12em",
                      background: "transparent",
                      border: btnHovered
                        ? "1px solid rgba(74,143,232,0.4)"
                        : "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 6,
                      color: "#FFFFFF",
                      height: 48,
                      padding: "0 0 0 24px",
                      minWidth: 220,
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      transform: btnClicking ? "scale(0.98)" : "scale(1)",
                      transition: "border-color 500ms ease, transform 100ms ease",
                    }}
                  >
                    <span style={{
                      opacity: btnHovered ? 0 : 1,
                      transition: "opacity 500ms ease",
                      whiteSpace: "nowrap",
                    }}>
                      RUN AUDIT
                    </span>
                    <div style={{
                      position: "absolute",
                      right: 4, top: 4, bottom: 4,
                      width: btnHovered ? "calc(100% - 8px)" : "20%",
                      background: "rgba(74,143,232,0.15)",
                      borderRadius: 4,
                      display: "grid",
                      placeItems: "center",
                      transition: "width 500ms ease",
                    }}>
                      <ChevronRight size={16} color="#4A8FE8" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
