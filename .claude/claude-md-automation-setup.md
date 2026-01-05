# CLAUDE.md에 추가할 자동화 워크플로우 설정

이 내용을 **기존 CLAUDE.md 파일의 맨 아래에 추가**하세요.

---

## 🚀 자동화 워크플로우 (Phase 전체 사이클)

### 기본 원리

**"Phase N 전체 사이클 돌려줘"** 또는 **"Phase N 시작해줘"** 명령 시,
다음 **5단계가 자동으로 순차 실행**됩니다.

### 5단계 워크플로우

#### 1단계: 테스트 설계 (@tdd-master)
- Phase 가이드 문서 생성 (`docs/phases/phase-N-guide.md`)
- 테스트 케이스 8-15개 설계 (Given-When-Then 형식)
- 구현 순서 정리
- 체크리스트 자동 생성

#### 2단계: 코드 탐색 (@serena MCP + LSP)
- Serena MCP로 관련 파일 자동 탐색
- 의존성 구조 파악
- 기존 코드 패턴 분석
- LSP 정보 기반 타입 분석
- 컨텍스트 자동 제공

#### 3단계: TDD 구현 (Claude)
- 첫 번째 테스트 파일 생성 (RED)
- 테스트 실행 → 실패 확인
- 최소 구현 코드 생성 (GREEN)
- `npm test` 실행 → 테스트 통과 확인

#### 4단계: 자동 코드 리뷰 (@code-review)
- 테스트 + 구현 코드 자동 검토
- 개선 제안 (성능, 타입, 스타일)
- 버그 가능성 체크
- 테스트 커버리지 확인

#### 5단계: 문서 업데이트 (@tdd-master)
- `README-PLAN.md` 진행률 업데이트
- Phase 가이드 체크리스트 반영
- 완료된 테스트 마크 표시
- 다음 테스트 제안

### 사용 방법

**명령 (다음 중 하나):**

```
@tdd-master
Phase 1 전체 사이클 돌려줘
```

또는

```
@tdd-master
Phase 1 시작해줘
```

또는

```
Phase 1 자동화 실행
```

### 자동 출력 예시

```
🚀 Phase 1 전체 사이클 시작

## 1️⃣ 테스트 설계 (@tdd-master)
📄 docs/phases/phase-1-guide.md 생성 완료
✅ 8개 테스트 케이스 설계 완료

## 2️⃣ 코드 탐색 (@serena MCP)
🔍 관련 파일 탐색 완료:
  - components/auth/LoginForm.tsx
  - hooks/useAuth.ts
  - utils/validators.ts
  - types/auth.ts

## 3️⃣ TDD 구현 (Claude)
📝 src/__tests__/auth/login.test.tsx 생성
🔴 테스트 실행: 1/8 실패 (RED)
📝 src/components/auth/LoginForm.tsx 생성
💚 테스트 실행: 1/8 통과 (GREEN)

## 4️⃣ 코드 리뷰 (@code-review)
✅ 타입 안전성: OK
⚠️ 성능 제안: useCallback 추가 권장
✅ 테스트 커버리지: 100%
💡 리팩토링: 컴포넌트 분리 고려

## 5️⃣ 문서 업데이트 (@tdd-master)
📊 README-PLAN.md 진행률 업데이트
   Phase 1: 0% → 12.5% (1/8 완료)
📋 체크리스트 업데이트:
   ✅ Test 1: LoginForm 렌더링 (완료)
   ⬜ Test 2: 이메일 유효성 검사 (예정)
   ⬜ Test 3: 비밀번호 입력 (예정)
   ...

---

🎯 Phase 1 첫 테스트 완료!
📌 다음 테스트 구현할까요? (Y/N)
```

### 자동화 규칙 (중요)

**Trigger (자동 실행 조건):**
- "Phase N 전체 사이클"
- "Phase N 시작"
- "Phase N 자동화"
- "Phase N 시작해줘"

**Sequence (순차 실행 순서):**
1. @tdd-master (테스트 설계)
2. @serena (코드 탐색) + LSP 활용
3. Claude (구현)
4. @code-review (검토)
5. @tdd-master (문서 업데이트)

**각 단계 완료 후:**
- 자동으로 다음 단계로 진행
- 진행 상황 실시간 표시
- 오류 발생 시 사용자에게 확인 요청

### 실제 사용 시나리오

```
당신:
@tdd-master
Phase 1 전체 사이클 돌려줘

Claude (자동 실행):

🚀 시작...

[1단계: 테스트 설계]
@tdd-master이(가) 테스트 설계 중...
  ✅ docs/phases/phase-1-guide.md 생성
  ✅ 8개 테스트 케이스 설계 완료
  ✅ Given-When-Then 형식 정의

[2단계: 코드 탐색]
@serena가 코드 탐색 중...
  ✅ 관련 파일 3개 발견
  ✅ 기존 패턴 분석 완료
  ✅ 컨텍스트 준비 완료

[3단계: TDD 구현]
테스트 + 구현 코드 작성 중...
  📝 src/__tests__/auth/login.test.tsx 생성
  🔴 npm test: 1 failed (예상된 실패)
  📝 src/components/auth/LoginForm.tsx 생성
  💚 npm test: 1 passed (성공!)

[4단계: 코드 리뷰]
@code-review가 검토 중...
  ✅ 타입 검사 OK
  ⚠️ 개선 제안: useCallback 추가
  ✅ 테스트 100% 커버리지
  완료!

[5단계: 문서 업데이트]
@tdd-master이(가) 문서 업데이트 중...
  ✅ README-PLAN.md 진행률 업데이트 (12.5%)
  ✅ Phase-1-guide.md 체크리스트 업데이트
  ✅ 다음 테스트 제안 준비

---

🎯 완료!
Phase 1 첫 테스트 완료: LoginForm 렌더링 ✅

📌 다음 단계:
- 다음 테스트 구현할까요? (Y/N)
```

### 수동 개입 필요한 부분

**자동화 불가능 (Y/N 선택 필요):**
- ❓ 다음 테스트 계속 구현할지 결정
- ❓ 리뷰 피드백 반영할지 결정
- ❓ 리팩토링 수준 결정

**자동화 100% 가능:**
- ✅ 테스트 설계
- ✅ 코드 탐색
- ✅ 첫 구현
- ✅ 기본 리뷰
- ✅ 문서 업데이트

---

## Phase별 TDD 적용 비율

각 Phase의 TDD 수준과 자동화 정도:

| Phase | 영역 | TDD 비율 | 자동화 수준 |
|-------|------|---------|-----------|
| Phase 1 | 인증 (비즈니스 로직) | 100% | ✅ 전체 자동화 |
| Phase 2 | UI 컴포넌트 | 70% | ⚠️ 기능 자동화, 스타일 수동 |
| Phase 3 | 시뮬레이션 관리 | 80% | ✅ 대부분 자동화 |
| Phase 4 | 실시간 결과 | 60% | ⚠️ WebSocket 수동 테스트 포함 |
| Phase 5 | 히스토리/갤러리 | 70% | ✅ 중간 수준 자동화 |

---

## 자동화 설정 프롬프트

### Claude Code에서 실행할 프롬프트

```
다음을 모두 실행해줄래:

1️⃣ CLAUDE.md 파일 확인
   - 기존 내용 모두 유지
   - 맨 아래에 추가할 준비

2️⃣ 다음 섹션을 CLAUDE.md 맨 아래에 추가해줘:

---

## 🚀 자동화 워크플로우 (Phase 전체 사이클)

### 기본 원리
"Phase N 전체 사이클 돌려줘" 명령 시, 5단계가 자동 실행됩니다.

### 5단계 워크플로우
1. @tdd-master: 테스트 설계
2. @serena: 코드 탐색
3. Claude: TDD 구현
4. @code-review: 자동 리뷰
5. @tdd-master: 문서 업데이트

[위의 상세 내용 전체 복사]

---

3️⃣ .claude/agents/tdd-master.md 파일의 "## 기본 행동" 섹션에 다음을 추가해줘:

---

## 자동화 모드 (Phase 전체 사이클)

**Trigger 키워드:**
- "Phase N 전체 사이클 돌려줘"
- "Phase N 시작해줘"

**자동 실행 순서:**
1. 테스트 설계: docs/phases/phase-N-guide.md 생성
2. 코드 탐색: /mcp__serena__ 자동 호출
3. TDD 구현: 테스트 + 구현 코드 생성
4. 코드 리뷰: @code-review 자동 호출
5. 문서 업데이트: README-PLAN.md + 체크리스트

---

4️⃣ 완료 확인:
   - CLAUDE.md 업데이트 완료 (Y/N)
   - .claude/agents/tdd-master.md 업데이트 완료 (Y/N)

5️⃣ 설정 완료 후 확인 메시지:

✅ 자동화 워크플로우 설정 완료!

이제 다음 명령으로 5단계가 자동 실행됩니다:
@tdd-master
Phase 1 전체 사이클 돌려줘

테스트 준비 끝!
```

### 설정 확인

설정이 완료되면 다음을 확인:

- [ ] CLAUDE.md에 "## 🚀 자동화 워크플로우" 섹션 추가됨
- [ ] .claude/agents/tdd-master.md에 자동화 모드 설명 추가됨
- [ ] "Phase 1 전체 사이클 돌려줘" 명령 인식됨
- [ ] 5단계 순차 실행 가능 확인

---

## 다음: 실제 마스터플랜 생성

자동화 설정이 완료되면, 실제 프로젝트의 마스터플랜을 생성:

```
@tdd-master

신소재 시뮬레이션 플랫폼 프로젝트를 TDD로 구축하려고 해.

핵심 기능:
1. 사용자 인증 (회원가입, 로그인)
2. LLM 프롬프트 입력
3. 시뮬레이션 실행
4. 결과 시각화

기술 스택: Next.js 15 + TypeScript + Tailwind + shadcn/ui

TDD 마스터플랜을 만들어줄래?
```

그럼 자동으로:
- `README-PLAN.md` 생성
- `docs/phases/` 디렉토리 + 모든 phase 가이드 생성
- 첫 마스터플랜 준비 완료!
