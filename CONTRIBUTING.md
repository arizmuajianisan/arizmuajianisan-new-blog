# Contributing

Notes to my future self on how to make changes to this blog.

## The golden rule

**Never push to `main` directly.** `main` is protected — a direct push is rejected by
GitHub. Every change lands as a **pull request** that CI must pass before it can merge.
`main` only ever changes by merging a PR.

## The workflow

```bash
# 1. Start from an up-to-date main
git checkout main
git pull

# 2. Create a branch named after what it does
git checkout -b fix/short-description      # or feat/... , content/... , chore/...

# 3. Make your changes, then stage + commit
git add <files>
git commit -m "type(scope): what changed"

# 4. Push the BRANCH (never main)
git push -u origin fix/short-description    # -u links it, so later just `git push`

# 5. Open the pull request
gh pr create --base main --title "..." --body "..."
```

Then: **wait for CI to go green → merge the PR → delete the branch.**

## After the PR merges — clean up

```bash
git checkout main
git pull                                    # pull the merged change back down
git branch -d fix/short-description         # delete the local branch
```

## What CI checks

Every push (including PR branches) runs `.github/workflows/ci.yml` on Node 22 / pnpm:

| Step | Command | Catches |
|------|---------|---------|
| Lint | `pnpm run lint` | style / ESLint issues |
| Typecheck | `pnpm run typecheck` | type errors |
| Build | `pnpm run build` | prerender + the `@nuxt/content` SQLite path (`better-sqlite3`) |

Run these locally before pushing to catch problems early:

```bash
pnpm run lint && pnpm run typecheck && pnpm run build
```

## Dependabot PRs

Dependency updates arrive as PRs through the **same** flow. The only difference:
minor/patch updates **auto-merge** once CI passes (see
`.github/workflows/dependabot-auto-merge.yml`); **major** updates are left for manual
review and merge.

## Common gotchas

- **`git push` to `main` is rejected** — that's branch protection working, not a bug.
  Branch instead.
- **Accidentally committed on `main`?** Move the commit onto a branch:
  ```bash
  git branch fix/my-change       # bookmark the commit on a new branch
  git reset --hard origin/main   # rewind local main to match remote
  git checkout fix/my-change     # continue on the branch
  ```
- **Draft blog posts:** set `draft: true` in the frontmatter — the post rides along in
  the PR but won't publish on deploy until you flip the flag.
- **Local dev:** `pnpm dev`. Ignore the D1 warning (`@nuxt/content` falls back to a local
  SQLite dump) — it only matters on the Cloudflare deploy.

## Commit message convention

`type(scope): summary` — e.g. `fix(icon): resolve icons locally`, `content(blog): add
dependabot post`, `chore(deps): bump nuxt`. Common types: `feat`, `fix`, `content`,
`chore`, `ci`, `docs`.
