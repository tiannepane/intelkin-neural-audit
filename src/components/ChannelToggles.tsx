const channels = [
  { id: "video", label: "VIDEO" },
  { id: "audio", label: "AUDIO" },
  { id: "text", label: "TEXT" },
] as const;

const ChannelToggles = ({ detected = [] }: { detected?: string[] }) => {
  const activeSet = new Set(detected);

  return (
    <div className="flex gap-2">
      {channels.map((ch) => (
        <span
          key={ch.id}
          className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
            activeSet.has(ch.id)
              ? "bg-foreground/15 text-foreground"
              : "bg-muted text-muted-foreground/50"
          }`}
        >
          {ch.label}
        </span>
      ))}
    </div>
  );
};

export default ChannelToggles;
