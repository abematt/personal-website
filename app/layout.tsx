import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abraham Mathew | Software Engineer",
  description: "Personal website and portfolio of Abraham Mathew, Software Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`relative bg-zinc-950 text-zinc-800 antialiased dark:text-zinc-200 ${GeistSans.className} ${GeistMono.variable}`}
      >
        <div className="container flex min-h-screen flex-col py-4 md:w-[45rem] md:py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
