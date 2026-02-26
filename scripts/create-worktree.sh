#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: npm run worktree:new -- <branch-name> [base-ref]"
  echo "Example: npm run worktree:new -- feature/dashboard-redesign main"
  exit 1
fi

BRANCH_NAME="$1"
BASE_REF="${2:-main}"
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREES_DIR="${REPO_ROOT}/../worktrees"
WORKTREE_PATH="${WORKTREES_DIR}/${BRANCH_NAME}"

mkdir -p "${WORKTREES_DIR}"

if [[ -d "${WORKTREE_PATH}" ]]; then
  echo "Worktree already exists at ${WORKTREE_PATH}"
  exit 1
fi

echo "Creating worktree: ${WORKTREE_PATH}"
git -C "${REPO_ROOT}" worktree add -b "${BRANCH_NAME}" "${WORKTREE_PATH}" "${BASE_REF}"

if [[ -f "${REPO_ROOT}/.env" ]]; then
  cp "${REPO_ROOT}/.env" "${WORKTREE_PATH}/.env"
  echo "Copied .env to worktree"
else
  echo ".env not found in repo root; skipping copy"
fi

echo "Installing dependencies in worktree"
npm --prefix "${WORKTREE_PATH}" install --no-package-lock

echo "Checking Docker DB port mapping (expected: 54322)"
if command -v docker >/dev/null 2>&1; then
  if docker ps --format '{{.Ports}}' | grep -q '54322'; then
    echo "Database port 54322 is exposed in docker ps"
  else
    echo "Warning: could not find port 54322 in docker ps output"
  fi
else
  echo "Warning: docker command not found; skipping DB port check"
fi

cat <<EOF

Worktree is ready.
Path: ${WORKTREE_PATH}
Branch: ${BRANCH_NAME}

Next:
  cd "${WORKTREE_PATH}"
  npm run dev
EOF
