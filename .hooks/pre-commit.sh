#!/usr/bin/env bash
# Pre-commit hook: run tests before allowing commit
set -euo pipefail

echo "Running tests..."
npm test --silent 2>&1

if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
