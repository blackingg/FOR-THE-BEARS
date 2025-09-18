import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

interface LoadingScreenProps {
  started: boolean;
  setStarted: (started: boolean) => void;
}

export const LoadingScreen = (props: LoadingScreenProps) => {
  const { started, setStarted } = props;
  const { progress, total, loaded, item } = useProgress();

  useEffect(() => {
    console.log(progress, total, loaded, item);
    if (progress === 100) {
      setTimeout(() => {
        setStarted(true);
      }, 1000);
    }
  }, [progress, total, loaded, item, setStarted]);

  const getItemName = (itemUrl: string | undefined): string => {
    if (!itemUrl) return "Initializing...";

    try {
      const fileName = itemUrl.split("/").pop();
      if (!fileName) return "Loading asset...";

      const nameWithoutExt = fileName.split(".")[0];
      return decodeURIComponent(nameWithoutExt);
    } catch {
      return "Loading asset...";
    }
  };

  const currentItemName = getItemName(item);
  const itemProgress = total > 0 ? `${loaded} / ${total}` : "...";

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
        flex items-center justify-center bg-[#171720]
        ${started ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <img
            src="/Bera_logo.svg"
            alt="Bera Logo"
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
        </div>

        <div className="w-64 md:w-96 bg-[#000] bg-opacity-20 rounded-full h-2">
          <div
            className="bg-[#fff] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-lg md:text-xl font-semibold text-[#fff]">
          {Math.round(progress)}%
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm md:text-base text-[#fff] opacity-70">
            Loading Experience...
          </div>

          <div className="text-xs md:text-sm text-[#fff] opacity-50">
            {currentItemName}
          </div>

          <div className="text-xs text-[#fff] opacity-40">
            Item {itemProgress}
          </div>
        </div>
      </div>
    </div>
  );
};
