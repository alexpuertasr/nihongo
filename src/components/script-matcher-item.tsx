import { forwardRef, useEffect, useRef } from "react";

import type { Status } from "./script-matcher";

interface Props {
  index: number;
  isFirstScript: boolean;
  isRevealed?: boolean;
  isCorrect?: boolean;
  status: Status;
  script: string;
  romaji: string;
  onRemove: (index: number) => void;
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

export const ScriptMatcherItem = forwardRef<HTMLHeadingElement, Props>(
  function ScriptMatcherItem(
    {
      index,
      isFirstScript,
      isRevealed,
      isCorrect,
      status,
      script,
      romaji,
      onRemove,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
      if (status === "removing" && containerRef.current) {
        containerRef.current.addEventListener("animationend", () => {
          onRemove(index);
        });
      }
    }, [index, status, onRemove]);

    return (
      <div
        ref={containerRef}
        className={`w-36 text-center sm:w-48 ${isCorrect !== undefined ? (isCorrect ? "text-green-500" : "text-red-500") : ""} ${status !== "current" ? "absolute" : ""} ${getAnimationStage(isFirstScript, status)}`}
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
