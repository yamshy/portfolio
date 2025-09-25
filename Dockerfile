# Multi-stage build for Astro portfolio site
FROM node:22-alpine AS builder

WORKDIR /app

# Use corepack for pnpm (smaller layer + reproducible)
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Set production environment for build optimization
ENV NODE_ENV=production

# Copy source code
COPY . .

# Build the Astro site
RUN pnpm build

# Final stage with Caddy minimal static server
FROM caddy:2-alpine

# Create non-root user
RUN addgroup -g 1001 -S app && adduser -S app -u 1001 -G app

# Copy built site from builder stage
COPY --from=builder --chown=app:app /app/dist /srv

# Strip capabilities from Caddy binary
USER root
RUN apk add --no-cache libcap && setcap -r /usr/bin/caddy
USER app

# Expose port 8080 for non-root user compatibility
EXPOSE 8080

# Serve static files on 8080 explicitly
CMD ["caddy", "file-server", "--root", "/srv", "--listen", ":8080"]