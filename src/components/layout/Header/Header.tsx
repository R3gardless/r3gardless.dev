'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { Heading, Text } from '@/components/ui/typography';
import { SITE_CONFIG } from '@/constants';
import { getHeaderNavStrings } from '@/constants/i18n';
import { useThemeStore } from '@/store/themeStore';

import {
  LanguageSwitcher,
  langFromPathname,
  localizedPathname,
  pathnameWithoutLangPrefix,
} from './LanguageSwitcher';

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

  // 현재 경로의 언어를 유지한 채 이동하도록, 네비게이션 링크에 언어 prefix를 붙입니다.
  // (언어를 바꾸기 전까지 홈/About/Blog 이동 시에도 선택한 언어가 유지됨)
  const currentLang = langFromPathname(pathname);
  const homeHref = localizedPathname('/', currentLang);
  const aboutHref = localizedPathname('/about', currentLang);
  const blogHref = localizedPathname('/blog', currentLang);

  // 네비게이션 라벨을 현재 언어에 맞춰 분기 (한국어: 소개/블로그)
  const nav = getHeaderNavStrings(currentLang);

  // 컨테이너 스타일 변수
  const baseContainerStyle = `
    fixed top-0 left-0 right-0 z-50
    ${className}
  `;

  const mobileMenuContainerStyle = `
    md:hidden fixed top-[100px] right-0 z-50
    w-[144px] h-screen backdrop-blur-xl
    flex flex-col items-center
  `;

  // 현재 경로 확인 함수 (/en, /ja 언어 prefix는 무시하고 비교)
  const isCurrentPath = (path: string) => {
    if (!pathname) return false;
    const withoutLangPrefix = pathnameWithoutLangPrefix(pathname);
    if (path === '/') {
      // 언어별 홈(/, /en, /ja)에서도 홈이 현재 경로로 인식되도록 prefix 제거 후 비교
      return withoutLangPrefix === '/';
    }
    return pathname.startsWith(path) || withoutLangPrefix.startsWith(path);
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
    <nav className={baseContainerStyle}>
      <div className="flex justify-center backdrop-blur-xl w-full h-[100px]">
        <div className="relative w-full max-w-[1300px] px-12 flex items-center justify-between">
          {/* 로고 */}
          <Link
            href={homeHref}
            className="
              hover:opacity-130 transition-opacity duration-200
              focus:outline-none focus-visible:outline-none
            "
            onClick={closeMobileMenu} // 모바일 메뉴 있는 경우, 메뉴 닫기
          >
            <Heading level={2} fontFamily="maruBuri" className="text-2xl">
              {SITE_CONFIG.name}
            </Heading>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center">
            {/* 네비게이션 링크들 */}
            <div className="flex items-center gap-12">
              <button
                onClick={toggleTheme}
                className="
                  w-12 h-12
                  hover:rotate-12 hover:scale-110 transition-all duration-500 ease-out cursor-pointer
                  focus:outline-none focus-visible:outline-none
                  active:scale-95 active:rotate-45
                "
                aria-label={`${theme === 'light' ? 'dark' : 'light'} mode toggle`}
              >
                <Image
                  src={theme === 'light' ? '/icons/lightmode.png' : '/icons/darkmode.png'}
                  alt={`${theme === 'light' ? 'light' : 'dark'} mode icon`}
                  width={50}
                  height={50}
                  className="w-full h-full object-contain transition-all duration-500 ease-out"
                />
              </button>
              <Link
                href={aboutHref}
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
                  {nav.about}
                </Text>
              </Link>
              <Link
                href={blogHref}
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
                  {nav.blog}
                </Text>
              </Link>

              {/* 콘텐츠 언어 스위처 (KR/EN/JP) */}
              <LanguageSwitcher />
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
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div className={`${mobileMenuContainerStyle}`}>
          {/* 모바일 메뉴 콘텐츠 - About, Blog, 다크모드 아이콘 순서 */}
          <div className="flex flex-col items-center gap-6 mt-3">
            <Link
              href={aboutHref}
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
                {nav.about}
              </Text>
            </Link>
            <Link
              href={blogHref}
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
                {nav.blog}
              </Text>
            </Link>

            {/* 모바일 콘텐츠 언어 스위처 (KR/EN/JP) */}
            <LanguageSwitcher onNavigate={closeMobileMenu} />

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
              aria-label={`${theme === 'light' ? 'dark' : 'light'} mode toggle`}
            >
              <Image
                src={theme === 'light' ? '/icons/lightmode.png' : '/icons/darkmode.png'}
                alt={`${theme === 'light' ? 'light' : 'dark'} mode icon`}
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
