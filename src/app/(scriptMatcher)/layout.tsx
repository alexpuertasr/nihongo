import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <Link
        aria-label="Back to home"
        className="absolute left-0 top-0 m-4 flex rounded-xl bg-white/10 p-4 hover:bg-white/20"
        href="/"
      >
        <ArrowLeft size={16} />
      </Link>
    </>
  );
}
