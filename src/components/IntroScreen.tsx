import { useRef, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

/* ── Funnel geometry (SVG viewBox 340×500) ── */
const VW = 340, VH = 500, CX = VW / 2, GAP = 3;
const WIDTHS = [300, 192, 93, 36, 14];
const SEG_H = (VH - GAP * 3) / 4;

function segPath(i: number): string {
  const topY = i * (SEG_H + GAP), botY = topY + SEG_H;
  const tl = CX - WIDTHS[i] / 2, tr = CX + WIDTHS[i] / 2;
  const bl = CX - WIDTHS[i + 1] / 2, br = CX + WIDTHS[i + 1] / 2;
  const c = SEG_H * 0.42;
  return `M${tl},${topY} L${tr},${topY} C${tr},${topY + c} ${br},${botY - c} ${br},${botY} L${bl},${botY} C${bl},${botY - c} ${tl},${topY + c} ${tl},${topY} Z`;
}

const WAIST_Y = [SEG_H + GAP / 2, 2 * (SEG_H + GAP) - GAP / 2, 3 * (SEG_H + GAP) - GAP / 2];
const DROP_RATES = [0.36, 0.33, 0.19];

function funnelHalfW(y: number): number {
  for (let i = 0; i < 4; i++) {
    const t0 = i * (SEG_H + GAP), t1 = t0 + SEG_H;
    if (y >= t0 && y <= t1) {
      const t = (y - t0) / SEG_H;
      return (WIDTHS[i] * (1 - t) + WIDTHS[i + 1] * t) / 2;
    }
    if (y > t1 && y < t1 + GAP) return WIDTHS[i + 1] / 2;
  }
  return WIDTHS[4] / 2;
}

/* ── Annotation data ──
   Horizontal: funnel right edge = SVG center + halfWidth × (80vh/500)
   Vertical:   viewport-relative values that account for the 48px top bar  */
const ANN_VH_SCALE = 80 / VH; // vh per SVG unit (container = 80vh tall)

const ANNOTATIONS = [
  {
    pct:         "−36%",
    label:       "visual hierarchy",
    explanation: "Users couldn't locate the next action fast enough — visual search overhead predicted drop-off.",
    topVh:       32,
    left:        `calc(50% + ${(WIDTHS[1] / 2 * ANN_VH_SCALE).toFixed(2)}vh)`,
  },
  {
    pct:         "−33%",
    label:       "trust signal missing",
    explanation: "Hesitation at credibility-sensitive moments is the strongest early predictor of abandonment.",
    topVh:       55,
    left:        `calc(50% + ${(WIDTHS[2] / 2 * ANN_VH_SCALE).toFixed(2)}vh)`,
  },
  {
    pct:         "−19%",
    label:       "decision friction",
    explanation: "Competing options without clear hierarchy forced a choice users weren't ready to make.",
    topVh:       72,
    left:        `calc(50% + ${(WIDTHS[3] / 2 * ANN_VH_SCALE).toFixed(2)}vh)`,
  },
];

/* ── Particle animation — 25% speed, 400ms waist pause, particle-triggered annotations ── */
function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onWaistTriggered: (waistIndex: number) => void,
) {
  // Keep callback in a ref so the animation loop always reads the latest version
  const onWaistTriggeredRef = useRef(onWaistTriggered);
  onWaistTriggeredRef.current = onWaistTriggered;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // pauseFrames: remaining frames to hold at waist (~180ms at 60fps = 11 frames)
    interface P {
      x: number; y: number; vy: number; op: number;
      alive: boolean; off: boolean; dx: number;
      cw: boolean[]; pauseFrames: number;
    }

    const ps: P[] = [];
    for (let i = 0; i < 60; i++) {
      ps.push({
        x: CX + (Math.random() - 0.5) * 20,
        y: -Math.random() * 30,
        // 25% of original speed (was 3.0 + rand*2.0)
        vy: (3.0 + Math.random() * 2.0) * 0.25,
        op: 0.5 + Math.random() * 0.3,
        alive: true, off: false, dx: 0,
        cw: [false, false, false],
        pauseFrames: 0,
      });
    }

    let frame = 0;
    const START = 54; // ~0.9s delay at 60fps before particles begin
    let holdDrawn = false;
    let raf: number;

    // Triggered once, never reset — persists for the lifetime of this effect closure
    const waistTriggered = [false, false, false];

    function tick() {
      frame++;
      if (frame < START) { raf = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, VW, VH);

      let anyAlive = false;
      for (const p of ps) {
        if (!p.alive) continue;
        anyAlive = true;

        if (p.pauseFrames > 0) {
          // Holding at waist — just decrement and draw in place
          p.pauseFrames--;
        } else if (p.off) {
          // Ejecting sideways after waist drop
          p.x += p.dx;
          p.op -= 0.04;
          if (p.op <= 0) { p.alive = false; continue; }
        } else {
          // Normal downward travel
          p.y += p.vy;
          p.x += (Math.random() - 0.5) * 0.5;
          const hw = funnelHalfW(p.y);
          p.x = Math.max(CX - hw + 2, Math.min(CX + hw - 2, p.x));

          for (let w = 0; w < 3; w++) {
            if (!p.cw[w] && p.y >= WAIST_Y[w]) {
              p.cw[w] = true;
              // 400ms pause (~24 frames at 60fps)
              p.pauseFrames = 24;
              if (Math.random() < DROP_RATES[w]) {
                p.off = true;
                p.dx = (p.x > CX ? 1 : -1) * (0.8 + Math.random() * 0.6);
              }
            }
          }

          if (p.y >= VH - 15) {
            p.op -= 0.05;
            if (p.op <= 0) { p.alive = false; continue; }
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,143,232,${p.op.toFixed(2)})`;
        ctx.fill();
      }

      // Detection: fire annotation for any waist with >= 3 live particles in its 20px band
      for (let w = 0; w < 3; w++) {
        if (!waistTriggered[w]) {
          let count = 0;
          for (const p of ps) {
            if (p.alive && Math.abs(p.y - WAIST_Y[w]) <= 10) count++;
          }
          if (count >= 3) {
            waistTriggered[w] = true;
            onWaistTriggeredRef.current(w);
          }
        }
      }

      if (anyAlive) {
        raf = requestAnimationFrame(tick);
      } else if (!holdDrawn) {
        holdDrawn = true;
        // Hold dots at tip
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(CX + (Math.random() - 0.5) * 8, VH - 8 + (Math.random() - 0.5) * 6, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(74,143,232,0.2)";
          ctx.fill();
        }
        // Schedule waist pulse lines
        const baseDelay = 200;
        for (let w = 0; w < 3; w++) {
          setTimeout(() => {
            const width = WIDTHS[w + 1];
            let pulseOp = 0;
            let rising = true;
            function pulseTick() {
              ctx.clearRect(0, WAIST_Y[w] - 2, VW, 4);
              if (rising) { pulseOp += 0.04; if (pulseOp >= 0.25) rising = false; }
              else { pulseOp -= 0.03; }
              if (pulseOp > 0) {
                ctx.beginPath();
                ctx.moveTo(CX - width / 2, WAIST_Y[w]);
                ctx.lineTo(CX + width / 2, WAIST_Y[w]);
                ctx.strokeStyle = `rgba(74,143,232,${pulseOp.toFixed(2)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                requestAnimationFrame(pulseTick);
              }
              // Redraw hold dots
              for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(CX - 4 + i * 2, VH - 8 + (i % 2) * 3, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(74,143,232,0.2)";
                ctx.fill();
              }
            }
            requestAnimationFrame(pulseTick);
          }, baseDelay + w * 600);
        }
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef]);
}

/* ── Column 2 copy stack ── */
function CopyStack({ onNext }: { onNext: () => void }) {
  const [tribeHovered, setTribeHovered] = useState(false);
  const [btnHovered,   setBtnHovered]   = useState(false);
  const [btnActive,    setBtnActive]    = useState(false);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 8% 0 6%",
      paddingTop: 48,
      height: "100%",
      boxSizing: "border-box",
    }}>

      {/* Headline */}
      <h1 style={{
        fontSize: 64,
        fontWeight: 300,
        color: "#FFFFFF",
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        margin: 0,
        marginBottom: 20,
        opacity: 0,
        animation: "slideUp 0.5s ease forwards",
        animationDelay: "0.6s",
      }}>
        Read the signal,<br />not the survey.
      </h1>

      {/* Subhead */}
      <p style={{
        fontSize: 17,
        fontWeight: 300,
        color: "#888888",
        lineHeight: 1.5,
        margin: 0,
        marginBottom: 20,
        opacity: 0,
        animation: "fadeOnly 0.4s ease forwards",
        animationDelay: "0.9s",
      }}>
        Neural honesty for product decisions.
      </p>

      {/* TRIBE v2 anchor line */}
      <p style={{
        fontSize: 12,
        fontFamily: "monospace",
        color: "#444444",
        margin: 0,
        marginBottom: 40,
        opacity: 0,
        animation: "fadeOnly 0.4s ease forwards",
        animationDelay: "1.1s",
      }}>
        Built on{" "}
        {/* Anchor span — tooltip positioned relative to this */}
        <span
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={() => setTribeHovered(true)}
          onMouseLeave={() => setTribeHovered(false)}
        >
          <span style={{
            color: "#666666",
            borderBottom: "1px dotted rgba(255,255,255,0.25)",
            cursor: "default",
            letterSpacing: "0.05em",
          }}>
            TRIBE v2
          </span>

          {/* Tooltip */}
          {tribeHovered && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(10,10,10,0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              padding: "14px 16px",
              maxWidth: 240,
              width: "max-content",
              zIndex: 200,
              opacity: 0,
              animation: "fadeOnly 150ms ease forwards",
              pointerEvents: "none",
            }}>
              <div style={{
                fontSize: 11, fontFamily: "monospace", color: "#FFFFFF",
                letterSpacing: "0.1em", marginBottom: 8,
              }}>
                TRIBE v2
              </div>
              <p style={{
                fontSize: 13, color: "#777777", lineHeight: 1.6, margin: 0,
              }}>
                Meta FAIR's open-source neural baseline dataset. 752 brain scans
                across diverse demographics — the research foundation for
                subconscious response mapping.
              </p>
            </div>
          )}
        </span>
        {" "}by Meta FAIR
      </p>

      {/* CTA Button */}
      <div style={{
        opacity: 0,
        animation: "fadeOnly 0.4s ease forwards",
        animationDelay: "2.6s",
        display: "inline-block",
      }}>
        <button
          onClick={onNext}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => { setBtnHovered(false); setBtnActive(false); }}
          onMouseDown={() => setBtnActive(true)}
          onMouseUp={() => setBtnActive(false)}
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.12em",
            background: "transparent",
            border: `1px solid ${btnHovered ? "rgba(74,143,232,0.4)" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 6,
            color: "#FFFFFF",
            height: 48,
            padding: "0 0 0 24px",
            minWidth: 260,
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transform: btnActive ? "scale(0.98)" : "scale(1)",
            transition: "border-color 500ms ease, transform 100ms ease",
          }}
        >
          {/* Label — fades out on hover */}
          <span style={{
            opacity: btnHovered ? 0 : 1,
            transition: "opacity 500ms ease",
            whiteSpace: "nowrap",
          }}>
            START A NEURAL AUDIT
          </span>

          {/* Chevron pill — expands on hover */}
          <div style={{
            position: "absolute",
            right: 4,
            top: 4,
            bottom: 4,
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
      </div>

    </div>
  );
}

/* ── Page ── */
export default function IntroScreen({ onNext }: { onNext: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [triggeredWaists, setTriggeredWaists] = useState<Set<number>>(new Set());

  useParticles(canvasRef, (w) => {
    setTriggeredWaists((prev) => new Set(prev).add(w));
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      height: "100vh",
      overflow: "hidden",
      background: "#000000",
    }}>

      {/* Fixed top bar — transparent, z-index 100 */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: 48, zIndex: 100,
        display: "flex", alignItems: "center",
        padding: "0 32px",
        background: "transparent",
      }}>
        <span style={{ color: "#ffffff", fontSize: 14, fontFamily: "monospace" }}>
          Intelkin
        </span>
      </div>

      {/* Column 1 — 55%, funnel */}
      <div style={{
        width: "55%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8%",
        boxSizing: "border-box",
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Radial atmosphere behind funnel */}
        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 65% at 50% 50%, rgba(74,143,232,0.05) 0%, transparent 70%)",
        }} />

        {/* Funnel container — 80% of column height, vertically centered */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          zIndex: 1,
        }}>
          {/* Funnel SVG */}
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            preserveAspectRatio="xMidYMid meet"
          >
            {[0, 1, 2, 3].map((i) => (
              <g
                key={i}
                style={{
                  opacity: 0,
                  animation: "segmentIn 0.3s ease forwards",
                  animationDelay: `${0.9 + i * 0.12}s`,
                }}
              >
                <path d={segPath(i)} fill="#1A1A1A" />
                <path
                  d={`M${CX - WIDTHS[i] / 2},${i * (SEG_H + GAP)} L${CX + WIDTHS[i] / 2},${i * (SEG_H + GAP)}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>

          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            width={VW}
            height={VH}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

        </div>

        {/* Annotations — positioned in Column 1 using viewport-relative top values */}
        {ANNOTATIONS.map((ann, i) => {
          if (!triggeredWaists.has(i)) return null;
          return (
            <div
              key={i}
              style={{
                position:      "absolute",
                top:           `${ann.topVh}vh`,
                left:          ann.left,
                transform:     "translateY(-50%)",
                display:       "flex",
                alignItems:    "center",
                zIndex:        5,
                pointerEvents: "none",
              }}
            >
              <div style={{
                height:     1,
                width:      0,
                flexShrink: 0,
                background: "rgba(255,255,255,0.15)",
                animation:  "hairlineIn 300ms ease-out forwards",
              }} />
              <div style={{
                marginLeft: 10,
                opacity:    0,
                animation:  "fadeOnly 250ms ease 200ms forwards",
              }}>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: "#4A8FE8", lineHeight: 1.3 }}>
                  {ann.pct}
                </div>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#555555", lineHeight: 1.3 }}>
                  {ann.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Column 2 — 45%, copy stack */}
      <div style={{
        width: "45%",
        height: "100vh",
        flexShrink: 0,
        position: "relative",
      }}>
        <CopyStack onNext={onNext} />
      </div>

    </div>
  );
}
