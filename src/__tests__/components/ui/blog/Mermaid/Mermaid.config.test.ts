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

  it('does not override mermaid default colors or force a site theme', () => {
    // mermaid 기본값만 사용합니다. 사이트 테마/themeVariables를 주입하지 않습니다.
    expect(source).not.toContain("theme: 'base'");
    expect(source).not.toContain('themeVariables');
  });
});
