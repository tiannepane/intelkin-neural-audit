const regions = [
  { name: "Visual Cortex", value: 78 },
  { name: "Prefrontal Cortex", value: 62 },
  { name: "Amygdala", value: 45 },
  { name: "Language Network", value: 53 },
  { name: "Fusiform Face Area", value: 71 },
];

const regionsB = [
  { name: "Visual Cortex", value: 64 },
  { name: "Prefrontal Cortex", value: 71 },
  { name: "Amygdala", value: 33 },
  { name: "Language Network", value: 48 },
  { name: "Fusiform Face Area", value: 58 },
];

const RegionBars = ({ variant = "a" }: { variant?: "a" | "b" }) => {
  const data = variant === "a" ? regions : regionsB;

  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{r.name}</span>
            <span className="text-sm font-mono text-foreground">{r.value}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-none overflow-hidden">
            <div
              className="h-full bg-foreground/40 transition-all duration-700"
              style={{ width: `${r.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegionBars;
