"use client";

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";

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
  const [wrongCounter, setWrongCounter] = useState(0);
  const [successCounter, setSuccessCounter] = useState(0);
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
      setWrongCounter((state) => ++state);
    }

    setScriptIndex(newScriptIndex);
    setValue("");
  };

  const onCorrect = () => {
    let newScripts;

    if (scriptIndex !== undefined) {
      newScripts = [...currentScripts];
      newScripts.splice(scriptIndex, 1);
      setSuccessCounter((state) => ++state);
      setCurrentScripts(newScripts);
    }

    onPassScript({ isCorrect: true, scripts: newScripts });
  };

  const onIncorrectAttempted = () => {
    setWrongCounter((state) => ++state);

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
            <div className="absolute right-0 top-0 m-4 rounded-xl bg-white/10 p-4">
              <p>{`Correct: ${successCounter}`}</p>
              <p>{`Wrong: ${wrongCounter}`}</p>
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
              <div className="absolute top-16 h-2.5 w-full rounded-full bg-white/10">
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
