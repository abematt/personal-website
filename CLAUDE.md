# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website and blog for Abraham Mathew, deployed at www.abrahammathew.dev. Built with Next.js 14, shadcn/ui components, and Tailwind CSS with a dark theme.

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
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **CMS**: Notion (Official @notionhq/client API)
- **Icons**: Tabler Icons, Lucide React

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
- [lib/notion-posts.ts](lib/notion-posts.ts): Blog post fetching logic using `getPageContentBySlug()`
- Fetches blocks with pagination (100 blocks max per request)

**Component Organization**:
- `components/sections/`: Page sections (header, work-experience, projects)
- `components/data/`: Static content data (hero, experience, projects)
- `components/ui/`: Reusable UI primitives (shadcn/ui components)
- `components/utils/`: Utility functions like `highlightTechTerms()`

**Styling Approach**:
- Dark mode forced via `className="dark"` on `<html>` element
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
- Main page is client component (`'use client'`) for Framer Motion and scroll refs
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

## Key Files

- [app/layout.tsx](app/layout.tsx): Root layout with Navbar, metadata, dark theme
- [app/page.tsx](app/page.tsx): Homepage with hero, work experience, projects
- [app/blog/page.tsx](app/blog/page.tsx): Blog index with posts from Notion
- [app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx): Individual blog post pages
- [components/ClientNotion.jsx](components/ClientNotion.jsx): Custom Notion block renderer
- [lib/notion-posts.ts](lib/notion-posts.ts): Blog post data fetching logic
