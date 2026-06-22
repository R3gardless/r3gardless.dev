# r3gardless.dev Guide

## 성격

`r3gardless.dev`는 개인 KB에서 검증된 글만 가져와 정적 블로그로 발행하는 사이트입니다. 앱은 조용하고 읽기 중심이어야 하며, 마케팅 페이지처럼 과장된 히어로나 장식적인 카드 묶음으로 흐르지 않습니다.

## 디렉터리

```text
r3gardless.dev/
├── AGENTS.md
├── CLAUDE.md
├── .codex/skills/r3gardless-dev/
├── content/posts/          # generated, KB publish:true Markdown
├── public/content/         # generated, exported cover/body assets
├── public/data/            # generated, postMeta/contentLinkIndex
├── scripts/                # content sync/build/check harness
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # layout, sections, templates, ui
│   ├── constants/          # site/blog/about/static data
│   ├── libs/content/       # KB scanner/exporter/renderer
│   ├── libs/seo/
│   ├── styles/
│   ├── types/
│   └── utils/
├── src/__tests__/
├── tests/fixtures/kb/
└── .github/workflows/
```

## 콘텐츠 계약

- GitHub Actions는 private `R3gardless/KNOWLEDGE_BASE`를 `.cache/knowledge-base`로 checkout합니다.
- `KB_PATH`는 repo root 또는 `KNOWELDGE_BASE`/`KNOWLEDGE_BASE` 하위 폴더 모두 허용합니다.
- 발행은 `publish: true`이고 `layer !== source`인 Markdown만 허용합니다.
- cover 필드는 `cover`만 사용합니다. 본문 이미지와 cover는 `public/content/posts/<slug>/assets/`로 복사되어 content hash가 포함된 절대 public 경로로 재작성됩니다.
- `category`는 frontmatter 값을 우선합니다. 없을 때만 `.../<category>/wiki/...` 경로에서 파생합니다. `type: concept` 같은 KB 타입을 블로그 category로 쓰지 않습니다.
- KB 내부 `.md` 링크와 wikilink는 발행 글이면 `/blog/<slug>`, source 노트면 `source_url`/`archived_url`, 그 외에는 텍스트 강등입니다.
- raw/source 원문은 절대 `content/posts/`로 export하지 않습니다.

## 디자인 톤앤매너

- 색은 `src/styles/globals.css` CSS 변수만 씁니다.
- 기본 본문은 Pretendard입니다. MaruBuri는 로고, 주요 페이지 타이틀, 섹션 제목 같은 editorial accent에 제한합니다.
- 전체 톤은 warm off-white/light와 near-black/dark 기반의 절제된 흑백입니다.
- 구분은 얇은 border, spacing, typography hierarchy를 우선합니다. 중첩 카드, 과한 glass, gradient/orb 장식은 피합니다.
- 카드 radius는 기존 컴포넌트 호환 외에는 작게 유지합니다. 읽기 본문은 Notion에 가까운 1rem/1.6 line-height를 유지합니다.
- 블로그 본문 CSS는 `src/styles/markdown.css`의 `.post-body` 표준 태그 스타일이 기준입니다.
- 일반 UI 아이콘은 `lucide-react`, GitHub/LinkedIn 같은 브랜드 아이콘은 `react-icons` 브랜드 팩을 씁니다.

## About 방향

About은 현재 프로필 이미지, 소셜 링크, 타임라인, 프로젝트 링크처럼 구조화 데이터가 많으므로 React 컴포넌트 유지가 적합합니다. Markdown 단일 파일도 가능하지만 interactive/link/icon/timeline 표현을 다시 컴포넌트로 보강해야 하므로 당장은 혼합형이 낫습니다. 장기적으로는 biography 문단만 Markdown/MDX로 빼고, education/work/projects는 typed constants나 content collection으로 유지하는 방향이 가장 안전합니다.

## 하네스

`bun run verify`가 로컬 단일 게이트입니다. CI는 branch protection의 required check에 맞춰 `lint-build`와 `unit-test` job으로 나눕니다.

```bash
bun run types:check
bun run lint:check
bun run format:check
bun run build:content
bun run build:meta
bun run build
bun run check-content
bun run check-repo
bun run smoke:out
bun run check-links
bun run test:unit:run
```

품질 게이트는 다음을 실패 처리합니다.

- source/raw 발행
- 깨진 wikilink, 남은 `.md` 상대 링크
- 남은 로컬 이미지 경로
- missing cover/body asset
- category가 `concept` 같은 KB type으로 생성되는 경우
- KaTeX math 내부의 exporter escape 회귀
- Markdown body가 Pretendard가 아닌 글꼴로 바뀌는 경우
- CI/CD가 `R3gardless/KNOWLEDGE_BASE`를 직접 checkout하지 않는 경우
- CI가 `lint-build`/`unit-test` required check를 노출하지 않는 경우
- CI/CD가 private KB token 부재 시 fixture KB로 fallback하는 경우
