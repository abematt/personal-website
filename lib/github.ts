export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  level: ContributionLevel;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
}

// Contribution calendar for the last year, read from the public HTML fragment
// GitHub renders on profile pages, so no token is needed. Returns null if it
// can't be fetched or its markup changes, and the homepage skips the section.
export async function getContributions(login: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${login}/contributions`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const days: ContributionDay[] = [];
    for (const [cell] of Array.from(html.matchAll(/<td[^>]*\bdata-date="[^"]+"[^>]*>/g))) {
      const date = cell.match(/data-date="([^"]+)"/)?.[1];
      const level = Number(cell.match(/data-level="([0-4])"/)?.[1]);
      if (date && !Number.isNaN(level)) days.push({ date, level: level as ContributionLevel });
    }
    // Cells come row by row (one row per weekday); put them back in date order.
    days.sort((a, b) => a.date.localeCompare(b.date));

    const total = html.replace(/\s+/g, " ").match(/([\d,]+) contributions? in the last year/)?.[1];
    if (!days.length || !total) return null;

    return { total: Number(total.replace(/,/g, "")), days };
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return null;
  }
}
