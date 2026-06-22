# R3gardless.dev

Next.js 기반 정적 블로그입니다. 개인 KNOWLEDGE_BASE의 Markdown 중 `publish: true` 문서만 빌드 시 export해서 GitHub Pages에 배포합니다.

## 주요 기능

- KNOWLEDGE_BASE Markdown 기반 콘텐츠 파이프라인
- GFM, GitHub alert, KaTeX, Mermaid, wikilink 렌더링
- 정적 export 기반 GitHub Pages 배포
- Tailwind CSS v4와 CSS variable 기반 테마
- Vitest와 빌드/링크/HTML smoke 하네스

## 시작하기

```bash
bun install
bun run dev
```

브라우저에서 <http://localhost:3000>을 엽니다.

## KNOWLEDGE_BASE 연결

로컬에서는 `KNOWLEDGE_BASE_PATH`로 KNOWLEDGE_BASE 루트를 지정할 수 있습니다.

```bash
KNOWLEDGE_BASE_PATH=/path/to/KNOWELDGE_BASE bun run build:content
```

기본 후보에는 `.cache/knowledge-base/KNOWELDGE_BASE`, `.cache/knowledge-base/KNOWLEDGE_BASE`, 레포 상위의 `KNOWLEDGE_BASE`/`KNOWELDGE_BASE`가 포함됩니다. private GitHub KNOWLEDGE_BASE(`R3gardless/KNOWLEDGE_BASE`)를 로컬 캐시에 동기화하려면 인증 가능한 git 환경에서 실행합니다.

```bash
bun run sync:knowledge-base
```

## 주요 명령

```bash
bun run verify        # 전체 게이트
bun run build         # 정적 사이트 빌드
bun run export        # build 후 out/.nojekyll 생성
bun run build:content # KNOWLEDGE_BASE -> content/public export
bun run build:meta    # content -> public/data/postMeta.json
bun run check-links   # 링크/이미지 게이트
bun run smoke:out     # out/ HTML smoke
```

## CI/CD

- PR: `.github/workflows/ci.yml`에서 `lint-build`와 `unit-test` required check를 실행합니다. `lint-build`는 private KNOWLEDGE_BASE checkout 후 타입/린트/포맷/build/content/link/smoke 게이트를 실행하고, `unit-test`는 `bun run test:unit:run`을 실행합니다.
- main: `.github/workflows/deploy.yml`에서 private KNOWLEDGE_BASE checkout, `verify`, `.nojekyll`, GitHub Pages 배포
- private KNOWLEDGE_BASE checkout에는 repository secret `KNOWLEDGE_BASE_TOKEN`이 필요합니다.
- 자동 병합 워크플로우는 사용하지 않습니다.
