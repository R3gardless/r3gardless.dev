---
name: r3gardless-dev
description: Work on the r3gardless.dev Next.js static blog, especially KB Markdown content pipeline, blog rendering, CI/CD, harnesses, visual design tone, About page, and repo governance tasks.
---

# r3gardless.dev

## Start Here

Read `AGENTS.md` first. Read `docs/REPO_GUIDE.md` when changing layout, visual design, content pipeline, CI/CD, tests, or repo structure.

## Workflow

1. Inspect existing files before making assumptions.
2. Preserve static export and GitHub Pages constraints.
3. Treat the KB source as read-only. Only generated `content/posts`, `public/content`, and `public/data` are written by scripts.
4. Use `cover` as the only canonical image frontmatter field.
5. Keep blog body typography Pretendard; reserve MaruBuri for logo, hero/page titles, and section headings.
6. Keep Markdown body styles in `src/styles/markdown.css` under `.post-body`; do not recreate the legacy Notion stylesheet.
7. Run the narrow relevant tests first, then `bun run verify` before finishing substantial work.

## Critical Gates

- `bun run check-content` catches generated content contract regressions.
- `bun run check-repo` catches repo governance, CI/CD, and forbidden Notion dependency regressions.
- `bun run smoke:out` checks rendered static HTML for Markdown features.
- `bun run check-links` checks exported links and assets against the KB index.

## Design

Use thin borders, restrained spacing, CSS variables, and readable typography. Avoid nested cards, decorative gradients, or heavy glass effects unless already required by an existing component.
