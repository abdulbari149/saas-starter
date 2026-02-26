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

if [[ -f "${REPO_ROOT}/.env.local" ]]; then
  cp "${REPO_ROOT}/.env.local" "${WORKTREE_PATH}/.env.local"
  echo "Copied .env.local to worktree"
else
  echo ".env.local not found in repo root; skipping copy"
fi

echo "Installing dependencies in worktree"
npm --prefix "${WORKTREE_PATH}" install --no-package-lock

cat <<EOF

Worktree is ready.
Path: ${WORKTREE_PATH}
Branch: ${BRANCH_NAME}

Next:
  cd "${WORKTREE_PATH}"
  npm run dev
EOF
