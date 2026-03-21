# r3gardless.dev

Next.js 블로그 플랫폼 (Notion CMS 연동)

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + CSS Variables
- **State**: Zustand (`src/store/`)
- **CMS**: Notion API (`@notionhq/client` + `notion-client`)
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library
- **UI Docs**: Storybook
- **Package Manager**: Bun

## Commands

```bash
bun run dev              # 개발 서버 (Turbopack)
bun run build            # 프로덕션 빌드
bun run start            # 프로덕션 서버
bun run test:unit:run    # 테스트 실행
bun run lint             # ESLint (auto-fix)
bun run lint:check       # ESLint (check only)
bun run format           # Prettier
bun run format:check     # Prettier (check only)
bun run types:check      # TypeScript 타입 체크
bun run storybook        # Storybook 개발 서버
bun run build:meta       # Notion 포스트 메타데이터 JSON 생성
```

## Architecture

- **Atomic Design**: atoms → molecules → organisms → templates → pages
- **Components**: `src/components/` (common, layout, meta, providers, sections, templates, ui)
- **Notion API**:
  - `src/libs/notion.ts` — 공식 SDK (`@notionhq/client`)
  - `src/libs/notionClient.ts` — 비공식 클라이언트 (`notion-client`)
- **Styles**: `src/styles/` (globals.css, notion.css, prism-theme.css, masonry.css)
- **Tests**: `src/__tests__/` (src 구조 미러링)

## Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   ├── about/          # About page
│   └── blog/           # Blog pages ([slug] 동적 라우트)
├── components/
│   ├── common/         # 공용 컴포넌트
│   ├── layout/         # Header, Footer
│   ├── meta/           # SEO, Analytics
│   ├── providers/      # Context providers
│   ├── sections/       # 페이지별 섹션
│   ├── templates/      # 페이지 템플릿
│   └── ui/             # 재사용 UI (about, blog, buttons, pagination, search, typography)
├── constants/          # 상수 (blog, site, storage)
├── hooks/              # Custom hooks
├── libs/               # 외부 라이브러리 통합
├── store/              # Zustand stores
├── styles/             # 글로벌 스타일
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## Theming

- 모든 색상은 `src/styles/globals.css`의 CSS 변수 사용
- Light: `:root`, Dark: `[data-theme='dark']`
- **절대 색상 하드코딩 금지** (`theme === 'light' ? '#fff' : '#000'` 같은 JS 조건문 금지)

### 주요 CSS 변수

```css
var(--color-background)     /* 메인 배경 */
var(--color-surface)        /* 카드/표면 배경 */
var(--color-text-primary)   /* 기본 텍스트 */
var(--color-text-secondary) /* 보조 텍스트 */
var(--color-primary)        /* 브랜드 컬러 */
var(--color-accent)         /* 강조 컬러 */
var(--color-border)         /* 테두리 */
var(--color-divider)        /* 구분선 */
```

## Typography

`src/components/ui/typography/`의 Typography 컴포넌트 사용 필수:

```tsx
import { Heading, Text } from '@/components/ui/typography';

<Heading level={1}>제목</Heading>
<Heading level={2} fontFamily="maruBuri">섹션 제목</Heading>
<Text fontFamily="maruBuri" className="text-lg">본문</Text>
```

- `<Heading level={1-5}>` — 모든 heading
- `<Text>` — paragraph, inline text
- Props: `fontFamily` (`'maruBuri'` | `'pretendard'`), `className`
- 예외: Notion 콘텐츠 렌더링, 서드파티 라이브러리 내부

## Conventions

- 접근성 우선 (`aria-*`, 시맨틱 요소)
- Notion 스타일은 `src/styles/notion.css`, 코드 하이라이팅은 `src/styles/prism-theme.css`
- CI/CD: GitHub Actions (ESLint → TypeScript check → Unit tests → Build)
- 기존 패턴을 따를 것 — 확실하지 않으면 기존 코드 참고
