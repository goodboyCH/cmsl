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

## TDD 기반 개발 워크플로우

상세 가이드: [.claude/tdd-workflow-setup.md](.claude/tdd-workflow-setup.md)

### TDD 사이클

```
1️⃣ 마스터플랜 → README-PLAN.md 생성
2️⃣ Phase 시작 → docs/phases/phase-N-guide.md 생성
3️⃣ RED → 실패하는 테스트 작성
4️⃣ GREEN → 테스트 통과시키는 최소 구현
5️⃣ REFACTOR → 코드 정리 (/code-review 활용)
6️⃣ 반복 → 다음 테스트로
```

### 도구 역할

| 도구 | 역할 | 사용 시점 |
|------|------|----------|
| Task (Explore) | 코드베이스 분석 | 구현 시작 전 |
| Task (Plan) | 구현 계획 수립 | 복잡한 기능 설계 시 |
| /code-review | 코드 품질 검토 | Phase 완료 후 |
| /frontend-design | UI 컴포넌트 생성 | 프론트 작성 시 |

### 테스트 명령어

```bash
npm run test           # Vitest 실행 (watch 모드)
npm run test:run       # 단일 실행
npm run test:coverage  # 커버리지 리포트
```

### 사용 예시

```
# 마스터플랜 수립
"갤러리 기능을 TDD로 개발하려고 해. 마스터플랜을 만들어줄래?"

# Phase 시작
"Phase 1 시작: 갤러리 UI. 테스트 설계와 첫 테스트 코드를 만들어줄래?"

# 구현 진행
"첫 테스트 통과했어! 다음 테스트를 작성해줄래?"

# Phase 완료
"Phase 1 완료! README-PLAN.md 진행률 업데이트해줄래?"
```

## 자동화 워크플로우 (Phase 전체 사이클)

### 기본 원리

**"Phase N 전체 사이클 돌려줘"** 또는 **"Phase N 시작해줘"** 명령 시, 5단계가 자동으로 순차 실행됩니다.

### 5단계 워크플로우

| 단계 | 도구 | 작업 내용 |
|------|------|----------|
| 1 | @tdd-master | 테스트 설계 - `docs/phases/phase-N-guide.md` 생성, 테스트 케이스 설계 |
| 2 | Task (Explore) | 코드 탐색 - 관련 파일 탐색, 기존 패턴 분석, 컨텍스트 준비 |
| 3 | Claude | TDD 구현 - 테스트 작성(RED) → 구현(GREEN) → `npm test` 실행 |
| 4 | /code-review | 코드 리뷰 - 타입 안전성, 성능, 테스트 커버리지 검토 |
| 5 | @tdd-master | 문서 업데이트 - `README-PLAN.md` 진행률, 체크리스트 반영 |

### 트리거 키워드

다음 명령어로 자동화 사이클 시작:

```
Phase 1 전체 사이클 돌려줘
Phase 1 시작해줘
Phase 1 자동화 실행
```

### 자동 출력 예시

```
🚀 Phase 1 전체 사이클 시작

## 1️⃣ 테스트 설계 (@tdd-master)
📄 docs/phases/phase-1-guide.md 생성 완료
✅ 8개 테스트 케이스 설계 완료

## 2️⃣ 코드 탐색 (Task Explore)
🔍 관련 파일 탐색 완료:
  - components/pages/GalleryPage.tsx
  - lib/supabaseClient.ts

## 3️⃣ TDD 구현 (Claude)
📝 __tests__/components/gallery.test.tsx 생성
🔴 테스트 실행: 1/8 실패 (RED)
📝 components/Gallery.tsx 생성
💚 테스트 실행: 1/8 통과 (GREEN)

## 4️⃣ 코드 리뷰 (/code-review)
✅ 타입 안전성: OK
✅ 테스트 커버리지: 100%

## 5️⃣ 문서 업데이트 (@tdd-master)
📊 README-PLAN.md 진행률: 0% → 12.5% (1/8 완료)

---
🎯 Phase 1 첫 테스트 완료!
📌 다음 테스트 구현할까요? (Y/N)
```

### 수동 개입 필요 부분

| 자동화 가능 | 수동 결정 필요 |
|------------|---------------|
| ✅ 테스트 설계 | ❓ 다음 테스트 계속할지 |
| ✅ 코드 탐색 | ❓ 리뷰 피드백 반영 여부 |
| ✅ 첫 구현 | ❓ 리팩토링 수준 |
| ✅ 기본 리뷰 | |
| ✅ 문서 업데이트 | |

### CMSL 프로젝트 TDD 적용 비율

| 영역 | TDD 비율 | 이유 |
|------|---------|------|
| 관리자 CRUD | 100% | 핵심 비즈니스 로직 |
| 폼 유효성 검사 | 100% | 버그 방지 효과 높음 |
| 커스텀 훅 | 80% | 재사용 로직 |
| 다국어(i18n) | 70% | 주요 기능 |
| UI 컴포넌트 | 30% | 시각적 확인 더 효율적 |
| 애니메이션 | 0% | 비주얼 테스트 영역 |
