/**
 * Notion API 응답 타입 정의
 * 실제 Notion API 응답 구조를 기반으로 정의
 */

/**
 * Notion 색상 타입 정의
 */
export type NotionColor =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

/**
 * Notion 텍스트 블록 기본 구조
 */
export interface NotionTextBlock {
  type: 'text';
  text: {
    content: string;
    link: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

/**
 * Notion 타이틀 속성
 */
export interface NotionTitleProperty {
  id: string;
  type: 'title';
  title: NotionTextBlock[];
}

/**
 * Notion 리치 텍스트 속성
 */
export interface NotionRichTextProperty {
  id: string;
  type: 'rich_text';
  rich_text: NotionTextBlock[];
}

/**
 * Notion 셀렉트 속성
 */
export interface NotionSelectProperty {
  id: string;
  type: 'select';
  select: {
    name: string;
    color: NotionColor;
  } | null;
}

/**
 * Notion 멀티 셀렉트 속성
 */
export interface NotionMultiSelectProperty {
  id: string;
  type: 'multi_select';
  multi_select: Array<{
    name: string;
    color: NotionColor;
  }>;
}

/**
 * Notion 체크박스 속성
 */
export interface NotionCheckboxProperty {
  id: string;
  type: 'checkbox';
  checkbox: boolean;
}

/**
 * Notion 생성 시간 속성
 */
export interface NotionCreatedTimeProperty {
  id: string;
  type: 'created_time';
  created_time: string;
}

/**
 * Notion 마지막 수정 시간 속성
 */
export interface NotionLastEditedTimeProperty {
  id: string;
  type: 'last_edited_time';
  last_edited_time: string;
}

/**
 * Notion 유니크 ID 속성
 */
export interface NotionUniqueIdProperty {
  id: string;
  type: 'unique_id';
  unique_id: {
    prefix: string | null;
    number: number;
  };
}

/**
 * Notion 파일 속성
 */
export interface NotionFilesProperty {
  id: string;
  type: 'files';
  files: Array<{
    type: 'file';
    file: {
      url: string;
      expiry_time?: string;
    };
    name: string;
  }>;
}

/**
 * 블로그 포스트를 위한 Notion 페이지 속성 정의
 */
export interface NotionPageProperties {
  title: NotionTitleProperty;
  description?: NotionRichTextProperty;
  category?: NotionSelectProperty;
  tag?: NotionMultiSelectProperty;
  tags?: NotionMultiSelectProperty; // 다른 프로젝트에서 'tags'를 사용할 수도 있음
  isPublished: NotionCheckboxProperty;
  createdAt: NotionCreatedTimeProperty;
  lastEditedAt: NotionLastEditedTimeProperty;
  id?: NotionUniqueIdProperty;
  cover?: NotionFilesProperty;
}

/**
 * 색상 값을 안전하게 변환하는 헬퍼 함수
 */
export function validateNotionColor(color: string | undefined): NotionColor {
  const validColors: NotionColor[] = [
    'gray',
    'brown',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'red',
  ];
  return validColors.includes(color as NotionColor) ? (color as NotionColor) : 'gray';
}

/**
 * Notion 텍스트 블록에서 plain_text 추출
 */
export function extractPlainText(textBlocks: NotionTextBlock[] | undefined): string {
  if (!textBlocks || textBlocks.length === 0) return '';
  return textBlocks[0]?.plain_text || '';
}

/**
 * Notion 멀티 셀렉트에서 태그 이름들 추출
 */
export function extractTagNames(
  multiSelect: Array<{ name: string; color: NotionColor }> | undefined,
): string[] {
  if (!multiSelect) return [];
  return multiSelect.map(tag => tag.name);
}
