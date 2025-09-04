# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Shyam Ajudia's portfolio website built with Astro v5 and featuring a modern design with glassmorphism effects and animated organic shapes. The site showcases professional evolution from molecular biology research to infrastructure engineering.

**Current State**: The project has been reset to a clean slate with minimal styling, ready for rebuilding with Open Props and native Astro scoped CSS instead of Tailwind.

## Tech Stack

- **Framework**: Astro v5 with Svelte integration
- **Styling**: Open Props design tokens with native Astro scoped CSS
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

- **Design Tokens**: Open Props provides comprehensive CSS custom properties for colors, spacing, typography, and animations
- **Color Palette**: Warm brand colors (coral #E85A2B, mocha #A47864, accent yellow #FFD644) defined as custom properties
- **Glassmorphism**: Backdrop-blur effects using CSS custom properties and Astro scoped styles
- **Animations**: Organic morphing shapes, floating elements, and smooth transitions using Open Props easing functions
- **Typography**: RST Thermal font with multiple weights + Open Props typography scale
- **Architecture**: Component-scoped CSS using Astro's `<style>` tags with semantic class names

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
   git checkout -b feature/description-of-change origin/main
   git checkout -b fix/description-of-bug origin/main
   git checkout -b docs/description-of-docs-change origin/main
   ```

2. **Make changes**: Implement your changes with conventional commits
3. **Create Pull Request**: Submit PR to merge into `main` branch
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

### Styling Approach

- **Open Props Integration**: Uses Open Props design tokens for consistent spacing, colors, typography, and animations
- **Scoped CSS**: Each Astro component uses `<style>` tags for component-scoped styling
- **Semantic Classes**: Meaningful class names instead of utility classes (e.g., `.hero-title` vs `.text-6xl`)
- **Custom Properties**: Brand colors and design tokens defined as CSS custom properties
- **Performance**: Animations optimized with `will-change` properties and Open Props easing functions
- **Accessibility**: Supports reduced motion, high contrast, and proper focus indicators
- **Responsive**: Mobile-first approach using CSS custom media queries and Open Props breakpoints

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

## Current Project State

### Style Reset Status

The project has undergone a complete style reset to enable a fresh approach with Open Props:

- **STRUCTURE.md**: Complete documentation of all content, layout patterns, and design requirements
- **Minimal Styling**: Only basic reset CSS with Open Props integration
- **Clean Components**: All components stripped to semantic HTML structure
- **Ready for Rebuild**: Foundation prepared for incremental styling with Open Props design tokens

### Development Approach

1. **Reference STRUCTURE.md** for complete design requirements and content organization
2. **Use Open Props tokens** for consistent spacing, colors, typography, and animations  
3. **Build incrementally** - start with layout, then typography, then visual effects
4. **Scope styles** to components using Astro's `<style>` tags
5. **Preserve accessibility** and responsive behavior documented in STRUCTURE.md

## Project Structure Notes

- `STRUCTURE.md`: Complete website structure and design system documentation
- `src/styles/global.css`: Minimal reset with Open Props integration and RST Thermal font
- `src/types/index.ts`: TypeScript type definitions
- `public/fonts/rst-thermal/`: Custom font files (.otf format)
- `src/assets/`: Static assets including background SVGs
- TypeScript configuration extends Astro's strict config
- No traditional testing setup - relies on Astro's built-in checks
