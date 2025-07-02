import siteConfig from '@/config/site.json';

export const getSiteConfig = () => siteConfig;

export type SiteConfig = typeof siteConfig;
