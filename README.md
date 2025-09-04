# Astro Portfolio

A modern portfolio website built with Astro, featuring automated releases and container image publishing.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   ├── BentoGrid.astro
│   │   ├── CTAButton.astro
│   │   ├── GlassmorphicContainer.astro
│   │   ├── OrganicShapes.astro
│   │   ├── ProjectCard.astro
│   │   ├── SidebarNav.astro
│   │   └── Timeline.astro
│   ├── layouts
│   │   └── BaseLayout.astro
│   └── pages
│       └── index.astro
├── package.json
├── release.config.js
├── Dockerfile
└── .github/workflows/release.yml
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

### Quick Start

```bash
# Test the latest release locally
docker run -p 8080:8080 ghcr.io/yamshy/portfolio:latest
```

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |
| `pnpm check:astro`     | Run Astro's built-in diagnostics                 |
| `pnpm type-check`      | Verify TypeScript types                          |
| `pnpm lint`            | Lint files with ESLint                           |
| `pnpm lint:fix`        | Fix lint issues automatically                    |
| `pnpm format`          | Format files with Prettier                       |
| `pnpm format:check`    | Check file formatting                            |
| `pnpm check`           | Run linting, formatting check, and type-check    |
| `pnpm release`         | Run semantic-release locally (for testing)       |

## 🚀 Automated Releases

This project uses [semantic-release](https://semantic-release.gitbook.io/) to automatically determine the next semantic version based on commit messages.

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `BREAKING CHANGE:` - Breaking changes (major version bump)
- `docs:`, `style:`, `refactor:`, `test:`, `chore:` - No version bump

Examples:

```
feat: add new portfolio section
fix: resolve responsive layout issue
docs: update README with new features
BREAKING CHANGE: redesign navigation structure
```

### Release Process

On each push to `main` with valid Conventional Commits:

1. **semantic-release** automatically:
   - Analyzes commit messages
   - Determines the next version number
   - Updates `CHANGELOG.md`
   - Creates a Git tag (e.g., `v1.2.3`)
   - Publishes a GitHub Release

2. **GitHub Actions** then:
   - Builds the Astro site
   - Creates a Docker container image
   - Pushes the image to GitHub Container Registry (GHCR)
   - Tags the image with the released version (e.g., `ghcr.io/<owner>/portfolio:1.2.3`)
   - Adds OCI labels for provenance

### Container Images

Images are automatically published to `ghcr.io/<owner>/portfolio:<version>` with:

- Semantic version tags (e.g., `1.2.3`, `2.0.0`)
- `latest` tag for the most recent release
- OCI labels for source, revision, creation time, and version
- Container exposes port 8080 for non-root user compatibility
- Serves static files from `/srv` via Caddy's file-server on port 8080

### Deployment

The Flux GitOps repository watches these image tags with a SemVer ImagePolicy to automatically deploy new versions. No Flux configuration is needed in this repository.

**Note**: Set your GHCR package visibility to public if Flux needs to pull images without authentication secrets.

## 👀 Want to learn more?

- [Astro Documentation](https://docs.astro.build)
- [semantic-release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
