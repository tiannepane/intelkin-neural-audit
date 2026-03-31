import Header from "@/components/Header";
import DesignColumn from "@/components/DesignColumn";
import NeuralInsightCard from "@/components/NeuralInsightCard";
import TimelineScrubber from "@/components/TimelineScrubber";

const Index = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />

    <div className="flex-1 p-3 flex flex-col gap-3">
      <p className="text-xs text-muted-foreground font-mono text-center tracking-widest uppercase">
        Design for the instinctive mind
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_380px] gap-3 flex-1">
        <DesignColumn label="Design A" variant="a" />
        <DesignColumn label="Design B" variant="b" />
        <NeuralInsightCard />
      </div>
    </div>

    <TimelineScrubber />
  </div>
);

export default Index;
