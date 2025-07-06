'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { useThemeStore } from '@/store/themeStore';
import { getSiteConfig } from '@/utils/config';
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
  const siteConfig = getSiteConfig();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav
      className={`
        w-full h-[100px] flex justify-center
        ${className}
      `}
    >
      <div
        className="
        w-full max-w-[1300px] px-12 py-8
        flex items-center justify-between
        relative
      "
      >
        {/* 로고 */}
        <Link
          href="/"
          className="
            hover:opacity-80 transition-opacity duration-200
            focus:outline-none focus-visible:outline-none
          "
          onClick={closeMobileMenu}
        >
          {' '}
          <Heading level={1} fontFamily="maruBuri">
            {siteConfig.site.name}
          </Heading>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-[50px]">
          {/* 테마 토글 버튼 */}
          <button
            onClick={toggleTheme}
            className="
              w-12 h-12
              flex items-center justify-center
              hover:opacity-80 transition-opacity duration-200 cursor-pointer
              focus:outline-none focus-visible:outline-none
            "
            aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
          >
            <Image
              src={theme === 'light' ? '/icons/lightmode.png' : '/icons/darkmode.png'}
              alt={`${theme === 'light' ? '라이트' : '다크'} 모드 아이콘`}
              width={50}
              height={50}
              className="w-full h-full object-contain"
            />
          </button>

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
                  ${isCurrentPath('/about') ? 'font-bold' : 'font-normal'}
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
                  ${isCurrentPath('/blog') ? 'font-bold' : 'font-normal'}
                `}
              >
                Blog
              </Text>
            </Link>
          </div>
        </div>

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
          md:hidden fixed inset-y-0 right-0 top-25 bottom-0 z-50
          w-48
          bg-[var(--color-background)]
          flex flex-col items-center py-8
          shadow-lg
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
                  ${isCurrentPath('/about') ? 'font-bold' : 'font-normal'}
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
                  ${isCurrentPath('/blog') ? 'font-bold' : 'font-normal'}
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
                hover:opacity-80 transition-opacity duration-200 cursor-pointer
                focus:outline-none focus-visible:outline-none
                mt-2
              "
              aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
            >
              <Image
                src={theme === 'light' ? '/icons/lightmode.png' : '/icons/darkmode.png'}
                alt={`${theme === 'light' ? '라이트' : '다크'} 모드 아이콘`}
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
