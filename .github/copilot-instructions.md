# 🚀 Copilot Instructions for This Project

This project is a **Next.js blog platform** following:
- Atomic Design (atoms, molecules, organisms, templates, pages)
- Tailwind CSS v4 for styling
- TypeScript for type safety
- Zustand for state management
- TanStack Query for data fetching
- Notion API for CMS integration
- Storybook for UI documentation
- Vitest/Jest for unit tests
- Lucide React for icons

Please follow these development instructions when suggesting code.

---

## 💡 UI Component Rules

✅ **Follow Atomic Design**  
- **Atoms** → smallest UI (e.g., `LabelButton`, `TagButton`, `Typography`, `SearchInput`)  
- **Molecules** → combined atoms (e.g., `SearchBar`, `CarouselCard`, `BlogPostCard`)  
- **Organisms** → complex UI blocks (e.g., `Carousel`, `BlogPostList`, `Navbar`)  
- **Templates** → page-level layout structures

✅ **Styling**
- Use **Tailwind CSS utility classes** (favor utility-first)  
- Apply variants: `text`, `primary`, `secondary` 
- Apply sizes: `sm`, `md`, `lg`  
- Support `disabled`, `loading` states in interactive components  
- Ensure **dark mode compatibility** using `data-theme` or `.dark` selectors

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
- **DO NOT** hardcode colors or split logic in JS like `theme === 'light' ? ... : ...`  
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
✅ Use **TanStack Query hooks** (`src/hooks/`) for remote data (e.g., Notion API)  
✅ Centralize Notion API logic in `src/lib/notionClient.ts`

---

## 💡 Testing & Documentation

✅ Always write **Storybook stories** for new components  
✅ Add **Vitest/Jest unit tests** for key logic  
✅ Ensure **Prettier** and **ESLint** pass on all code

---

## 💡 File & Folder Structure

✅ Place atomic components under `src/components/ui/`  
✅ Place templates under `src/components/templates/`  
✅ Place Zustand stores under `src/store/`  
✅ Place API clients under `src/lib/`

✅ **Component Directory Structure**
- Create individual directories for each component (e.g., `src/components/ui/atoms/Typography/`)
- Always include an `index.tsx` file in the component directory for clean exports
- Component structure example:
  ```
  src/components/ui/atoms/Typography/
  ├── index.tsx          # Export the component
  ├── Typography.tsx     # Main component implementation
  ├── Typography.stories.tsx # Storybook stories
  └── Typography.test.tsx    # Unit tests
  ```
- Use named exports in `index.tsx`: `export { Typography } from './Typography'`
- This allows clean imports: `import { Typography } from '@/components/ui/Typography'`

---

## 🚀 Important

- Prioritize **reusability** and **composability**  
- Optimize for **accessibility** (`aria-*`, semantic elements)  
- **Always pull light/dark mode colors from `globals.css` variables, not from JS conditionals**  
- Use **Lucide React icons** consistently throughout the project
- When unsure, match the project's existing patterns

---

✅ **Color Variables — Reference for `globals.css`:**

