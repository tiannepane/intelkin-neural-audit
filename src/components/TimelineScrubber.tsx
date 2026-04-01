import { useState } from "react";
import type { ViewMode } from "./Header";

const DURATION    = 30;
const FRAME_COUNT = 10;
const frames = Array.from({ length: FRAME_COUNT }, (_, i) => ({
  index: i + 1,
  time: ((i / (FRAME_COUNT - 1)) * DURATION).toFixed(1),
}));
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* Cycling 5-color palette — timeline thumbnails only */
const PALETTE = ["#8B5CF6", "#06B6D4", "#EF4444", "#F97316", "#4A8FE8"];

const TimelineScrubber = ({ mode }: { mode: ViewMode }) => {
  const [position,   setPosition]   = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeIdx = Math.round((position / DURATION) * (FRAME_COUNT - 1));
  const fillPct   = (position / DURATION) * 100;

  const label = `DESIGN ${mode.toUpperCase()} PLAYBACK`;

  return (
    <div className="h-full flex flex-col justify-center">
      {/* Top row: label + time counter */}
      <div className="flex items-center justify-between mb-2">
        <p
          className="font-mono uppercase"
          style={{ fontSize: 11, color: "#888888", letterSpacing: "0.12em" }}
        >
          {label}
        </p>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#777777" }}>
          {position.toFixed(1)}s / {DURATION}s
        </span>
      </div>

      {/* Frame thumbnails */}
      <div className="flex gap-1 mb-3">
        {frames.map((f, idx) => {
          const color    = PALETTE[idx % PALETTE.length];
          const isActive = idx === activeIdx;

          return (
            <div
              key={f.index}
              className="flex-1 flex flex-col items-center gap-0.5 min-w-0"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className="w-full aspect-[2/1] rounded-sm"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.06)"
                    : hoveredIdx === idx
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: isActive
                    ? `1px solid ${color}`
                    : "none",
                  borderTop: isActive ? undefined : `3px solid ${color}`,
                  transition: "background 150ms ease",
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{ fontFamily: "monospace", fontSize: 10, color: "#777777", lineHeight: 1 }}
              >
                {fmt(Number(f.time))}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={DURATION}
        step={0.1}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="w-full appearance-none cursor-pointer rounded-sm"
        style={{
          height: 2,
          background: `linear-gradient(to right,
            rgba(74,143,232,0.6) 0%,
            rgba(74,143,232,0.6) ${fillPct}%,
            rgba(255,255,255,0.08) ${fillPct}%,
            rgba(255,255,255,0.08) 100%)`,
        }}
        ref={(el) => {
          if (el && !el.parentElement?.querySelector("style[data-scrub]")) {
            const s = document.createElement("style");
            s.setAttribute("data-scrub", "");
            s.textContent = `
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 10px; height: 10px;
                border-radius: 50%;
                background: #4A8FE8;
                cursor: grab;
              }
              input[type=range]::-webkit-slider-thumb:active { cursor: grabbing; }
            `;
            el.parentElement?.appendChild(s);
          }
        }}
      />
    </div>
  );
};

export default TimelineScrubber;
