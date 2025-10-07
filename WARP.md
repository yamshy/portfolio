# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development

```bash
pnpm install                # Install dependencies
pnpm dev                   # Start dev server at http://localhost:4321
pnpm build                 # Production build to dist/
pnpm preview --host        # Serve built site for validation
```

### Quality Assurance

```bash
pnpm check                 # Run all checks (Astro, TypeScript, lint, format)
pnpm check:astro           # Astro static analysis
pnpm type-check            # TypeScript type checking
pnpm lint                  # ESLint checks
pnpm lint:fix              # Auto-fix ESLint issues
pnpm format                # Format with Prettier
pnpm format:check          # Check formatting
```

### Testing

```bash
pnpm test                  # Run unit tests (Vitest)
pnpm test:watch            # Watch mode for unit tests
pnpm test:ui               # Vitest UI
pnpm test:coverage         # Generate test coverage
pnpm test:e2e              # Run Playwright E2E tests
pnpm test:e2e:ui           # Playwright UI mode
```

### Single Test Execution

```bash
pnpm test ComponentName.test.ts    # Run specific test file
vitest run path/to/test.ts         # Direct vitest execution
```

## Architecture Overview

### Tech Stack

- **Astro 5**: Static site generation with hybrid rendering capabilities
- **Svelte 5**: Component islands for interactive functionality
- **TypeScript**: Strongly typed across all components and utilities
- **CSS**: Vanilla CSS with design tokens (Open Props integration)
- **pnpm**: Package management and task execution

### Project Structure

```
src/
├── pages/                 # Astro pages (routing)
├── layouts/              # Shared layout components
├── components/           # Organized by feature/domain
│   ├── home/            # Homepage-specific components
│   ├── ui/              # Reusable UI components
│   ├── demos/           # Interactive demo components
│   └── util/            # Utility components
├── content/             # TypeScript data definitions
├── styles/              # CSS organization
│   ├── tokens.css       # Design system tokens
│   ├── utilities.css    # Utility classes
│   └── animations.css   # Animation definitions
├── scripts/             # Client-side JavaScript
└── lib/                 # Shared utilities/helpers
```

### Key Architectural Patterns

**Component Organization**: Components are grouped by domain (`home/`, `ui/`, `demos/`) rather than technical type, promoting feature-based development.

**Content Layer**: Centralized content definitions in `src/content/home.ts` with full TypeScript types for projects, experiences, and other structured data.

**CSS Architecture**: Token-based design system using Open Props for consistent spacing, colors, and typography across components.

**Island Architecture**: Svelte components hydrated selectively using Astro's `client:load` directive for interactive elements like theme toggles and animations.

**Script Organization**: Client-side scripts separated into `src/scripts/` with initialization patterns for mobile navigation and reveal animations.

### Important Implementation Details

**Theme System**: Inline theme script prevents flash of unstyled content, with theme state managed via data attributes on `<html>`.

**Type Safety**: All content structures (Project, Experience, Insight) have strict TypeScript definitions ensuring data consistency.

**CSS Methodology**: Uses CSS custom properties and utility classes rather than CSS-in-JS, maintaining performance and allowing for easy theming.

**Component Props**: Astro components receive data via props from centralized content definitions, keeping presentation separate from data.

### Development Guidelines from AGENTS.md

**Preview Requirement**: Always generate a preview by running `pnpm build` followed by `pnpm preview --host` when working on tasks that modify the UI.

**File Naming**: Components use `PascalCase.svelte/.ts`, pages/layouts use `kebab-case.astro`.

**Testing Strategy**: Unit tests with Vitest, E2E tests with Playwright. Test files should be `*.test.ts` near source or under `tests/unit`.

**Commit Requirements**: Conventional Commits format required (e.g., `feat: add projects grid`).

**Known Issues**: If `pnpm astro check` flags `CTAButton` missing a `class` prop, add it to the component's props.

### CI/CD Pipeline

- **PR Checks**: Node.js checks, conventional commit validation, Docker smoke test
- **Release**: Automated via semantic-release on main branch
- **Container**: Docker builds serve the site with Caddy for production deployment

## Package Manager

This project uses **pnpm** as the package manager. Always use `pnpm` commands rather than `npm` or `yarn` to maintain consistency with lockfile and workspace configuration.
