# Codex 프롬프트 — r3gardless.dev Notion→Markdown(KB) 전환 계획 수립

> 아래 블록 전체를 Codex에 그대로 붙여넣으세요. (계획 먼저 → 승인 후 단계별 구현, 각 단계는 하네스 green 필수)

---

너는 `r3gardless.dev` 레포(Next.js 16.2 App Router, React 19, TypeScript, Tailwind v4, **정적 export로 GitHub Pages 배포**)에서 작업하는 시니어 엔지니어다. 목표는 현재 **Notion을 CMS로 쓰는 블로그를, 내 개인 지식베이스(KB)의 마크다운을 소스로 읽어 렌더링하는 구조로 전환**하는 것이다.

먼저 아래 정보를 바탕으로 **상세 실행 계획**을 작성해 제시하고, 내 승인을 받은 뒤 Phase별로 구현한다. **각 Phase는 "검증 하네스"가 모두 green이어야 다음 Phase로 진행**한다. 실패가 있으면 멈추고 고친다. 추측 금지 — 불확실하면 해당 소스 파일을 직접 열어 확인하라.

## 0. 절대 규칙

- KB 레포(원본 지식베이스)의 **기존 콘텐츠는 읽기 전용**, 절대 수정하지 않는다. (단, §7의 마이그레이션 회고 노트 **새 파일 1건 추가**는 예외로 허용.)
- 블로그에는 frontmatter `publish: true`인 마크다운만 들어간다. **외부 출처 원문(youtube 자막 등 raw source)은 절대 발행 금지(저작권).**
- **원본 Notion 페이지 자체는 참조/소스 노트로 만들지 않는다**(이전 후 삭제 예정이므로 링크가 깨진다). 본문 속 외부 참고문헌(GitHub·MDN·공식 문서 등)만 source 로 ingest 한다.
- 정적 export(`next build` → `out/`)가 **계속 동작**해야 한다(GitHub Pages, `.nojekyll`).
- **디자인·포맷은 시각적으로 동등하게 유지(필수)**: 타이포·색·간격·다크모드·레이아웃·라우팅·SEO가 전환 전후로 같아야 한다. 변경은 본문 렌더러 내부 구현(recordMap→markdown)에 한정하고, **보이는 결과(룩)는 바뀌면 안 된다.** 디자인 토큰/CSS 변수·폰트를 그대로 재사용한다. (시각 회귀로 검증 — §5)
- 모든 변경은 타입체크·린트·포맷·테스트·빌드를 통과해야 한다.

## 1. 현재 구조 (확인된 사실)

- 콘텐츠 메타: `scripts/build-post-meta.ts`(prebuild, tsx) → `@notionhq/client`로 Notion DB 조회 → `public/data/postMeta.json` 생성 + 커버 이미지 다운로드.
- `src/libs/staticPostData.ts`: postMeta.json 읽어 `PostMeta[]` 반환(`getStaticPostList`, `getPostListWithStaticFallback`).
- 본문: `src/libs/notionClient.ts`의 `getPageBlocks(pageId)` → `notion-client` recordMap.
- 라우팅: `src/app/blog/[slug]/page.tsx` — `generateStaticParams`(postMeta slug), `generateMetadata`, recordMap 패칭 → `PostPageContent`.
- `src/app/blog/[slug]/PostPageContent.tsx`: prop `recordMap: ExtendedRecordMap` → `PostTemplate` → `PostBody`.
- `src/components/ui/blog/PostBody/PostBody.tsx`: `react-notion-x` `NotionRenderer`(recordMap) + prismjs + katex + 동적 third-party(Equation/Code/Pdf). 테스트 `PostBody.test.tsx`, 스토리 `PostBody.stories.tsx` 존재.
- 타입: `src/types/blog.ts`의 `PostMeta`(pageId, id, title, description, createdAt, lastEditedAt, category{text,color}, tags, slug, encodedSlug, cover).
- 유틸: `src/utils/blog.ts`의 `findPostByEncodedSlug`, `getTableOfContents`(현재 recordMap 기반).
- 스타일: `src/styles/` globals.css / markdown.css / prism-theme.css / masonry.css.
- 의존성(현재): @notionhq/client, notion-client, notion-types, notion-utils, react-notion-x, katex, prismjs, react-masonry-css.
- 도구·스크립트: Vitest(`test:unit:run`), tsc(`types:check`), ESLint(`lint:check`), Prettier(`format:check`), Husky+lint-staged, Storybook. 빌드: `prebuild`(tsx build-post-meta) → `build`(next build), `export`/`deploy`(out/ + .nojekyll).

## 2. KB 콘텐츠 계약 (소스 포맷)

KB 경로는 환경변수 `KB_PATH`로 주입(기본값은 계획에서 합의). 발행 대상 = frontmatter `publish: true`인 `.md`.
frontmatter 예:

```yaml
layer: wiki # wiki | report | source (발행은 주로 wiki/report, 본인 글)
type: concept # entity|concept|moc|report|experience ...
title: '...'
tags: [..]
publish: true
slug: '...' # 없으면 파일명에서 생성
published_at: 2026-06-21 # 없으면 git 최초 커밋일 또는 added
description: '...' # 없으면 본문 첫 단락/요약
cover: ./assets/x.png # (선택)
as_of: 2026-06-21 # report 전용 스냅샷 기준일
```

본문 마크다운 기능: **GitHub alert**(`> [!TIP] / [!NOTE] / [!WARNING] / [!CAUTION]`), **KaTeX**(`$..$`, `$$..$$`), **Mermaid**(```mermaid 펜스, 차트 xychart-beta/pie 포함), **GFM**(표·체크리스트·취소선·각주), **코드펜스**(언어 명시), **이미지**(`![캡션](경로)`), **위키링크** `[[대상]]`/`[[대상|별칭]]`/`[[대상#섹션]]`.

## 3. 전환 목표 (범위)

**제거**: @notionhq/client, notion-client, notion-types, notion-utils, react-notion-x 및 recordMap 의존 전부.
**추가(검토)**: gray-matter, unified, remark-parse, remark-gfm, remark-math, **remark-wiki-link**, remark-github-blockquote-alert(또는 동등 alert), remark-rehype, rehype-katex, rehype-slug, rehype-autolink-headings, 코드 하이라이트(rehype-pretty-code 또는 기존 prismjs 유지), React 변환(rehype-react 또는 next-mdx-remote). **Mermaid는 정적 export/CI에서 Playwright를 피하려 클라이언트 컴포넌트**로 구현(```mermaid 펜스를 `<Mermaid/>`클라이언트 컴포넌트로 변환, mount 시`mermaid.run()`).
**유지**: 라우팅(generateStaticParams/Metadata), PostTemplate/레이아웃, `PostMeta` 인터페이스(필드만 frontmatter로 채움 — pageId 등 Notion 전용 필드는 정리), next/image, globals/prism/masonry CSS, 다크모드(`data-theme`). `markdown.css`는 **표준 태그**(h1~h6,`pre code`, table, blockquote, ul/ol 등) 대상으로 작성.
**TOC**: `getTableOfContents`를 recordMap이 아니라 렌더된 heading(rehype-slug id)에서 추출하도록 변경.

**아이콘 라이브러리**: `lucide-react`는 **브랜드 로고(GitHub·X·LinkedIn 등)를 제공하지 않는다**(상위 버전에서 브랜드 아이콘 제거). 따라서 브랜드/소셜 아이콘은 **별도 브랜드 아이콘 라이브러리로 교체**한다 — 권장: Simple Icons 계열(`@icons-pack/react-simple-icons` 또는 `react-icons/si`). 일반 UI 아이콘(메뉴·화살표 등)은 `lucide-react` 유지. 작업: 현재 `lucide-react`로 쓰던 브랜드 아이콘 사용처를 전수 조사해 교체하고, 빌드·타입·렌더 확인.

**콘텐츠 동기화**: 빌드 시 KB에서 `publish: true` 페이지(+참조 assets)만 블로그 `content/posts/`로 복사하는 `build:content` 단계를 둔다. **raw/비공개는 절대 복사 금지**(submodule보다 export-필터 방식 권장 — 비공개 유출 차단). 렌더러·메타는 `content/`만 읽는다.

## 4. 위키링크 플러그인 + 인용 해석 요구사항 (중요)

- `remark-wiki-link`로 `[[..]]` 처리. `[[대상|별칭]]`은 별칭, `[[대상#섹션]]`은 앵커 포함.
- **인덱스 2개를 먼저 빌드**(전체 KB frontmatter 스캔):
  - `published map`: publish:true 페이지의 basename → `/blog/<slug>`.
  - `source_url map`: 모든 source 노트의 basename → frontmatter `source_url`(원문 URL).
- **`[[대상]]` 해석 우선순위**:
  1. 발행 페이지면 → 내부 링크 `/blog/<slug>`.
  2. 미발행 source 노트인데 `source_url` 있으면 → **그 외부 원문 URL로 링크**(`target="_blank" rel="noopener"`). (내 비공개 요약이 아니라 공개 원본을 가리켜 evergreen + 저작권 안전.)
  3. 둘 다 아니면 → 일반 텍스트(라벨)로 강등.
- **상대경로 마크다운 링크도 동일 처리**: 본문/참고문헌의 `[label](../sources/x.md)`, `[label](./x.md)` 같은 KB 내부 `.md` 경로 링크는 **위와 같은 규칙으로 치환**(발행→내부, source_url→외부, 없으면 텍스트). 블로그 출력에 `.md` 상대경로가 그대로 남으면 안 된다.
- **이미지 경로**: `cover`·본문 이미지의 KB 상대경로는 `build:content`가 복사한 블로그 자산 경로로 재작성.
- **빌드 게이트**: 발행 대상끼리의 `[[..]]`/내부 링크가 깨지면 **빌드 실패**. source_url 없는 미발행 대상은 텍스트 강등 + 경고. 남아있는 `.md` 상대링크가 있으면 **실패**.
- (선택) frontmatter에 `archived_url`이 있으면 source_url 대신/병기로 사용(링크로트 대비). 없으면 무시.

## 5. 검증 하네스 (반드시 구축, 전부 green = 에러 0)

**Vitest 테스트(신규/갱신)**

1. 콘텐츠 로더: frontmatter 파싱, `publish` 필터(비공개·raw 제외), slug 생성·맵.
2. 렌더러 단위: alert / KaTeX / Mermaid펜스→컴포넌트 / GFM 표·체크리스트 / 코드 하이라이트 / 이미지→next image / heading→TOC 각각 기대 출력.
3. 위키링크 리졸버: 발행 대상→링크, 미발행→텍스트 강등, 별칭·앵커.
4. 기존 `PostBody.test.tsx`·스토리를 마크다운 기반으로 교체.

**빌드/정적 게이트** 5. `tsc --noEmit` / `eslint` / `prettier --check` 통과. 6. `build:content`(publish 필터 export) + `build:meta`(frontmatter→postMeta.json) 성공. 7. `next build` 성공 + `out/` 생성. 샘플 포스트 HTML에 렌더 요소(alert/표/수식/코드) 존재 스모크 테스트. 8. 콘텐츠 링크 체크: 발행 집합 내 깨진 `[[..]]`/이미지 경로 0건(있으면 실패).

**디자인 패리티 게이트 (필수)** 9. **시각 회귀**: 레포에 이미 있는 **Storybook + Chromatic**을 활용한다. PostBody와 핵심 블로그 컴포넌트의 스토리를 마크다운 입력으로 갱신하고, 모든 마크다운 요소(제목/본문/표/코드/alert/수식/이미지/인용/리스트/mermaid placeholder)를 한 스토리에 모은 픽스처를 둔다. **전환 전(react-notion-x) 대비 후(markdown) 시각 차이가 의도된 것 외에 없어야** 한다(Chromatic diff 승인 또는 스냅샷 일치). 10. **다크/라이트 양쪽** 렌더 확인. 대표 포스트 1편을 전환 전후로 스크린샷 비교해 타이포·간격·색이 동일함을 확인. 11. CSS: `globals.css`/`prism-theme.css`/`masonry.css`는 재사용, `markdown.css`는 표준 태그 셀렉터로 작성하되 **동일한 시각 결과**를 내야 한다.

**CI** 9. `.github/workflows`에 게이트 추가: install → types:check → lint:check → test:unit:run → build:content → build:meta → build → link-check. 하나라도 실패 시 빨강.

## 6. 너의 응답(=이 작업의 산출물)

1. **단계별 실행 계획(Phase 0~N)**: 각 Phase의 변경 파일 목록(경로), 추가/제거 패키지, 구현 요지, 그리고 **그 Phase를 닫는 하네스 게이트**.
2. Mermaid/KaTeX/alert/코드 하이라이트/위키링크 각각의 구체 구현 방식(선택 라이브러리 + 이유).
3. PostMeta·라우팅·PostBody·markdown.css 변경 상세.
4. `build:content` 동기화 설계 + KB 경로 주입 방식.
5. 롤백 전략(브랜치, Phase별 커밋).
6. 리스크/대안(특히 Mermaid 렌더, 정적 export 제약, `[[..]]`·`.md` 상대링크의 source_url 치환 처리, react-notion-x 제거 후 룩 유지).
7. 아이콘 라이브러리 교체 계획(lucide 브랜드 아이콘 → Simple Icons 계열, 사용처 전수 교체).
8. 레포 거버넌스·하네스·CI/CD 정비(§8): 디렉터리 구조 확정, AGENTS.md/CLAUDE.md, `npm run verify` 단일 게이트, 워크플로 재작성.

## 7. 마이그레이션 기록을 KB에 반영 (마지막 Phase)

이 전환 작업 자체가 지식이다. 완료 후 과정·결정·트러블슈팅을 **KB에 새 노트 1건으로 기록**한다.

- **KB 작성 규약을 그대로 따른다**: KB 루트의 `AGENTS.md`와 `skills/kb-note`·`skills/kb-style`를 읽고 그 포맷(frontmatter, 합쇼체, GitHub alert, 섹션 구조, 줄간격)으로 작성.
- **위치/타입**: 적절한 대주제/세부주제(없으면 `개발/블로그 운영/` 신설)의 `sources/`에 `type: experience`(회고) 또는 how-to. 파일명 `YYYY-MM-DD-제목.md`.
- **내용 구성**(kb-style 3.4 경험/회고 또는 3.3 how-to): 배경(왜 Notion→markdown) → 과정(Phase별 핵심 결정) → 트러블슈팅(Mermaid 렌더, 위키링크/`source_url` 치환, 정적 export 제약 등) → 결과·배운 점. **외부 참고는 원본 URL로 인용.**
- **publish 여부는 사용자에게 확인**(이 회고는 블로그 글감이 될 수 있음).
- 기록 후 KB의 `python3 skills/kb-curate/scripts/lint.py KNOWELDGE_BASE`가 green인지 확인(위키링크·명명 등). 기존 KB 파일은 수정 금지, 신규 1건만 추가.

## 8. 레포 거버넌스·하네스·CI/CD 정비 (필수 — 디렉터리 구조에 맞게)

마이그레이션과 함께 `r3gardless.dev` 레포 자체의 거버넌스/자동화도 **디렉터리 구조에 맞춰 추가·개편한다(선택 아님).**

1. **디렉터리 구조 확정·문서화**: 전환 후 구조를 명시한다. 예:
   ```text
   r3gardless.dev/
   ├── AGENTS.md            # 공용 에이전트 지침(아래)
   ├── CLAUDE.md            # Claude 전용(=> AGENTS.md 가리키고 차이만)
   ├── content/posts/       # KB에서 export된 발행 마크다운(+assets)
   ├── scripts/             # build-post-meta.ts, build-content.ts, check-links.ts ...
   ├── src/                 # 앱 (libs/content, components, app/blog ...)
   ├── tests/ 또는 *.test.tsx  # 하네스(테스트 위치 규칙 통일)
   └── .github/workflows/   # CI/CD
   ```
2. **AGENTS.md(루트) 신설·갱신**: 스택, 디렉터리 구조, 콘텐츠 파이프라인(KB→content→render), 명령어, 컨벤션(아이콘 규칙, 위키링크/source_url 치환, 발행 규칙, 정적 export)을 적는다. KB의 `AGENTS.md` 톤을 따른다. **CLAUDE.md는 AGENTS.md를 가리키고 Claude 전용 차이만** 둔다(중복 금지).
3. **하네스 일원화**: 게이트를 한 명령으로 묶는 `npm run verify` 추가 = `types:check && lint:check && format:check && test:unit:run && build:content && build:meta && build && check-links`. 테스트 파일 위치 규칙을 통일하고, 누락된 부분(콘텐츠 로더·렌더러·위키링크·아이콘 렌더) 테스트를 채운다.
4. **CI/CD 개편**: `.github/workflows/`를 디렉터리/스크립트에 맞게 재작성 — `ci.yml`(PR: install→verify), `deploy.yml`(main: verify→export→Pages 배포, `.nojekyll`). 기존 워크플로와 중복 제거.
5. **instructions 동기화**: 위 규칙(아이콘 교체, 인용/소스 치환, publish 필터, 하네스 게이트)이 AGENTS.md·CLAUDE.md·CI에 **모두 일관**되게 반영됐는지 교차 점검.
6. 게이트: `npm run verify`가 로컬·CI 모두 green이어야 이 Phase 완료.

**먼저 위 계획(Phase 0~8)을 제시하고 내 승인을 기다린 뒤**, Phase별로 구현하며 각 Phase 종료 시 하네스 명령어와 통과 여부를 보고하라.
