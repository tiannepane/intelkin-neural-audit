const BrainVisualization = ({ imageSrc }: { imageSrc: string }) => (
  <div className="relative aspect-square w-full max-w-[320px] mx-auto flex items-center justify-center bg-background rounded-full overflow-hidden">
    <div className="absolute inset-0 bg-background" />
    <img
      src={imageSrc}
      alt="Neural activation heatmap"
      className="relative z-10 w-[85%] h-[85%] object-contain animate-pulse-glow"
      width={800}
      height={800}
    />
  </div>
);

export default BrainVisualization;
