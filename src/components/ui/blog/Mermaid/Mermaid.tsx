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
        // mermaid 기본값만 사용합니다. 사이트 테마/색을 일절 주입(override)하지 않고,
        // 다이어그램이 %%{init}%%/classDef로 정의한 색은 mermaid가 처리하는 대로 둡니다.
        //
        // 예외적으로 securityLevel: 'loose'로 htmlLabels만 켭니다. 이는 색 override가
        // 아니라 렌더링 방식입니다. 이게 없으면 `<br/>` 줄바꿈이 사라지고 커스텀 폰트
        // 폭 계산이 어긋나 라벨 끝 글자가 잘립니다. 콘텐츠는 first-party KB라 안전합니다.
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
