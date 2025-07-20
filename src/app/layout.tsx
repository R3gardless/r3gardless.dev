import type { Metadata } from 'next';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { siteMetadata } from '@/libs/seo/siteMetadata';

import '@/styles/globals.css';
import '@/styles/notion.css';
import '@/styles/prism-theme.css';

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
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className="
          font-pretendard
          antialiased
          min-h-screen
          flex
          flex-col
        "
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* 헤더 */}
          <Header />

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1">{children}</main>

          {/* 푸터 */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
