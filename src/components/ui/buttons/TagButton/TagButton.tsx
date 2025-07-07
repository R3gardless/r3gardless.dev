import React from 'react';
import { X } from 'lucide-react';

export interface TagButtonProps {
  /**
   * 태그 텍스트 내용
   */
  text: string;
  /**
   * 클릭된 상태 (X 아이콘 표시)
   * @default false
   */
  isClicked?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: (event?: React.MouseEvent) => void;
  /**
   * X 아이콘 클릭 이벤트 핸들러 (태그 제거용)
   */
  onRemove?: (event?: React.MouseEvent) => void;
}

/**
 * 기본 태그 버튼 컴포넌트
 * 테마 변수를 사용하여 색상 적용
 */
export const TagButton = ({
  text,
  isClicked = false,
  className = '',
  onClick,
  onRemove,
}: TagButtonProps) => {
  // 기본 스타일
  const baseStyles =
    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all duration-200';

  // 테마에 따른 스타일 적용 (CSS 변수 사용)
  // 클릭된 상태에서는 반대 테마의 색상을 사용
  const themeStyles = isClicked
    ? 'bg-[color:var(--color-secondary-clicked)] text-[color:var(--color-text-clicked)]'
    : 'bg-[color:var(--color-secondary)] text-[color:var(--color-text)]';

  // 호버 효과 및 커서 스타일 (클릭 가능한 경우에만 적용)
  const hoverStyles = onClick ? 'hover:opacity-80 cursor-pointer' : '';

  /* 클릭 가능한 경우 button, 그렇지 않은 경우 span 사용하여 시맨틱 마크업 향상 */
  const Component = onClick ? 'button' : 'span';

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 onClick 이벤트 전파 방지
    onRemove?.();
  };

  return (
    <Component
      className={`${baseStyles} ${themeStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <span>{text.startsWith('#') ? text : `#${text}`}</span>
      {isClicked && onRemove && (
        <X
          size={12}
          className="ml-1 cursor-pointer hover:opacity-110 opacity-70 transition-opacity"
          onClick={handleRemove}
          aria-label="태그 제거"
        />
      )}
    </Component>
  );
};

export default TagButton;
