# Design references

A running bank of other people's personal websites worth learning from. When Abraham drops in a URL, add an entry here, newest first. Later, pull from this list to compare sites and decide what to borrow for this one.

Each entry has: the URL, the date it was added, a short summary, and what stands out. Leave **Verdict** blank until Abraham has looked at the site and decided what to take from it.

---

## cyze.dev — Blake Cyze

- **URL:** https://www.cyze.dev/ (dropped in via the snippet https://www.cyze.dev/snippets/crt-screen-zoom)
- **Added:** 2026-10-03
- **Who:** Blake Cyze, Lead Product Engineer at Avatone. X: [@cyze_dev](https://x.com/cyze_dev). GitHub: [blakecyze](https://github.com/blakecyze).
- **Summary:** A light, minimal single page with a hero, then a big grid of cards split into Featured Projects and Snippets. Snippets are 30+ small interactive demos, each with its own page.
- **Structure:** A header with social links (LinkedIn, GitHub, X), a hero line ("Research, design, code, ship. Repeat."), a project grid with WebP thumbnails, a snippets grid, and a footer with a back-to-top link.
- **Standout ideas:**
  - **CRT Screen Zoom snippet:** moving the cursor moves a camera around a CRT monitor that is showing the site itself. Clicking zooms through the glass onto the real homepage. The trick: 57 camera angles were pre-rendered in Blender, and the browser blends the four closest ones. A screenshot of the site is warped onto the curved tube, and the live page takes over halfway through the zoom, so the two never need to match pixel for pixel.
  - **A Snippets section** as a craft showcase: one page per effect, with older/newer navigation and a short write-up. Others include Koi Dither Pond, Holographic Card Shader, Proximity Type Morph, Landscape Depth Card and Theme-Aware Favicons.
  - Personality in the footer: "626 matchas in, no plans to stop."
- **GitHub:** The site's source isn't public. Related repos:
  - [blakecyze/blakecyze](https://github.com/blakecyze/blakecyze): a profile README with SVG section headers and a list of shipped side projects.
  - [woodsmoke](https://github.com/blakecyze/woodsmoke): a camping planner (Vite + TypeScript).
  - Claude Code skill packs: [kanso](https://github.com/blakecyze/kanso), [mimesis](https://github.com/blakecyze/mimesis), [swarm](https://github.com/blakecyze/swarm) and [perpetuity](https://github.com/blakecyze/perpetuity).
- **Other sites by Blake:** gradients.fyi (OKLCH mesh-gradient editor), otoya.app, d2ttk.com, whowrote.dev, jaune.design.
- **Verdict (2026-10-04):** Take the "one object sitting in an empty room" feel of the CRT snippet as the site's entry point. Also take the idea of small project tiles with custom logos.

---

## anishfn.qala.lol — Anish Gupta

- **URL:** https://anishfn.qala.lol/ (now redirects to https://www.anishfn.ink/)
- **Added:** 2026-09-23
- **Summary:** A minimal single-page portfolio that reads top to bottom: intro, GitHub contributions, projects, experiments, writing, then a guestbook.
- **Structure:** A header with a short intro and links (Twitter, email, GitHub), then a GitHub contribution heatmap, project cards with thumbnails (Coffer, Omarchy, Qala), an "Experiments" section of small interactive toys (Ransom Note, Teardown, 404 Runner), a dated writing list, and a guestbook.
- **Visual:** Clean sans-serif type with several weights. Light, dark and system theme toggle in the top right.
- **Standout ideas:**
  - **Guestbook:** visitors type a message, draw a signature on a canvas, and see a running count of signatures.
  - An **Experiments** section kept separate from Projects, so small playful builds get their own space.
  - A **GitHub contribution heatmap** as a live sign of activity.
  - Copy about craft: "Most of the work goes into the details nobody is meant to notice."
- **Stack (inferred):** Next.js, based on the `/_next/image` paths.
- **Verdict (2026-10-04):** Take the simple header (round avatar, name, role, one-line intro, inline links), the GitHub contributions chart ("N contributions in YEAR", Less/More legend), project tiles, and an Experiments section with an "All experiments" link.
