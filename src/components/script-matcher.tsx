"use client";

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import {
  PiArrowClockwiseBold,
  PiCheckCircleBold,
  PiXCircleBold,
} from "react-icons/pi";

import {
  type Script,
  getRandomScriptIndex,
  getScript,
  scripts,
} from "@/lib/scripts";

import { ScriptMatcherItem } from "./script-matcher-item";

interface Props {
  isQuickMode?: boolean;
  scriptType: ScriptType;
  defaultScriptIndex: number | undefined;
}

export type ScriptType = "hiragana" | "katakana";

export type Status = "current" | "previous" | "removing";

export type RenderedScript = Script & { correct?: boolean; status: Status };

function passNextState(opts: {
  isCurrentCorrect: boolean;
  renderedScripts: RenderedScript[];
}): RenderedScript[] {
  return opts.renderedScripts.map((script) => ({
    ...script,
    status: script.status === "current" ? "previous" : "removing",
    ...(script.status === "current" && { correct: opts.isCurrentCorrect }),
  }));
}

function getNewRenderedScript(scripts: Script[]): [RenderedScript, number] {
  const newScriptIndex = getRandomScriptIndex(scripts)!;
  const newScript = scripts[newScriptIndex]!;

  const newRenderedScript: RenderedScript = {
    status: "current",
    ...newScript,
  };

  return [newRenderedScript, newScriptIndex];
}

export function ScriptMatcher({
  isQuickMode,
  scriptType,
  defaultScriptIndex,
}: Props) {
  const [value, setValue] = useState("");
  const [correctCounter, setCorrectCounter] = useState(0);
  const [incorrectCounter, setIncorrectCounter] = useState(0);
  const [currentScripts, setCurrentScripts] = useState(scripts);
  const [scriptIndex, setScriptIndex] = useState(defaultScriptIndex);
  const currentScriptRef = useRef<HTMLHeadingElement>(null);

  const script = getScript(scriptIndex, currentScripts) ?? null;

  const [renderedScripts, setRenderedScripts] = useState<RenderedScript[]>(
    script ? [{ ...script, status: "current" }] : [],
  );

  const onPassScript = (opts: { isCorrect: boolean; scripts?: Script[] }) => {
    const [newRenderedScript, newScriptIndex] = getNewRenderedScript(
      opts.scripts ?? currentScripts,
    );

    setRenderedScripts((state) => [
      ...passNextState({
        isCurrentCorrect: opts.isCorrect,
        renderedScripts: state,
      }),
      newRenderedScript,
    ]);

    if (!opts.isCorrect) {
      setIncorrectCounter((state) => ++state);
    }

    setScriptIndex(newScriptIndex);
    setValue("");
  };

  const onCorrect = () => {
    let newScripts;

    if (scriptIndex !== undefined) {
      newScripts = [...currentScripts];
      newScripts.splice(scriptIndex, 1);
      setCorrectCounter((state) => ++state);
      setCurrentScripts(newScripts);
    }

    onPassScript({ isCorrect: true, scripts: newScripts });
  };

  const onIncorrectAttempted = () => {
    setIncorrectCounter((state) => ++state);

    if (currentScriptRef.current) {
      currentScriptRef.current.classList.add("animate-wrong-shake");
      currentScriptRef.current.classList.add("text-red-500");

      currentScriptRef.current.addEventListener("animationend", () => {
        currentScriptRef.current?.classList.remove("animate-wrong-shake");
        currentScriptRef.current?.classList.remove("text-red-500");
      });
    }
  };

  const handleOnReset = () => {
    const [newRenderedScript, newScriptIndex] = getNewRenderedScript(scripts);

    setCorrectCounter(0);
    setIncorrectCounter(0);
    setCurrentScripts(scripts);
    setRenderedScripts([newRenderedScript]);
    setScriptIndex(newScriptIndex);
    setValue("");
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!script || event.code !== "Enter") return;

    if (event.currentTarget.value === "") {
      onPassScript({ isCorrect: false });
      return;
    }

    if (event.currentTarget.value !== script.romaji) {
      onIncorrectAttempted();
    } else {
      onCorrect();
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!script) return;

    if (isQuickMode) {
      const romaji = script.romaji;
      const value = event.target.value;

      if (value.length !== romaji.length) {
        setValue(event.target.value.toLowerCase());
        return;
      }

      if (value !== romaji) {
        onPassScript({ isCorrect: false });
      } else {
        onCorrect();
      }
    } else {
      setValue(event.target.value.toLowerCase());
    }
  };

  const handleOnRemove = (index: number) => {
    setRenderedScripts((state) => state.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {!currentScripts.length ? (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Congrats! 🎉
            </h1>
            <button onClick={handleOnReset}>Practice again</button>
          </>
        ) : (
          <>
            <div
              className="absolute left-14 top-0 m-4 flex rounded-xl bg-white/10 p-4 hover:bg-white/20"
              onClick={handleOnReset}
            >
              <PiArrowClockwiseBold />
            </div>
            <div className="flex">
              {renderedScripts.map((script, index) => {
                const isCurrent = script.status === "current";
                return (
                  <ScriptMatcherItem
                    index={index}
                    key={script.romaji}
                    ref={isCurrent ? currentScriptRef : undefined}
                    isFirstScript={renderedScripts.length === 1}
                    isCorrect={script.correct}
                    status={script.status}
                    script={script[scriptType]}
                    romaji={script.romaji}
                    onRemove={handleOnRemove}
                  />
                );
              })}
              <div
                className={`scale-40 absolute flex h-[104px] w-36 translate-x-full flex-col items-center justify-between opacity-0 sm:h-32 sm:w-48 ${correctCounter > 0 || incorrectCounter > 0 ? "animate-fade-in" : ""}`}
              >
                <div className="flex items-center gap-2 text-green-500">
                  <PiCheckCircleBold className="h-11 w-11 sm:h-16" />
                  <p className="w-10 text-center text-3xl font-bold sm:text-4xl">
                    {correctCounter}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <PiXCircleBold className="h-11 w-11 sm:h-16" />
                  <p className="w-10 text-center text-3xl font-bold sm:text-4xl">
                    {incorrectCounter}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                autoFocus
                className="bg-transparent text-center focus:outline-none"
                value={value}
                placeholder="Type the romaji..."
                onChange={handleOnChange}
                onKeyDown={handleOnKeyDown}
              />
              <div
                className={`absolute top-16 h-2.5 w-full rounded-full bg-white/10 opacity-0 ${correctCounter > 0 ? "animate-fade-in" : ""}`}
              >
                <div
                  className="h-2.5 min-w-2.5 rounded-full bg-blue-600"
                  style={{
                    width: `${((scripts.length - currentScripts.length) / scripts.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
