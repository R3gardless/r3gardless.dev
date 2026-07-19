import type { Paragraph, Root } from 'mdast';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import { repairBrokenStrongMarkers } from '@/libs/content/emphasis';

function repairMarkdown(markdown: string): string {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  repairBrokenStrongMarkers(tree);
  return String(unified().use(remarkStringify).stringify(tree));
}

function paragraphWithText(value: string): Root {
  const paragraph: Paragraph = { type: 'paragraph', children: [{ type: 'text', value }] };
  return { type: 'root', children: [paragraph] };
}

describe('repairBrokenStrongMarkers', () => {
  it('닫는 마커 앞 공백으로 깨진 볼드를 strong으로 복구한다', () => {
    const result = repairMarkdown(
      '장점은 **table lookup 8번으로 거리 계산이 끝난다 **는 점입니다.',
    );

    expect(result).toContain('**table lookup 8번으로 거리 계산이 끝난다** 는 점입니다.');
  });

  it('여는 마커 뒤 공백으로 깨진 볼드를 strong으로 복구한다', () => {
    const result = repairMarkdown('** 여는 쪽**도 고칩니다.');

    expect(result).toContain('**여는 쪽**도 고칩니다.');
  });

  it('양쪽 공백이 모두 붙은 경우도 복구한다', () => {
    const result = repairMarkdown('중간의 ** 양쪽 공백 ** 케이스.');

    expect(result).toContain('**양쪽 공백**');
  });

  it('한 텍스트 노드에 깨진 쌍이 여러 개 있으면 모두 복구한다', () => {
    const tree = paragraphWithText('A **첫째 **B 그리고 **둘째 **C');
    repairBrokenStrongMarkers(tree);

    const paragraph = tree.children[0] as Paragraph;
    const strongTexts = paragraph.children
      .filter(child => child.type === 'strong')
      .map(child => (child.children[0] as { value: string }).value);

    expect(strongTexts).toEqual(['첫째', '둘째']);
  });

  it('정상 볼드와 공백 없는 escaped 마커는 건드리지 않는다', () => {
    // 정상 볼드는 파싱 단계에서 strong 노드가 되므로 통과
    expect(repairMarkdown('**정상 볼드**와 텍스트')).toContain('**정상 볼드**와 텍스트');
    // 공백 없는 escaped 쌍은 "공백 없는 쌍 skip" 규칙으로 리터럴 유지
    expect(repairMarkdown('리터럴 \\*\\*마커\\*\\*는 유지')).toContain('\\*\\*마커\\*\\*는 유지');
  });

  it('공백이 없는 리터럴 쌍은 복구 대상이 아니다', () => {
    const tree = paragraphWithText('그대로 **유지**될 리터럴');
    repairBrokenStrongMarkers(tree);

    const paragraph = tree.children[0] as Paragraph;
    expect(paragraph.children).toHaveLength(1);
    expect(paragraph.children[0].type).toBe('text');
  });
});
