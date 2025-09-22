# Portfolio Site

## Overview

This repository hosts the source for my personal portfolio. Astro builds the site as static HTML with a light sprinkling of interactive islands, keeping the runtime footprint small while still enabling richer UI moments where they matter.

## Project Structure

- `src/` – Site source code, including Astro pages (`src/pages`), layouts (`src/layouts`), shared utilities, and Svelte components (`src/components`).
- `public/` – Static assets copied verbatim into the final build.
- `tests/` – Automated test suites; unit specs live under `tests/unit` and Playwright end-to-end specs under `tests/e2e`.
- `Dockerfile` – Builds a container image that serves the generated site with Caddy for local or production previews.
- `astro.config.mjs`, `svelte.config.js`, and `tsconfig.json` – Framework and tooling configuration.

## Tech Stack & Tooling

- **Astro 5** – Static site generation, routing, and view transitions.
- **Svelte 5** – Hydrated islands that power dynamic components.
- **TypeScript** – Strong typing across Astro, Svelte, and supporting utilities.
- **Vanilla CSS tokens & utilities** – Global design system primitives, animations, and responsive layout helpers.
- **pnpm** – Package management and task runner.
- **Vitest** – Unit testing framework with fast module mocking.
- **Playwright** – Browser automation for end-to-end coverage.
- **semantic-release** – Automated versioning and changelog management on `main`.

## Development Workflow

Install dependencies once:

```bash
pnpm install
```

Common scripts:

```bash
pnpm dev            # Start the local development server (http://localhost:4321)
pnpm build          # Generate an optimized static build in dist/
pnpm preview --host # Serve the production build for local verification
```

Quality checks:

```bash
pnpm test           # Run unit tests with Vitest
pnpm test:e2e       # Execute Playwright end-to-end tests
pnpm astro check    # Static analysis for Astro components
pnpm tsc --noEmit   # Type-check the project
```
