#!/usr/bin/env bash

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "========================================"
echo "  Simulador Agil - Setup Script"
echo "========================================"
echo ""

# --- Check prerequisites ---
echo "[1/5] Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "  ERROR: Node.js is not installed. Install it from https://nodejs.org/"
  exit 1
fi
echo "  Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
  echo "  ERROR: npm is not installed."
  exit 1
fi
echo "  npm: $(npm --version)"

if ! command -v python3 &> /dev/null; then
  echo "  ERROR: Python 3 is not installed."
  exit 1
fi
echo "  Python: $(python3 --version)"

if ! command -v poetry &> /dev/null; then
  echo "  WARNING: Poetry is not installed. Install it for the backend:"
  echo "    curl -sSL https://install.python-poetry.org | python3 -"
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

if command -v poetry &> /dev/null; then
  poetry install
  echo "  Backend dependencies installed with Poetry."
else
  echo "  Poetry not found. Install manually:"
  echo "    cd $PROJECT_ROOT/apps/api"
  echo "    poetry install"
fi

echo ""

# --- Done ---
echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "  How to run the project:"
echo "========================================"
echo ""
echo "  Option 1 - Development mode:"
echo "    # Terminal 1 (API):"
echo "    cd apps/api && poetry run uvicorn simulado_gen.main:app --reload"
echo ""
echo "    # Terminal 2 (Web):"
echo "    cd apps/web && npm run dev"
echo ""
echo "  Option 2 - Docker:"
echo "    docker compose up --build"
echo ""
echo "========================================"
