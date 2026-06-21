declare module 'remark-wiki-link' {
  import type { Plugin } from 'unified';

  interface RemarkWikiLinkOptions {
    permalinks?: string[];
    pageResolver?: (pageName: string) => string[];
    hrefTemplate?: (permalink: string) => string;
    wikiLinkClassName?: string;
    newClassName?: string;
    aliasDivider?: string;
  }

  const remarkWikiLink: Plugin<[RemarkWikiLinkOptions?]>;
  export default remarkWikiLink;
}
