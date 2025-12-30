# CMSL (Computational Materials Science Laboratory)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 18, shadcn/ui, Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- We recommend using nvm: [nvm Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

## Getting Started

### Install Dependencies

```sh
npm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```sh
cp .env.local.example .env.local
```

### Development Server

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

## Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── board/              # Board pages (news, gallery)
├── people/             # People pages (professor, members, alumni)
├── research/           # Research pages
└── ...
components/
├── pages/              # Page-specific components
├── ui/                 # shadcn/ui components
└── ...
lib/                    # Utility functions
hooks/                  # Custom React hooks
public/                 # Static assets
```

---

## Git Flow Strategy

이 프로젝트는 **Git Flow** 브랜치 전략을 사용합니다.

### Branch Types

| Branch | Purpose | Base Branch | Merge To |
|--------|---------|-------------|----------|
| `main` | 프로덕션 배포 코드 | - | - |
| `develop` | 개발 통합 브랜치 | `main` | `main` |
| `feature/*` | 새 기능 개발 | `develop` | `develop` |
| `release/*` | 릴리즈 준비 | `develop` | `main`, `develop` |
| `hotfix/*` | 긴급 버그 수정 | `main` | `main`, `develop` |

### Branch Flow Diagram

```
main ─────●─────────────────●─────────────●──────
          │                 ↑             ↑
          │            (release)      (hotfix)
          │                 │             │
develop ──●──●──●──●──●─────●─────────────●──────
             │     ↑
         (feature) │
             │     │
feature/* ───●─────┘
```

### GitHub Issue 기반 브랜치 네이밍

**모든 작업은 GitHub Issue에서 시작합니다:**

1. GitHub에서 Issue 생성 (예: `갤러리 페이지 추가` → Issue #12)
2. Issue 번호를 브랜치 이름에 포함

**브랜치 네이밍 규칙:**
```
<type>/#<issue-number>-<short-description>

- type: feature, chore, fix, hotfix, release  중 하나
- issue-number: GitHub Issue 번호
- short-description: 영문 소문자, 단어는 하이픈(-)으로 연결
```

**Examples:**
| Issue | Issue 제목 | 브랜치 이름 |
|-------|-----------|------------|
| #12 | 갤러리 페이지 추가 | `feature/#12-gallery-page` |
| #25 | 다크모드 기능 구현 | `feature/#25-dark-mode` |
| #30 | 로그인 버그 수정 | `hotfix/#30-login-bug` |
| #35 | v1.2.0 릴리즈 | `release/#35-v1.2.0` |
| #42 | 회원가입 폼 유효성 검사 | `feature/#42-signup-validation` |
| #55 | 이미지 업로드 성능 개선 | `feature/#55-image-upload-perf` |

### Workflow

#### 1. 새 기능 개발 (Feature)

```sh
# 1. GitHub에서 Issue 생성 (예: #12 갤러리 페이지 추가)

# 2. develop에서 feature 브랜치 생성 (이슈 번호 포함)
git checkout develop
git pull origin develop
git checkout -b feature/#12-gallery-page

# 3. 개발 작업...
git add .
git commit -m "feat: 갤러리 페이지 추가 (#12)"

# 4. develop에 머지
git checkout develop
git merge feature/#12-gallery-page
git push origin develop

# 5. feature 브랜치 삭제
git branch -d feature/#12-gallery-page
```

#### 2. 릴리즈 준비 (Release)

```sh
# 1. GitHub에서 Release Issue 생성 (예: #35 v1.0.0 릴리즈)

# 2. develop에서 release 브랜치 생성
git checkout develop
git checkout -b release/#35-v1.0.0

# 3. 버전 업데이트, 버그 수정 등...
git commit -m "chore: prepare release v1.0.0 (#35)"

# 4. main에 머지 및 태그
git checkout main
git merge release/#35-v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags

# 5. develop에도 머지
git checkout develop
git merge release/#35-v1.0.0
git push origin develop

# 6. release 브랜치 삭제
git branch -d release/#35-v1.0.0
```

#### 3. 긴급 수정 (Hotfix)

```sh
# 1. GitHub에서 Hotfix Issue 생성 (예: #40 로그인 버그 긴급 수정)

# 2. main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/#40-login-bug

# 3. 버그 수정...
git commit -m "fix: 로그인 버그 긴급 수정 (#40)"

# 4. main에 머지 및 태그
git checkout main
git merge hotfix/#40-login-bug
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin main --tags

# 5. develop에도 머지
git checkout develop
git merge hotfix/#40-login-bug
git push origin develop

# 6. hotfix 브랜치 삭제
git branch -d hotfix/#40-login-bug
```

### Commit Message Convention

```
<type>: <description> (#<issue-number>)

[optional body]
```

**Types:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

**Examples:**
```
feat: 갤러리 페이지 추가 (#12)
fix: 로그인 버그 수정 (#40)
docs: README 업데이트 (#5)
chore: dependencies 업데이트 (#22)
```

> **Tip**: 커밋 메시지에 `(#이슈번호)`를 포함하면 GitHub에서 자동으로 해당 이슈에 링크됩니다.

### Initial Setup

Git Flow를 처음 설정하는 경우:

```sh
# develop 브랜치 생성 (아직 없다면)
git checkout main
git checkout -b develop
git push -u origin develop
```

### Vercel Deployment

- `main` 브랜치 → Production 배포
- `develop` 브랜치 → Preview 배포 (선택사항)

---

## License

MIT
