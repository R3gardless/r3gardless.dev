import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import {
  LanguageSwitcher,
  langFromPathname,
  localizedPathname,
  pathnameWithoutLangPrefix,
  searchForLanguageSwitch,
} from './LanguageSwitcher';

const navigationMocks = vi.hoisted(() => ({
  pathname: '/blog',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationMocks.pathname,
}));

describe('LanguageSwitcher helpers', () => {
  it('경로에서 언어를 파싱한다', () => {
    expect(langFromPathname('/blog')).toBe('kr');
    expect(langFromPathname('/en/blog')).toBe('en');
    expect(langFromPathname('/ja')).toBe('ja');
  });

  it('언어 prefix를 제거·교체한다', () => {
    expect(pathnameWithoutLangPrefix('/en/blog')).toBe('/blog');
    expect(localizedPathname('/blog', 'en')).toBe('/en/blog');
    expect(localizedPathname('/en/blog', 'kr')).toBe('/blog');
  });

  it('언어 전환 시 series query만 제거한다 (category/tags/search는 유지)', () => {
    expect(searchForLanguageSwitch('?series=ANN+%EB%85%BC%EB%AC%B8')).toBe('');
    expect(searchForLanguageSwitch('?series=ANN&tags=Web,DB&category=Vector+Search')).toBe(
      '?tags=Web%2CDB&category=Vector+Search',
    );
    expect(searchForLanguageSwitch('?search=hnsw&series=ANN')).toBe('?search=hnsw');
    expect(searchForLanguageSwitch('')).toBe('');
  });
});

describe('LanguageSwitcher', () => {
  it('언어 링크에 series query를 제외한 현재 필터를 유지한다', () => {
    navigationMocks.pathname = '/blog';
    window.history.replaceState(null, '', '/blog/?series=ANN%20%EB%85%BC%EB%AC%B8&tags=Web');

    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: 'Language switcher' }));

    const englishLink = screen.getByRole('link', { name: /English/ });
    expect(englishLink.getAttribute('href')).toBe('/en/blog?tags=Web');
    expect(englishLink.getAttribute('href')).not.toContain('series');
  });
});
