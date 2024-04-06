import { ScriptMatcher } from "@/components/script-matcher";
import { getRandomScriptIndex } from "@/lib/scripts";

export default async function Page() {
  return (
    <ScriptMatcher
      isQuickMode
      scriptType="katakana"
      defaultScriptIndex={getRandomScriptIndex()}
    />
  );
}
