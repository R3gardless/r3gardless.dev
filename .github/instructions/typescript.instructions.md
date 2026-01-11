---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript & ESLint Best Practices

## Type Safety Rules
- **Always prefer explicit types over inference** for function parameters and return values
- Use `interface` for object shapes that may be extended, `type` for unions/intersections
- Leverage TypeScript utility types: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`
- Use `const` assertions for literal types: `as const`
- Avoid type assertions (`as Type`) unless absolutely necessary - prefer type guards
- Use discriminated unions for complex state management

## Naming Conventions (Strictly Enforced)
- **camelCase**: variables, functions, parameters (e.g., `isLoading`, `postList`, `handleClick`)
- **PascalCase**: components, types, interfaces, enums (e.g., `PostCard`, `BlogPost`, `ThemeStore`)
- **UPPER_SNAKE_CASE**: constants and environment variables (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- Prefix boolean variables with `is`, `has`, `should` (e.g., `isVisible`, `hasError`, `shouldRender`)
- Prefix event handlers with `handle` or `on` (e.g., `handleSubmit`, `onClick`)

## Code Quality Standards
- **No `any` types** - use `unknown` with type guards or proper typing
- **No unused variables or imports** - clean them up immediately
- **No console.logs in production code** - use proper logging utilities
- Prefer `const` over `let`, never use `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators
- Extract magic numbers and strings into named constants
- Keep functions small and focused (single responsibility principle)
- Maximum function length: ~50 lines (consider refactoring if longer)
- Prefer early returns to reduce nesting depth

## React Best Practices
- Components should be pure and avoid side effects in render
- Use custom hooks for reusable stateful logic
- Properly handle cleanup in useEffect hooks
- Avoid inline function definitions in JSX (especially in lists)
- Use React.Fragment or `<>` instead of unnecessary wrapper divs
- Properly key list items with stable, unique identifiers (not array index)
- Destructure props at the component level for clarity

## Import Organization
- Group imports in this order: React → Third-party libraries → Internal modules → Types → Styles
- Use absolute imports with `@/` path alias
- Sort imports alphabetically within each group
