'use client';

import Script from 'next/script';
import React from 'react';

interface GoogleAnalyticsProps {
  gaId: string;
}

/**
 * Google Analytics (GA4) 컴포넌트
 *
 * - GA4 추적 코드를 Next.js Script 컴포넌트로 최적화하여 로드
 * - Google 공식 스크립트와 동일한 구현
 * - 환경변수에서 GA ID를 가져와 추적 설정
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
