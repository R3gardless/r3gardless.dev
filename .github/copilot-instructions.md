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

Please follow these development instructions when suggesting code.

---

## 💡 UI Component Rules

✅ **Follow Atomic Design**  
- **Atoms** → smallest reusable UI (e.g., `Button`, `Icon`, `Tag`)  
- **Molecules** → combined atoms (e.g., `SearchBar`, `CarouselCard`, `BlogPostCard`)  
- **Organisms** → complex UI blocks (e.g., `Carousel`, `BlogPostList`, `Navbar`)  
- **Templates** → page-level layout structures

✅ **Styling**
- Use **Tailwind CSS utility classes** (favor utility-first)  
- Apply variants: `primary`, `secondary`, `ghost`, `outline`  
- Apply sizes: `sm`, `md`, `lg`  
- Support `disabled`, `loading` states in interactive components  
- Ensure **dark mode compatibility** using `data-theme` or `.dark` selectors

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
✅ Prefer explicit boolean names (`isActive`, `hasError`, `shouldRender`)

✅ Add meaningful comments above complex logic:
- **Why** the logic exists (not just what it does)
- Any special cases or assumptions

✅ Use **JSDoc-style comments** (`/** ... */`) for exported functions or complex utilities

---

## 💡 State & Data Rules

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

---

## 🚀 Important

- Prioritize **reusability** and **composability**  
- Optimize for **accessibility** (`aria-*`, semantic elements)  
- **Always pull light/dark mode colors from `globals.css` variables, not from JS conditionals**  
- When unsure, match the project’s existing patterns

---

✅ **Optional — Example for `globals.css` color variables:**

```css
:root {
  --color-primary: #1a73e8;
  --color-secondary: #fbbc04;
  --color-text: #202124;
  --color-bg: #ffffff;
}

[data-theme='dark'] {
  --color-primary: #8ab4f8;
  --color-secondary: #f28b82;
  --color-text: #e8eaed;
  --color-bg: #202124;
}
