---
name: worktree-implement
description: Create and prepare a git worktree for implementation in this project by creating a branch worktree, copying .env, installing dependencies, and checking Docker database port mapping. Use when a user asks to start a new feature/fix branch with isolated workspace setup, especially for parallel implementation tasks.
---

# Worktree Implement

Create the branch worktree and bootstrap it for coding.

## Inputs

- `branch_name` (required): New branch/worktree name, example `feature/billing-portal`.
- `base_ref` (optional): Base branch/ref to branch from. Default to `main`.

## Workflow

1. Validate that the user provided `branch_name`. Ask for it if missing.
2. Run the project command:
   `npm run worktree:new -- <branch_name> [base_ref]`
3. If the project command does not exist, run:
   `.codex/skills/worktree-implement/scripts/create-worktree.sh <branch_name> [base_ref]`
4. Confirm completion by checking:
   - Worktree exists in `../worktrees/<branch_name>`
   - `.env` exists in the new worktree when root `.env` exists
   - `node_modules` was installed in the worktree
   - `docker ps` shows database port `54322` exposed
5. Continue implementation in the new worktree path.

## Response Contract

- Return the created worktree path and branch name.
- Return the exact command to enter the worktree.
- If setup fails, return the failing step and command output summary, then retry with a clear fix.
