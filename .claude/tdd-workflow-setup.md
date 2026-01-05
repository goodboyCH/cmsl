# TDD 마스터플랜 기반 개발 워크플로우

## 개요

이 가이드는 CMSL 프로젝트에서 **TDD (Test-Driven Development)** 기반으로:
- 마스터플랜 수립
- 페이즈별 마크다운 문서화
- 자동 진행률 관리

하는 워크플로우를 설정합니다.

> **프론트엔드 프로젝트 참고**: 모든 코드에 TDD를 적용할 필요는 없습니다. 비즈니스 로직, 커스텀 훅, 중요한 사용자 플로우에 집중하세요.

---

## 아키텍처

```
마스터플랜 (README-PLAN.md)
    │
    ├── docs/phases/
    │   ├── phase-1-guide.md
    │   ├── phase-2-guide.md
    │   └── ...
    │
    └── Phase별 개발 사이클
        ├── 테스트 설계
        ├── 코드베이스 분석 (Task - Explore)
        ├── 구현
        ├── 코드 리뷰 (/code-review)
        └── 문서 업데이트
```

---

## 1. 테스트 환경 (설정 완료)

### 설치된 패키지

- `vitest` - 테스트 러너
- `@testing-library/react` - React 컴포넌트 테스트
- `@testing-library/jest-dom` - DOM 매처
- `@testing-library/user-event` - 사용자 이벤트 시뮬레이션
- `jsdom` - 브라우저 환경 시뮬레이션

### 테스트 명령어

```bash
npm run test           # Vitest 실행 (watch 모드)
npm run test:run       # 단일 실행
npm run test:coverage  # 커버리지 리포트
```

### 설정 파일

- `vitest.config.ts` - Vitest 설정
- `vitest.setup.ts` - 테스트 환경 설정 (framer-motion, next/navigation 모킹 포함)

---

## 2. 프론트엔드 테스트 가이드라인

### 테스트가 효과적인 경우 (권장)

| 유형 | 예시 | 이유 |
|------|------|------|
| 복잡한 비즈니스 로직 | 폼 유효성 검사, 계산 로직 | 버그 방지 효과 높음 |
| 유틸리티 함수 | 날짜 포맷, 데이터 변환 | 순수 함수라 테스트 쉬움 |
| 커스텀 훅 | useAuth, usePagination | 재사용성 높은 로직 |
| 중요 사용자 플로우 | 로그인, 폼 제출, CRUD | 핵심 기능 보호 |
| Supabase 데이터 로직 | 쿼리, 뮤테이션 | API 연동 안정성 |

### 테스트 불필요한 경우 (스킵 가능)

| 유형 | 예시 | 이유 |
|------|------|------|
| 단순 UI 컴포넌트 | 버튼, 카드, 레이아웃 | 시각적 확인이 효율적 |
| shadcn/ui 래퍼 | components/ui/* | 이미 테스트된 라이브러리 |
| 정적 페이지 | About, Contact | 로직 없음 |
| 스타일링/애니메이션 | Tailwind, framer-motion | 비주얼 테스트 영역 |
| 3rd party 래퍼 | Three.js 컴포넌트 | 외부 라이브러리 영역 |

### CMSL 프로젝트 테스트 우선순위

1. **높음**: 관리자 CRUD, 인증 플로우, 폼 유효성 검사
2. **중간**: 다국어(i18n) 전환, 커스텀 훅, 데이터 페칭 로직
3. **낮음**: 순수 UI 컴포넌트, 애니메이션, 정적 페이지

---

## 3. TDD 워크플로우

### 3.1 마스터플랜 수립

사용자 요청 시 README-PLAN.md 생성:

```markdown
# [기능명] TDD 마스터플랜

## 프로젝트 개요
- 목표: [목표 설명]
- 기술 스택: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- 총 테스트: [개수]

## Phase 구조

### Phase 1: [목표]
- 핵심 기능: [기능1, 기능2]
- 테스트 수: N개
- 성공 기준: [기준]

## 진행률
| Phase | 상태 | 진행률 | 테스트 | 완료일 |
|-------|------|--------|--------|--------|
| 1 | 예정 | 0% | 0/N | - |
```

### 3.2 페이즈별 가이드 생성

각 Phase 시작 전에 `docs/phases/phase-N-guide.md` 생성:

```markdown
# Phase N: [목표]

## 개요
- Phase 목표: ...

## 테스트 케이스 설계

### Test 1: [설명]
- Given: [전제 조건]
- When: [행동]
- Then: [예상 결과]

## 체크리스트
- [ ] 테스트 케이스 설계 완료
- [ ] 테스트 통과
- [ ] 코드 리뷰 완료
```

---

## 4. TDD 사이클

```
1️⃣ 마스터플랜 (처음 1회)
   → README-PLAN.md 생성

2️⃣ Phase 시작
   → 페이즈 가이드 생성

3️⃣ 테스트 설계
   → 테스트 케이스 코드 생성

4️⃣ 첫 테스트 작성 (RED)
   테스트만 작성, 구현 X
   npm run test → 실패 확인

5️⃣ 최소 구현 (GREEN)
   Task (Explore) - 구조 파악
   → 구현
   → npm run test → 통과 확인

6️⃣ 리팩토링 (REFACTOR)
   코드 정리 및 최적화
   /code-review 활용

7️⃣ 다음 테스트로
   3️⃣ 단계로 돌아가기

8️⃣ Phase 완료
   → 진행률 업데이트
   → 다음 Phase 준비
```

---

## 5. 도구 역할 분담

| 도구 | 역할 | 사용 시점 |
|------|------|----------|
| @tdd-master | 마스터플랜, 테스트 설계, 문서화 | Phase 시작/종료 |
| Task (Explore) | 코드베이스 분석, 관련 파일 탐색 | 구현 시작 전 |
| Task (Plan) | 구현 계획 수립 | 복잡한 기능 설계 시 |
| /code-review | 코드 품질 검토 | Phase 테스트 완료 후 |
| /frontend-design | UI/UX 컴포넌트 생성 | 프론트 컴포넌트 작성 시 |

---

## 6. 사용 예시

### 마스터플랜 수립

```
@tdd-master

갤러리 관리 기능을 TDD로 개발하려고 해.

핵심 기능:
1. 이미지 업로드
2. 카테고리별 필터링
3. 관리자 CRUD

마스터플랜을 만들어줄래?
```

### Phase 시작

```
@tdd-master

Phase 1 시작: 갤러리 CRUD API

테스트 설계와 첫 테스트 코드를 만들어줄래?
```

### 구현 진행

```
첫 테스트 통과했어!
다음 테스트 (이미지 필터링)를 작성해줄래?
```

### 코드 리뷰

```
/code-review

Phase 1의 테스트 + 구현 코드 검토해줄래?
```

### Phase 완료

```
@tdd-master

Phase 1 완료!
- README-PLAN.md 진행률 업데이트해줄래?
- Phase 2 가이드 보여줄래?
```

---

## 7. 테스트 작성 템플릿

### 컴포넌트 테스트

```typescript
// __tests__/components/[Component].test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Component } from '@/components/Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Component onClick={onClick} />)
    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalled()
  })
})
```

### 훅 테스트

```typescript
// __tests__/hooks/[useHook].test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCustomHook } from '@/hooks/useCustomHook'

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.value).toBe(initialValue)
  })

  it('updates state correctly', () => {
    const { result } = renderHook(() => useCustomHook())

    act(() => {
      result.current.setValue('new value')
    })

    expect(result.current.value).toBe('new value')
  })
})
```

### Supabase 모킹

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    })),
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
  },
}))
```

### 다국어 테스트

```typescript
import { LanguageProvider } from '@/components/LanguageProvider'

const renderWithLanguage = (ui: React.ReactElement, language = 'en') => {
  return render(
    <LanguageProvider defaultLanguage={language}>
      {ui}
    </LanguageProvider>
  )
}

it('displays Korean text when language is ko', () => {
  renderWithLanguage(<Component />, 'ko')
  expect(screen.getByText('한국어 텍스트')).toBeInTheDocument()
})
```

---

## 8. 산출물 구조

```
프로젝트/
├── README-PLAN.md          # 마스터플랜 (TDD 진행 시)
├── docs/
│   └── phases/             # 페이즈별 가이드
│       ├── phase-1-guide.md
│       └── ...
├── __tests__/              # 테스트 파일
│   ├── components/
│   ├── hooks/
│   └── lib/
├── components/
├── app/
├── lib/
├── hooks/
├── vitest.config.ts
└── vitest.setup.ts
```

---

## 참고사항

- **선택적 TDD**: 프론트엔드는 모든 코드에 TDD가 필요하지 않음. 로직이 있는 부분에 집중
- **시각적 테스트**: UI는 브라우저에서 직접 확인하는 것이 효율적
- **점진적 적용**: 새 기능부터 TDD 적용, 기존 코드는 필요 시 테스트 추가
- **테스트 커버리지**: `npm run test:coverage`로 확인 (100% 목표 아님)
