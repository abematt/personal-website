import type { Contributions } from "@/lib/github";

const LEVEL_COLORS = [
  "#18181c",
  "oklch(0.36 0.07 255)",
  "oklch(0.5 0.11 255)",
  "oklch(0.64 0.14 255)",
  "oklch(0.78 0.13 255)",
];

export function ContributionGraph({ contributions }: { contributions: Contributions }) {
  const { total, days } = contributions;
  // The calendar starts mid-week; pad the first column so rows line up with weekdays.
  const leading = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-zinc-400">Contributions</h2>
        <p className="font-mono text-[13px] text-zinc-400">
          {total.toLocaleString("en-US")} in the last year
        </p>
      </div>
      {/* rtl on the scroller makes narrow screens open on the newest weeks. */}
      <div className="overflow-x-auto [direction:rtl]">
        <div
          role="img"
          aria-label={`${total.toLocaleString("en-US")} GitHub contributions in the last year`}
          className="grid min-w-[420px] grid-flow-col grid-rows-7 gap-[2px] auto-cols-[minmax(0,1fr)] [direction:ltr]"
        >
          {Array.from({ length: leading }, (_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => (
            <div
              key={day.date}
              className="aspect-square rounded-[2px]"
              style={{ background: LEVEL_COLORS[day.level] }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 text-xs text-zinc-400" aria-hidden="true">
        <span className="mr-1">Less</span>
        {LEVEL_COLORS.map((color) => (
          <div key={color} className="h-[9px] w-[9px] rounded-[2px]" style={{ background: color }} />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}
