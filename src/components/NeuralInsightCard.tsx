import type { ViewMode } from "./Header";

const insights = [
  {
    region: "Visual Cortex",
    winner: "B",
    delta: -14,
    interpretation: "Design B requires less visual processing effort",
  },
  {
    region: "Prefrontal Cortex",
    winner: "B",
    delta: +9,
    interpretation: "Design B triggers more deliberate reasoning",
  },
  {
    region: "Amygdala",
    winner: "B",
    delta: -12,
    interpretation: "Design B evokes less emotional friction",
  },
  {
    region: "Language Network",
    winner: "B",
    delta: -5,
    interpretation: "Design B has slightly clearer textual hierarchy",
  },
  {
    region: "Fusiform Face Area",
    winner: "A",
    delta: +13,
    interpretation: "Design A activates stronger face recognition",
  },
];

const NeuralInsightCard = ({ mode }: { mode: ViewMode }) => (
  <div className="border border-card-border bg-card p-4 flex flex-col gap-3 h-full min-h-0 overflow-y-auto">
    <div className="shrink-0">
      <h3 className="text-xl font-semibold text-white mb-1">Neural Insight</h3>
      <p className="text-[13px] leading-relaxed" style={{ color: "#666" }}>
        Region-level comparison · lower activation = less cognitive friction
      </p>
    </div>

    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {insights.map((i) => {
        const highlighted =
          mode === "both" || i.winner.toLowerCase() === mode;
        return (
          <div
            key={i.region}
            className="border border-card-border rounded-sm px-3.5 py-2.5 flex flex-col gap-1.5 transition-opacity duration-300"
            style={{
              background: highlighted
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.01)",
              opacity: highlighted ? 1 : 0.4,
            }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background:
                      i.delta < 0
                        ? "hsl(142, 69%, 58%)"
                        : "hsl(0, 72%, 56%)",
                  }}
                />
                <span className="text-[15px] font-medium text-white">
                  {i.region}
                </span>
              </div>
              <span
                className="text-xs font-mono font-medium px-2 py-0.5 rounded-sm"
                style={{
                  color: "#E8A04A",
                  background: "rgba(232,160,74,0.12)",
                }}
              >
                {i.winner} ({i.delta > 0 ? "+" : ""}
                {i.delta}%)
              </span>
            </div>
            <p className="text-[13px] leading-snug" style={{ color: "#666" }}>
              {i.interpretation}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

export default NeuralInsightCard;
