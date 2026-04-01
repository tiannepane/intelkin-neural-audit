import { useState, useMemo, useCallback, useRef } from "react";
import type { ViewMode } from "./Header";

/* ── Region data ── */
const REGIONS = [
  { scientific: "Visual Cortex",      plain: "Layout Clarity",     idx: 0 },
  { scientific: "Prefrontal Cortex",  plain: "Decision Effort",    idx: 1 },
  { scientific: "Amygdala",           plain: "Emotional Response",  idx: 2 },
  { scientific: "Language Network",   plain: "Content Clarity",     idx: 3 },
  { scientific: "Fusiform Face Area", plain: "Recognition Speed",   idx: 4 },
];

const COLORS: Record<string, { hex: string; rgb: string }> = {
  "Visual Cortex":      { hex: "#EF4444", rgb: "239,68,68"  },
  "Prefrontal Cortex":  { hex: "#F97316", rgb: "249,115,22" },
  "Amygdala":           { hex: "#EAB308", rgb: "234,179,8"  },
  "Language Network":   { hex: "#3B82F6", rgb: "59,130,246" },
  "Fusiform Face Area": { hex: "#A855F7", rgb: "168,85,247" },
};

/* ── Keyframe data [t0,t4,t8,t12,t16,t20,t24,t28] per region ── */
const KF_A = [
  [45,72,78,81,76,70,74,78],[38,55,62,58,65,60,63,62],
  [22,38,45,40,50,42,47,45],[30,48,53,55,51,58,54,53],[40,65,71,74,69,72,68,71],
];
const KF_B = [
  [38,58,64,68,61,65,63,64],[42,65,71,68,74,70,72,71],
  [18,28,33,30,38,35,32,33],[25,40,48,50,45,52,47,48],[35,52,58,62,55,60,57,58],
];

const CHURN_A = [
  "Users scanned the layout fast. Low visual search effort means they found the CTA before friction could cause drop-off.",
  "Moderate decision load at key moments. Users are deliberating, which is healthy unless it appears at commitment steps.",
  "Low stress response throughout. Users felt safe enough to continue without hesitation.",
  "Copy required moderate processing effort. Simpler sentence structure at key moments would reduce cognitive overhead.",
  "Strong recognition response. Brand elements and human imagery are landing and building familiarity.",
];
const CHURN_B = [
  "Users took longer to orient. Extended scanning at this stage predicts a higher bounce rate before the first meaningful interaction.",
  "Slightly elevated decision effort. This can signal higher perceived value, but watch for drop-off at checkout or sign-up stages.",
  "Reduced stress signal compared to A. Trust was established faster, which correlates with lower abandonment at trust-sensitive steps.",
  "Marginally lower processing effort. Small gains here compound across longer sessions.",
  "Weaker recognition signal. Consider adding more human imagery or brand anchors at this stage.",
];

function lerp(kf: number[], t: number): number {
  const idx = Math.min(6, Math.max(0, Math.floor(t / 4)));
  const frac = (t - idx * 4) / 4;
  return kf[idx] * (1 - frac) + kf[Math.min(7, idx + 1)] * frac;
}

function riskBadge(v: number) {
  if (v > 65) return { text: "LOW RISK",    bg: "rgba(34,197,94,0.1)",  color: "#22C55E" };
  if (v >= 40) return { text: "MEDIUM RISK", bg: "rgba(234,179,8,0.1)",  color: "#EAB308" };
  return { text: "HIGH RISK",   bg: "rgba(239,68,68,0.1)", color: "#EF4444" };
}

/* ── Frame thumbnails (reused from SummaryView) ── */
function FrameA({ variant }: { variant: number }) {
  const s = 14 + (variant % 3) * 8, w = 6 + (variant % 4);
  return (
    <svg viewBox="0 0 80 50" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="80" height="50" fill="#F8F8F8" /><rect width="80" height="7" fill="#E0E0E0" />
      <rect y="7" width="18" height="43" fill="#EBEBEB" />
      <rect x="22" y={s} width="24" height="10" rx="1" fill="#D8D8D8" />
      <rect x="50" y={s+4} width="20" height="8" rx="1" fill="#D8D8D8" />
      <rect x={80-w-4} y="2" width={w} height="3" rx="1" fill="#EF4444" />
    </svg>
  );
}
function FrameB({ variant }: { variant: number }) {
  const hi = variant % 3;
  return (
    <svg viewBox="0 0 80 50" width="100%" height="100%" preserveAspectRatio="none">
      <rect width="80" height="50" fill="#F4F4F4" /><rect width="80" height="8" fill="#1A1A2E" />
      {[0,1,2].map(c=>(
        <g key={c}><rect x={4+c*26} y="12" width="22" height="16" rx="1" fill="#FFF" stroke="#E0E0E0" strokeWidth="0.5"/>
          <rect x={4+c*26} y="12" width="22" height="3" rx="1" fill={c===hi?"#3B82F6":"#C8D4E8"}/>
          <rect x={6+c*26} y="18" width="14" height="2" rx="0.5" fill="#E0E0E0"/>
          <rect x={6+c*26} y="22" width="10" height="2" rx="0.5" fill="#ECECEC"/></g>
      ))}
    </svg>
  );
}

const FRAME_COLORS=["#8B5CF6","#06B6D4","#EF4444","#F97316","#4A8FE8","#8B5CF6","#06B6D4","#EF4444"];
const TIMESTAMPS=["00:00","00:04","00:08","00:12","00:16","00:20","00:24","00:28"];
const COG_A=61.8, COG_B=54.8;

/* ── Report modal ── */
function ReportModal({content,onClose}:{content:string;onClose:()=>void}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24,boxSizing:"border-box"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="glass-card" style={{width:"100%",maxWidth:680,maxHeight:"80vh",display:"flex",flexDirection:"column",padding:0,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
          <span style={{fontSize:11,fontFamily:"monospace",color:"#555",letterSpacing:"0.15em",textTransform:"uppercase"}}>Neural Audit Report</span>
          <button onClick={onClose} style={{background:"transparent",border:"none",cursor:"pointer",color:"#666",fontSize:18,lineHeight:1,padding:"2px 6px",borderRadius:2}}
            onMouseEnter={e=>{e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.color="#666"}}>×</button>
        </div>
        <div className="region-bars-scroll" style={{flex:1,overflowY:"auto",padding:24}}>
          <pre style={{margin:0,fontSize:13,color:"#CCC",lineHeight:1.75,fontFamily:"inherit",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{content}</pre>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AnalysisView({ mode }: { mode: ViewMode }) {
  const [currentTime, setCurrentTime] = useState(8);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const dragging = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);

  const activeFrame = Math.min(7, Math.max(0, Math.round(currentTime / 4)));
  const fillPct = (currentTime / 28) * 100;
  const kf = mode === "a" ? KF_A : KF_B;
  const churn = mode === "a" ? CHURN_A : CHURN_B;

  const vals = useMemo(() => REGIONS.map(r => Math.round(lerp(kf[r.idx], currentTime))), [kf, currentTime]);

  const handleScrub = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setCurrentTime(Math.round(pct * 28 * 10) / 10);
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY ?? "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, messages: [{ role: "user", content: `Generate a professional neural audit report.\n\nREGION DATA at t=${currentTime.toFixed(1)}s:\n${REGIONS.map((r,i)=>`- ${r.plain} (${r.scientific}): A=${Math.round(lerp(KF_A[i],currentTime))}%, B=${Math.round(lerp(KF_B[i],currentTime))}%`).join("\n")}\n\nCOGNITIVE LOAD: A=${COG_A}, B=${COG_B}\nMETHODOLOGY: TRIBE v2, 752 Meta FAIR baseline scans\n\nWrite: Executive Summary, Key Findings, Design Recommendations, Next Steps. Plain text only.` }] }),
      });
      if (!res.ok) { const e = await res.json().catch(()=>({error:{message:`HTTP ${res.status}`}})); throw new Error(e?.error?.message ?? `HTTP ${res.status}`); }
      const data = await res.json();
      setReport(data.content[0].text); setModalOpen(true);
    } catch (err) {
      setReport(`Report generation failed.\n\n${err instanceof Error ? err.message : "Unknown error"}\n\nEnsure VITE_ANTHROPIC_API_KEY is set in your .env file.`);
      setModalOpen(true);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

        {/* Band 1: Churn analysis + Report panel (65%) */}
        <div style={{ height: "65%", display: "flex", flexDirection: "row", overflow: "hidden" }}>

          {/* Column 1: Churn cards (60%) */}
          <div className="region-bars-scroll" style={{ width: "60%", height: "100%", overflowY: "auto", padding: "20px 20px 20px 24px", boxSizing: "border-box" }}>
            <p style={{ fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, marginBottom: 16 }}>
              Churn Risk by Neural Signal
            </p>
            {REGIONS.map((r, i) => {
              const v = vals[i];
              const c = COLORS[r.scientific] ?? { hex: "#4A8FE8", rgb: "74,143,232" };
              const risk = riskBadge(v);
              return (
                <div key={r.scientific} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: 14, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 14, color: "#FFF", display: "block", lineHeight: 1.3 }}>{r.plain}</span>
                      <span style={{ fontSize: 10, color: "#333", fontFamily: "monospace", lineHeight: 1.3 }}>{r.scientific}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ fontSize: 9, fontFamily: "monospace", borderRadius: 2, padding: "2px 6px", background: risk.bg, color: risk.color }}>{risk.text}</span>
                      <span style={{ fontSize: 13, fontFamily: "monospace", color: c.hex }}>{v}%</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ position: "relative", height: 3, marginTop: 10, borderRadius: 2 }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v}%`, background: c.hex, borderRadius: 2, boxShadow: `0 0 8px rgba(${c.rgb},0.6), 0 0 2px rgba(${c.rgb},0.9)`, transition: "width 0.15s ease" }} />
                  </div>
                  <p style={{ margin: 0, marginTop: 10, fontSize: 13, color: "#777", lineHeight: 1.6 }}>{churn[i]}</p>
                </div>
              );
            })}
          </div>

          {/* Column 2: Report panel (40%) */}
          <div style={{ width: "40%", height: "100%", overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "#000", display: "flex", flexDirection: "column", padding: "20px 24px", gap: 20, boxSizing: "border-box" }}>
            {/* Cognitive load */}
            <div style={{ flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, marginBottom: 14 }}>Cognitive Load Score</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline" }}><span style={{ fontSize: 11, fontFamily: "monospace", color: "#444", marginRight: 6 }}>A</span><span style={{ fontSize: 48, fontWeight: 300, lineHeight: 1, color: "#FFF" }}>{COG_A}</span></div>
                <div style={{ display: "flex", alignItems: "baseline" }}><span style={{ fontSize: 11, fontFamily: "monospace", color: "#444", marginRight: 6 }}>B</span><span style={{ fontSize: 48, fontWeight: 300, lineHeight: 1, color: "#FFF" }}>{COG_B}</span></div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }} />
            {/* Audit confidence */}
            <div style={{ flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontFamily: "monospace", color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, marginBottom: 10 }}>Audit Confidence</p>
              <p style={{ fontSize: 18, fontWeight: 300, color: "#FFF", margin: 0 }}>High confidence</p>
              <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: 0, marginTop: 8 }}>Based on 752 Meta FAIR baseline scans. Neural response patterns validated across a diverse demographic sample.</p>
            </div>
            {/* Session metadata */}
            <div style={{ flexShrink: 0 }}>
              {[["Audit date","April 1 2026"],["Design A","upload_a.mp4"],["Design B","upload_b.mp4"],["Duration","30s, 8 frames"]].map(([l,v])=>(
                <div key={l} style={{ display: "flex", gap: 16, lineHeight: 1.8 }}>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#333", width: 80, flexShrink: 0 }}>{l}</span>
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "#666" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }} />
            {/* Generate report */}
            <div style={{ marginTop: "auto", flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
              <button onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
                onClick={generateReport} disabled={loading}
                style={{ minWidth: 180, padding: "10px 20px", background: btnHover ? "rgba(74,143,232,0.06)" : "transparent", border: btnHover ? "1px solid rgba(74,143,232,0.6)" : "1px solid rgba(74,143,232,0.35)", borderRadius: 4, color: "#4A8FE8", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "background 150ms ease, border-color 150ms ease", animation: loading ? "pulse 1.5s ease-in-out infinite" : "none" }}>
                {loading ? "Generating..." : "Generate report"}
              </button>
            </div>
          </div>
        </div>

        {/* Band 2: Interactive timeline (35%) */}
        <div style={{ height: "35%", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
          {/* Label row */}
          <div style={{ display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#666", letterSpacing: "0.12em" }}>DESIGN {mode.toUpperCase()} PLAYBACK</span>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#555" }}>{currentTime.toFixed(1)}s / 30s</span>
          </div>

          {/* Frame thumbnails */}
          <div style={{ display: "flex", gap: 8, flex: 1, minHeight: 0 }}>
            {Array.from({ length: 8 }, (_, i) => {
              const isActive = i === activeFrame;
              const bc = FRAME_COLORS[i];
              return (
                <div key={i} onClick={() => setCurrentTime(i * 4)}
                  style={{ flex: 1, aspectRatio: "16/10", borderRadius: 3, overflow: "hidden", cursor: "pointer", border: isActive ? `1px solid ${bc}` : "none", borderTop: isActive ? undefined : `2px solid ${bc}`, boxSizing: "border-box", background: isActive ? "rgba(255,255,255,0.06)" : "transparent", transition: "opacity 200ms ease" }}>
                  <div style={{ width: "100%", height: "100%" }}>{mode === "a" ? <FrameA variant={i} /> : <FrameB variant={i} />}</div>
                </div>
              );
            })}
          </div>

          {/* Scrubber */}
          <div ref={barRef} style={{ position: "relative", height: 12, flexShrink: 0, cursor: "pointer" }}
            onMouseDown={e => { dragging.current = true; handleScrub(e.clientX); }}
            onMouseMove={e => { if (dragging.current) handleScrub(e.clientX); }}
            onMouseUp={() => { dragging.current = false; }}
            onMouseLeave={() => { dragging.current = false; }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 5, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: 0, top: 5, height: 2, width: `${fillPct}%`, background: "rgba(74,143,232,0.6)", borderRadius: 2, transition: dragging.current ? "none" : "width 0.15s ease" }} />
            <div style={{ position: "absolute", top: 0, width: 12, height: 12, borderRadius: "50%", background: "#4A8FE8", left: `calc(${fillPct}% - 6px)`, cursor: "grab", transition: dragging.current ? "none" : "left 0.15s ease" }} />
          </div>

          {/* Timestamps */}
          <div style={{ display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
            {TIMESTAMPS.map((t, i) => <span key={i} style={{ fontSize: 9, fontFamily: "monospace", color: "#555", width: "calc(100%/8)", textAlign: "center" }}>{t}</span>)}
          </div>
        </div>
      </div>

      {modalOpen && report && <ReportModal content={report} onClose={() => setModalOpen(false)} />}
      <style>{`@keyframes pulse { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }`}</style>
    </>
  );
}
