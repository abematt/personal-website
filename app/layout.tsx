import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sections/header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abraham Mathew",
  description: "Personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`relative bg-zinc-950 text-zinc-800 antialiased dark:text-zinc-200 ${inter.className}`}
      >
        {/* Background Pattern */}
        <div className="container flex min-h-screen flex-col py-4 md:w-[45rem] md:py-8">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
