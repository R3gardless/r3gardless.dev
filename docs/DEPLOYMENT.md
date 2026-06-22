# GitHub Pages 배포 가이드

이 프로젝트는 private KB를 checkout한 뒤 Markdown 콘텐츠를 export하고, Next.js static export 결과물인 `out/`을 GitHub Pages에 배포합니다.

## Repository 설정

1. GitHub Repository → Settings → Pages
2. Source를 `GitHub Actions`로 설정
3. Custom domain이 있으면 Pages 설정에서 등록

## Actions Secrets / Variables

필수 secret:

- `KNOWLEDGE_BASE_TOKEN`: private KB repository를 읽을 수 있는 token

선택 variables:

- `NEXT_PUBLIC_GISCUS_REPO`
- `NEXT_PUBLIC_GISCUS_REPO_ID`
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
- `NEXT_PUBLIC_GA_ID`

Notion 관련 secret은 더 이상 필요하지 않습니다.

## 배포 흐름

1. `deploy.yml`이 site repo를 checkout합니다.
2. private KB를 `.cache/knowledge-base`에 checkout합니다.
3. `bun install --frozen-lockfile`
4. `bun run verify`
5. `touch out/.nojekyll`
6. `actions/upload-pages-artifact`와 `actions/deploy-pages`로 배포

`bun run verify`는 `types:check`, `lint:check`, `format:check`, `test:unit:run`, `build`(`prebuild`에서 `build:content`와 `build:meta` 실행), `check-content`, `check-repo`, `smoke:out`, `check-links`를 순서대로 실행합니다.

## 로컬 검증

```bash
KB_PATH=/path/to/KNOWELDGE_BASE bun run verify
```

private KB를 로컬 캐시에 동기화하려면 인증 가능한 git 환경에서 실행합니다.

```bash
bun run sync:kb
bun run verify
```

## 문제 해결

- `KNOWLEDGE_BASE_TOKEN` 실패: token이 private KB read 권한을 갖는지 확인합니다.
- `MISSING_IMAGE_ASSET`: publish 대상 Markdown이 존재하지 않는 로컬 이미지 경로를 참조합니다. KB 원본 asset을 복구하거나 해당 note의 publish 상태를 조정해야 합니다.
- `MARKDOWN_LINK_LEFTOVER`: KB 내부 `.md` 링크가 resolver를 통과하지 못했습니다.
- GitHub Pages 404: `output: 'export'`, `trailingSlash: true`, `out/.nojekyll`을 확인합니다.

## 참고

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
