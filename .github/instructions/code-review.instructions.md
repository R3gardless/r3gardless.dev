---
applyTo: "**"
excludeAgent: "coding-agent"
---

# GitHub Copilot Code Review Guidelines

When performing code reviews as GitHub Copilot, follow these instructions:

## Review Language
- **Always write code review comments in Korean (한글)** for consistency with the team's preferred language
- Use professional, constructive tone when providing feedback
- Structure feedback clearly with specific file references and line numbers

## Review Focus Areas
- Check TypeScript type safety and avoid `any` types unless absolutely necessary
- Verify proper error handling with try-catch blocks and error boundaries
- Ensure accessibility standards (ARIA attributes, semantic HTML, keyboard navigation)
- Validate responsive design implementation (mobile-first approach)
- Review component reusability and proper separation of concerns
- Check for proper use of React hooks (dependency arrays, cleanup functions)
- Verify CSS variable usage for theming (avoid hardcoded colors)
- Ensure Tailwind utility classes are used correctly and consistently

## Security Checklist
- Validate proper sanitization of user inputs and external data
- Check for exposed sensitive information (API keys, tokens)
- Verify secure handling of environment variables
- Review authentication and authorization logic
- Check for XSS vulnerabilities in dynamic content rendering

## Performance Considerations
- Identify unnecessary re-renders and suggest React.memo, useMemo, useCallback where appropriate
- Check for proper code splitting and lazy loading
- Verify image optimization (Next.js Image component usage)
- Review bundle size impact of new dependencies
