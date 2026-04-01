import { useState, useEffect, useCallback } from "react";
import IntroScreen from "@/components/IntroScreen";
import UploadScreen from "@/components/UploadScreen";
import AnalysisScreen from "@/components/AnalysisScreen";

type Page = "intro" | "upload" | "loading" | "analysis";

const LoadingScreen = () => (
  <div className="h-screen flex items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-5 page-fade-enter">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-lg font-mono" style={{ color: "#E8A04A" }}>
          Initializing TRIBE v2 scan...
        </span>
      </div>
    </div>
  </div>
);

const Index = () => {
  const [page, setPage] = useState<Page>("intro");
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next: Page) => {
    setFading(true);
    setTimeout(() => {
      setPage(next);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (page === "loading" && !fading) {
      const t = setTimeout(() => goTo("analysis"), 1500);
      return () => clearTimeout(t);
    }
  }, [page, fading, goTo]);

  return (
    <div
      className="transition-opacity ease-in-out"
      style={{ transitionDuration: "400ms", opacity: fading ? 0 : 1 }}
    >
      {page === "intro" && <IntroScreen onNext={() => goTo("upload")} />}
      {page === "upload" && <UploadScreen onNext={() => goTo("loading")} />}
      {page === "loading" && <LoadingScreen />}
      {page === "analysis" && <AnalysisScreen />}
    </div>
  );
};

export default Index;
