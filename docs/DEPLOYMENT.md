# 🚀 GitHub Pages 배포 가이드

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

## 📋 배포 설정

### 1. Repository 설정

1. GitHub Repository → **Settings** → **Pages**로 이동
2. **Source**를 `GitHub Actions`로 설정
3. **Custom domain** (선택사항): 커스텀 도메인이 있다면 설정

### 2. Environment Variables (Secrets)

GitHub Repository → **Settings** → **Secrets and variables** → **Actions**에서 다음 secrets를 추가하세요:

**필수 환경변수:**
- `NOTION_API_KEY`: Notion API 키
- `NOTION_DATABASE_ID`: Notion 데이터베이스 ID

**선택적 환경변수:**
- `GISCUS_REPO`: Giscus 댓글 시스템 레포지토리 (예: `username/repo`)
- `GISCUS_REPO_ID`: Giscus 레포지토리 ID
- `GOOGLE_SITE_VERIFICATION`: Google Search Console 인증 코드

> 💡 **참고**: `*` 접두사가 있는 환경변수들은 클라이언트 사이드에서 사용되므로 민감하지 않은 정보만 포함해야 합니다.

### 3. 브랜치 보호 규칙 (선택사항)

`main` 브랜치를 보호하려면:
1. **Settings** → **Branches**로 이동
2. `main` 브랜치에 대한 protection rule 추가
3. **Require pull request reviews before merging** 활성화

## 🔄 배포 프로세스

### 자동 배포
- `main` 브랜치에 push할 때 자동으로 배포됩니다
- GitHub Actions workflow가 자동으로 실행됩니다

### 수동 배포
1. GitHub Repository → **Actions** 탭 이동
2. **Deploy to GitHub Pages** workflow 선택
3. **Run workflow** 버튼 클릭

## 📁 배포 구조

```
.github/
├── workflows/
│   └── deploy.yml          # 배포 워크플로우
public/
└── .nojekyll              # Jekyll 비활성화
```

## 🛠 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드를 테스트할 수 있습니다:

```bash
# 정적 빌드 생성
bun run build

# 빌드 결과 확인
ls -la out/

# 로컬에서 정적 파일 서빙 (선택)
npx serve out
```

## 📊 배포 상태 확인

### GitHub Actions
- Repository → **Actions** 탭에서 배포 상태 확인
- 빌드 로그와 에러 메시지 확인 가능

### GitHub Pages
- Repository → **Settings** → **Pages**에서 배포된 사이트 URL 확인
- 보통 `https://username.github.io/repository-name` 형태

## 🐛 문제 해결

### 일반적인 문제들

1. **404 에러**: 
   - `public/.nojekyll` 파일이 있는지 확인
   - Next.js `output: 'export'` 설정 확인

2. **빌드 실패**:
   - GitHub Secrets에 환경변수가 올바르게 설정되었는지 확인
   - 필수 환경변수: `NOTION_API_KEY`, `NOTION_DATABASE_ID`
   - 선택적 환경변수는 누락되어도 빌드에 영향 없음
   - 로컬에서 `bun run build` 테스트

3. **이미지 최적화 에러**:
   - `next.config.ts`에서 `images.unoptimized: true` 설정 확인

4. **리소스 로딩 실패**:
   - 상대 경로 사용 확인
   - `trailingSlash: true` 설정 확인

### 배포 로그 확인

```bash
# GitHub Actions 실행 중 로그 실시간 확인 가능
# Repository → Actions → 해당 workflow run 클릭
```

## 🔧 고급 설정

### 커스텀 도메인 사용

GitHub Repository → **Settings** → **Pages** → **Custom domain**에서 도메인을 설정하세요.

DNS 설정에서 GitHub Pages IP로 A 레코드 설정:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

또는 CNAME 레코드로 설정:
```
username.github.io
```

### 캐시 최적화

GitHub Actions에서 다음 캐시를 사용합니다:
- Next.js 빌드 캐시 (`.next/cache`)
- Bun dependencies 캐시 (`bun.lockb`)

## 📚 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
