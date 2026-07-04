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
        // 정의했으면 그대로 존중하고(override 금지), 정의가 없으면 mermaid 기본 테마를
        // 씁니다. antiscript는 스크립트만 제거하고 htmlLabels(라벨 color, <br/>)를 허용합니다.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'antiscript',
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
