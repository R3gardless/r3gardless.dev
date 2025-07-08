# 🚀 Copilot Instructions for This Project

This project is a **Next.js blog platform** following:
- Atomic Design (atoms, molecules, organisms, templates, pages)
- Tailwind CSS v4 for styling
- TypeScript for type safety
- Zustand for state management
- Notion API for CMS integration
- Storybook for UI documentation
- Vitest/Jest for unit tests
- Lucide React for icons

Please follow these development instructions when suggesting code.

---

## 💡 UI Component Rules

✅ **Component Classification**
- **UI** → Reusable single-function components (e.g., `Button`, `Typography`, `SearchBar`)
- **Sections** → Layout units for specific pages (e.g., `BlogPosts`, `RelatedPosts`, `PostNavigator`)
- **Templates** → Page-level layout/view components
- **Layout** → Common site layouts (Header, Footer)
- **Meta** → SEO and metadata management (e.g., `Seo`)

✅ **Styling**
- Use **Tailwind CSS utility classes** (favor utility-first)  
- Apply variants: `text`, `primary`, `secondary` 
- Apply sizes: `sm`, `md`, `lg`  
- Support `disabled`, `loading` states in interactive components  

✅ **Responsive Design**
- Follow **mobile-first approach** with Tailwind breakpoints, primarily using `md:` for desktop layouts
- Use responsive grid layouts: `grid-cols-1 md:grid-cols-2` or `grid-cols-1 md:grid-cols-3`
- Apply responsive spacing: `px-4 md:px-8`
- Implement responsive typography: `text-sm md:text-base`
- Hide/show elements based on screen size: `hidden md:block` or `block md:hidden`
- Consider touch-friendly sizing on mobile (minimum 44px tap targets)
- Focus on mobile (< 768px) and desktop (≥ 768px) breakpoints using `md:` as the primary responsive modifier

✅ **Icons**
- Use **Lucide React** for all icons (e.g., `Search`, `Moon`, `Sun`, `Menu`)
- Import icons directly: `import { Search } from 'lucide-react'`
- Prefer semantic icon names that match their purpose
- Apply consistent sizing with Tailwind classes (`size-4`, `size-5`, `size-6`)
- Use responsive icon sizing: `size-4 md:size-5 lg:size-6`
- Use CSS variables for icon colors to maintain theme consistency

⚠ **Important for light/dark mode colors**
- Always reference CSS variables defined in `globals.css` 
- Notion-related designs are defined in `notion.css`  
- **DO NOT** hardcode colors or use conditional logic in JS like `theme === 'light' ? ... : ...`  
- Instead, use `var(--color-primary)`, `var(--color-secondary)` etc.,  
  and define them under `:root` and `[data-theme='dark']` in CSS

---

## 💡 Variable Naming & Code Style

✅ Use **camelCase** for variables, functions, and props (e.g., `isLoading`, `postList`)  
✅ Use **PascalCase** for components, types, and interfaces (e.g., `PostCard`, `ThemeStore`)  
✅ Use **UPPER_SNAKE_CASE** for constants (e.g., `API_BASE_URL`, `DEFAULT_THEME`)

✅ Write clear, descriptive variable names (avoid short names like `tmp`, `val`, `x`)  
✅ Prefer explicit boolean

✅ Use **Zustand** (`src/store/`) for local state (e.g., theme)  
✅ Centralize Notion API logic in `src/lib/notion.ts` `src/lib/notionClient.ts`
  - `notion.ts` for official Notion SDK (`@notionhq/client`)
  - `notionClient.ts` for unofficial Notion client (`notion-client`)

---

## 💡 Package Management & Commands

✅ **Use Bun for all package management and script execution**
- Always use `bun install` instead of `npm install` or `yarn install`
- Use `bun run` for executing scripts (e.g., `bun run dev`, `bun run build`, `bun run test`)
- Use `bun add` for adding dependencies (e.g., `bun add lodash`, `bun add -d @types/node`)
- Use `bun remove` for removing dependencies
- When suggesting terminal commands, always use bun equivalents:
  - `bun run dev` → Start development server
  - `bun run build` → Build production bundle
  - `bun run test:unit:run` → Run unit tests
  - `bun run lint` → Run ESLint
  - `bun run storybook` → Start Storybook

---

## 💡 Testing & Documentation

✅ Always write **Storybook stories** for new components  
✅ Add **Vitest/Jest unit tests** for key logic  
✅ Ensure **Prettier** and **ESLint** pass on all code

---

## 💡 File & Folder Structure

✅ **Complete Project Structure:**
```
src/
├── app/                    # Next.js App Router pages
├── components/             # All React components
│   ├── ui/                 # Reusable UI components
│   │   ├── buttons/        # Button components (CategoryButton, TagButton, LoadMoreButton, etc.)
│   │   ├── typography/     # Text components (Heading, Text, DateText)
│   │   ├── blog/           # Blog-specific components (PostCard, PostRow, CategoryList, TagList, etc.)
│   │   ├── pagination/     # Pagination components (PaginationBar, PaginationChevronButton)
│   │   └── search/         # Search components (SearchBar, SearchInput)
│   ├── layout/             # Layout components (Header, Footer)
│   ├── sections/           # Page sections (BlogHeader, BlogPosts, BlogSidebar, RecentPosts, etc.)
│   ├── templates/          # Page templates (BlogTemplate, PostTemplate, LandingTemplate)
│   └── meta/               # SEO and metadata components (Seo)
├── config/                 # Configuration files
├── constants/              # Application constants
├── hooks/                  # Custom React hooks
├── libs/                   # External library configurations (notion.ts)
├── store/                  # Zustand store files (themeStore.ts)
├── styles/                 # Global styles (globals.css)
├── types/                  # TypeScript type definitions (blog.ts)
└── utils/                  # Utility functions (config.ts)
```

✅ **Component Directory Structure**
- Create individual directories for each component (e.g., `src/components/ui/buttons/CategoryButton/`)
- Always include an `index.tsx` file in the component directory for clean exports
- Component structure example:
  ```
  src/components/ui/buttons/CategoryButton/
  ├── index.tsx          # Export the component
  ├── CategoryButton.tsx # Main component implementation
  ├── CategoryButton.stories.tsx # Storybook stories
  └── CategoryButton.test.tsx    # Unit tests
  ```
- Use named exports in `index.tsx`: `export { CategoryButton } from './CategoryButton'`
- This allows clean imports: `import { CategoryButton } from '@/components/ui/buttons/CategoryButton'`

---

## 🚀 Important

- Prioritize **reusability** and **composability**  
- Optimize for **accessibility** (`aria-*`, semantic elements)  
- **Always pull light/dark mode colors from `globals.css` variables, not from JS conditionals**  
- Use **Lucide React icons** consistently throughout the project
- When unsure, match the project's existing patterns
- **All interactive components must set `focus:outline-none focus-visible:outline-none` (no focus ring) for focus states**

---

✅ **Color Variables — Reference for `globals.css`:**

