import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { Search, Command } from 'lucide-react';

export interface SearchBarProps {
  /**
   * 검색어 입력 값
   */
  value?: string;
  /**
   * placeholder 텍스트
   * @default 'Find something interesting…'
   */
  placeholder?: string;
  /**
   * 검색어 변경 이벤트 핸들러
   */
  onChange?: (value: string) => void;
  /**
   * Enter 키 또는 검색 버튼 클릭 시 호출되는 핸들러
   */
  onSearch?: (value: string) => void;
  /**
   * 로딩 상태
   * @default false
   */
  loading?: boolean;
  /**
   * 비활성화 상태
   * @default false
   */
  disabled?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 키보드 단축키 표시 여부
   * @default true
   */
  showShortcut?: boolean;
}

/**
 * SearchBar 컴포넌트
 * 검색 기능을 위한 입력창과 단축키 지원
 *
 * Cmd+K (macOS) 또는 Ctrl+K (Windows/Linux) 단축키로 포커스 가능
 */
export const SearchBar = forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      value = '',
      placeholder = 'Find something interesting…',
      onChange,
      onSearch,
      loading = false,
      disabled = false,
      className = '',
      showShortcut = true,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isMac, setIsMac] = useState(false);

    // macOS 여부 확인
    useEffect(() => {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, []);

    // 키보드 단축키 (Cmd+K 또는 Ctrl+K) 처리
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((isMac ? event.metaKey : event.ctrlKey) && event.key === 'k') {
          event.preventDefault();
          inputRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMac]);

    // Enter 키 처리
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !disabled && !loading) {
        onSearch?.(value);
      }
    };

    // 입력값 변경 처리
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      onChange?.(newValue);
    };

    // 포커스 상태 관리
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // 컨테이너 스타일
    const containerClasses = [
      'relative flex items-center w-full max-w-md mx-auto',
      'bg-[color:var(--color-background)]',
      'border border-[color:var(--color-primary)]',
      'rounded-lg transition-all duration-200',
      isFocused ? 'ring-2 ring-[color:var(--color-primary)]/20' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // 입력 필드 스타일 - 포커스 상태에 따라 패딩 조정
    const inputClasses = [
      'flex-1 pl-12 py-3', // 검색 아이콘을 위한 왼쪽 패딩
      isFocused || !showShortcut ? 'pr-4' : 'pr-16', // 포커스 시 오른쪽 패딩 줄임
      'bg-transparent',
      'text-[color:var(--color-text)]',
      'placeholder:text-[color:var(--color-text)]/50',
      'focus:outline-none',
      'disabled:cursor-not-allowed',
      'text-sm md:text-base',
      'transition-all duration-200', // 패딩 변화에 부드러운 전환 효과
    ].join(' ');

    // 단축키 표시 스타일
    const shortcutClasses = [
      'absolute right-3 top-1/2 -translate-y-1/2',
      'flex items-center gap-1',
      'px-2 py-1 rounded',
      'bg-[color:var(--color-secondary)]',
      'text-[color:var(--color-text)]/70',
      'text-xs font-medium',
      'pointer-events-none',
      'transition-all duration-200',
      isFocused ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0', // 포커스 시 살짝 오른쪽으로 이동하며 사라짐
    ].join(' ');

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {/* 검색 아이콘 */}
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-text)]/70 pointer-events-none"
        />

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClasses}
        />

        {/* 키보드 단축키 표시 */}
        {showShortcut && !isFocused && (
          <div className={shortcutClasses}>
            {isMac ? (
              <>
                <Command size={12} />
                <span>+</span>
                <span>K</span>
              </>
            ) : (
              <>
                <span>Ctrl</span>
                <span>+</span>
                <span>K</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
