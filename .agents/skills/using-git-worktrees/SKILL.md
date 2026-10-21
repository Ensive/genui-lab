---
name: using-git-worktrees
description: Use when starting feature work, parallelizing independent tasks, or executing an implementation plan in this repo.
---

# Using Git Worktrees

Independent tasks run in separate git worktrees under `.worktrees/<branch>` inside this repo. Those checkouts stay untracked.

## When to use

- Starting feature work that should leave the current checkout untouched
- Two or more independent tasks that can proceed in parallel

Stay in the current worktree for sequential edits or a single-file change.

## Steps

1. Detect isolation. Resolve both paths:

```bash
git rev-parse --git-dir
git rev-parse --git-common-dir
git rev-parse --show-superproject-working-tree
```

If `--git-dir` and `--git-common-dir` differ, and `--show-superproject-working-tree` is empty, this checkout is already a linked worktree. Do not nest another one.

2. Confirm the directory is ignored before creating anything:

```bash
git check-ignore -q .worktrees
```

If that fails, add `.worktrees/` to `.gitignore` and commit that change first.

3. Create one worktree per independent task, from `main` or the agreed base:

```bash
git worktree add .worktrees/<branch> -b <branch>
```

4. In the worktree, install dependencies and verify a clean baseline:

```bash
pnpm install
pnpm test
```

If tests fail, report the failures and wait before continuing.

Do not commit anything under `.worktrees/`.
