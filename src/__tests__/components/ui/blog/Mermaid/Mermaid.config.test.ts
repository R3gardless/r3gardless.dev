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
    expect(source).toMatch(/flowchart:\s*\{\s*htmlLabels:\s*true\s*\}/);
  });

  it('does not override mermaid default colors or force a site theme', () => {
    // mermaid 기본값만 사용합니다. 사이트 테마/themeVariables를 주입하지 않습니다.
    expect(source).not.toContain("theme: 'base'");
    expect(source).not.toContain('themeVariables');
  });

  it('waits for fonts to load before rendering to avoid clipped labels', () => {
    // 커스텀 폰트 로드 전 렌더하면 라벨 폭 계산이 어긋나 끝 글자가 잘립니다.
    expect(source).toContain('document.fonts');
    expect(source).toMatch(/await\s+document\.fonts\.ready/);
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
