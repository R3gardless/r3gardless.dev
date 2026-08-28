import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Mermaid는 클라이언트에서 실제 브라우저 레이아웃(getBBox 등)을 필요로 해 jsdom에서
 * 온전히 렌더할 수 없습니다. 대신 렌더 품질을 좌우하는 초기화/격리 설정이 회귀하지
 * 않도록 소스 수준에서 고정합니다.
 */
const source = fs.readFileSync(
  path.join(process.cwd(), 'src/components/ui/blog/Mermaid/Mermaid.tsx'),
  'utf8',
);

describe('Mermaid rendering configuration', () => {
  it('keeps htmlLabels on (antiscript) so <br/> and custom fonts render, without loose scripts', () => {
    // strict는 htmlLabels를 꺼서 `<br/>` 줄바꿈이 사라지고 폰트 폭이 잘립니다.
    // antiscript는 htmlLabels를 허용하되 스크립트는 제거해 loose보다 안전합니다.
    expect(source).toContain("securityLevel: 'antiscript'");
    expect(source).not.toContain("securityLevel: 'loose'");
    expect(source).toMatch(/htmlLabels:\s*true/);
    expect(source).toMatch(/flowchart:\s*\{\s*htmlLabels:\s*true\b/);
  });

  it('uses the handDrawn look with a fixed seed on the base theme', () => {
    // 사이트 기본 룩은 손그림입니다. seed 0(기본)은 랜덤이라 재렌더마다 선이 흔들립니다.
    expect(source).toMatch(/look:\s*'handDrawn'/);
    expect(source).toMatch(/handDrawnSeed:\s*HAND_DRAWN_SEED/);
    expect(source).toMatch(/const HAND_DRAWN_SEED\s*=\s*[1-9]\d*;/);
    expect(source).toContain("theme: 'base'");
  });

  it('feeds themeVariables from globals.css tokens instead of hard-coded colors', () => {
    // 색은 globals.css CSS 변수만 사용합니다. JS에 hex/rgb 리터럴을 두지 않습니다.
    expect(source).toMatch(/const themeVariables\s*=\s*readMermaidThemeVariables\(host\)/);
    expect(source).toMatch(/^\s*themeVariables,\s*$/m);
    expect(source).toMatch(/getComputedStyle\(/);
    expect(source).toContain("'--pb-mermaid-surface'");
    expect(source).toContain("'--pb-mermaid-primary'");
    expect(source).toContain("'--pb-mermaid-stroke'");
    expect(source).toContain("'--pb-mermaid-text'");
    expect(source).toContain("'--pb-mermaid-cluster'");
    // px 리터럴은 check-repo(rem 규칙)에 걸리고, mermaid는 px가 필요하므로 토큰으로 넘깁니다.
    expect(source).toContain("fontSize: '--pb-mermaid-font-size'");
    expect(source).not.toMatch(/\d+px/);
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).not.toMatch(/rgba?\(/);
  });

  it('declares every mermaid palette token it reads in globals.css', () => {
    const globals = fs.readFileSync(path.join(process.cwd(), 'src/styles/globals.css'), 'utf8');
    const tokens = [...source.matchAll(/'(--pb-mermaid-[a-z-]+)'/g)].map(([, token]) => token);
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of new Set(tokens)) {
      expect(globals).toMatch(new RegExp(`^\\s*${token}:\\s*\\S`, 'm'));
    }
  });

  it('waits for fonts to load before rendering to avoid clipped labels', () => {
    // 커스텀 폰트 로드 전 렌더하면 라벨 폭 계산이 어긋나 끝 글자가 잘립니다.
    expect(source).toContain('document.fonts');
    expect(source).toMatch(/await\s+document\.fonts\.ready/);
  });

  it('uses the body font stack and pre-loads the dynamic subsets the diagram text needs', () => {
    // Pretendard는 unicode-range 동적 서브셋이라 다이어그램에만 있는 글자는 렌더 후에
    // 로드되어 폭이 어긋납니다. fonts.load(font, text)로 먼저 당겨옵니다.
    expect(source).toContain("fontFamily: '--pb-sans'");
    expect(source).toMatch(
      /document\.fonts\.load\([^)]*themeVariables\.fontFamily[^)]*,\s*code,?\s*\)/,
    );
  });

  it('isolates the diagram in a Shadow DOM so page CSS cannot bleed into labels', () => {
    // Shadow DOM이 없으면 globals의 p { color } 등이 라벨로 새어들어 색이 씻기거나
    // 폭이 어긋나 글자가 잘립니다.
    expect(source).toContain('attachShadow');
    expect(source).toMatch(/mermaid\.render\(/);
  });

  it('injects the SVG via DOMParser nodes, not string innerHTML', () => {
    // 문자열 innerHTML 주입 대신 inert 파싱 후 노드 삽입으로 XSS/DOM 클로버링을 줄입니다.
    expect(source).toContain('DOMParser');
    expect(source).toMatch(/importNode/);
    expect(source).not.toMatch(/shadow\.innerHTML\s*=/);
  });

  it('localizes the diagram accessibility label by lang', () => {
    // en/ja 글에서 한국어 aria-label이 노출되지 않도록 lang으로 로컬라이즈합니다.
    expect(source).toMatch(/aria-label=\{DIAGRAM_LABEL/);
    expect(source).toContain("en: 'Diagram'");
  });
});
