# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website and blog for Abraham Mathew, deployed at www.abrahammathew.dev. Built with Next.js 14 and Tailwind CSS with a dark theme.

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
- **Styling**: Tailwind CSS with dark theme (zinc-950 background)
- **CMS**: Notion (Official @notionhq/client API)
- **Icons**: inline SVG (see [components/project-logo.tsx](components/project-logo.tsx))

### Key Architectural Patterns

**Path Aliasing**: Uses `@/*` to reference root-level imports
```typescript
import { notion } from '@/lib/notion'
import Navbar from '@/components/sections/header'
```

**Blog System with Notion CMS**:
- Blog posts are managed in a Notion database (ID: `NOTION_DATABASE_ID`)
- Each post must have properties: `Title`, `Slug` (formula field), and `Date`
- Posts are fetched using the official Notion API (`@notionhq/client`)
- Custom renderer at [components/ClientNotion.jsx](components/ClientNotion.jsx) handles Notion block types
- Blog routes use dynamic segments: `/blog/[slug]`
- Static paths are pre-generated via `generateStaticParams()`

**Revalidation Strategy**:
- Blog pages use ISR with 300-second revalidation (`export const revalidate = 300`)
- Webhook endpoint at `/api/revalidate` for manual cache invalidation
- Requires `REVALIDATE_SECRET` for security

**Data Layer**:
- [lib/notion.ts](lib/notion.ts): Notion client initialization
- [lib/notion-posts.ts](lib/notion-posts.ts): `getPosts()` for post lists and `getPageContentBySlug()` for a single post
- Fetches blocks with pagination (100 blocks max per request)

**Component Organization**:
- `components/data/`: Static content data (hero links, experience, projects with tile logo + hue)
- `components/contribution-graph.tsx`, `components/project-logo.tsx`: homepage pieces
- [lib/github.ts](lib/github.ts): GitHub contribution calendar, parsed from the public `github.com/users/<login>/contributions` fragment (no token; cached 1 hour; section hidden if parsing fails)

**Styling Approach**:
- Dark mode forced via `className="dark"` on `<html>` element
- Fonts: Geist Sans for body, Geist Mono (`font-mono`) for dates and counts, via the `geist` package
- No global navbar: the homepage header holds the links, and [app/blog/layout.tsx](app/blog/layout.tsx) adds a back link on blog pages
- Custom container: `container md:w-[45rem]` for centered content
- Zinc color palette for dark theme consistency
- Prose styles for blog content

### Image Handling

Next.js Image component configured for external Notion images:
- Allowed domains: `www.notion.so`, `s3.us-west-2.amazonaws.com`, `guidea-dev-blog-images.s3.us-east-1.amazonaws.com`
- Configuration in [next.config.js](next.config.js)

### Environment Variables

Required in `.env.local` (not committed):
```
NOTION_TOKEN=           # Notion integration token
NOTION_DATABASE_ID=     # Notion database ID for blog posts
REVALIDATE_SECRET=      # Secret for revalidation webhook
```

## Important Patterns

**Client/Server Components**:
- Main page is a server component (ISR, 300s) that fetches GitHub contributions and the latest posts
- Blog pages are server components for data fetching
- ClientNotion.jsx is client component for interactive rendering

**TypeScript/JavaScript Mix**:
- Most files are TypeScript (.tsx, .ts)
- ClientNotion renderer is JavaScript (.jsx) for flexibility with Notion block types
- Included in tsconfig via explicit path

**Notion Block Rendering**:
- Supports: paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, image
- Unsupported blocks show "Unsupported block" message
- Images handle both external URLs and Notion-hosted files

## Design Reference Bank

Abraham collects other personal websites as design inspiration in [docs/design-references.md](docs/design-references.md). When a reference URL gets dropped in (often with no instructions), fetch the site and add a new entry at the top of that file using the same format as the existing ones. Leave `Verdict` blank for Abraham to fill in. When asked to review, compare, or borrow from the references, start from that file.

## Key Files

- [app/layout.tsx](app/layout.tsx): Root layout with metadata, fonts, dark theme
- [app/page.tsx](app/page.tsx): Homepage: header, contributions, project tiles, work, writing
- [app/blog/page.tsx](app/blog/page.tsx): Blog index with posts from Notion
- [app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx): Individual blog post pages
- [components/ClientNotion.jsx](components/ClientNotion.jsx): Custom Notion block renderer
- [lib/notion-posts.ts](lib/notion-posts.ts): Blog post data fetching logic
