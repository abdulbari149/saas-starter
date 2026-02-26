#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: create-worktree.sh <branch-name> [base-ref]"
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

git -C "${REPO_ROOT}" worktree add -b "${BRANCH_NAME}" "${WORKTREE_PATH}" "${BASE_REF}"

if [[ -f "${REPO_ROOT}/.env.local" ]]; then
  cp "${REPO_ROOT}/.env.local" "${WORKTREE_PATH}/.env.local"
fi

npm --prefix "${WORKTREE_PATH}" install --no-package-lock

echo "Worktree ready at ${WORKTREE_PATH}"
