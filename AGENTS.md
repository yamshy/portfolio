# Overview

This repository hosts a modern **Astro v5** portfolio site with Svelte components, written in **TypeScript** and managed with **pnpm**. Agents automate dependency installs, type checks, tests, builds, and release workflows.

# Prerequisites

- **Node.js**: v24.7.0 via [`mise`](.mise.toml) (CI uses Node 20; any Node ≥20 works)
- **pnpm**: v10.15.0
- **Git** for version control
- **Docker** (optional) for container smoke tests

# Quick Start for Agents

```bash
# Install dependencies
pnpm install

# Astro static analysis (fails if CTAButton lacks class prop)
pnpm astro check

# TypeScript types
pnpm tsc --noEmit

# Linting & formatting
# (not configured; see patch below to add ESLint/Prettier)

# Unit tests (Vitest)
pnpm test          # single run
pnpm test:watch    # watch mode

# Build site
pnpm build

# Optional container smoke test
# (requires Docker)
docker build -t portfolio-test .
docker run -d --name portfolio-test -p 8080:8080 portfolio-test:latest
curl -I http://localhost:8080
# cleanup
docker rm -f portfolio-test && docker rmi portfolio-test:latest
```

# Repository Conventions for Agents

## Scripts

| Script         | Purpose                              | Command |
| -------------- | ------------------------------------ | ------- |
| `dev`          | Start dev server on `localhost:4321` | `astro dev` |
| `build`        | Build production site to `dist/`     | `astro build` |
| `preview`      | Preview built site                   | `astro preview` |
| `astro`        | Access Astro CLI                     | `astro` |
| `test`         | Run unit tests once                  | `vitest --run` |
| `test:watch`   | Watch tests                          | `vitest` |
| `test:ui`      | Vitest UI                            | `vitest --ui` |
| `test:coverage`| Collect test coverage                | `vitest --coverage --run` |
| `test:e2e`     | Playwright end‑to‑end tests          | `playwright test` |
| `test:e2e:ui`  | Interactive Playwright UI            | `playwright test --ui` |
| `release`      | Trigger semantic-release             | `semantic-release` |

## Commit Style

- Uses **Conventional Commits** for automated releases【F:README.md†L58-L72】
- Example: `feat: add new portfolio section`

## Branching & PR Checks

- Default branch: `main`
- PR workflow `.github/workflows/pr-checks.yml` runs type checking, Astro check, build, Conventional Commit validation, and a Docker smoke test【F:.github/workflows/pr-checks.yml†L1-L90】
- Release workflow builds and publishes a container image via semantic-release【F:release.config.js†L1-L11】【F:.github/workflows/release.yml†L1-L60】

## Directory Hints

- Source code: [`src/`](src)
- Unit tests: [`tests/unit`](tests/unit)
- Agent prompts: [`.cursor/commands`](.cursor/commands)
- Infrastructure: [`Dockerfile`](Dockerfile), GitHub Actions in [`.github/workflows`](.github/workflows)

## Secrets & Environment

- No `.env` files committed; never commit secrets.
- `NODE_ENV` defaults to `development` in `.mise.toml`【F:.mise.toml†L1-L6】

# Agent Tasks & Safe Operations

- Agents may modify source, tests, docs, and CI workflows.
- Ensure `astro check`, `tsc --noEmit`, tests, and builds pass before committing.
- Avoid introducing accessibility regressions; keep Astro components semantic.
- Do not commit generated artifacts or secret keys.

# Common Workflows

### Prepare a Pull Request

1. `pnpm install`
2. Run `pnpm astro check`, `pnpm tsc --noEmit`, `pnpm test`, and `pnpm build`
3. Fix any issues; commit using Conventional Commits.
4. Push branch and open PR.

### Refactor or Add a Feature

1. Update or add tests under `tests/`.
2. Ensure type safety and run the full check suite.
3. Update docs (README, AGENTS.md) if behavior changes.

### Add a New Agent Automation

1. Place scripts or prompts under `.cursor/commands`.
2. Document new behavior in AGENTS.md.
3. Ensure CI covers the new automation.

# CI Integration

- **PR Checks**: Node setup, dependency install, `tsc --noEmit`, `astro check`, `astro build`, Conventional Commit validation, Docker smoke test.【F:.github/workflows/pr-checks.yml†L1-L90】
- **Release**: semantic-release determines version, updates changelog, and builds a container image.【F:release.config.js†L1-L11】
- Match CI locally by running the same commands before pushing.

# Troubleshooting

- `pnpm astro check` currently fails at `src/pages/index.astro` because `CTAButton` lacks a `class` prop; add it to the component's props to resolve the error.
- If `mise` warns about untrusted config, run `mise trust`.
- Docker is required for container smoke tests; install or skip on unsupported environments.

# Appendix

## Tool Versions

| Tool       | Version                  |
| ---------- | ------------------------ |
| Node.js    | 24.7.0 (mise) / 20 in CI |
| pnpm       | 10.15.0                  |
| Astro      | ^5.13.4                  |
| TypeScript | ^5.9.2                   |
| Vitest     | ^3.2.4                   |
| Playwright | ^1.55.0                  |

## Command Reference

- `astro check --watch` – re-run checks on file change
- `tsc --noEmit` – verify TypeScript types without output
- `vitest --run` / `vitest --reporter=verbose`

## Recommended package.json Patch

```diff
--- a/package.json
+++ b/package.json
@@
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage --run",
     "test:e2e": "playwright test",
     "test:e2e:ui": "playwright test --ui",
+    "check:astro": "astro check",
+    "check:types": "tsc --noEmit",
+    "lint": "eslint .",
+    "lint:fix": "eslint . --fix",
+    "format:check": "prettier -c .",
+    "format:write": "prettier -w .",
+    "check:all": "pnpm check:astro && pnpm check:types && pnpm lint && pnpm format:check && pnpm test",
     "release": "semantic-release"
   },
```

# Acceptance Checklist

- [ ] `pnpm astro check` passes or issues documented
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Lint and format checks pass if configured
- [ ] CI workflows mirror local checks
- [ ] No secrets committed
- [ ] Scripts table matches `package.json`
