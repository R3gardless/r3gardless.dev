import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Mermaid는 클라이언트에서 실제 브라우저 레이아웃(getBBox 등)을 필요로 해 jsdom에서
 * 온전히 렌더할 수 없습니다. 대신 렌더 품질을 좌우하는 초기화 설정이 회귀하지 않도록
 * 소스 수준에서 고정합니다.
 */
const source = fs.readFileSync(
  path.join(process.cwd(), 'src/components/ui/blog/Mermaid/Mermaid.tsx'),
  'utf8',
);

describe('Mermaid initialize configuration', () => {
  it('keeps htmlLabels on via loose securityLevel so <br/> and custom fonts render', () => {
    // strict/antiscript는 htmlLabels를 꺼서 `<br/>` 줄바꿈이 사라지고 폰트 폭이 잘립니다.
    expect(source).toContain("securityLevel: 'loose'");
    expect(source).toMatch(/htmlLabels:\s*true/);
    expect(source).toMatch(/flowchart:\s*\{\s*htmlLabels:\s*true\s*\}/);
  });

  it('applies a PostBody theme fallback that diagram-defined colors override', () => {
    // 색 지정이 없는 다이어그램은 PostBody 톤을 따르고, 지정된 색은 이 폴백을 덮어씁니다.
    expect(source).toContain("theme: 'base'");
    expect(source).toContain('themeVariables');
    expect(source).toContain('postBodyThemeVariables');
    // 라이트/다크 폴백 색을 적용하기 위해 사이트 테마를 관찰해야 합니다.
    expect(source).toContain("attributeFilter: ['data-theme']");
  });
});
