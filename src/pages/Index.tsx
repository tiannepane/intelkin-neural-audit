import Header from "@/components/Header";
import DesignColumn from "@/components/DesignColumn";
import NeuralInsightCard from "@/components/NeuralInsightCard";
import TimelineScrubber from "@/components/TimelineScrubber";
import brainA from "@/assets/brain-viz-a.jpg";
import brainB from "@/assets/brain-viz-b.jpg";

const Index = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />

    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* Tagline */}
      <p className="text-xs text-muted-foreground font-mono text-center tracking-widest uppercase">
        Design for the instinctive mind
      </p>

      {/* Main grid: two design columns + insight panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_380px] gap-4 flex-1">
        <DesignColumn label="Design A" variant="a" brainImage={brainA} />
        <DesignColumn label="Design B" variant="b" brainImage={brainB} />
        <NeuralInsightCard />
      </div>
    </div>

    <TimelineScrubber />
  </div>
);

export default Index;
