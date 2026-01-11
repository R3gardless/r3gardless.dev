---
applyTo: "src/components/**"
---

# UI Component Development Guidelines

## Component Classification
- **UI** → Reusable single-function components (e.g., `Button`, `Typography`, `SearchBar`)
- **Sections** → Layout units for specific pages (e.g., `BlogPosts`, `RelatedPosts`, `PostNavigator`)
- **Templates** → Page-level layout/view components
- **Layout** → Common site layouts (Header, Footer)
- **Meta** → SEO and metadata management (e.g., `Seo`)

## Styling
- Use **Tailwind CSS utility classes** (favor utility-first)
- Apply variants: `text`, `primary`, `secondary`
- Apply sizes: `sm`, `md`, `lg`
- Support `disabled`, `loading` states in interactive components

## Responsive Design
- Follow **mobile-first approach** with Tailwind breakpoints, primarily using `md:` for desktop layouts
- Use responsive grid layouts: `grid-cols-1 md:grid-cols-2` or `grid-cols-1 md:grid-cols-3`
- Apply responsive spacing: `px-4 md:px-8`
- Implement responsive typography: `text-sm md:text-base`
- Hide/show elements based on screen size: `hidden md:block` or `block md:hidden`
- Consider touch-friendly sizing on mobile (minimum 44px tap targets)
- Focus on mobile (< 768px) and desktop (≥ 768px) breakpoints using `md:` as the primary responsive modifier

## Icons
- Use **Lucide React** for all icons (e.g., `Search`, `Moon`, `Sun`, `Menu`)
- Import icons directly: `import { Search } from 'lucide-react'`
- Prefer semantic icon names that match their purpose
- Apply consistent sizing with Tailwind classes (`size-4`, `size-5`, `size-6`)
- Use responsive icon sizing: `size-4 md:size-5 lg:size-6`
- Use CSS variables for icon colors to maintain theme consistency

## Theme & Colors
- Always reference CSS variables defined in `globals.css`
- Notion-related designs are defined in `notion.css`
- **DO NOT** hardcode colors or use conditional logic in JS like `theme === 'light' ? ... : ...`
- Instead, use `var(--color-primary)`, `var(--color-secondary)` etc.
- Define colors under `:root` and `[data-theme='dark']` in CSS

## Component Directory Structure
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

## Focus States
- **All interactive components must set `focus:outline-none focus-visible:outline-none` (no focus ring) for focus states**

## Testing & Documentation
- Always write **Storybook stories** for new components
- Add **Vitest/Jest unit tests** for key logic
- Ensure **Prettier** and **ESLint** pass on all code

## Storybook Guidelines
- **DO NOT create separate Light/Dark theme stories** - themes automatically switch via CSS variables
- Use `layout: 'centered'` for most components, `layout: 'fullscreen'` for page-level sections
- Include component descriptions in `parameters.docs.description.component`
- Create interactive examples with state management when applicable
- Use descriptive story names that explain the use case (e.g., `WithSearch`, `WithCategory`)
