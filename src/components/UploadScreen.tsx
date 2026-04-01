import { useState, useCallback } from "react";
import { Upload, Check } from "lucide-react";
import GhostBrain from "./GhostBrain";

type AuditMode = "ab" | "single" | null;

/* ── File type detection ── */
const detectType = (name: string): string | null => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "VIDEO";
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) return "IMAGE";
  if (ext === "pdf") return "PDF";
  return null;
};

/* ── Drop zone ── */
function DropZone({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
}) {
  const [over, setOver] = useState(false);
  const type = file ? detectType(file.name) : null;

  return (
    <div className="flex-1 max-w-[280px]">
      <p
        className="font-mono mb-2 text-center"
        style={{ fontSize: 11, letterSpacing: "0.1em", color: "#666666" }}
      >
        {label}
      </p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.onchange = () => {
            const f = input.files?.[0];
            if (f) onFile(f);
          };
          input.click();
        }}
        className="h-[140px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
        style={{
          border: file
            ? "1px solid rgba(74,143,232,0.5)"
            : over
            ? "1px dashed rgba(74,143,232,0.4)"
            : "1px dashed rgba(255,255,255,0.15)",
          background: file
            ? "rgba(74,143,232,0.03)"
            : over
            ? "rgba(74,143,232,0.03)"
            : "rgba(255,255,255,0.03)",
          borderRadius: "4px",
        }}
      >
        {file ? (
          <>
            <Check className="w-4 h-4" style={{ color: "#4A8FE8" }} />
            <span className="text-[13px] font-mono text-white truncate max-w-[200px] px-3">
              {file.name}
            </span>
            {type && (
              <span
                className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-sm"
                style={{
                  color: "#4A8FE8",
                  background: "rgba(74,143,232,0.12)",
                }}
              >
                {type}
              </span>
            )}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" style={{ color: "#555555" }} />
            <span className="font-mono" style={{ fontSize: 13, color: "#777777" }}>
              Drop any file
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Mode card ── */
function ModeCard({
  title,
  description,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex-1 max-w-[280px] text-left p-7 transition-all duration-200 relative"
      style={{
        border: selected ? "1px solid #4A8FE8" : "1px solid #2A2A2A",
        background: "transparent",
        borderRadius: "2px",
        boxShadow: selected
          ? "0 0 24px rgba(74,143,232,0.08)"
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "rgba(74,143,232,0.5)";
          e.currentTarget.style.boxShadow = "0 0 24px rgba(74,143,232,0.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "#2A2A2A";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      {selected && (
        <div
          className="absolute top-3 right-3 rounded-full"
          style={{ background: "#4A8FE8", width: 8, height: 8 }}
        />
      )}
      <h3 className="text-[18px] text-white mb-2">{title}</h3>
      <p className="text-[14px] leading-[1.6]" style={{ color: "#666" }}>
        {description}
      </p>
    </button>
  );
}

/* ── Page 2 ── */
export default function UploadScreen({ onNext }: { onNext: () => void }) {
  const [mode, setMode] = useState<AuditMode>(null);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);

  const ready =
    mode === "single" ? fileA !== null : mode === "ab" ? fileA !== null && fileB !== null : false;

  const handleRun = useCallback(() => {
    if (ready) onNext();
  }, [ready, onNext]);

  return (
    <div className="h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Ghost brain background */}
      <GhostBrain />

      {/* Top bar */}
      <div className="flex items-center px-6 py-4 shrink-0 relative z-10">
        <span className="text-white font-semibold text-xl tracking-tight">
          Intelkin
        </span>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-[640px] w-full px-6 text-center">
          {/* Eyebrow */}
          <p
            className="font-mono uppercase mb-5"
            style={{ fontSize: 11, letterSpacing: "0.15em", color: "#4A8FE8" }}
          >
            Select Mode
          </p>

          {/* Headline */}
          <h2 className="text-[28px] font-light text-white leading-[1.3] mb-10">
            How would you like to run this audit?
          </h2>

          {/* Mode cards */}
          <div className="flex gap-6 justify-center mb-8">
            <ModeCard
              title="A/B Test"
              description="Compare two designs against each other. See which one creates less cognitive friction across every measured region."
              selected={mode === "ab"}
              onSelect={() => setMode("ab")}
            />
            <ModeCard
              title="Single Audit"
              description="Analyze one design on its own. Get a full neural breakdown of where attention goes and where friction builds."
              selected={mode === "single"}
              onSelect={() => setMode("single")}
            />
          </div>

          {/* Upload zones — fade in when mode selected */}
          {mode && (
            <div className="page-fade-enter">
              <div className="flex gap-6 justify-center mb-3">
                <DropZone
                  label={mode === "ab" ? "Design A" : "Your Design"}
                  file={fileA}
                  onFile={setFileA}
                />
                {mode === "ab" && (
                  <DropZone label="Design B" file={fileB} onFile={setFileB} />
                )}
              </div>

              <p
                className="font-mono mb-8"
                style={{ fontSize: 11, letterSpacing: "0.08em", color: "#666666" }}
              >
                Max 60s · MP4, MOV, PNG, PDF · Under 500MB
              </p>

              {/* CTA */}
              <div className="h-12 flex items-center justify-center">
                {ready && (
                  <button
                    onClick={handleRun}
                    className="px-8 py-3 text-[15px] tracking-[0.08em] transition-all duration-200 page-fade-enter"
                    style={{
                      color: "#4A8FE8",
                      border: "1px solid #4A8FE8",
                      borderRadius: "2px",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(74,143,232,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    Run neural audit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
