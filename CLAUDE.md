# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Abraham Mathew, deployed at www.abrahammathew.dev. Built with Next.js 14 and Tailwind CSS, with light and dark themes.

## Development Commands

```bash
npm run dev    # Start development server (localhost:3000)
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with light/dark themes (next-themes, defaults to the system setting)
- **Icons**: inline SVG (see [components/project-logo.tsx](components/project-logo.tsx))

### Key Architectural Patterns

**Path Aliasing**: Uses `@/*` to reference root-level imports
```typescript
import { getContributions } from '@/lib/github'
import { ThemeToggle } from '@/components/theme-toggle'
```

**Component Organization**:
- `components/data/`: Static content data (hero links, experience, projects with tile logo + hue)
- `components/contribution-graph.tsx`, `components/project-logo.tsx`: homepage pieces
- [lib/github.ts](lib/github.ts): GitHub contribution calendar, parsed from the public `github.com/users/<login>/contributions` fragment (no token; cached 1 hour; section hidden if parsing fails)

**Styling Approach**:
- Themes: `next-themes` toggles the `dark` class on `<html>`; [components/theme-toggle.tsx](components/theme-toggle.tsx) is the System/Light/Dark switch
- Colors are named tokens (`page`, `ink`, `ink-muted`, `line`, `panel`, `hover`, `tile`, `--heat-*`) defined for both themes in [app/globals.css](app/globals.css) and mapped in [tailwind.config.js](tailwind.config.js). Use these, not raw `zinc-*` classes, so both themes stay correct
- Fonts: Geist Sans for body, Geist Mono (`font-mono`) for dates and counts, via the `geist` package
- No global navbar: the homepage header holds the links
- Custom container: `container md:w-[45rem]` for centered content

## Important Patterns

**Server Components**:
- The homepage is a server component (ISR, 1 hour) that fetches GitHub contributions
- [components/theme-toggle.tsx](components/theme-toggle.tsx) is the one client component

## Self-hosted apps (separate)

Some side projects are self-hosted under `*.apps.abrahammathew.com` (Aladí, for
example, is linked from the homepage's project tiles). Each lives in its own
repo and is built and deployed from there, not from this one. This site only
links to the public ones.

## Design Reference Bank

Abraham collects other personal websites as design inspiration in [docs/design-references.md](docs/design-references.md). When a reference URL gets dropped in (often with no instructions), fetch the site and add a new entry at the top of that file using the same format as the existing ones. Leave `Verdict` blank for Abraham to fill in. When asked to review, compare, or borrow from the references, start from that file.

## Key Files

- [app/layout.tsx](app/layout.tsx): Root layout with metadata, fonts, theme provider
- [app/page.tsx](app/page.tsx): Homepage: header, contributions, project tiles, work
- [components/data/](components/data/): Hero, experience and project content
- [lib/github.ts](lib/github.ts): GitHub contribution calendar fetch

## Writing

The old Notion-backed blog was removed on 2026-10-04. A new writing system is on the ideas list; until it exists there is no blog route.

The two existing posts ("Dev Blog 1 - Guidea", 2025-06-18, and "Dev Log 2 - A complete system", 2025-06-21) still live in the Notion database. `NOTION_TOKEN` and `NOTION_DATABASE_ID` in `.env.local` are kept only so they can be exported when the new system exists. The old fetch and render code is in git history at commit `76f204f` if a reference is needed.

## Ideas List

Ideas for the site are kept in [docs/ideas.md](docs/ideas.md), grouped into Up next, Someday and Done. When Abraham mentions something he might want to build, add it there. When something ships, move it to Done with the date.
