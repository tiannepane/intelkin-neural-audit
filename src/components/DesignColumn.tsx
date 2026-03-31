import UploadDropzone from "./UploadDropzone";
import ChannelToggles from "./ChannelToggles";
import BrainVisualization from "./BrainVisualization";
import RegionBars from "./RegionBars";

interface DesignColumnProps {
  label: string;
  variant: "a" | "b";
  brainImage: string;
}

const DesignColumn = ({ label, variant, brainImage }: DesignColumnProps) => (
  <div className="flex flex-col gap-4 p-4 border border-card-border bg-card">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-medium text-foreground">{label}</h2>
      <ChannelToggles />
    </div>
    <UploadDropzone label="Drop video file or click to upload" />
    <BrainVisualization imageSrc={brainImage} />
    <RegionBars variant={variant} />
  </div>
);

export default DesignColumn;
