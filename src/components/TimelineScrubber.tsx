import { useState } from "react";

const DURATION = 30; // seconds
const TICK_INTERVAL = 5;

const TimelineScrubber = () => {
  const [position, setPosition] = useState(0);
  const ticks = Array.from({ length: Math.floor(DURATION / TICK_INTERVAL) + 1 }, (_, i) => i * TICK_INTERVAL);

  return (
    <div className="border-t border-border bg-card px-6 py-4">
      <div className="flex gap-4 mb-3">
        <div className="flex-1 h-10 bg-muted flex items-center justify-center">
          <span className="text-xs font-mono text-muted-foreground">Design A — frames</span>
        </div>
        <div className="flex-1 h-10 bg-muted flex items-center justify-center">
          <span className="text-xs font-mono text-muted-foreground">Design B — frames</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={DURATION}
          step={0.1}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="w-full h-1 bg-muted appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        />
        <div className="flex justify-between mt-1">
          {ticks.map((t) => (
            <span key={t} className="text-[10px] font-mono text-muted-foreground">
              {String(Math.floor(t / 60)).padStart(2, "0")}:{String(t % 60).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 text-right">
        <span className="text-xs font-mono text-muted-foreground">
          {position.toFixed(1)}s / {DURATION}s
        </span>
      </div>
    </div>
  );
};

export default TimelineScrubber;
