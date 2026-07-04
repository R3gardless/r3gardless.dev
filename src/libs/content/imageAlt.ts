/**
 * 이미지 alt(캡션) 파싱 유틸.
 *
 * CommonMark의 이미지 설명(link label)에는 균형 잡힌 중첩 대괄호가 올 수 있어
 * (`![a [b] c](url)`), 정규식 `!\[...\]\(` 으로는 alt 경계를 정확히 잘라낼 수 없습니다.
 * 그래서 대괄호 depth와 이스케이프를 추적하는 상태 머신으로 파싱합니다.
 */

/**
 * `![` 로 시작하는 문자열에서 이미지 alt를 추출합니다. 닫는 `]` 바로 뒤가 `(` 인,
 * depth 0의 위치를 alt의 끝으로 봅니다. 유효한 `![alt](` 형태가 아니면 null.
 */
export function extractImageAltAtStart(raw: string): string | null {
  if (!raw.startsWith('![')) {
    return null;
  }

  let depth = 0;
  for (let index = 2; index < raw.length; index += 1) {
    const char = raw[index];

    if (char === '\\') {
      index += 1; // 이스케이프된 다음 문자는 특수문자로 취급하지 않습니다.
      continue;
    }

    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      if (depth === 0) {
        return raw[index + 1] === '(' ? raw.slice(2, index) : null;
      }
      depth -= 1;
    }
  }

  return null;
}

/**
 * 마크다운 본문의 모든 `![alt](...)` 이미지에서, alt에 보존된 강조/취소선/인라인 코드/
 * math 마커의 이스케이프(`\*` `\_` `\~` `` \` `` `\$`)를 해제합니다. 중첩 대괄호를
 * 고려해 각 이미지 alt 경계를 상태 머신으로 찾습니다.
 */
export function unescapeMarkersInImageAlts(markdown: string): string {
  let result = '';
  let index = 0;

  while (index < markdown.length) {
    if (markdown[index] === '!' && markdown[index + 1] === '[') {
      const alt = extractImageAltAtStart(markdown.slice(index));
      if (alt !== null) {
        const unescaped = alt.replace(/\\([*_~`$])/g, '$1');
        result += `![${unescaped}](`;
        index += 2 + alt.length + 2; // `![` + alt + `](`
        continue;
      }
    }

    result += markdown[index];
    index += 1;
  }

  return result;
}
