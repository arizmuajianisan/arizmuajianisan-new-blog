---
title: "Learning GitHub Workflow and Dependabot"
author: "arizmuajianisan"
pubDatetime: 2026-08-13T09:00:00Z
description: "How I set up Dependabot to keep this blog's dependencies up to date, and what I learned wiring it together with GitHub Actions and auto-merge."
featured: true
draft: false
tags:
  - github
  - github-actions
  - dependabot
  - ci-cd
  - automation
---

# The Issue

Keeping dependencies up to date is one of those chores I always put off. I'd open the repo weeks later, run an install, and suddenly there were a dozen packages behind, some of them with security advisories. Doing it by hand is boring and easy to forget.

So for this blog I decided to let a robot do it. That robot is **Dependabot**. But along the way I learned that just turning it on isn't enough, and that the interesting part is how it fits together with GitHub Actions.

## What is Dependabot?

Dependabot is a bot built into GitHub. It watches your dependency files (for me that's `package.json` + `pnpm-lock.yaml`, and the versions pinned in my GitHub Actions workflows) and opens pull requests when something is out of date. Two flavors:

- **Security updates** — toggled in the repo Settings UI, opens PRs when there's a known vulnerability.
- **Version updates** — the scheduled "your dependency is behind" PRs. These are configured with a file: `.github/dependabot.yml`.

Here's the config I ended up with:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
    labels:
      - dependencies
    groups:
      minor-and-patch:
        update-types:
          - minor
          - patch

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
    labels:
      - dependencies
      - github-actions
```

The `groups` part was a small win: instead of getting a separate PR for every tiny bump, all the low-risk minor and patch updates get batched into **one** PR. Less noise to review. Major bumps still come as their own PR so they get proper attention.

## First Lesson: The Labels Have To Exist

The first thing I hit was a warning on the PRs:

> The following labels could not be found: `dependencies`, `github-actions`. Please create them before Dependabot can add them to a pull request.

Turns out Dependabot won't create labels for you. If you reference a label in `dependabot.yml`, it has to already exist in the repo, otherwise it just warns and moves on. Easy fix once you know — create them once and the warning is gone for good:

```bash
gh label create dependencies --description "Updates a dependency file" --color 0366d6
gh label create github-actions --description "Updates GitHub Actions code" --color 000000
```

## Second Lesson: Green CI Doesn't Always Mean "It Works"

This one surprised me the most.

My CI (a GitHub Actions workflow in `.github/workflows/ci.yml`) was running **lint** and **typecheck**. Both green, so I assumed a dependency bump that passed CI was safe to merge.

But this blog is Nuxt + `@nuxt/content`, and `@nuxt/content` uses a native module (`better-sqlite3`) **at build time** to prerender all the pages. Lint and typecheck never actually run the build — so they never touch that native module. A bump could break the actual build and CI would still be green.

I only caught this when a `better-sqlite3` major bump came through. To be sure, I ran the real build locally and watched it prerender every page. It worked, but the lesson stuck: **my CI had a blind spot.**

The fix was one extra step in the workflow:

```yaml
      - name: Typecheck
        run: pnpm run typecheck

      - name: Build
        run: pnpm run build
```

Now CI runs lint → typecheck → **build**, and a green check genuinely means the site prerenders. This turned out to be the key that makes everything after it trustworthy.

## Third Lesson: Automating the Merge

Once CI actually proves something, you can start trusting it to merge for you. GitHub has a nice pattern for this using `dependabot/fetch-metadata` to read what kind of update a PR is, and then `gh pr merge --auto`.

```yaml
name: dependabot-auto-merge
on: pull_request
permissions:
  contents: write
  pull-requests: write
jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Fetch Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Enable auto-merge for minor and patch updates
        if: steps.metadata.outputs.update-type == 'version-update:semver-minor' || steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

A few things I learned reading how this actually behaves:

- **`--auto` only queues the merge.** It doesn't merge immediately. My branch protection rule requires the `ci` check to pass, so the merge only happens once CI is green. A red build never merges. That's the safety net.
- **I only auto-merge minor and patch.** Major bumps are excluded on purpose — those get my eyes.
- **For grouped PRs, the "update type" is the largest bump in the group.** So a group full of patches auto-merges, but if one major sneaks into a group, the whole thing waits for me. Safe default.
- **`if: github.actor == 'dependabot[bot]'`** means the job is skipped on my own PRs. When I opened the PR that *added* this workflow, the job showed up as "Skipping" — which confused me for a second, but that's exactly correct. It only runs for the bot.

## A Gotcha: Strict Branch Protection

My `main` branch protection is set to require branches to be **up to date** before merging (`strict: true`). This has a side effect I didn't expect: when several Dependabot PRs are open and I merge one, all the others become "behind" and need to be refreshed before they can merge.

Dependabot usually rebases them on its own within a few minutes. Occasionally one gets stuck and needs a nudge — either an `@dependabot rebase` comment on the PR, or updating the branch from the UI. Good to know so I don't panic when a PR sits in a "blocked" state for a bit.

## Where It Landed

Putting it all together, my weekly flow is now basically hands-off:

- Dependabot opens PRs every Monday, already labeled and grouped.
- CI runs lint + typecheck + build, so green really means green.
- Minor and patch updates **merge themselves** once CI passes.
- **Major** bumps wait for me to review — which is exactly where I want to spend my attention.

## Conclusion

I went into this thinking "just turn on Dependabot," and came out having learned a lot more about how GitHub Actions, branch protection, and merge automation actually fit together. The biggest takeaway for me: **automation is only as trustworthy as the checks behind it.** Adding the build step to CI was the small change that made everything else safe to automate.

If you're running any project with dependencies, I'd recommend setting this up. Future-you will appreciate not having to babysit version bumps.
