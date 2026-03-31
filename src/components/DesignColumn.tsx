import UploadDropzone from "./UploadDropzone";
import ChannelToggles from "./ChannelToggles";
import BrainVisualization from "./BrainVisualization";
import RegionBars from "./RegionBars";

interface DesignColumnProps {
  label: string;
  variant: "a" | "b";
}

const DesignColumn = ({ label, variant }: DesignColumnProps) => (
  <div className="flex flex-col gap-3 p-4 border border-card-border bg-card">
    <div className="flex items-center justify-between">
      <h2 className="text-base font-medium text-foreground">{label}</h2>
      <ChannelToggles />
    </div>
    <UploadDropzone />
    <BrainVisualization variant={variant} />
    <RegionBars variant={variant} />
  </div>
);

export default DesignColumn;
