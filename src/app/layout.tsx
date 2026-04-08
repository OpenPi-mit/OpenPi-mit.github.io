import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PersistentBackground } from "@/components/PersistentBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poggio AI",
  description: "Research-driven AI systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black`}>
        <PersistentBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
