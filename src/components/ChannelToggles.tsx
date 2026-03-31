import { useState } from "react";

const channels = [
  { id: "video", label: "VIDEO", activeClass: "bg-neural-blue text-primary-foreground" },
  { id: "audio", label: "AUDIO", activeClass: "bg-neural-green text-primary-foreground" },
  { id: "text", label: "TEXT", activeClass: "bg-neural-purple text-primary-foreground" },
] as const;

const ChannelToggles = () => {
  const [active, setActive] = useState<Set<string>>(new Set(["video"]));

  const toggle = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex gap-2">
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => toggle(ch.id)}
          className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
            active.has(ch.id)
              ? ch.activeClass
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {ch.label}
        </button>
      ))}
    </div>
  );
};

export default ChannelToggles;
