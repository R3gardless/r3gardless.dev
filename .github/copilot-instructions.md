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
- Apply variants: `text`, `primary`, `secondary` 
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

✅ **Color Variables — Reference for `globals.css`:**

```css
:root {
  --color-background: #fafaf8;
  --color-text: #000000;
  --color-primary: #e8e8e6;
  --color-secondary: #e6e7e7;
  --color-label-gray: #d4d4d1;
  --color-label-brown: #e8c4a0;
  --color-label-orange: #ffb380;
  --color-label-yellow: #ffe066;
  --color-label-green: #a3e65c;
  --color-label-blue: #7bb3f0;
  --color-label-purple: #b347ff;
  --color-label-pink: #ff8ab8;
  --color-label-red: #ff6b6b;
}

[data-theme='dark'] {
  --color-background: #08031b;
  --color-text: #ffffff;
  --color-primary: #5a5a58;
  --color-secondary: #4d4f4f;
  --color-label-gray: #7a7a77;
  --color-label-brown: #a66b3a;
  --color-label-orange: #d4703a;
  --color-label-yellow: #d4a73a;
  --color-label-green: #5ba617;
  --color-label-blue: #2e5bba;
  --color-label-purple: #6200ea;
  --color-label-pink: #c2185b;
  --color-label-red: #c62828;
}
```