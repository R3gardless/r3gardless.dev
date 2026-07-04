'use client';

import { useEffect, useId, useRef, useState } from 'react';

export interface MermaidProps {
  code?: string;
}

function readIsDark(): boolean {
  return document.documentElement.dataset.theme === 'dark';
}

/**
 * 색 지정이 없는 다이어그램이 PostBody 톤(폰트색·라인·표면)을 따르도록 하는
 * themeVariables 폴백입니다. 다이어그램이 %%{init}%%/classDef로 색을 지정하면
 * 그 값이 이 폴백을 덮어써서 그대로 유지됩니다(override 금지).
 */
function postBodyThemeVariables(isDark: boolean) {
  const fg = isDark ? '#ffffff' : '#111111';
  const surface = isDark ? '#1f1f1e' : '#f5f5f3';
  const border = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.24)';
  const line = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)';

  return {
    darkMode: isDark,
    fontFamily: 'Pretendard, sans-serif',
    background: 'transparent',
    primaryColor: surface,
    secondaryColor: surface,
    tertiaryColor: surface,
    primaryTextColor: fg,
    secondaryTextColor: fg,
    tertiaryTextColor: fg,
    primaryBorderColor: border,
    secondaryBorderColor: border,
    tertiaryBorderColor: border,
    lineColor: line,
    titleColor: fg,
    nodeTextColor: fg,
  };
}

export function Mermaid({ code = '' }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // 사이트 테마(data-theme)를 관찰해, 색 미지정 다이어그램의 폴백 색을 라이트/다크에
  // 맞춥니다. 지정된 다이어그램은 자체 색을 쓰므로 이 값에 영향받지 않습니다.
  useEffect(() => {
    setIsDark(readIsDark());

    if (!globalThis.MutationObserver) {
      return undefined;
    }

    const observer = new globalThis.MutationObserver(() => setIsDark(readIsDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!ref.current || !code.trim()) {
        return;
      }

      try {
        const mermaid = (await import('mermaid')).default;
        // 색 지정이 있으면 그대로(override 금지), 없으면 PostBody 톤(폰트색 등)을 반영합니다.
        // theme:'base' + themeVariables 폴백으로 미지정 다이어그램을 사이트 테마에 맞추고,
        // 다이어그램의 %%{init}%%/classDef 지정은 이 폴백을 덮어써 그대로 유지됩니다.
        //
        // htmlLabels를 켜야 라벨이 실제 HTML로 레이아웃되어 `<br/>` 줄바꿈·자동 줄바꿈·
        // 커스텀 폰트(Pretendard) 폭이 정확합니다. 콘텐츠는 first-party KB라 loose가 안전합니다.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          htmlLabels: true,
          flowchart: { htmlLabels: true },
          theme: 'base',
          themeVariables: postBodyThemeVariables(isDark),
        });

        ref.current.removeAttribute('data-processed');
        ref.current.textContent = code;
        await mermaid.run({ nodes: [ref.current] });

        if (!cancelled) {
          setError(null);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : 'Mermaid render failed');
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, isDark]);

  if (!code.trim()) {
    return null;
  }

  return (
    <figure className="my-6 overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <div id={`mermaid-${id}`} ref={ref} className="mermaid">
        {code}
      </div>
      {error && (
        <figcaption className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
          Mermaid diagram could not be rendered.
        </figcaption>
      )}
    </figure>
  );
}
