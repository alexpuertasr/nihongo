import "@/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Nihongo",
  description: "Learn japansese scripts",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <main className="bg-linear-to-b flex h-dvh flex-col items-center justify-center gap-4 from-[#111827] to-[#030712] text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
