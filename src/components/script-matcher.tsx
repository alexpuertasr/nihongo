"use client";

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from "react";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";

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
  const [isRevealed, setIsRevealed] = useState(false);
  const [wrongCounter, setWrongCounter] = useState(0);
  const [successCounter, setSuccessCounter] = useState(0);
  const [currentScripts, setCurrentScripts] = useState(scripts);
  const [scriptIndex, setScriptIndex] = useState(defaultScriptIndex);
  const scriptRef = useRef<HTMLHeadingElement>(null);

  const script = getScript(scriptIndex, currentScripts) ?? null;

  const onReset = (scripts: Script[] = currentScripts) => {
    setScriptIndex(getRandomScriptIndex(scripts));
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

    onReset(newScripts);
  };

  const onWrong = () => {
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
    if (!script || event.code !== "Enter") return;

    if (event.currentTarget.value === script.romaji) {
      onCorrect();
    } else {
      onWrong();
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

      if (value === romaji) {
        onCorrect();
      } else {
        onWrong();
        onReset();
      }
    } else {
      setValue(event.target.value.toLowerCase());
    }
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
            <div className="absolute top-0 h-2.5 w-full bg-white/10">
              <div
                className="h-2.5 bg-blue-600"
                style={{
                  width: `${((scripts.length - currentScripts.length) / scripts.length) * 100}%`,
                }}
              />
            </div>
            <div
              className="fixed left-14 top-2.5 m-4 flex rounded-xl bg-white/10 p-4 hover:bg-white/20"
              onClick={() => setIsRevealed((state) => !state)}
            >
              {isRevealed ? <PiEyeSlashBold /> : <PiEyeBold />}
            </div>
            <div className="absolute right-0 top-2.5 m-4 rounded-xl bg-white/10 p-4">
              <p>{`Correct: ${successCounter}`}</p>
              <p>{`Wrong: ${wrongCounter}`}</p>
            </div>
            <h1
              ref={scriptRef}
              className="text-7xl font-extrabold tracking-tight text-white sm:text-8xl"
            >
              {isRevealed ? script?.romaji : script?.[scriptType]}
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
