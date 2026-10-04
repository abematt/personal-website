import Link from "next/link";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="mb-10 pt-4 text-sm">
        <Link href="/" className="text-zinc-400 transition-colors hover:text-zinc-100">
          ← Abraham Mathew
        </Link>
      </nav>
      {children}
    </>
  );
}
