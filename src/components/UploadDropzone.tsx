import { Upload } from "lucide-react";

const UploadDropzone = ({ label }: { label: string }) => (
  <div className="border border-dashed border-border rounded-none p-6 flex flex-col items-center justify-center gap-2 bg-card hover:border-muted-foreground/30 transition-colors cursor-pointer">
    <Upload className="w-5 h-5 text-muted-foreground" />
    <span className="text-muted-foreground text-xs font-mono">{label}</span>
  </div>
);

export default UploadDropzone;
