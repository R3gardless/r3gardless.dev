'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';

export interface MermaidProps {
  code?: string;
  /**
   * 접근성 라벨 로컬라이즈용 렌더 언어.
   */
  lang?: PostLang;
}

const DIAGRAM_LABEL: Record<PostLang, string> = {
  kr: '다이어그램',
  en: 'Diagram',
  ja: '図',
};

export function Mermaid({ code = '', lang = DEFAULT_POST_LANG }: MermaidProps) {
  const id = useId().replace(/:/g, '');
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      const host = hostRef.current;
      if (!host || !code.trim()) {
        return;
      }

      try {
        const mermaid = (await import('mermaid')).default;
        // mermaid 기본값만 사용합니다(사이트 테마/색 주입 없음). 다이어그램이
        // %%{init}%%/classDef로 정의한 색만 그대로 반영됩니다.
        //
        // securityLevel: 'antiscript' — htmlLabels(<br/>·자동 줄바꿈·폰트 폭 정확)를
        // 허용하되 스크립트는 제거해 'loose'보다 XSS에 안전합니다.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'antiscript',
          htmlLabels: true,
          flowchart: { htmlLabels: true },
        });

        // 커스텀 폰트가 로드된 뒤 렌더해야 라벨 폭 계산이 어긋나 글자가 잘리지 않습니다.
        if (typeof document !== 'undefined' && document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch {
            // 폰트 로드 상태를 확인할 수 없어도 렌더는 진행합니다.
          }
        }

        const { svg } = await mermaid.render(`mermaid-svg-${id}`, code);
        if (cancelled) {
          return;
        }

        // 문자열 innerHTML 주입 대신 DOMParser로 SVG를 inert 문서에서 파싱해 노드로
        // 삽입합니다(스크립트 미실행 + DOM 클로버링 리스크 감소). 추가로 Shadow DOM으로
        // 페이지 CSS(globals의 p { color } 등)를 완전히 차단해, 다이어그램이 mermaid 자체
        // 스타일만 쓰도록 격리합니다(GitHub/VSCode 렌더러처럼). 격리가 없으면 본문 타이포가
        // 라벨로 새어들어 색이 씻기거나 폭이 어긋나 글자가 잘립니다.
        // htmlLabels(<br>·foreignObject 내부 HTML)는 엄격 XML(image/svg+xml)에서 깨질 수
        // 있어 관대한 text/html로 파싱합니다. 파싱 실패로 svg를 못 찾으면 조용히 빈
        // 다이어그램을 남기지 않고 에러를 던져 아래 error UI가 뜨게 합니다.
        const parsedSvg = new globalThis.DOMParser()
          .parseFromString(svg, 'text/html')
          .body.querySelector('svg');
        if (!parsedSvg) {
          throw new Error('Mermaid SVG could not be parsed');
        }

        const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent =
          ':host{all:initial;display:block}svg{display:block;max-width:100%;height:auto;margin:0 auto}';
        shadow.replaceChildren(style);
        shadow.append(document.importNode(parsedSvg, true));

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
  }, [code, id]);

  if (!code.trim()) {
    return null;
  }

  return (
    <figure className="mermaid-figure my-6 overflow-x-auto">
      <div
        ref={hostRef}
        className="mermaid"
        role="img"
        aria-label={DIAGRAM_LABEL[lang] ?? DIAGRAM_LABEL[DEFAULT_POST_LANG]}
      >
        {code}
      </div>
      {error && (
        <figcaption className="mermaid-error mt-3 text-sm">
          Mermaid diagram could not be rendered.
        </figcaption>
      )}
    </figure>
  );
}
