# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` (Astro pages in `src/pages`, layouts in `src/layouts`, Svelte/TS components in `src/components`).
- Tests: unit tests in `tests/unit`; add e2e tests under `tests/e2e`.
- Static/public assets: `public/`.
- CI & infra: `.github/workflows/`, `Dockerfile`, release config in `release.config.js`.
- Agent prompts/automation: `.cursor/commands`.

## Build, Test, and Development Commands
- `pnpm dev` — start local dev server at `http://localhost:4321`.
- `pnpm build` — production build to `dist/`.
- `pnpm preview` — preview built site.
- `pnpm astro` — run Astro CLI; e.g., `pnpm astro check` (static analysis).
- `pnpm test` / `pnpm test:watch` / `pnpm test:ui` — Vitest run/watch/UI.
- `pnpm test:coverage` — collect coverage.
- `pnpm test:e2e` / `pnpm test:e2e:ui` — Playwright e2e.
- Type check: `pnpm tsc --noEmit`.
- Optional container smoke test: `docker build -t portfolio-test . && docker run -p 8080:8080 portfolio-test:latest`.

## Coding Style & Naming Conventions
- Language: TypeScript, Svelte, Astro; 2‑space indentation.
- Files: components `PascalCase.svelte/ts`, pages/layouts `kebab-case.astro`.
- Variables/functions `camelCase`; exported types/interfaces `PascalCase`.
- Prefer semantic HTML and accessible components; keep props typed.
- Lint/format: Prettier/ESLint may be added; when present use `pnpm lint` and `pnpm format:check`.

## Testing Guidelines
- Frameworks: Vitest (unit), Playwright (e2e).
- Unit test files: `*.test.ts` near source or under `tests/unit` mirroring paths.
- Aim to cover component logic and page rendering; add fixtures/mocks as needed.
- Run before pushing: `pnpm test` and `pnpm test:coverage` (optional in CI).

## Commit & Pull Request Guidelines
- Conventional Commits required (e.g., `feat: add projects grid`).
- Before PR: run `pnpm astro check`, `pnpm tsc --noEmit`, `pnpm test`, `pnpm build`.
- PRs: clear description, link issues, include screenshots for UI changes.
- CI mirrors these checks and runs a Docker smoke test on PRs; releases are automated via `semantic-release` on `main`.

## Security & Configuration Tips
- Node ≥20 (repo uses `mise`; run `mise trust` if prompted). No secrets or `.env` files committed.
- Known check: if `pnpm astro check` flags `CTAButton` missing a `class` prop, add it to the component’s props.
