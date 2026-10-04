export type ProjectLogoName = "chat" | "book" | "film";

const PATHS: Record<ProjectLogoName, React.ReactNode> = {
  // Speech bubble with a status dot
  chat: (
    <>
      <path d="M20 12.5a7.5 7 0 0 1-10.6 6.4L4 20l1.3-4.2A7 7 0 1 1 20 12.5z" />
      <circle cx="17.5" cy="6.5" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  // Open book
  book: <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5M12 6.5c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5M12 6.5v13" />,
  // Two linked film frames
  film: (
    <>
      <rect x="3" y="5" width="10" height="8" rx="1.5" />
      <rect x="11" y="11" width="10" height="8" rx="1.5" />
      <path d="M6 5v8M18 11v8" />
    </>
  ),
};

// A small dark tile holding a faintly tinted stroke mark. `hue` is an OKLCH hue angle.
export function ProjectLogo({ name, hue }: { name: ProjectLogoName; hue: number }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-zinc-800 bg-zinc-900"
      style={{ color: `oklch(0.78 0.07 ${hue})` }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {PATHS[name]}
      </svg>
    </div>
  );
}
