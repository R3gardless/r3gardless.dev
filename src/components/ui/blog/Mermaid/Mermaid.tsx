'use client';

import { useEffect, useId, useRef, useState } from 'react';

export interface MermaidProps {
  code?: string;
}

export function Mermaid({ code = '' }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'default' | 'dark'>('default');

  useEffect(() => {
    const readTheme = () =>
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default');

    readTheme();

    if (!globalThis.MutationObserver) {
      return undefined;
    }

    const observer = new globalThis.MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!ref.current || !code.trim()) {
        return;
      }

      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme,
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
  }, [code, theme]);

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
