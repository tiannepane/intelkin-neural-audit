import { useState, useCallback } from "react";
import { Upload } from "lucide-react";

const detectFileType = (name: string): "VIDEO" | "AUDIO" | "TEXT" | null => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  if (["mp4", "webm", "mov", "avi", "mkv", "ogv"].includes(ext)) return "VIDEO";
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext)) return "AUDIO";
  if (["txt", "pdf", "doc", "docx", "csv", "json", "md", "html"].includes(ext))
    return "TEXT";
  return null;
};

const pillColor: Record<string, string> = {
  VIDEO: "bg-neural-blue",
  AUDIO: "bg-neural-green",
  TEXT: "bg-neural-purple",
};

const UploadDropzone = ({ label }: { label?: string }) => {
  const [fileType, setFileType] = useState<"VIDEO" | "AUDIO" | "TEXT" | null>(
    null
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    setFileType(detectFileType(file.name));
    setFileName(file.name);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onClickUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  const placeholder = label
    ? `${label} \u2014 drop any file`
    : "Drop any file \u2014 video, audio, or text";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={onClickUpload}
      className={`
        flex-1 border-2 border-dashed rounded-sm px-4 py-3
        flex items-center justify-center gap-2
        cursor-pointer transition-all duration-200
        ${
          dragOver
            ? "border-primary/60 bg-primary/5 shadow-[0_0_20px_rgba(74,144,255,0.12)]"
            : "border-border/50 bg-transparent hover:border-muted-foreground/30 hover:bg-muted/20"
        }
      `}
    >
      <Upload className="w-5 h-5 text-muted-foreground/60 shrink-0" />
      {fileName ? (
        <div className="flex items-center gap-2 min-w-0">
          {label && (
            <span className="text-sm font-medium text-foreground shrink-0">
              {label}:
            </span>
          )}
          <span className="text-sm font-mono text-muted-foreground truncate">
            {fileName}
          </span>
          {fileType && (
            <span
              className={`${pillColor[fileType]} text-primary-foreground text-xs font-mono font-medium px-2 py-0.5 rounded-full shrink-0`}
            >
              {fileType}
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground/70 font-mono">
          {placeholder}
        </span>
      )}
    </div>
  );
};

export default UploadDropzone;
