import { LocalizedLandingPage } from '@/libs/blogPages';

/**
 * ja 홈 라우트. ja 번역본이 있는 포스트만 노출하는 랜딩 페이지.
 */
export default function JaLandingPage() {
  return <LocalizedLandingPage lang="ja" />;
}
