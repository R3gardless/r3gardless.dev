import { afterEach, describe, expect, it, vi } from 'vitest';

import { readMermaidThemeVariables } from '@/components/ui/blog/Mermaid/Mermaid';

function stubComputedStyle(values: Record<string, string>) {
  vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
    getPropertyValue: (name: string) => values[name] ?? '',
  } as unknown as ReturnType<typeof globalThis.getComputedStyle>);
}

describe('readMermaidThemeVariables', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps globals.css tokens onto mermaid base-theme variables', () => {
    stubComputedStyle({
      '--pb-mermaid-surface': ' #f8fafc ',
      '--pb-mermaid-primary': '#f8fafc',
      '--pb-mermaid-stroke': '#64748b',
      '--pb-mermaid-text': '#1e293b',
      '--pb-mermaid-cluster': '#ffffff',
      '--pb-mermaid-cluster-stroke': '#cbd5e1',
      '--pb-sans': "'Pretendard', ui-sans-serif, sans-serif",
      '--pb-mermaid-font-size': '14px',
    });

    expect(readMermaidThemeVariables(document.createElement('div'))).toEqual({
      background: '#f8fafc',
      primaryColor: '#f8fafc',
      primaryBorderColor: '#64748b',
      lineColor: '#64748b',
      primaryTextColor: '#1e293b',
      clusterBkg: '#ffffff',
      clusterBorder: '#cbd5e1',
      fontFamily: "'Pretendard', ui-sans-serif, sans-serif",
      fontSize: '14px',
    });
  });

  it('omits tokens that are not defined so mermaid falls back to its own defaults', () => {
    // .post-body 밖(스토리북 등)에서는 --pb-sans가 없고, 토큰이 비면 mermaid 기본값을 씁니다.
    stubComputedStyle({ '--pb-mermaid-stroke': '#64748b' });

    expect(readMermaidThemeVariables(document.createElement('div'))).toEqual({
      primaryBorderColor: '#64748b',
      lineColor: '#64748b',
    });
  });
});
