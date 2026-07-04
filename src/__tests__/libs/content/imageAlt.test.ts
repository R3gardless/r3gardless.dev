import { describe, expect, it } from 'vitest';

import { extractImageAltAtStart, unescapeMarkersInImageAlts } from '@/libs/content/imageAlt';

describe('extractImageAltAtStart', () => {
  it('extracts a plain alt', () => {
    expect(extractImageAltAtStart('![hello](/x.png)')).toBe('hello');
  });

  it('keeps nested balanced brackets in the alt', () => {
    expect(extractImageAltAtStart('![a [b] c](/x.png)')).toBe('a [b] c');
    expect(extractImageAltAtStart('![a [b [c] d] e](/x.png)')).toBe('a [b [c] d] e');
  });

  it('keeps escaped brackets and emphasis markers', () => {
    expect(extractImageAltAtStart('![a \\] b](/x.png)')).toBe('a \\] b');
    expect(extractImageAltAtStart('![*i* **b** ~~d~~](/x.png)')).toBe('*i* **b** ~~d~~');
  });

  it('returns null when not a valid image start', () => {
    expect(extractImageAltAtStart('[link](/x)')).toBeNull();
    expect(extractImageAltAtStart('![no closing paren]')).toBeNull();
    expect(extractImageAltAtStart('![alt] not an image')).toBeNull();
  });
});

describe('unescapeMarkersInImageAlts', () => {
  it('unescapes emphasis/strike/code/math markers inside image alts only', () => {
    const input = '![\\*i\\* \\~\\~d\\~\\~ \\`c\\` \\$x\\$](/x.png) and \\*keep\\* outside';
    expect(unescapeMarkersInImageAlts(input)).toBe(
      '![*i* ~~d~~ `c` $x$](/x.png) and \\*keep\\* outside',
    );
  });

  it('handles nested brackets without corrupting the alt', () => {
    const input = '![a \\[b\\] \\*i\\* [n]](/x.png)';
    expect(unescapeMarkersInImageAlts(input)).toBe('![a \\[b\\] *i* [n]](/x.png)');
  });

  it('leaves text without images unchanged', () => {
    expect(unescapeMarkersInImageAlts('no images here \\* \\_')).toBe('no images here \\* \\_');
  });
});
