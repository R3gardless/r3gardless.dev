# Copilot Instructions for r3gardless.dev

This repository is a Next.js static blog that renders Markdown exported from a private personal KB.

## Core Rules

- Use Bun for package and script execution.
- The source KB is read-only. Only generated `content/posts/`, `public/content/`, and `public/data/` are written by the site pipeline.
- Publish only Markdown with frontmatter `publish: true`; never publish raw/source notes.
- Keep static export working for GitHub Pages.
- Do not add auto-merge workflows.

## Content Pipeline

- `KB_PATH` points to the KB root. CI checks out the private KB into `.cache/knowledge-base`.
- `bun run build:content` exports publishable notes and referenced assets.
- `bun run build:meta` writes `public/data/postMeta.json`.
- `bun run check-links` fails leftover `.md` links, missing images, and broken publish links.
- `bun run verify` is the single local/CI gate.

## Markdown Rendering

- GFM, task lists, tables, footnotes: `remark-gfm`
- Alerts: `remark-github-blockquote-alert`
- Math: `remark-math` + `rehype-katex`
- Wikilinks: `remark-wiki-link` plus local resolver
- Mermaid: client `Mermaid` component, static export friendly
- Code: `rehype-pretty-code`

## Icons

- General UI icons: `lucide-react`
- Brand/social icons: prefer `react-icons/si`; use another `react-icons` brand pack when Simple Icons does not expose the brand.

## Project Structure

```text
content/posts/          # generated Markdown posts
public/content/         # generated assets
public/data/            # generated JSON indexes
scripts/                # KB sync/export/meta/check/smoke scripts
src/libs/content/       # scanner, exporter, resolver, renderer
src/components/         # UI, layout, sections, templates
src/styles/             # globals and Markdown body styles
tests/fixtures/kb/      # fixture KB for harness tests
.github/workflows/      # ci.yml and deploy.yml
```

See `AGENTS.md` for the canonical project instructions.
