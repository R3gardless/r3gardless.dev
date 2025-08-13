# 🔧 GitHub Pages 배포 체크리스트

GitHub Pages 배포를 위한 설정 체크리스트입니다.

## ✅ 완료된 설정

- [x] **Next.js 설정**
  - [x] `output: 'export'` 설정
  - [x] `trailingSlash: true` 설정  
  - [x] `images.unoptimized: true` 설정
  - [x] `basePath` 환경변수 지원

- [x] **GitHub Actions Workflow**
  - [x] `.github/workflows/deploy.yml` 생성
  - [x] Bun 설정
  - [x] 캐시 최적화
  - [x] 환경변수 처리

- [x] **정적 파일 설정**
  - [x] `public/.nojekyll` 파일

- [x] **빌드 스크립트**
  - [x] `package.json`에 export 스크립트 추가
  - [x] 로컬 빌드 테스트 완료

- [x] **문서화**
  - [x] 배포 가이드 (`docs/DEPLOYMENT.md`)
  - [x] README.md 업데이트

## 🚀 다음 단계 (GitHub에서 설정 필요)

1. **Repository Settings 설정**
   ```
   Repository → Settings → Pages
   Source: GitHub Actions 선택
   Custom domain: 이미 설정 완료 ✅
   ```

2. **Environment Variables 설정**
   ```
   Repository → Settings → Secrets and variables → Actions
   
   필수 Secrets:
   - NOTION_API_KEY: [Notion Integration API Key]
   - NOTION_DATABASE_ID: [Notion Database ID]
   
   선택적 Variables (클라이언트 사이드에서 사용):
   - NEXT_PUBLIC_GISCUS_REPO: [Giscus 댓글 레포지토리, 예: username/repo]
   - NEXT_PUBLIC_GISCUS_REPO_ID: [Giscus 레포지토리 ID]
   - NEXT_PUBLIC_GISCUS_CATEGORY_ID: [Giscus 카테고리 ID]
   - NEXT_PUBLIC_GA_ID: [Google Analytics (GA4) 추적 ID, 예: G-XXXXXXXXXX]
   ```

3. **첫 배포 실행**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

4. **배포 상태 확인**
   ```
   Repository → Actions 탭에서 workflow 실행 상태 확인
   Repository → Settings → Pages에서 사이트 URL 확인
   ```

## 🔗 예상 배포 URL

- Repository가 `username/repository-name`인 경우:
  `https://username.github.io/repository-name/`

- 커스텀 도메인을 설정한 경우:
  `https://your-domain.com/`

## 🐛 문제 해결

빌드나 배포에 문제가 있다면:

1. **로컬 빌드 테스트**
   ```bash
   bun run build
   ls -la out/
   ```

2. **GitHub Actions 로그 확인**
   - Repository → Actions → 실패한 workflow 클릭
   - 로그에서 에러 메시지 확인

3. **환경변수 확인**
   - GitHub Secrets 설정 재확인
   - Notion API 키 유효성 확인

## ✨ 배포 완료 후

배포가 완료되면 다음을 확인하세요:

- [ ] 사이트가 정상적으로 로드되는지
- [ ] 블로그 포스트가 올바르게 표시되는지  
- [ ] 이미지와 CSS가 정상 로드되는지
- [ ] 모바일에서도 정상 작동하는지
- [ ] 다크모드 토글이 작동하는지
