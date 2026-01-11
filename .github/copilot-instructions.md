# 🚀 Copilot Instructions for r3gardless.dev

This project is a **Next.js blog platform** following:
- Atomic Design (atoms, molecules, organisms, templates, pages)
- Tailwind CSS v4 for styling
- TypeScript for type safety
- Zustand for state management
- Notion API for CMS integration
- Storybook for UI documentation
- Vitest/Jest for unit tests
- Lucide React for icons

## 📚 Additional Instructions

This repository uses **path-specific custom instructions** for focused guidance:
- **Code Review Guidelines**: `.github/instructions/code-review.instructions.md` - Applied to all files, used only for code reviews
- **TypeScript/ESLint Rules**: `.github/instructions/typescript.instructions.md` - Applied to all `.ts` and `.tsx` files
- **Component Development**: `.github/instructions/components.instructions.md` - Applied to all files in `src/components/`

## 💡 Quick Reference

**State Management**
- Use **Zustand** (`src/store/`) for client state (e.g., theme)
- Centralize Notion API logic in:
  - `src/libs/notion.ts` for official Notion SDK (`@notionhq/client`)
  - `src/libs/notionClient.ts` for unofficial Notion client (`notion-client`)

**Package Manager**
- Use **Bun** for all package management and script execution
- Always use `bun install`, `bun add`, `bun remove` instead of npm/yarn
- Commands: `bun run dev`, `bun run build`, `bun run test:unit:run`, `bun run lint`

---

## 📁 Project Structure

```
r3gardless.dev/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD pipelines
│   ├── instructions/       # Path-specific Copilot instructions
│   └── copilot-instructions.md  # This file
├── docs/                   # Project documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── DEPLOYMENT_CHECKLIST.md  # Pre-deployment checklist
├── public/
│   ├── data/               # Static JSON data (postMeta.json)
│   ├── fonts/              # Custom fonts (Maruburi, Pretendard)
│   ├── icons/              # Favicon and app icons
│   └── images/             # Static images and blog cover images
├── scripts/
│   └── build-post-meta.ts  # Script to generate post metadata JSON
├── src/
│   ├── __tests__/          # Test files mirroring src structure
│   │   ├── libs/           # Library tests (notion.test.ts, notionClient.test.ts)
│   │   ├── store/          # Store tests (themeStore.test.ts)
│   │   └── utils/          # Utility tests (blog.test.ts)
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Landing page
│   │   ├── not-found.tsx   # 404 error page
│   │   ├── robots.ts       # robots.txt generator
│   │   ├── sitemap.ts      # sitemap.xml generator
│   │   ├── about/          # About page
│   │   └── blog/           # Blog pages
│   │       ├── page.tsx    # Blog list page (server component)
│   │       ├── BlogPageClient.tsx  # Blog client-side logic
│   │       └── [slug]/     # Dynamic blog post pages
│   │           ├── page.tsx         # Post detail page (server component)
│   │           └── PostPageContent.tsx  # Post client-side content
│   ├── components/         # All React components
│   │   ├── common/         # Shared common components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── meta/           # SEO and analytics components
│   │   ├── providers/      # React context providers
│   │   ├── sections/       # Page-specific sections
│   │   ├── templates/      # Page templates
│   │   └── ui/             # Reusable UI components
│   │       ├── about/      # About page specific UI components
│   │       ├── blog/       # Blog-specific UI components
│   │       ├── buttons/    # Button components
│   │       ├── pagination/ # Pagination components
│   │       ├── search/     # Search components
│   │       └── typography/ # Text components
│   ├── constants/          # Application constants
│   │   ├── blog.ts         # Blog-related constants
│   │   ├── site.ts         # Site metadata constants
│   │   └── storage.ts      # Storage key constants
│   ├── hooks/              # Custom React hooks
│   ├── libs/               # External library integrations
│   │   └── seo/            # SEO utilities
│   ├── store/              # Zustand state management
│   ├── styles/             # Global styles
│   │   ├── globals.css     # Global CSS with Tailwind + CSS variables
│   │   ├── masonry.css     # Masonry grid layout styles
│   │   ├── notion.css      # Notion content rendering styles
│   │   └── prism-theme.css # Code syntax highlighting theme
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── eslint.config.mjs       # ESLint configuration (flat config)
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Vitest configuration
└── vitest.setup.ts         # Vitest setup file
```

---

## 🏗️ Build & Validation Commands

**Development**
```bash
bun run dev              # Start development server (http://localhost:3000)
bun run build            # Build production bundle
bun run start            # Start production server
bun run lint             # Run ESLint
bun run lint:fix         # Run ESLint with auto-fix
```

**Testing**
```bash
bun run test:unit        # Run unit tests in watch mode
bun run test:unit:run    # Run unit tests once
bun run test:unit:coverage  # Run tests with coverage report
```

**Storybook**
```bash
bun run storybook        # Start Storybook dev server (http://localhost:6006)
bun run build-storybook  # Build Storybook static site
```

**Scripts**
```bash
bun run build:post-meta  # Generate post metadata JSON from Notion
```

**CI/CD Pipeline**
- GitHub Actions workflow runs on push to `main` and pull requests
- Pipeline includes: ESLint, TypeScript check, unit tests, and build verification
- All checks must pass before merging to main

---

## 🎨 Color Variables & Theming

**Theme System**
- All colors must reference CSS variables defined in `src/styles/globals.css`
- Theme colors are defined under `:root` (light mode) and `[data-theme='dark']` (dark mode)
- **NEVER** hardcode colors or use JS conditionals like `theme === 'light' ? '#fff' : '#000'`

**Available CSS Variables**
```css
/* Background & Surface */
var(--color-background)      /* Main background color */
var(--color-surface)         /* Card/surface background */
var(--color-surface-hover)   /* Hover state for surfaces */

/* Text Colors */
var(--color-text-primary)    /* Primary text color */
var(--color-text-secondary)  /* Secondary/muted text */
var(--color-text-tertiary)   /* Tertiary/subtle text */

/* Brand & Accent */
var(--color-primary)         /* Primary brand color */
var(--color-secondary)       /* Secondary brand color */
var(--color-accent)          /* Accent/highlight color */

/* Borders & Dividers */
var(--color-border)          /* Default border color */
var(--color-divider)         /* Divider lines */
```

**Notion Content Styles**
- Notion-specific rendering styles are defined in `src/styles/notion.css`
- Code syntax highlighting uses Prism theme in `src/styles/prism-theme.css`

---

## 🚀 Development Principles

- Prioritize **reusability** and **composability**
- Optimize for **accessibility** (`aria-*`, semantic elements)
- Always pull light/dark mode colors from `globals.css` variables, not from JS conditionals
- Use **Lucide React icons** consistently throughout the project
- When unsure, match the project's existing patterns

