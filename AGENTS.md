# r3gardless.dev

Next.js App Router 기반의 정적 블로그입니다. 콘텐츠 원본은 개인 KNOWLEDGE_BASE의 Markdown이고, 빌드 시 `publish: true` 문서만 `content/posts/`와 `public/content/`로 export한 뒤 렌더링합니다.

## 스택

- Framework: Next.js 16 App Router, React 19, TypeScript
- Styling: Tailwind CSS v4, CSS variables, `src/styles/globals.css`
- Content: KNOWLEDGE_BASE Markdown -> `content/posts/` -> static render
- Markdown: unified, remark-gfm, remark-math, remark-wiki-link, rehype-katex, rehype-pretty-code, Mermaid client renderer
- Icons: 일반 UI 아이콘은 `lucide-react`, 브랜드/소셜 아이콘은 `react-icons` 브랜드 팩
- Tests: Vitest, Testing Library
- Package manager: Bun
- Deploy: `output: 'export'` 기반 GitHub Pages, `out/.nojekyll`

## 디렉터리 구조

```text
r3gardless.dev/
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── docs/REPO_GUIDE.md      # 구조, 디자인 톤앤매너, 하네스 상세
├── .agents/r3gardless-dev/ # 공용 AI agent skill 원본
├── .codex/skills/          # 공용 skill을 가리키는 Codex symlink
├── content/posts/          # KNOWLEDGE_BASE에서 export된 publish:true Markdown. generated, gitignore.
├── public/content/         # 본문/cover asset export. generated, gitignore.
├── public/data/            # postMeta.json, contentLinkIndex.json. generated, gitignore.
├── scripts/                # sync/build/check KNOWLEDGE_BASE content pipeline
├── src/
│   ├── app/                # Next.js routes
│   ├── components/         # UI, sections, templates, layout
│   ├── libs/content/       # KNOWLEDGE_BASE scanner, exporter, resolver, Markdown renderer
│   ├── styles/             # globals, Markdown body, code theme, masonry
│   ├── types/
│   └── utils/
├── src/__tests__/          # src 구조를 미러링하는 단위 테스트
├── tests/fixtures/kb/      # 하네스용 fixture KNOWLEDGE_BASE
└── .github/workflows/      # ci.yml, deploy.yml
```

## 콘텐츠 파이프라인

1. `KNOWLEDGE_BASE_PATH`가 가리키는 KNOWLEDGE_BASE 루트를 가장 먼저 읽습니다. 기본 후보에는 `.cache/knowledge-base/KNOWELDGE_BASE`, `.cache/knowledge-base/KNOWLEDGE_BASE`, 레포 상위의 `KNOWLEDGE_BASE`/`KNOWELDGE_BASE`가 포함됩니다.
2. `scripts/build-content.ts`가 전체 KNOWLEDGE_BASE frontmatter를 스캔합니다.
3. `publish: true`이고 `layer !== source`인 Markdown만 `content/posts/<slug>/index.md`로 export합니다.
4. `cover`와 본문 이미지는 `public/content/posts/<slug>/assets/`로 복사하고 Markdown 경로를 절대 public 경로로 재작성합니다. Exported asset URL은 content hash를 포함해야 하며, 같은 파일명으로 이미지를 교체해도 cache가 남지 않아야 합니다.
5. 위키링크와 KNOWLEDGE_BASE 내부 `.md` 링크는 다음 순서로 처리합니다.
   - publish 대상: `/blog/<slug>` 내부 링크
   - 미발행 source + `source_url`: 외부 원문 URL
   - 그 외: 텍스트 강등 및 warning
6. `scripts/build-post-meta.ts`가 export된 Markdown frontmatter에서 `public/data/postMeta.json`을 만듭니다.
7. `scripts/check-links.ts`는 남은 `.md` 상대 링크, 깨진 이미지, 발행 대상 링크 오류를 실패 처리합니다.

KNOWLEDGE_BASE 원본은 읽기 전용입니다. 이 레포의 파이프라인은 generated output만 쓰며, KNOWLEDGE_BASE 파일을 수정하지 않습니다. 예외는 마이그레이션 회고 노트 1건 추가가 명시된 작업뿐입니다.

## 명령어

```bash
bun install
bun run dev
bun run sync:knowledge-base
bun run build:content
bun run build:meta
bun run check-links
bun run smoke:out
bun run test:unit:run
bun run types:check
bun run lint:check
bun run format:check
bun run build
bun run verify
bun run export
```

`bun run verify`가 로컬 단일 게이트입니다. 순서는 `types:check -> lint:check -> format:check -> test:unit:run -> build(prebuild: build:content + build:meta) -> check-content -> check-repo -> smoke:out -> check-links`입니다. CI는 branch protection의 required check와 맞추기 위해 `lint-build`와 `unit-test` job으로 나눕니다.

## 디자인 톤앤매너

상세 기준은 [docs/REPO_GUIDE.md](./docs/REPO_GUIDE.md)를 우선합니다.

- 본문 글꼴은 Pretendard입니다. MaruBuri는 로고, 페이지 타이틀, 섹션 제목 같은 accent에 제한합니다.
- 색상은 `globals.css` CSS 변수만 사용합니다.
- 블로그와 About은 얇은 구분선, 충분한 여백, 절제된 흑백 대비로 구성합니다.
- 중첩 카드, 과한 glass, gradient/orb 장식, 마케팅식 hero composition은 피합니다.
- `src/styles/markdown.css`의 `.post-body`가 Markdown 본문 룩의 기준입니다.

## Markdown 렌더링 규칙

- GitHub alert는 `remark-github-blockquote-alert`로 처리합니다.
- KaTeX는 `remark-math`와 `rehype-katex`로 정적 렌더링합니다.
- Mermaid fence는 `<Mermaid />` 클라이언트 컴포넌트로 변환하고 mount 시 `mermaid.run()`을 호출합니다.
- 코드 하이라이트는 `rehype-pretty-code`와 Shiki를 사용합니다.
- heading id와 ToC는 `github-slugger` 기준으로 맞춥니다.
- Markdown 본문 스타일은 `src/styles/markdown.css`의 `.post-body` 아래 표준 태그 스타일입니다.

## 구현 규칙

- 기존 레이아웃과 SEO surface를 유지합니다.
- 정적 export가 깨지면 안 됩니다. `next start` 의존 기능을 추가하지 마십시오.
- raw/source 원문은 블로그로 발행하지 않습니다.
- KNOWLEDGE_BASE 내부 `.md` 링크가 최종 output에 남으면 실패입니다.
- 발행 frontmatter의 canonical image field는 `cover`입니다.
- Exported cover/body asset URL은 content hash를 포함해야 합니다.
- 블로그 category는 frontmatter `category`를 우선하고, `type: concept` 같은 KNOWLEDGE_BASE 타입을 category로 쓰지 않습니다.
- 색상은 `globals.css` CSS 변수만 사용합니다. JS에서 테마별 색상 분기를 만들지 않습니다.
- 페이지/섹션 일반 텍스트는 Typography 컴포넌트 사용을 우선합니다. Markdown 렌더러 내부 raw tag는 예외입니다.
- 일반 UI 아이콘은 `lucide-react`, GitHub/LinkedIn/X 같은 브랜드 아이콘은 `react-icons/si`를 우선 사용하고 없으면 `react-icons/fa` 같은 브랜드 팩으로 대체합니다.
- 자동 병합 워크플로우를 만들지 않습니다. Dependabot PR도 사람이 확인해서 병합합니다.

## CI/CD

- `ci.yml`: PR에서 `lint-build`와 `unit-test` required check를 실행합니다. `lint-build`는 private KNOWLEDGE_BASE checkout 후 타입/린트/포맷/build/content/link/smoke 게이트를 실행하고, `unit-test`는 `bun run test:unit:run`을 실행합니다.
- `deploy.yml`: main push에서 private `R3gardless/KNOWLEDGE_BASE` checkout, `bun run verify`, `out/.nojekyll`, GitHub Pages upload/deploy. CI/CD는 fixture fallback을 쓰지 않고 `KNOWLEDGE_BASE_TOKEN`을 필수로 요구합니다.
- private KNOWLEDGE_BASE 접근에는 repository secret `KNOWLEDGE_BASE_TOKEN`이 필요합니다.
