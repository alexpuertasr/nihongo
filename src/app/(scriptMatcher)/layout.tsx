import Link from "next/link";
import { PiArrowLeftBold } from "react-icons/pi";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      {children}
      <Link
        className="absolute left-0 top-2.5 m-4 flex rounded-xl bg-white/10 p-4 hover:bg-white/20"
        href="/"
      >
        <PiArrowLeftBold />
      </Link>
    </div>
  );
}
