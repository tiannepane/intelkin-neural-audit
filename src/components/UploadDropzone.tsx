import { Upload } from "lucide-react";

const UploadDropzone = () => (
  <div className="border-2 border-dashed border-muted-foreground/30 rounded-none p-8 flex flex-col items-center justify-center gap-3 bg-card hover:border-muted-foreground/50 transition-colors cursor-pointer">
    <Upload className="w-7 h-7 text-muted-foreground" />
    <div className="text-center">
      <span className="text-sm text-foreground font-medium block">Drag & drop your file here</span>
      <span className="text-sm text-muted-foreground">or click to browse</span>
    </div>
    <span className="text-xs text-muted-foreground/60 font-mono">MP4, MOV, AVI, MP3, WAV, TXT</span>
  </div>
);

export default UploadDropzone;
