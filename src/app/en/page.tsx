import { LocalizedLandingPage } from '@/libs/blogPages';

/**
 * en 홈 라우트. en 번역본이 있는 포스트만 노출하는 랜딩 페이지.
 */
export default function EnLandingPage() {
  return <LocalizedLandingPage lang="en" />;
}
