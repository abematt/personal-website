# Ideas

A running list of things to try on the site. Add freely, prune often. Move an item to **Done** when it ships, with the date. Bigger ideas lifted from other sites live in [design-references.md](design-references.md); this file is for what we actually want to build here.

## Up next

- [ ] **New writing system** from scratch. The Notion blog (renderer, ISR, revalidate webhook) was removed on 2026-10-04. Decide the source (MDX in the repo is the obvious lean choice), then a writing index, post pages, a Writing section on the homepage, RSS and per-post Open Graph images.
- [ ] **Migrate the two Notion posts** into the new system once it exists: "Dev Blog 1 - Guidea" (2025-06-18) and "Dev Log 2 - A complete system" (2025-06-21). They are still in the Notion database; a one-off export script using the kept `NOTION_TOKEN` is enough. Delete the Notion env vars afterwards.
- [ ] **Experiments section** on the homepage, separate from Projects, with an "All experiments" link. Small playful builds get their own space (from anishfn).
- [ ] **Snippets / one page per effect**, with a short write-up and older/newer navigation (from cyze.dev). Could be the home for the experiments above.
- [ ] **"One object in an empty room" entry point**: a single interactive object (CRT monitor, desk, phone) that zooms into the real homepage (from the cyze.dev CRT snippet).

## Someday

- [ ] **Views counter**, on the homepage or per post once the new writing system exists. anishfn.ink shows a running count as a live sign of activity (same spirit as its guestbook signature count). Needs a tiny store, so pair it with whatever backs the guestbook, or the apps box.
- [ ] **Guestbook**: visitors leave a message, draw a signature on a canvas, running count of signatures.
- [ ] **Theme-aware favicon** that follows light/dark.
- [ ] **Photos section**: a small phone-photo grid, since the intro already mentions it.
- [ ] **Reading / running log**: a lightweight "now" line or page for books and runs.
- [ ] **Open Graph image** for the homepage.
- [ ] **Project tile hover**: a one-line description or a tiny screenshot on hover.
- [ ] **Footer personality line**, something small and true (cyze: "626 matchas in, no plans to stop.").

## Done

- [x] 2026-10-04 · **Light/dark/system theme toggle** with named color tokens for both themes.
- [x] 2026-10-04 · **Single-column redesign** with boxed sections and restyled project tiles with custom logos.
- [x] 2026-10 · **GitHub contribution graph** on the homepage.
