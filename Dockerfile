# Multi-stage build for Astro portfolio site
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Astro site
RUN pnpm build

# Final stage with Caddy minimal static server
FROM caddy:2-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built site from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/caddy

# Switch to non-root user
USER nextjs

# Expose port 8080 for non-root user compatibility
EXPOSE 8080

# Caddy will serve the static files by default on port 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]