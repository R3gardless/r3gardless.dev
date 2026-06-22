import { describe, expect, it } from 'vitest';

import { generatePostJsonLd, serializeJsonLd } from '@/libs/seo/postMetadata';

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
});
