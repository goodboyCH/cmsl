# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check

# shadcn component 추가
npx shadcn@latest add [component-name]
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (relaxed strict mode)
- **Styling**: Tailwind CSS with custom 24-column grid
- **UI Library**: shadcn/ui (40+ Radix UI components)
- **Animation**: Framer Motion, GSAP, @bsmnt/scrollytelling
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL + Auth)
- **3D**: Three.js, @react-three/drei, VTK.js
- **AI**: Google Generative AI (Gemini)
- **Deployment**: Vercel

## Architecture

### Directory Structure

```
app/                    # Next.js App Router
├── layout.tsx          # Root layout (metadata, providers)
├── page.tsx            # Home (delegates to HomePage component)
├── board/              # News, Gallery (CRUD pages)
├── people/             # Professor, Members, Alumni
├── research/           # Research topic pages
└── [route]/page.tsx    # Each route renders a component from components/pages/

components/
├── ui/                 # shadcn/ui primitives (DO NOT modify directly)
├── pages/              # Page-specific components (HomePage, AdminPage, etc.)
├── reactbits/          # Custom animation components (BlurText, GradientText, etc.)
├── Header.tsx          # Global navigation header
├── LanguageProvider.tsx # i18n context (Korean/English)
└── ...

lib/
├── supabaseClient.ts   # Supabase client (handles server/client env)
└── utils.ts            # cn() utility for Tailwind class merging

hooks/
├── use-mobile.ts       # Mobile breakpoint detection
└── use-toast.ts        # Toast notifications
```

### Key Patterns

**Client Components**: Mark with `'use client'` directive for hooks, Supabase, animations.

**Internationalization**: Custom `useLanguage()` hook.
```tsx
const { t, language } = useLanguage();
// Supabase fields: title (English), title_ko (Korean)
```

**24-Column Grid**: Custom Tailwind grid system.
```tsx
className="grid grid-cols-24 gap-4"
className="col-span-13"
```

**Data Fetching**: Supabase queries in useEffect.
```tsx
const { data } = await supabase.from('pages').select('*').eq('page_key', 'home').single();
```

### Supabase Tables

- `pages` - CMS page content (with `_ko` language variants)
- `publications` - Research papers
- `projects` - Research projects
- `notices` - News/announcements
- `gallery` - Image gallery

## Git Workflow

**Branch Naming** (GitHub Issue-based):
```
<type>/#<issue-number>-<description>
feature/#12-gallery-page
fix/#30-login-bug
hotfix/#40-urgent-fix
release/#35-v1.0.0
```

**Commit Convention**:
```
<type>: <description> (#<issue-number>)

feat: 갤러리 페이지 추가 (#12)
fix: 로그인 버그 수정 (#40)
```

**Branch Flow**:
- `main` → Production (Vercel auto-deploy)
- `develop` → Integration
- `feature/*` → New features (from develop)
- `hotfix/*` → Emergency fixes (from main)

## Claude Code Tools

### Plugins

| Command | Purpose |
|---------|---------|
| `/code-review` | PR code review |
| `/frontend-design` | UI component design/generation |

### MCP Servers

| MCP | Purpose |
|-----|---------|
| Serena | Codebase analysis, context understanding |

## UI Development Guidelines

1. Use `components/ui/` shadcn components first
2. Icons: `lucide-react`
3. Animation: `framer-motion` preferred
4. Responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints
5. New shadcn components: `npx shadcn@latest add [name]`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GOOGLE_GENERATIVE_AI_API_KEY
NEXT_PUBLIC_EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```
