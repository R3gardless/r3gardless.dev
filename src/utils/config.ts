import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';

/**
 * 사이트 설정 정보를 가져옵니다
 */
export const getSiteConfig = () => ({
  site: SITE_CONFIG,
  author: AUTHOR_CONFIG,
});

export type SiteConfig = ReturnType<typeof getSiteConfig>;
