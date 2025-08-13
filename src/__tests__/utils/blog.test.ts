import { describe, it, expect } from 'vitest';

import { formatPostDateTimeKST } from '../../utils/blog';

describe('Blog Utils', () => {
  describe('formatPostDateTimeKST', () => {
    it('UTC 날짜를 KST로 변환하여 올바른 형식으로 포맷팅한다', () => {
      const utcDate = '2025-08-09T16:22:00.000Z';
      const formatted = formatPostDateTimeKST(utcDate);

      // "Aug 10, 2025" 형식 확인
      expect(formatted).toMatch(/^[A-Za-z]{3} \d{2}, \d{4}$/);
    });

    it('잘못된 날짜는 원본 문자열을 반환한다', () => {
      const invalidDate = 'invalid-date';
      const formatted = formatPostDateTimeKST(invalidDate);

      expect(formatted).toBe(invalidDate);
    });

    it('UTC 시간이 다음날로 넘어가는 경우 올바르게 변환한다', () => {
      // UTC 16:22는 KST 01:22 (다음날)
      const utcDate = '2025-08-09T16:22:00.000Z';
      const formatted = formatPostDateTimeKST(utcDate);

      // 날짜가 Aug 10으로 변경되는지 확인
      expect(formatted).toContain('Aug 10, 2025');
    });
  });
});
