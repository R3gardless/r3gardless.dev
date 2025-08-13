import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { GoogleAnalytics } from './GoogleAnalytics';

/**
 * Google Analytics 컴포넌트 테스트
 */
describe('GoogleAnalytics', () => {
  it('GA ID가 제공되었을 때 스크립트 태그를 렌더링해야 한다', () => {
    const gaId = 'G-XXXXXXXXXX';

    render(<GoogleAnalytics gaId={gaId} />);

    // Document에서 gtag script가 추가되었는지 확인
    const scripts = document.querySelectorAll('script');
    const gtagScript = Array.from(scripts).find(script =>
      script.src?.includes('googletagmanager.com/gtag/js'),
    );

    expect(gtagScript).toBeDefined();
  });

  it('올바른 GA ID로 gtag script가 로드되어야 한다', () => {
    const gaId = 'G-TEST123456';

    render(<GoogleAnalytics gaId={gaId} />);

    const scripts = document.querySelectorAll('script');
    const gtagScript = Array.from(scripts).find(script =>
      script.src?.includes(`gtag/js?id=${gaId}`),
    );

    expect(gtagScript).toBeDefined();
    expect(gtagScript?.src).toContain(gaId);
  });

  it('빈 GA ID로도 정상적으로 렌더링되어야 한다', () => {
    expect(() => {
      render(<GoogleAnalytics gaId="" />);
    }).not.toThrow();
  });
});
