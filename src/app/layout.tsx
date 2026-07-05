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
        {/* Google Fonts - Signature font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 사용자가 직접 고른 테마(userSelectedTheme=true)만 신뢰하고,
                  // 그 외에는 항상 현재 시스템 선호도를 사용한다. (themeStore.initializeTheme와 동일 규칙)
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var theme = systemTheme;

                  var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
                  if (stored) {
                    var state = JSON.parse(stored).state;
                    if (state && state.userSelectedTheme === true &&
                        (state.theme === 'light' || state.theme === 'dark')) {
                      theme = state.theme;
                    }
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
