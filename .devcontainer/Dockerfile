# Development container for Astro portfolio site
FROM node:24.8.0-bullseye

# Install additional system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for pnpm
RUN corepack enable

# Set specific pnpm version to match project requirements
RUN corepack prepare pnpm@10.15.0 --activate

# Install Playwright dependencies for e2e testing
RUN npx playwright install-deps

# Create workspace directory
WORKDIR /workspace

# Set environment variables
ENV NODE_ENV=development
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Create non-root user matching the project setup
RUN groupadd --gid 1000 node \
    && usermod --uid 1000 --gid 1000 node \
    && chown -R node:node /workspace

USER node

# Install global tools that might be useful for development
RUN pnpm add -g @astrojs/cli

# Expose ports for development servers
EXPOSE 4321 4173 9323

# Default command
CMD ["/bin/bash"]
