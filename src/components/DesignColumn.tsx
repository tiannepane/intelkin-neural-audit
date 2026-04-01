import UploadDropzone from "./UploadDropzone";
import BrainVisualization from "./BrainVisualization";
import RegionBars from "./RegionBars";

const activationA: Record<string, number> = {
  "Visual Cortex": 0.78,
  "Prefrontal Cortex": 0.62,
  Amygdala: 0.45,
  "Language Network": 0.53,
  "Fusiform Face Area": 0.71,
};

const activationB: Record<string, number> = {
  "Visual Cortex": 0.64,
  "Prefrontal Cortex": 0.71,
  Amygdala: 0.33,
  "Language Network": 0.48,
  "Fusiform Face Area": 0.58,
};

interface DesignColumnProps {
  label: string;
  variant: "a" | "b";
}

const DesignColumn = ({ label, variant }: DesignColumnProps) => (
  <div className="flex flex-col gap-4 p-5 border border-card-border bg-card min-h-0">
    <h2 className="text-base font-semibold text-foreground">{label}</h2>
    <UploadDropzone />
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <BrainVisualization
        activationData={variant === "a" ? activationA : activationB}
      />
      <RegionBars variant={variant} />
    </div>
  </div>
);

export default DesignColumn;
