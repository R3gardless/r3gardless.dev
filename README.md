# 🚀 R3gardless.dev

[![Coverage Status](https://codecov.io/gh/R3gardless/r3gardless.dev/branch/main/graph/badge.svg)](https://codecov.io/gh/R3gardless/r3gardless.dev)

Next.js 기반의 블로그 플랫폼으로, Notion을 CMS로 활용하여 콘텐츠를 관리합니다.

## ✨ 주요 기능

- 📝 **Notion CMS 연동**: Notion 데이터베이스를 통한 콘텐츠 관리
- 🎨 **Tailwind CSS v4**: 모던한 스타일링
- 🔧 **TypeScript**: 타입 안전성
- 📱 **반응형 디자인**: 모바일-퍼스트 접근
- 🌙 **다크모드**: 라이트/다크 테마 지원
- 🧩 **컴포넌트 아키텍처**: Atomic Design 패턴
- 📊 **Storybook**: UI 컴포넌트 문서화
- 🧪 **Vitest**: 단위 테스트

## 🚀 시작하기

### 개발 서버 실행

```bash
# 의존성 설치
bun install

# 개발 서버 시작
bun run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
# Notion API 설정
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id

# Giscus 댓글 시스템 (선택사항) - 클라이언트에서 사용하므로 NEXT_PUBLIC_ 접두사 필요
NEXT_PUBLIC_GISCUS_REPO=your_giscus_repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_giscus_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_giscus_category_id

# Google Analytics (GA4) 설정 (선택사항)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🛠 개발 도구

### 스크립트

```bash
# 개발 서버 (Turbopack)
bun run dev

# 프로덕션 빌드
bun run build

# 정적 사이트 빌드 (GitHub Pages용)
bun run export

# 테스트 실행
bun run test

# 린팅
bun run lint

# 포맷팅
bun run format

# 스토리북
bun run storybook
```

### 코드 품질

- **ESLint**: 코드 스타일 검사
- **Prettier**: 코드 포맷팅  
- **Husky**: Git hooks
- **lint-staged**: 스테이징된 파일 린팅

## 📚 아키텍처

### 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
│   ├── ui/                 # 재사용 가능한 UI 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   ├── sections/           # 페이지 섹션
│   └── templates/          # 페이지 템플릿
├── libs/                   # 외부 라이브러리 설정
├── store/                  # Zustand 상태 관리
├── types/                  # TypeScript 타입 정의
└── utils/                  # 유틸리티 함수
```

### 컴포넌트 분류

- **UI**: 단일 기능 재사용 컴포넌트 (`Button`, `Typography`)
- **Sections**: 특정 페이지의 레이아웃 단위 (`BlogPosts`, `RelatedPosts`)
- **Templates**: 페이지 레벨 레이아웃 컴포넌트
- **Layout**: 공통 사이트 레이아웃 (`Header`, `Footer`)

## 🚀 배포

### GitHub Pages 자동 배포

이 프로젝트는 GitHub Actions를 통해 자동으로 GitHub Pages에 배포됩니다.

1. Repository Settings → Pages → Source를 `GitHub Actions`로 설정
2. Repository Secrets에 환경변수 추가:
   - `NOTION_API_KEY`: Notion API 키
   - `NOTION_DATABASE_ID`: Notion 데이터베이스 ID
   - `NEXT_PUBLIC_GISCUS_REPO`: Giscus 댓글 레포지토리 (선택사항)
   - `NEXT_PUBLIC_GISCUS_REPO_ID`: Giscus 레포지토리 ID (선택사항)
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`: Giscus 카테고리 ID (선택사항)
   - `NEXT_PUBLIC_GA_ID`: Google Analytics (GA4) 추적 ID (선택사항)
3. `main` 브랜치에 push하면 자동 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)를 참고하세요.

### 수동 배포

```bash
# 정적 사이트 빌드
bun run export

# 빌드 결과 확인
ls -la out/
```

## 🧪 테스트

```bash
# 단위 테스트 실행
bun run test:unit:run

# 테스트 커버리지 확인
open coverage/index.html
```

## 📖 문서

- [배포 가이드](./docs/DEPLOYMENT.md)
- [Storybook](http://localhost:6006) - 컴포넌트 문서

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🔗 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Notion API](https://developers.notion.com)
