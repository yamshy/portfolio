#!/usr/bin/env bash
set -e

echo "🔧 Setting up workspace..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed"
    echo "Please install pnpm: https://pnpm.io/installation"
    exit 1
fi

echo "✓ pnpm found"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy .env file from root if it exists
if [ -f "$CONDUCTOR_ROOT_PATH/.env" ]; then
    echo "📋 Copying .env file..."
    cp "$CONDUCTOR_ROOT_PATH/.env" .env
    echo "✓ .env file copied"
else
    echo "ℹ️  No .env file found at root (this is okay if you don't need one)"
fi

# Install Playwright browsers if needed
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "🎭 Installing Playwright browsers..."
    pnpm exec playwright install --with-deps
    echo "✓ Playwright browsers installed"
else
    echo "✓ Playwright browsers already installed"
fi

echo "✅ Setup complete! You can now click 'Run' to start the dev server."
