import type { Metadata } from 'next';

import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { GoogleAnalytics } from '@/components/meta/GoogleAnalytics';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { THEME_STORAGE_KEY } from '@/constants';
import { siteMetadata } from '@/libs/seo/siteMetadata';

import '@/styles/globals.css';

// 메타데이터 설정 (별도 파일에서 관리)
export const metadata: Metadata = siteMetadata;

/**
 * Root Layout Component
 *
 * Next.js App Router의 최상위 레이아웃 컴포넌트
 * - 전역 스타일 및 폰트 설정
 * - 메타데이터 및 SEO 설정
 * - 테마 시스템 통합
 * - Header와 Footer를 포함한 기본 레이아웃 구조
 * - Google Analytics 통합
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // localStorage에서 저장된 테마 확인
                  var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
                  var theme = 'light';
                  
                  if (stored) {
                    try {
                      var parsed = JSON.parse(stored);
                      theme = parsed.state?.theme || theme;
                    } catch (e) {
                      // 파싱 실패 시 시스템 선호도 사용
                      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                  } else {
                    // 저장된 테마가 없으면 시스템 선호도 사용
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  // FOUC 방지를 위해 즉시 테마 적용
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  // 오류 발생 시 기본 테마 적용
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.dataset.theme = 'light';
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="
          antialiased
          min-h-screen
          flex
          flex-col
        "
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* 페이지 전환 시 스크롤 최상단으로 이동 */}
          <ScrollToTop />

          {/* 헤더 */}
          <Header />

          {/* 메인 콘텐츠 영역 - Header가 fixed이므로 상단 패딩 추가 */}
          <main className="mt-[100px]">{children}</main>

          {/* 푸터 */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
