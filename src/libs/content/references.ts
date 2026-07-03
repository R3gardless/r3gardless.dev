/**
 * 참고문헌(References) 섹션 제목 판별.
 *
 * export 변환(mdast)과 런타임 렌더링(hast) 양쪽에서 동일한 기준으로 참고문헌 섹션을
 * 인식하도록 제목 집합과 판별 함수를 한곳에서 공유합니다. kr/en/ja 제목을 모두 포함합니다.
 */
const REFERENCE_HEADING_TITLES = new Set<string>([
  // ko
  '참고문헌',
  '참고 문헌',
  '출처',
  // en
  'references',
  'reference',
  'sources',
  'source',
  // ja
  '参考文献',
  '参考資料',
  '出典',
]);

/**
 * 번호 접두사(예: "6. ")를 제거하고 정규화한 제목이 참고문헌 제목인지 판별합니다.
 */
export function isReferenceHeadingTitle(rawTitle: string): boolean {
  const title = rawTitle
    .trim()
    .toLowerCase()
    .replace(/^\d+(?:\.\d+)*\.?\s*/, '');
  return REFERENCE_HEADING_TITLES.has(title);
}
