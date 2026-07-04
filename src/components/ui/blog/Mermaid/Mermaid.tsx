'use client';

import { useEffect, useId, useRef, useState } from 'react';

export interface MermaidProps {
  code?: string;
}

export function Mermaid({ code = '' }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!ref.current || !code.trim()) {
        return;
      }

      try {
        const mermaid = (await import('mermaid')).default;
        // 사이트 테마를 강제하지 않습니다. 다이어그램이 %%{init}%%/classDef로 색·폰트를
        // 정의했으면 그대로 존중하고(override 금지), 정의가 없으면 mermaid 기본 테마를 씁니다.
        //
        // htmlLabels를 켜야 라벨이 실제 HTML로 레이아웃되어 `<br/>` 줄바꿈, 자동 줄바꿈,
        // 커스텀 폰트(Pretendard) 폭이 정확히 잡힙니다. SVG text 모드(strict/antiscript)는
        // `<br/>`를 무시하고 폰트 폭 계산이 어긋나 마지막 글자가 잘립니다.
        // 콘텐츠는 first-party KB라 loose(htmlLabels 허용)가 안전합니다.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          htmlLabels: true,
          flowchart: { htmlLabels: true },
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
  }, [code]);

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
