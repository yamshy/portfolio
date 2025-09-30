# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
pnpm dev              # Start dev server at http://localhost:4321
pnpm build            # Build for production to dist/
pnpm preview --host   # Preview production build locally
```

### Testing
```bash
pnpm test             # Run all Vitest unit tests
pnpm test:watch       # Run Vitest in watch mode
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Generate coverage report (85% threshold)
pnpm test:e2e         # Run Playwright E2E tests (builds first)
pnpm test:e2e:ui      # Open Playwright UI
```

### Quality Checks
```bash
pnpm check:astro      # Astro static analysis
pnpm type-check       # TypeScript type checking (tsc --noEmit)
pnpm lint             # ESLint validation
pnpm lint:fix         # Auto-fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm check            # Run all checks (astro, types, lint, format)
```

### Running Single Tests
```bash
vitest path/to/test.test.ts                    # Single unit test
playwright test tests/e2e/specific.spec.ts     # Single E2E test
```

## Architecture

### Tech Stack
- **Astro 5**: Static site generator with view transitions, routing built on file-system
- **Svelte 5**: Component framework for interactive "islands" with client-side hydration
- **TypeScript**: Strongly typed across pages, components, and utilities
- **LightningCSS**: CSS transformer with nesting, custom media queries
- **Open Props**: CSS design tokens for consistency
- **Vitest**: Unit testing with custom Astro component transform plugin
- **Playwright**: E2E testing across Chromium, Firefox, WebKit, and Mobile Chrome

### Project Structure
```
src/
  pages/              # Astro file-based routing (index.astro → /)
  layouts/            # Shared page layouts (BaseLayout.astro)
  components/
    home/             # Homepage-specific Astro components
    ui/               # Reusable UI components (Astro)
    skills/           # Skill-related Svelte components
    demos/            # Interactive demos (Svelte)
    scripts/          # Svelte initializers for client-side scripts
    util/             # Utility Svelte components
  content/            # Structured content (home.ts exports typed data)
  scripts/            # Client-side and inline scripts (theme, mobile nav)
  styles/             # Global CSS (tokens, utilities, animations)
  lib/                # Shared TypeScript utilities

tests/
  unit/               # Vitest unit tests
  e2e/                # Playwright E2E tests
  setup.ts            # Vitest test setup
```

### Component Architecture
- **Astro components** (.astro): Server-rendered HTML with scoped styles, minimal JS
- **Svelte components** (.svelte): Client-side interactive islands, hydrated on demand
- **Content separation**: Portfolio content lives in `src/content/home.ts` as typed data structures
- **Layout inheritance**: `BaseLayout.astro` provides document shell with theme script, fonts, global styles

### Styling System
- **Global styles** loaded in BaseLayout: `tokens.css`, `utilities.css`, `animations.css`
- **CSS tokens** from Open Props provide design system primitives
- **LightningCSS** with nesting and custom media queries enabled
- **Scoped styles** per-component with Astro's built-in scoping

### Testing Strategy
- **Unit tests** target Svelte components with custom Vitest plugin that transforms Astro components
- **E2E tests** run against production build (`pnpm build` → `pnpm preview`)
- **Coverage thresholds**: 85% for statements, branches, functions, lines
- **Cross-browser**: Playwright tests run on desktop Chrome, Firefox, Safari, and mobile Chrome

### Build & Deployment
- **Static output**: Astro generates optimized HTML, CSS, JS to `dist/`
- **Docker support**: Dockerfile uses Caddy to serve static files
- **GitOps**: Automated deployments via GitHub Actions to self-hosted Kubernetes cluster
- **API proxy**: Vite dev server proxies `/api` to `localhost:8080` (configured in astro.config.mjs)

### Git Workflow
- **Conventional commits**: Enforced via commitlint and husky hooks
- **Commit types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- **Pre-commit**: Runs lint-staged (ESLint + Prettier on staged files)
- **Semantic-release**: Automated versioning and CHANGELOG.md updates on main branch

## Key Files
- `astro.config.mjs`: Astro configuration with Svelte integration, Vite proxy, LightningCSS
- `vitest.config.ts`: Custom Astro transform plugin, jsdom environment, coverage config
- `playwright.config.ts`: Multi-browser E2E setup with automatic build/preview server
- `src/content/home.ts`: Typed content exports (projects, experience, contact, stats)
- `src/layouts/BaseLayout.astro`: Root layout with theme initialization, fonts, meta tags
- `package.json`: All scripts, dependencies, pnpm version, lint-staged configuration