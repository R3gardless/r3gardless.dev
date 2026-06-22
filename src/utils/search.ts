import type { PostMeta } from '@/types/blog';

const MIN_FUZZY_TOKEN_LENGTH = 4;

export function matchesPostSearch(post: PostMeta, rawQuery: string): boolean {
  const queryTokens = tokenizeSearchText(rawQuery);

  if (queryTokens.length === 0) {
    return true;
  }

  const fields = getPostSearchFields(post);
  const normalizedFields = fields.map(normalizeSearchText).filter(Boolean);
  const combinedText = normalizedFields.join(' ');
  const phrase = queryTokens.join(' ');

  if (combinedText.includes(phrase)) {
    return true;
  }

  return queryTokens.every(token =>
    normalizedFields.some(field => matchesSearchToken(token, field)),
  );
}

export function filterPostsBySearch(posts: PostMeta[], rawQuery: string): PostMeta[] {
  const query = rawQuery.trim();

  if (!query) {
    return posts;
  }

  return posts.filter(post => matchesPostSearch(post, query));
}

function getPostSearchFields(post: PostMeta): string[] {
  return [post.title, post.description ?? '', post.category.text, ...post.tags];
}

function matchesSearchToken(token: string, normalizedField: string): boolean {
  if (normalizedField.includes(token)) {
    return true;
  }

  if (token.length < MIN_FUZZY_TOKEN_LENGTH) {
    return false;
  }

  return normalizedField.split(' ').some(candidate => isFuzzyTokenMatch(token, candidate));
}

function isFuzzyTokenMatch(queryToken: string, candidate: string): boolean {
  if (candidate.length < MIN_FUZZY_TOKEN_LENGTH) {
    return false;
  }

  const maxLength = Math.max(queryToken.length, candidate.length);
  const maxDistance = maxAllowedDistance(maxLength);

  if (Math.abs(queryToken.length - candidate.length) > maxDistance) {
    return false;
  }

  return levenshteinDistance(queryToken, candidate) <= maxDistance;
}

function maxAllowedDistance(length: number): number {
  if (length <= 5) {
    return 1;
  }

  if (length <= 8) {
    return 2;
  }

  return Math.ceil(length * 0.25);
}

function tokenizeSearchText(value: string): string[] {
  return normalizeSearchText(value).split(' ').filter(Boolean);
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(source: string, target: string): number {
  const previous = Array.from({ length: target.length + 1 }, (_, index) => index);
  const current = Array.from({ length: target.length + 1 }, () => 0);

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    current[0] = sourceIndex;

    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const cost = source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;
      current[targetIndex] = Math.min(
        current[targetIndex - 1] + 1,
        previous[targetIndex] + 1,
        previous[targetIndex - 1] + cost,
      );
    }

    for (let index = 0; index < previous.length; index += 1) {
      previous[index] = current[index];
    }
  }

  return previous[target.length];
}
