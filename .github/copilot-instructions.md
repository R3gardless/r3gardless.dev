# Copilot Instructions for This Project

This project is a **Next.js blog platform** following:
- Atomic Design (atoms, molecules, organisms, templates, pages)
- Tailwind CSS v4 for styling
- TypeScript for type safety
- Zustand for state management
- TanStack Query for data fetching
- Notion API for CMS integration
- Storybook for UI documentation
- Vitest/Jest for unit tests

Please follow these development instructions when suggesting code:

---

## 💡 UI Component Rules

✅ Follow Atomic Design:  
- Atoms → smallest reusable UI (Button, Icon, Tag)  
- Molecules → combined atoms (SearchBar, CarouselCard, BlogPostCard)  
- Organisms → complex UI blocks (Carousel, BlogPostList, Navbar)  
- Templates → page-level layout structures

✅ Use Tailwind CSS classes, favoring utility-first styling.  
✅ Apply variants: `primary`, `secondary`, `ghost`, `outline`.  
✅ Apply sizes: `sm`, `md`, `lg`.  
✅ Support `disabled`, `loading` states in interactive components.  
✅ Ensure dark mode compatibility using `data-theme` or `.dark` selectors.

---

## 💡 Variable Naming & Code Style

✅ Use **camelCase** for variables, functions, and props (e.g., `isLoading`, `postList`).  
✅ Use **PascalCase** for components, types, and interfaces (e.g., `PostCard`, `ThemeStore`).  
✅ Use **UPPER_SNAKE_CASE** for constants (e.g., `API_BASE_URL`, `DEFAULT_THEME`).

✅ Write clear, descriptive variable names (avoid short names like `tmp`, `val`, `x`).  
✅ Prefer explicit boolean names (`isActive`, `hasError`, `shouldRender`).

✅ Add meaningful comments above complex logic, explaining:
- Why the logic exists (not just what it does)
- Any special cases or assumptions

✅ Use JSDoc style (`/** ... */`) for exported functions or complex utilities.

---

## 💡 State & Data Rules

✅ Use Zustand (`src/store/`) for local state (e.g., theme).  
✅ Use TanStack Query hooks (`src/hooks/`) for remote data (e.g., Notion API).  
✅ Centralize Notion API logic in `src/lib/notionClient.ts`.

---

## 💡 Testing & Documentation

✅ Always write Storybook stories for new components.  
✅ Add Vitest/Jest unit tests for key logic.  
✅ Ensure Prettier and ESLint pass on all code.

---

## 💡 File & Folder Structure

✅ Place atomic components under `src/components/ui/`.  
✅ Place templates under `src/components/templates/`.  
✅ Place Zustand stores under `src/store/`.  
✅ Place API clients under `src/lib/`.

---

## 🚀 Important

- Prioritize reusability and composability.  
- Optimize for accessibility (`aria-*`, semantic elements).  
- When unsure, match the project’s existing patterns.
