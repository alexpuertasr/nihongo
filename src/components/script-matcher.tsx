"use client";

import { type ChangeEvent, type KeyboardEvent, useState } from "react";

import { type Script, getRandomScriptIndex, scripts } from "@/lib/scripts";

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
      setCurrentScripts(newScripts);
    }

    reset(newScripts);
  };

  const handleOnReset = () => {
    setCurrentScripts(scripts);
    reset(scripts);
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (scriptIndex === undefined || event.code !== "Enter") return;

    if (event.currentTarget.value === currentScripts[scriptIndex]?.romaji) {
      success();
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isQuickMode) {
      if (scriptIndex === undefined || !currentScripts[scriptIndex]) return;

      const romaji = currentScripts[scriptIndex].romaji;
      const value = event.target.value;

      if (value.length !== romaji.length) return;

      if (value === romaji) {
        success();
      } else {
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
          <h1 className="text-7xl font-extrabold tracking-tight text-white sm:text-8xl">
            {scriptIndex !== undefined && currentScripts[scriptIndex]
              ? currentScripts[scriptIndex][scriptType]
              : null}
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
