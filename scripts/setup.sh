#!/usr/bin/env bash

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "========================================"
echo "  SimuladorÁgil — Setup Script"
echo "========================================"
echo ""

# --- Check prerequisites ---
echo "[1/5] Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "  ERROR: Node.js is not installed. Install it from https://nodejs.org/ (>= 20)"
  exit 1
fi
echo "  Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
  echo "  ERROR: npm is not installed."
  exit 1
fi
echo "  npm: $(npm --version)"

if ! command -v java &> /dev/null; then
  echo "  WARNING: Java is not installed. Gradle will auto-provision JDK 25 via toolchain, but having a local JDK speeds things up."
else
  echo "  Java: $(java -version 2>&1 | head -n 1)"
fi

if command -v docker &> /dev/null; then
  echo "  Docker: $(docker --version)"
fi

echo ""

# --- Setup .env ---
echo "[2/5] Setting up environment variables..."

if [ ! -f "$PROJECT_ROOT/.env" ]; then
  if [ -f "$PROJECT_ROOT/.env.example" ]; then
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
    echo "  Created .env from .env.example"
  else
    echo "  No .env.example found, skipping."
  fi
else
  echo "  .env already exists, skipping."
fi

echo ""

# --- Install frontend dependencies ---
echo "[3/5] Installing frontend dependencies..."

cd "$PROJECT_ROOT/apps/web"
npm install
echo "  Frontend dependencies installed."

echo ""

# --- Install backend dependencies ---
echo "[4/5] Installing backend dependencies..."

cd "$PROJECT_ROOT/apps/api"
./gradlew dependencies --quiet 2>/dev/null || ./gradlew --quiet
echo "  Backend dependencies resolved with Gradle."

echo ""

# --- Done ---
echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "  How to run the project:"
echo "========================================"
echo ""
echo "  Option 1 — Docker (recommended for quick start):"
echo "    docker compose up --build"
echo ""
echo "  Option 2 — Development mode (separate terminals):"
echo "    # Terminal 1 (API):"
echo "    cd apps/api && ./gradlew bootRun"
echo ""
echo "    # Terminal 2 (Web):"
echo "    cd apps/web && npm run dev"
echo ""
echo "  See docs/development.md for detailed instructions."
echo "========================================"
