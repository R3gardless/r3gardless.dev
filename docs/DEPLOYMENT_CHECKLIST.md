# GitHub Pages 배포 체크리스트

## 로컬

- [ ] `KB_PATH`가 올바른 KB 루트를 가리킨다.
- [ ] `bun run verify`가 통과한다.
- [ ] `out/`이 생성된다.
- [ ] `bun run export` 실행 시 `out/.nojekyll`이 생성된다.

## GitHub Repository

- [ ] Settings → Pages → Source가 `GitHub Actions`다.
- [ ] Secret `KB_REPO_TOKEN`이 private KB read 권한을 가진다.
- [ ] 필요한 `NEXT_PUBLIC_*` repository variables가 설정되어 있다.
- [ ] 자동 병합 workflow가 없다.

## 콘텐츠

- [ ] 발행할 Markdown만 `publish: true`다.
- [ ] source/raw 원문 note는 발행되지 않는다.
- [ ] publish 대상 이미지 경로가 모두 존재한다.
- [ ] KB 내부 `.md` 링크가 내부 블로그 링크, `source_url`, 또는 텍스트 강등으로 처리된다.
- [ ] `bun run check-links` 경고/에러를 검토했다.

## 배포 후

- [ ] 사이트 첫 화면이 로드된다.
- [ ] 블로그 목록이 표시된다.
- [ ] 샘플 글에서 alert, table, KaTeX, code block, Mermaid가 표시된다.
- [ ] 이미지와 CSS가 정상 로드된다.
- [ ] 모바일과 다크모드를 확인했다.
