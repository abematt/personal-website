import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
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
    // next-themes sets the theme class on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body className={`relative bg-page text-ink antialiased ${GeistSans.className} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="mx-auto flex min-h-screen w-full flex-col px-8 py-4 md:w-[45rem] md:py-8">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
