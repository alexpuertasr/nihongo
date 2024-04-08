import { ScriptMatcher } from "@/components/script-matcher";
import { getRandomScriptIndex } from "@/lib/scripts";

export default async function Page() {
  return (
    <ScriptMatcher
      scriptType="hiragana"
      defaultScriptIndex={getRandomScriptIndex()}
    />
  );
}
