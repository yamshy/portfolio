# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Shyam Ajudia's portfolio website built with Astro v5 and featuring a modern design with glassmorphism effects and animated organic shapes. The site showcases professional evolution from molecular biology research to infrastructure engineering.

## Tech Stack

- **Framework**: Astro v5 with Svelte integration
- **Styling**: Tailwind CSS v4 with custom design system
- **Font**: Custom RST Thermal font family
- **Deployment**: Docker containers via GitHub Container Registry
- **CI/CD**: Automated releases with semantic-release

## Commands

```bash
# Development
pnpm dev                 # Start development server on localhost:4321
pnpm build              # Build production site to ./dist/
pnpm preview            # Preview build locally

# Quality checks
astro check             # Run Astro's built-in checks including TypeScript
pnpm astro -- --help    # Get Astro CLI help

# Release (automated via CI/CD)
pnpm release            # Run semantic-release locally for testing
```

## Architecture

### Layout System

- **BaseLayout.astro**: Main layout with global background shapes, navigation, and accessibility features
- **Global background shapes**: Fixed positioned animated organic blobs using CSS animations
- **Navigation**: Dual navigation system with SidebarNav for desktop and MobileNav for mobile

### Design System

- **Color Palette**: Warm colors (coral, mocha, accent yellow) with custom CSS variables defined in global.css
- **Glassmorphism**: Custom utility classes with backdrop-blur effects
- **Animations**: Organic morphing shapes, floating elements, and smooth transitions
- **Typography**: RST Thermal font with multiple weights preloaded for performance

### Component Structure

- **ContactForm.astro**: Contact form component
- **ProjectCard.astro**: Reusable project showcase cards
- **GlassCard.astro**: Glassmorphism effect containers
- **FormInput.astro**: Styled form input components
- **Footer.astro**: Site footer

### Content Architecture

- **index.astro**: Single-page application with multiple sections (Hero, Timeline, Projects, Contact)
- **Professional Timeline**: Animated timeline showing career evolution from biology to tech
- **Projects**: Asymmetrical bento grid layout showcasing featured work

## Development Guidelines

### Branching and Pull Request Workflow

**IMPORTANT**: All changes must be made in feature branches and merged to main via pull requests.

Workflow:

1. **Create new branch**: Always create a new branch from main for any changes

   ```bash
   git checkout -b feature/description-of-change
   git checkout -b fix/description-of-bug
   git checkout -b docs/description-of-docs-change
   ```

2. **Make changes**: Implement your changes with conventional commits
3. **Create Pull Request**: Submit PR to merge into `master` branch
4. **Review and merge**: All changes must be reviewed before merging to main

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes  
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

### Commit Messages

**IMPORTANT**: All commits must use Conventional Commits format. This is critical for automated versioning and releases.

Required format:

- `feat: description` - New features (minor version bump)
- `fix: description` - Bug fixes (patch version bump)
- `docs: description` - Documentation changes
- `style: description` - Code style changes (formatting, etc.)
- `refactor: description` - Code refactoring
- `test: description` - Adding or updating tests
- `chore: description` - Build process or auxiliary tool changes
- `BREAKING CHANGE: description` - Breaking changes (major version bump)

Examples:

```
feat: add new project showcase section
fix: resolve mobile navigation overflow issue
docs: update CLAUDE.md with commit guidelines
style: format CSS with prettier
```

### Styling

- Uses Tailwind v4 with `@theme` directive for custom color definitions
- Global CSS animations are performance-optimized with `will-change` properties
- Supports accessibility features (reduced motion, high contrast, focus indicators)
- Responsive design with mobile-first approach

### Performance Considerations

- Font preloading for RST Thermal Regular weight
- CSS animations use `will-change` for GPU acceleration
- Organic shapes positioned with `fixed` positioning to reduce reflows
- Images and assets are optimized for web delivery

### Accessibility Features

- Skip links for keyboard navigation
- Focus indicators throughout the interface  
- Support for reduced motion preferences
- High contrast mode compatibility
- Semantic HTML structure with proper ARIA labels

## Deployment

The site uses automated CI/CD with semantic-release:

- **Commit Format**: Conventional Commits for automated versioning
- **Container Images**: Built and pushed to GitHub Container Registry
- **Deployment**: GitOps with Flux monitoring image tags for automatic updates
- **Environment**: Runs in Docker on port 8080 with Caddy server

## Project Structure Notes

- `src/types/index.ts`: TypeScript type definitions
- `public/fonts/rst-thermal/`: Custom font files (.otf format)
- `src/assets/`: Static assets including background SVGs
- TypeScript configuration extends Astro's strict config
- No traditional testing setup - relies on Astro's built-in checks
