# Bioinformatics Platform Portfolio

A ground-up Astro redesign that communicates how computational biology, scientific data pipelines, and DevOps automation intersect. The site combines a warm scientific palette, research-style storytelling, and interactive telemetry to demonstrate technical credibility for regulated laboratory environments.

## 🔬 Feature Highlights

- **Journal-inspired hero** with 96px serif typography, quantified impact metrics, and instant access to contact actions for clinical stakeholders.
- **Research-grade project section** presenting four hybrid case studies with problem/solution/stack/results/challenges narratives tailored to wet-lab and infrastructure leaders.
- **Research-grade case study layout** (`src/layouts/CaseStudyLayout.astro`) supporting abstract → methods → results storytelling and live operational overlays.
- **Interactive scientific islands**:
  - `Ic50Visualizer.svelte` renders on-the-fly dose–response curves with annotated IC₅₀ calculations.
  - `PipelineOpsDashboard.svelte` simulates sequencing pipeline SLAs, queue depth, and container fleet health.
  - `SequenceWorkbench.svelte` offers in-browser sequence manipulation, k-mer searches, and quality highlighting for demos and workshops.
  - `ApplicationSkills.svelte` clusters competencies by Scientific Computing, Data Engineering, and Infrastructure.
- **Adaptive theming** with AAA-compliant light/dark palettes (`src/styles/tokens.css`) anchored on Pantone 2025 Mocha Mousse, genomic greens, and protein-structure purples.
- **View-transitions-ready navigation** via `BaseLayout.astro`, ensuring smooth section changes without sacrificing performance targets (<3s load, 100 Lighthouse aim).

## 🧱 Architecture & Stack

| Layer      | Details                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Astro 5](https://astro.build/) with View Transitions, incremental hydration, and Markdown-friendly content authoring.     |
| Islands    | Svelte 5 components provide telemetry, visualizations, and navigation micro-interactions only where needed.                |
| Styling    | Vanilla CSS tokens/utility layers (`src/styles/tokens.css`, `utilities.css`, `animations.css`) plus Open Props primitives. |
| Fonts      | Cormorant Garamond for headers and IBM Plex Sans for body copy (loaded in `BaseLayout.astro`).                             |
| Deployment | Static build served via Caddy in the provided Docker image (`Dockerfile`) with semantic-release automation.                |

## 🗂️ Project Structure

```text
/
├── public/
│   ├── favicon.svg
│   └── fonts/rst-thermal/*
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── demos/SequenceWorkbench.svelte
│   │   ├── effects/*
│   │   ├── infrastructure/PipelineOpsDashboard.svelte
│   │   ├── navigation/*
│   │   ├── skills/ApplicationSkills.svelte
│   │   ├── ui/ThemeToggle.svelte
│   │   └── visualizations/Ic50Visualizer.svelte
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── CaseStudyLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── case-studies/adaptive-ngs.astro
│   ├── styles/{tokens.css,utilities.css,animations.css}
│   └── utils/*
├── tests/
│   ├── e2e/*
│   └── unit/*
├── astro.config.mjs
├── playwright.config.ts
├── vitest.config.ts
├── eslint.config.js
├── tsconfig.json
├── Dockerfile
├── package.json
├── release.config.js
├── commitlint.config.js
└── CHANGELOG.md
```

## 🧬 Content Authoring

- **Homepage (`src/pages/index.astro`)** exposes structured data arrays for hero metrics, featured projects, experience entries, and technical insights. Each project records problem, solution, tech stack, quantified results, and implementation challenges to keep storytelling specific.
- **Case studies** inherit from `CaseStudyLayout.astro` to deliver abstract/methods/results sections alongside live dashboard slots. Duplicate `src/pages/case-studies/adaptive-ngs.astro` as a starting point for additional stories.
- **Skills & demos** use Svelte props for data injection—extend the exported collections in each island to surface new disciplines or visualizations.

## 🎨 Design System

- Theme tokens live in `src/styles/tokens.css` (color ramps, spacing, typography scale) with per-mode CSS custom properties.
- Utility helpers in `src/styles/utilities.css` cover layout primitives, scientific annotations, and callout treatments.
- Micro-animations defined in `src/styles/animations.css` respect prefers-reduced-motion while enabling 200–500 ms reveals and scientific plotting cues.

## 🧪 Quality Gates

| Command                           | Purpose                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`                    | Install dependencies (Node ≥20).                                                                                    |
| `pnpm dev`                        | Start the Astro dev server (default `http://localhost:4321`). Add `--host 0.0.0.0 --port 4321` for remote previews. |
| `pnpm build`                      | Generate the optimized static site in `dist/`.                                                                      |
| `pnpm preview`                    | Serve the production build locally.                                                                                 |
| `pnpm astro check`                | Run Astro diagnostics across `.astro` and integrated components.                                                    |
| `pnpm tsc --noEmit`               | Type-check Astro/Svelte/TS files without emitting JS.                                                               |
| `pnpm test`                       | Execute Vitest unit suites (Happy DOM).                                                                             |
| `pnpm test:e2e`                   | Run Playwright end-to-end checks (accessibility assertions included).                                               |
| `pnpm lint` / `pnpm format:check` | Ensure ESLint + Prettier compliance prior to commits.                                                               |

CI replicates these checks and builds the Docker container for smoke validation before release.

## 🚀 Deployment & Release

- **Semantic-release** governs versioning, changelog updates, and GitHub releases triggered from `main`.
- **Container image** (see `Dockerfile`) bundles the static build with Caddy, exposing port 8080 for runtime previews and GHCR publishing.
- **Flux/GitOps compatibility**: downstream environments can watch GHCR tags to automatically roll out new builds.

## ♿ Accessibility & Performance

- Light/dark palettes maintain WCAG AAA contrast ratios and automatically honor `prefers-color-scheme` and `prefers-reduced-motion`.
- Hydration is scoped to interactive islands only, keeping bundle sizes small and maintaining sub-3s load goals even on hospital Wi-Fi.
- View Transitions and focus-visible states ensure smooth yet accessible navigation for keyboard and screen reader users.

## 🤝 Contributing

1. Fork and clone the repo, then run `pnpm install`.
2. Create feature branches locally (conventional commits required).
3. Run `pnpm astro check`, `pnpm tsc --noEmit`, `pnpm test`, and `pnpm build` before opening a PR.
4. Include updated screenshots or Lighthouse results when altering visuals or performance-sensitive logic.

Questions or improvements? Open an issue describing the bioinformatics scenario you want to support, and document expected metrics or instrumentation so the design stays grounded in real lab workflows.
