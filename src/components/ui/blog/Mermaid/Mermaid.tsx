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

const ERROR_LABEL: Record<PostLang, string> = {
  kr: '다이어그램을 렌더링할 수 없습니다.',
  en: 'Mermaid diagram could not be rendered.',
  ja: '図をレンダリングできませんでした。',
};

/**
 * mermaid `theme: 'base'` themeVariables -> globals.css 토큰 매핑.
 *
 * 색은 JS에 하드코딩하지 않고 `--pb-mermaid-*` CSS 변수를 렌더 시점에 읽어 넘깁니다.
 * mermaid는 themeVariables를 khroma로 파생(invert/darken 등)시키므로 `var(--x)` 문자열을
 * 그대로 줄 수 없고, 계산된 실제 색 값을 넘겨야 합니다. 토큰은 라이트/다크 공통이라
 * 테마 전환 시 재렌더가 필요하지 않습니다.
 */
const THEME_VARIABLE_TOKENS = {
  background: '--pb-mermaid-surface',
  primaryColor: '--pb-mermaid-primary',
  primaryBorderColor: '--pb-mermaid-stroke',
  lineColor: '--pb-mermaid-stroke',
  primaryTextColor: '--pb-mermaid-text',
  clusterBkg: '--pb-mermaid-cluster',
  clusterBorder: '--pb-mermaid-cluster-stroke',
  // 본문과 같은 Pretendard 스택(.post-body의 --pb-sans). 밖에서 렌더되면 mermaid 기본 폰트.
  fontFamily: '--pb-sans',
  // mermaid 폭 계산이 px를 요구해 토큰 값도 px입니다(블로그 UI rem 규칙의 의도적 예외).
  fontSize: '--pb-mermaid-font-size',
} as const;

/**
 * handDrawn 룩의 rough.js 시드. 0(기본)은 랜덤이라 재렌더마다 선이 흔들리므로 고정합니다.
 * KNOWLEDGE_BASE의 mermaid-cli 미리보기 설정(mermaid.config.json)과 같은 값을 씁니다.
 */
const HAND_DRAWN_SEED = 7;

export function readMermaidThemeVariables(element: Element): Record<string, string> {
  const styles = globalThis.getComputedStyle(element);
  const variables: Record<string, string> = {};
  for (const [name, token] of Object.entries(THEME_VARIABLE_TOKENS)) {
    const value = styles.getPropertyValue(token).trim();
    if (value) {
      variables[name] = value;
    }
  }
  return variables;
}

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
        const themeVariables = readMermaidThemeVariables(host);
        // 사이트 기본 룩: 손그림(handDrawn) + base 테마. 팔레트는 globals.css의
        // --pb-mermaid-* 토큰에서 읽습니다(readMermaidThemeVariables). 다이어그램이
        // %%{init}%%/classDef로 직접 지정한 테마·색은 여전히 이 기본값을 덮어씁니다.
        //
        // securityLevel: 'antiscript' — htmlLabels(<br/>·자동 줄바꿈·폰트 폭 정확)를
        // 허용하되 스크립트는 제거해 'loose'보다 XSS에 안전합니다.
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'antiscript',
          htmlLabels: true,
          flowchart: { htmlLabels: true, wrappingWidth: 360, nodeSpacing: 40, rankSpacing: 40 },
          look: 'handDrawn',
          handDrawnSeed: HAND_DRAWN_SEED,
          theme: 'base',
          themeVariables,
        });

        // 커스텀 폰트가 로드된 뒤 렌더해야 라벨 폭 계산이 어긋나 글자가 잘리지 않습니다.
        // Pretendard는 unicode-range 동적 서브셋이라 본문에 없던 글자는 다이어그램이 처음
        // 그릴 때 서브셋이 뒤늦게 로드됩니다. fonts.load(font, text)로 다이어그램 텍스트에
        // 필요한 서브셋을 먼저 당겨온 뒤 ready를 기다립니다.
        if (typeof document !== 'undefined' && document.fonts) {
          try {
            if (themeVariables.fontFamily) {
              await document.fonts.load(
                `${themeVariables.fontSize || '1em'} ${themeVariables.fontFamily}`,
                code,
              );
            }
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
      {/*
        렌더 결과 SVG는 Shadow DOM에 삽입되므로 host는 빈 컨테이너로 둡니다. 여기에 code
        텍스트를 자식으로 넣으면 렌더 성공 후에도 라이트 DOM에 소스가 중복 유지됩니다.
      */}
      <div
        ref={hostRef}
        className="mermaid"
        role="img"
        aria-label={DIAGRAM_LABEL[lang] ?? DIAGRAM_LABEL[DEFAULT_POST_LANG]}
      />
      {error && (
        <figcaption className="mermaid-error mt-3 text-sm">
          {ERROR_LABEL[lang] ?? ERROR_LABEL[DEFAULT_POST_LANG]}
        </figcaption>
      )}
    </figure>
  );
}
