const insights = [
  { region: "Visual Cortex", winner: "B", delta: -14, interpretation: "Design B requires less visual processing effort" },
  { region: "Prefrontal Cortex", winner: "B", delta: +9, interpretation: "Design B triggers more deliberate reasoning" },
  { region: "Amygdala", winner: "B", delta: -12, interpretation: "Design B evokes less emotional friction" },
  { region: "Language Network", winner: "B", delta: -5, interpretation: "Design B has slightly clearer textual hierarchy" },
  { region: "Fusiform Face Area", winner: "A", delta: +13, interpretation: "Design A activates stronger face recognition" },
];

const NeuralInsightCard = () => (
  <div className="border border-card-border bg-card p-5 flex flex-col gap-4 h-full">
    <div>
      <h3 className="text-lg font-medium text-foreground mb-0.5">Neural Insight</h3>
      <p className="text-sm text-muted-foreground">Region-level comparison · lower activation = less cognitive friction</p>
    </div>

    <div className="space-y-3 flex-1">
      {insights.map((i) => (
        <div key={i.region} className="flex items-start gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
              i.delta < 0 ? "bg-neural-green" : "bg-neural-red"
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{i.region}</span>
              <span className="text-sm font-mono text-muted-foreground">
                Winner: {i.winner} ({i.delta > 0 ? "+" : ""}{i.delta}%)
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{i.interpretation}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="border-t border-border pt-4">
      <p className="text-sm text-muted-foreground mb-2">Cognitive Load Score</p>
      <div className="flex items-center gap-8">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground">Design A</span>
          <span className="text-4xl font-mono font-semibold text-foreground">61.8</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground">Design B</span>
          <span className="text-4xl font-mono font-semibold text-neural-green">54.8</span>
        </div>
      </div>
    </div>
  </div>
);

export default NeuralInsightCard;
