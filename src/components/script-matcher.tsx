"use client";

import { type ChangeEvent, type KeyboardEvent, useState } from "react";

import {
  type Script,
  getRandomScriptIndex,
  getScript,
  scripts,
} from "@/lib/scripts";

interface Props {
  isQuickMode: boolean;
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

  const reset = (scripts: Script[] = currentScripts) => {
    setScriptIndex(getRandomScriptIndex(scripts));
    setValue("");
  };

  const success = () => {
    let newScripts;

    if (scriptIndex !== undefined) {
      newScripts = [...currentScripts];
      newScripts.splice(scriptIndex, 1);
      setSuccessCounter((state) => ++state);
      setCurrentScripts(newScripts);
    }

    reset(newScripts);
  };

  const handleOnReset = () => {
    setCurrentScripts(scripts);
    reset(scripts);
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (scriptIndex === undefined) return;

    if (event.code !== "Enter") {
      setWrongCounter((state) => ++state);
      return;
    }

    if (event.currentTarget.value === currentScripts[scriptIndex]?.romaji) {
      success();
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
        success();
      } else {
        setWrongCounter((state) => ++state);
        reset();
      }
    } else {
      setValue(event.target.value);
    }
  };

  return (
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
          <div className="absolute right-0 top-0 m-4 rounded-xl bg-white/10 p-4">
            <p>{`Remaining: ${currentScripts.length}`}</p>
            <p>{`Success: ${successCounter}`}</p>
            <p>{`Wrong: ${wrongCounter}`}</p>
          </div>
          <h1 className="text-7xl font-extrabold tracking-tight text-white sm:text-8xl">
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
  );
}
