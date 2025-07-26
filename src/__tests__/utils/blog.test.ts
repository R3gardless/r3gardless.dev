import { describe, it, expect } from 'vitest';

import { formatPostDate } from '../../utils/blog';

describe('Blog Utils', () => {
  describe('formatPostDate', () => {
    it('유효한 ISO 날짜를 올바른 형식으로 변환한다', () => {
      const isoDate = '2024-01-15T10:30:00.000Z';
      const formatted = formatPostDate(isoDate);

      expect(formatted).toMatch(/^[A-Za-z]{3} \d{2}, \d{4}$/);
    });

    it('잘못된 날짜는 원본 문자열을 반환한다', () => {
      const invalidDate = 'invalid-date';
      const formatted = formatPostDate(invalidDate);

      expect(formatted).toBe(invalidDate);
    });
  });
});
