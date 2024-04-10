import Link from "next/link";
import { PiArrowLeftBold } from "react-icons/pi";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Link
        className="absolute left-0 top-0 m-4 flex rounded-xl bg-white/10 p-4 hover:bg-white/20"
        href="/"
      >
        <PiArrowLeftBold />
      </Link>
    </>
  );
}
