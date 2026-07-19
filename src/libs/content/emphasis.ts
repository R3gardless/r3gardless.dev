import type { Parent, PhrasingContent, Text } from 'mdast';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

/**
 * 닫는(또는 여는) `**` 마커에 공백이 붙어 CommonMark 강조로 인정되지 못한 패턴.
 * 예: `**끝난다 **는` — Obsidian은 볼드로 렌더링하지만 remark는 리터럴 텍스트로 남깁니다.
 *
 * escape 주의: remark 파싱 시 `\*\*`의 백슬래시 정보는 소실되어 텍스트 노드에는 `**`만
 * 남습니다. 공백 없는 escaped 쌍(`\*\*마커\*\*`)은 아래 "공백 없는 쌍 skip" 규칙으로
 * 보존되지만, 공백이 붙은 escaped 쌍은 강조로 복구됩니다(의도적 한계 - 이 블로그
 * 콘텐츠에서 리터럴 `** `를 의도하는 경우는 없다고 가정).
 */
const BROKEN_STRONG_PATTERN = /(?<!\\)\*\*(\s*)([^*\n]+?)(\s*)\*\*/;

function isTextNode(value: unknown): value is Text {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'text',
  );
}

/**
 * remark 파싱 후에도 텍스트 노드에 리터럴로 남은 `**X **`/`** X**` 패턴을
 * 실제 strong 노드로 복구합니다.
 *
 * 텍스트 노드 안에 `**`가 남아 있다는 것 자체가 CommonMark 파싱이 실패했다는 뜻이므로
 * (성공한 강조는 strong 노드로 분리됨), 인접한 정상 볼드쌍을 오인할 위험 없이 안전합니다.
 * 마커에 붙어 있던 공백은 강조 밖으로 옮겨 Obsidian 렌더링과 같은 간격을 유지합니다.
 */
export function repairBrokenStrongMarkers(tree: Node) {
  visit(tree, 'text', (node: Node, index, parent) => {
    if (!parent || typeof index !== 'number' || !isTextNode(node)) {
      return;
    }

    const value = node.value;
    if (!value.includes('**')) {
      return;
    }

    const segments: PhrasingContent[] = [];
    let rest = value;
    let repaired = false;

    while (rest) {
      const match = rest.match(BROKEN_STRONG_PATTERN);
      if (!match || match.index === undefined) {
        break;
      }

      const [whole, leadingSpace, inner, trailingSpace] = match;
      // 양쪽 모두 공백이 없으면 이 유틸이 고칠 패턴이 아니다 (escape 등 다른 원인)
      if (!leadingSpace && !trailingSpace) {
        break;
      }

      repaired = true;
      const before = rest.slice(0, match.index) + (leadingSpace ? ' ' : '');
      if (before) {
        segments.push({ type: 'text', value: before });
      }
      segments.push({ type: 'strong', children: [{ type: 'text', value: inner }] });
      rest = (trailingSpace ? ' ' : '') + rest.slice(match.index + whole.length);
    }

    if (!repaired) {
      return;
    }

    if (rest) {
      segments.push({ type: 'text', value: rest });
    }

    (parent as Parent).children.splice(index, 1, ...(segments as never[]));
    // 새로 삽입한 노드들 다음부터 방문을 계속한다
    return index + segments.length;
  });
}

/**
 * remark 플러그인 래퍼 (renderer 체인용)
 */
export function remarkRepairBrokenStrongMarkers() {
  return repairBrokenStrongMarkers;
}
