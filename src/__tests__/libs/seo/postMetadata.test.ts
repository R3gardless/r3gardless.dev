import { describe, expect, it } from 'vitest';

import { SITE_CONFIG } from '@/constants';
import {
  buildBlogListLanguageAlternates,
  buildPostLanguageAlternates,
  generatePostJsonLd,
  generatePostMetadata,
  serializeJsonLd,
} from '@/libs/seo/postMetadata';

describe('post metadata helpers', () => {
  it('serializes JSON-LD without allowing script context breakout', () => {
    const jsonLd = generatePostJsonLd({
      title: '</script><script>alert(1)</script>',
      description: 'Unsafe <tag> & separator \u2028 \u2029',
      canonical: '/blog/security',
    });

    const serialized = serializeJsonLd(jsonLd);

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('\\u003c/script\\u003e');
    expect(serialized).toContain('\\u0026');
    expect(serialized).toContain('\\u2028');
    expect(serialized).toContain('\\u2029');
    expect(JSON.parse(serialized)).toMatchObject({
      headline: '</script><script>alert(1)</script>',
      description: 'Unsafe <tag> & separator \u2028 \u2029',
    });
  });

  it('builds hreflang alternates with kr as x-default', () => {
    const siteUrl = SITE_CONFIG.url;

    expect(buildPostLanguageAlternates('2026-06-21-note', ['kr', 'en', 'jp'])).toEqual({
      ko: `${siteUrl}/blog/2026-06-21-note`,
      en: `${siteUrl}/en/blog/2026-06-21-note`,
      ja: `${siteUrl}/jp/blog/2026-06-21-note`,
      'x-default': `${siteUrl}/blog/2026-06-21-note`,
    });
    expect(buildPostLanguageAlternates('2026-06-21-note', ['kr'])).toEqual({
      ko: `${siteUrl}/blog/2026-06-21-note`,
      'x-default': `${siteUrl}/blog/2026-06-21-note`,
    });
    expect(buildBlogListLanguageAlternates()).toEqual({
      ko: `${siteUrl}/blog`,
      en: `${siteUrl}/en/blog`,
      ja: `${siteUrl}/jp/blog`,
      'x-default': `${siteUrl}/blog`,
    });
  });

  it('localizes post metadata locale, canonical, and language alternates', () => {
    const siteUrl = SITE_CONFIG.url;
    const languageAlternates = buildPostLanguageAlternates('note', ['kr', 'en']);
    const metadata = generatePostMetadata({
      title: 'Translated Note',
      description: 'English description',
      canonical: '/en/blog/note',
      lang: 'en',
      languageAlternates,
    });

    expect(metadata.openGraph?.locale).toBe('en_US');
    expect(metadata.alternates?.canonical).toBe(`${siteUrl}/en/blog/note`);
    expect(metadata.alternates?.languages).toEqual(languageAlternates);

    const krMetadata = generatePostMetadata({
      title: 'Original Note',
      description: '\uc124\uba85',
      canonical: '/blog/note',
    });

    expect(krMetadata.openGraph?.locale).toBe('ko_KR');
    expect(krMetadata.alternates?.languages).toBeUndefined();
  });

  it('localizes JSON-LD inLanguage per content language', () => {
    expect(
      generatePostJsonLd({ title: 'kr', description: '', canonical: '/blog/a' }).inLanguage,
    ).toBe('ko-KR');
    expect(
      generatePostJsonLd({ title: 'en', description: '', canonical: '/en/blog/a', lang: 'en' })
        .inLanguage,
    ).toBe('en-US');
    expect(
      generatePostJsonLd({ title: 'jp', description: '', canonical: '/jp/blog/a', lang: 'jp' })
        .inLanguage,
    ).toBe('ja-JP');
  });
});
