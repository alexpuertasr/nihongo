import Link from "next/link";

export default async function Page() {
  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Nihon<span className="text-[hsl(350,100%,70%)]">go</span>
      </h1>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-8">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="/hiragana"
        >
          <h2 className="text-2xl font-bold">Hiragana →</h2>
          <div className="text-lg">
            Practice all the hiragana <br /> (ひらがな) characters
          </div>
        </Link>
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="/katakana"
        >
          <h2 className="text-2xl font-bold">Katakana →</h2>
          <div className="text-lg">
            Practice all the katakana <br /> (カタカナ) characters
          </div>
        </Link>
      </div>
    </>
  );
}
