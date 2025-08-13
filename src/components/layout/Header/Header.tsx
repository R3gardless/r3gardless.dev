'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { useThemeStore } from '@/store/themeStore';
import { SITE_CONFIG } from '@/constants';
import { Heading, Text } from '@/components/ui/typography';

/**
 * Header Props Interface
 */
export interface HeaderProps {
  /** CSS 클래스명 */
  className?: string;
}

/**
 * Header 컴포넌트
 *
 * Figma 디자인을 기반으로 구현된 헤더
 * - 로고 (config에서 가져옴)
 * - 네비게이션 메뉴 (About, Blog)
 * - 테마 토글 버튼 (라이트/다크 모드)
 * - 현재 페이지에 따른 bold 처리
 */
export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 컨테이너 스타일 변수
  const navContainerStyle = `
    fixed top-0 left-0 right-0 z-50
    
    w-full h-[100px] flex justify-center
    ${className}
  `;

  const innerContainerStyle = `
    relative
    w-full max-w-[1300px] px-12

    flex items-center justify-between

    backdrop-blur-xl

  `;

  // 현재 경로 확인 함수
  const isCurrentPath = (path: string) => {
    if (!pathname) return false;
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 모바일 메뉴 닫기
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={navContainerStyle}>
      <div className={innerContainerStyle}>
        {/* 로고 */}
        <Link
          href="/"
          className="
            hover:opacity-130 transition-opacity duration-200
            focus:outline-none focus-visible:outline-none
          "
          onClick={closeMobileMenu}
        >
          {' '}
          <Heading level={2} fontFamily="maruBuri">
            {SITE_CONFIG.name}
          </Heading>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center">
          {/* 네비게이션 링크들 */}
          <div className="flex items-center gap-[42px]">
            <Link
              href="/about"
              className="
                hover:opacity-80 transition-opacity duration-200
                focus:outline-none focus-visible:outline-none
              "
            >
              <Text
                fontFamily="maruBuri"
                className={`
                  text-xl
                  ${isCurrentPath('/about') ? 'font-black border-b border-current pb-1' : 'font-normal'}
                `}
              >
                About
              </Text>
            </Link>
            <Link
              href="/blog"
              className="
                hover:opacity-80 transition-opacity duration-200
                focus:outline-none focus-visible:outline-none
              "
            >
              <Text
                fontFamily="maruBuri"
                className={`
                  text-xl
                  ${isCurrentPath('/blog') ? 'font-black border-b border-current pb-1' : 'font-normal'}
                `}
              >
                Blog
              </Text>
            </Link>
          </div>
        </div>

        {/* 테마 토글 버튼 - About 왼쪽에 고정 */}
        <button
          onClick={toggleTheme}
          className="
            hidden md:flex
            absolute right-[237px]
            w-12 h-12
            items-center justify-center
            hover:rotate-12 hover:scale-110 transition-all duration-500 ease-out cursor-pointer
            focus:outline-none focus-visible:outline-none
            active:scale-95 active:rotate-45
          "
          aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
        >
          <Image
            src={theme === 'light' ? '/icons/lightmode.png' : '/icons/darkmode.png'}
            alt={`${theme === 'light' ? '라이트' : '다크'} 모드 아이콘`}
            width={50}
            height={50}
            className="w-full h-full object-contain transition-all duration-500 ease-out"
          />
        </button>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={toggleMobileMenu}
          className="
            md:hidden
            w-12 h-12
            flex items-center justify-center
            hover:opacity-80 transition-opacity duration-200 cursor-pointer
            focus:outline-none focus-visible:outline-none
          "
          aria-label="메뉴 열기/닫기"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-[var(--color-text)]" />
          ) : (
            <Menu size={24} className="text-[var(--color-text)]" />
          )}
        </button>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="
          md:hidden fixed top-[100px] right-0 z-50
          w-[144px] h-screen
          backdrop-blur-xl
          flex flex-col items-center
        "
        >
          {/* 모바일 메뉴 콘텐츠 - About, Blog, 다크모드 아이콘 순서 */}
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/about"
              className="
                hover:opacity-80 transition-opacity duration-200
                focus:outline-none focus-visible:outline-none
              "
              onClick={closeMobileMenu}
            >
              <Text
                fontFamily="maruBuri"
                className={`
                  text-lg
                  ${isCurrentPath('/about') ? 'font-black border-b border-current pb-1' : 'font-normal'}
                `}
              >
                About
              </Text>
            </Link>
            <Link
              href="/blog"
              className="
                hover:opacity-80 transition-opacity duration-200
                focus:outline-none focus-visible:outline-none
              "
              onClick={closeMobileMenu}
            >
              <Text
                fontFamily="maruBuri"
                className={`
                  text-lg
                  ${isCurrentPath('/blog') ? 'font-black border-b border-current pb-1' : 'font-normal'}
                `}
              >
                Blog
              </Text>
            </Link>

            {/* 모바일 테마 토글 버튼 */}
            <button
              onClick={toggleTheme}
              className="
                w-10 h-10
                flex items-center justify-center
                hover:rotate-12 hover:scale-110 transition-all duration-500 ease-out cursor-pointer
                focus:outline-none focus-visible:outline-none
                active:scale-95 active:rotate-45
                mt-2
              "
              aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
            >
              <Image
                src={theme === 'light' ? '/icons/lightmode.png' : '/icons/darkmode.png'}
                alt={`${theme === 'light' ? '라이트' : '다크'} 모드 아이콘`}
                width={40}
                height={40}
                className="w-full h-full object-contain transition-all duration-500 ease-out"
              />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
