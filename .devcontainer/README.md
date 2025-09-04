# Development Container Setup

This directory contains the configuration for developing the portfolio site using VS Code devcontainers.

## What's Included

- **Node.js 24.7.0** - Matches the project's mise configuration
- **pnpm 10.15.0** - Package manager with exact version matching
- **Playwright** - For end-to-end testing with browser dependencies pre-installed
- **Git & GitHub CLI** - Version control and GitHub integration
- **VS Code Extensions** - Pre-configured extensions for Astro, Svelte, TypeScript, and testing

## VS Code Extensions

The devcontainer automatically installs these extensions:

- `astro-build.astro-vscode` - Astro language support
- `svelte.svelte-vscode` - Svelte component support
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
- `ms-vscode.vscode-typescript-next` - Enhanced TypeScript support
- `esbenp.prettier-vscode` - Code formatting
- `dbaeumer.vscode-eslint` - ESLint integration
- `ms-playwright.playwright` - Playwright test runner
- `vitest.explorer` - Vitest test explorer

## Port Forwarding

The following ports are automatically forwarded:

- **4321** - Astro development server (`pnpm dev`)
- **4173** - Astro preview server (`pnpm preview`)
- **9323** - Vitest UI (`pnpm test:ui`)

## Getting Started

1. Open the project in VS Code
2. When prompted, click "Reopen in Container" or use the Command Palette:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Type "Dev Containers: Reopen in Container"
3. Wait for the container to build and dependencies to install
4. Start developing with `pnpm dev`

## Available Commands

Once inside the devcontainer, you can use all the project's npm scripts:

```bash
# Start development server
pnpm dev

# Run tests
pnpm test
pnpm test:watch
pnpm test:ui

# Build the project
pnpm build

# Preview the built site
pnpm preview

# Run end-to-end tests
pnpm test:e2e
pnpm test:e2e:ui

# Type checking and linting
pnpm check:astro
pnpm type-check
pnpm lint
pnpm lint:fix

# Code formatting
pnpm format
pnpm format:check

# Run all checks at once
pnpm check
```

## Container Features

- **Automatic dependency installation** - `pnpm install` runs on container creation
- **Non-root user** - Runs as the `node` user for security
- **Persistent workspace** - Your code changes persist outside the container
- **Pre-configured environment** - `NODE_ENV=development` is set automatically

## Troubleshooting

### Container won't start

- Ensure Docker is running on your system
- Try rebuilding the container: Command Palette → "Dev Containers: Rebuild Container"

### Missing dependencies

- The container runs `pnpm install` automatically on creation
- If dependencies seem out of sync, rebuild the container

### Port conflicts

- If port 4321 is already in use, VS Code will automatically forward to an alternative port
- Check the "Ports" tab in VS Code to see the actual forwarded ports
