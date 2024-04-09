import { forwardRef } from "react";

import type { Status } from "./script-matcher";

interface Props {
  isFirstScript: boolean;
  isRevealed?: boolean;
  isCorrect?: boolean;
  status: Status;
  script: string;
  romaji: string;
}

const getAnimationStage = (isFirstScript: boolean, status: Status) => {
  switch (status) {
    case "current":
      if (isFirstScript) return "";
      return "animate-fade-in";
    case "previous":
      return "animate-slide-out";
    case "removing":
      return "animate-slide-fade-out";
  }
};

const ScriptMatcherItem = forwardRef<HTMLHeadingElement, Props>(
  ({ isFirstScript, isRevealed, isCorrect, status, script, romaji }, ref) => {
    return (
      <div
        className={`w-36 text-center ${isCorrect !== undefined ? (isCorrect ? "text-green-500" : "text-red-500") : ""} ${status !== "current" ? "absolute" : ""} ${getAnimationStage(isFirstScript, status)}`}
      >
        <h1
          ref={ref}
          className={`text-7xl font-extrabold tracking-tight sm:text-8xl`}
        >
          {isRevealed ? romaji : script}
        </h1>
        {status !== "current" && (
          <h2 className="text-2xl font-bold">{romaji}</h2>
        )}
      </div>
    );
  },
);

ScriptMatcherItem.displayName = "ScriptMatcherItem";

export { ScriptMatcherItem };
