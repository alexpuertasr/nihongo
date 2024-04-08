"use client";

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";

import {
  type Script,
  getRandomScriptIndex,
  getScript,
  scripts,
} from "@/lib/scripts";

interface Props {
  isQuickMode?: boolean;
  scriptType: "hiragana" | "katakana";
  defaultScriptIndex: number | undefined;
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
  const scriptRef = useRef<HTMLHeadingElement>(null);

  const onReset = (scripts: Script[] = currentScripts) => {
    setScriptIndex(getRandomScriptIndex(scripts));
    setValue("");
  };

  const onSuccess = () => {
    let newScripts;

    if (scriptIndex !== undefined) {
      newScripts = [...currentScripts];
      newScripts.splice(scriptIndex, 1);
      setSuccessCounter((state) => ++state);
      setCurrentScripts(newScripts);
    }

    onReset(newScripts);
  };

  const onFail = () => {
    setWrongCounter((state) => ++state);

    if (scriptRef.current) {
      scriptRef.current.classList.add("animate-wrong-shake");
      scriptRef.current.classList.add("text-red-500");

      scriptRef.current.addEventListener("animationend", () => {
        scriptRef.current?.classList.remove("animate-wrong-shake");
      });
    }
  };

  const handleOnReset = () => {
    setCurrentScripts(scripts);
    onReset(scripts);
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (scriptIndex === undefined || event.code !== "Enter") return;

    const script = getScript(scriptIndex, currentScripts);
    if (!script) return;

    if (event.currentTarget.value === script.romaji) {
      onSuccess();
    } else {
      onFail();
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (scriptIndex === undefined) return;

    if (isQuickMode) {
      const script = getScript(scriptIndex, currentScripts);
      if (!script) return;

      const romaji = script.romaji;
      const value = event.target.value;

      if (value.length !== romaji.length) {
        setValue(event.target.value);
        return;
      }

      if (value === romaji) {
        onSuccess();
      } else {
        onFail();
        onReset();
      }
    } else {
      setValue(event.target.value);
    }
  };

  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {scriptIndex === undefined ? (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Congrats! 🎉
            </h1>
            <button onClick={handleOnReset}>Practice again</button>
          </>
        ) : (
          <>
            <div className="absolute top-0 h-2.5 w-full bg-white/10">
              <div
                className="h-2.5 bg-blue-600"
                style={{
                  width: `${((scripts.length - currentScripts.length) / scripts.length) * 100}%`,
                }}
              />
            </div>
            <div className="absolute right-0 top-2.5 m-4 rounded-xl bg-white/10 p-4">
              <p>{`Success: ${successCounter}`}</p>
              <p>{`Wrong: ${wrongCounter}`}</p>
            </div>
            <h1
              ref={scriptRef}
              className="text-7xl font-extrabold tracking-tight text-white sm:text-8xl"
            >
              {getScript(scriptIndex, currentScripts)?.[scriptType]}
            </h1>
            <input
              autoFocus
              className="bg-transparent text-center focus:outline-none"
              value={value}
              placeholder="Type the romaji..."
              onChange={handleOnChange}
              onKeyDown={handleOnKeyDown}
            />
          </>
        )}
      </div>
    </>
  );
}
