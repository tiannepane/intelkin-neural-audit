const regions = [
  { name: "Visual Cortex", cx: "50%", cy: "30%", r: 28, color: "hsl(var(--muted-foreground) / 0.5)" },
  { name: "Prefrontal Cortex", cx: "50%", cy: "18%", r: 22, color: "hsl(var(--muted-foreground) / 0.4)" },
  { name: "Amygdala", cx: "35%", cy: "55%", r: 16, color: "hsl(var(--muted-foreground) / 0.35)" },
  { name: "Language Network", cx: "68%", cy: "42%", r: 20, color: "hsl(var(--muted-foreground) / 0.3)" },
  { name: "Fusiform Face Area", cx: "42%", cy: "68%", r: 18, color: "hsl(var(--muted-foreground) / 0.35)" },
];

const activationColors: Record<string, { a: string; b: string }> = {
  "Visual Cortex": { a: "hsl(var(--foreground) / 0.7)", b: "hsl(var(--foreground) / 0.55)" },
  "Prefrontal Cortex": { a: "hsl(var(--foreground) / 0.55)", b: "hsl(var(--foreground) / 0.65)" },
  "Amygdala": { a: "hsl(var(--foreground) / 0.4)", b: "hsl(var(--foreground) / 0.28)" },
  "Language Network": { a: "hsl(var(--foreground) / 0.45)", b: "hsl(var(--foreground) / 0.4)" },
  "Fusiform Face Area": { a: "hsl(var(--foreground) / 0.6)", b: "hsl(var(--foreground) / 0.5)" },
};

const BrainVisualization = ({ variant }: { variant: "a" | "b" }) => (
  <div className="relative w-full aspect-[4/3] flex items-center justify-center">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Brain silhouette */}
      <ellipse cx="100" cy="95" rx="72" ry="80" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
      <ellipse cx="100" cy="85" rx="60" ry="65" fill="hsl(var(--muted) / 0.3)" />
      
      {/* Sulci lines */}
      <path d="M60 60 Q80 50 100 55 Q120 60 140 55" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <path d="M55 80 Q75 75 100 78 Q125 80 145 76" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
      <path d="M60 100 Q80 95 100 98 Q120 100 140 96" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
      
      {/* Region activation glows */}
      {regions.map((region) => {
        const color = activationColors[region.name]?.[variant] ?? region.color;
        return (
          <circle
            key={region.name}
            cx={region.cx}
            cy={region.cy}
            r={region.r}
            fill={color}
            className="transition-all duration-700"
            style={{ filter: "blur(8px)" }}
          />
        );
      })}
    </svg>
  </div>
);

export default BrainVisualization;
