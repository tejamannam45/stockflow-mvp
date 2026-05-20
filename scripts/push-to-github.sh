#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "→ Pulling remote README (if any)..."
git pull origin main --allow-unrelated-histories --no-edit || true

echo "→ Pushing to https://github.com/tejamannam45/stockflow-mvp ..."
git push -u origin main

echo "✓ Done! Check: https://github.com/tejamannam45/stockflow-mvp"
