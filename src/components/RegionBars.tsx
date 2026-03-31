const regions = [
  { name: "Visual Cortex", value: 78, color: "bg-neural-red" },
  { name: "Prefrontal Cortex", value: 62, color: "bg-neural-orange" },
  { name: "Amygdala", value: 45, color: "bg-neural-yellow" },
  { name: "Language Network", value: 53, color: "bg-neural-blue" },
  { name: "Fusiform Face Area", value: 71, color: "bg-neural-purple" },
];

const regionsB = [
  { name: "Visual Cortex", value: 64, color: "bg-neural-red" },
  { name: "Prefrontal Cortex", value: 71, color: "bg-neural-orange" },
  { name: "Amygdala", value: 33, color: "bg-neural-yellow" },
  { name: "Language Network", value: 48, color: "bg-neural-blue" },
  { name: "Fusiform Face Area", value: 58, color: "bg-neural-purple" },
];

const RegionBars = ({ variant = "a" }: { variant?: "a" | "b" }) => {
  const data = variant === "a" ? regions : regionsB;

  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{r.name}</span>
            <span className="text-xs font-mono text-foreground">{r.value}%</span>
          </div>
          <div className="h-1 w-full bg-muted rounded-none overflow-hidden">
            <div
              className={`h-full ${r.color} transition-all duration-700`}
              style={{ width: `${r.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegionBars;
