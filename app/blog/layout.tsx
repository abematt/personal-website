import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="mb-10 flex items-center justify-between pt-4 text-sm">
        <Link href="/" className="text-ink-muted transition-colors hover:text-ink-strong">
          ← Abraham Mathew
        </Link>
        <ThemeToggle />
      </nav>
      {children}
    </>
  );
}
