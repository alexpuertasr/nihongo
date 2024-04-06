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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <main className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#111827] to-[#030712] text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
