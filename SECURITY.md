# Security

How dependency security alerts are handled in this repo. This is a static,
prerendered blog deployed to Cloudflare Workers, so "severity" from GitHub is
always weighed against **real reachability** — most build/dev-time CVEs are not
exploitable against the deployed static output.

## The machinery (already set up)

- **Dependabot alerts** — ON (detects vulnerable deps).
- **Automated security fixes** — ON (auto-opens a fix PR when a patch exists and is
  reachable).
- **Auto-merge** — minor/patch Dependabot PRs merge themselves once CI is green
  (see `.github/workflows/dependabot-auto-merge.yml`). Majors are held for manual review.

So most alerts become a PR on their own. What still needs a human: **major-version**
fixes, **transitive-only** fixes Dependabot can't reach, and **accepting** alerts with
no patch.

## Playbook — when a new alert appears

### 1. Triage — get the facts

```bash
gh api repos/OWNER/REPO/dependabot/alerts --paginate \
  -q '.[] | select(.state=="open") |
  "\(.security_advisory.severity)\t\(.dependency.package.name)\t\(.dependency.scope)\t→ \(.security_vulnerability.first_patched_version.identifier // "NO PATCH")"'
```

For each alert, answer:

| Question | Why it matters |
|----------|----------------|
| `runtime` or `development` scope? | dev/build deps never ship → lower risk |
| Patched version exists? | "NO PATCH" → can only accept + wait |
| Direct or transitive dep? | decides the fix method (step 2) |
| Is the code path reachable? | e.g. a dep behind a disabled module isn't reachable |

**Severity = how bad in theory. Reachability = how bad for *this* site.** Decide on the second.

### 2. Fix, by dependency type

**Direct dep** (in `package.json`):
```bash
pnpm update <pkg>
```
(Automated security fixes usually open this PR for you.)

**Transitive dep** (via `@nuxt/*`, `@nuxtjs/seo`, `wrangler`, … — the common case):

1. Try bumping the **parent** first — it may already ship the fix:
   ```bash
   pnpm update <parent-pkg>
   ```
2. If the parent pins the old version, **force it** with an override in
   `pnpm-workspace.yaml`:
   ```yaml
   overrides:
     'pkg@<x.y.z': '>=x.y.z'
   ```
   Two gotchas (learned the hard way):
   - Overrides live in **`pnpm-workspace.yaml`**, NOT `package.json` — pnpm 11 ignores
     the `pnpm.overrides` field there.
   - If a **ranged** key silently doesn't take, use an **exact pin** (`'pkg': 'x.y.z'`).
   - Always confirm with `pnpm why <pkg>` → should report "Found 1 version".

**No patch available:** skip to step 4.

### 3. Validate, then ship

Never push a dependency change without proving it builds — run what CI runs:

```bash
pnpm install
pnpm run lint && pnpm run typecheck && pnpm run build
```

Then branch → commit → PR (see `CONTRIBUTING.md`). CI + auto-merge take it from there.

### 4. Accept what can't / shouldn't be fixed

Some alerts are correctly left alone: **no patch exists**, or **the code path is not
reachable**. Dismiss with a documented reason so the Security tab stays at zero (real
future alerts shouldn't hide in noise):

```bash
gh api -X PATCH repos/OWNER/REPO/dependabot/alerts/<number> \
  -f state=dismissed -f dismissed_reason=tolerable_risk \
  -f dismissed_comment="Why this is acceptable"
```

Reasons: `tolerable_risk`, `no_bandwidth`, `not_used`, `inaccurate`. Dismissing does
**not** stop Dependabot from opening a PR later if a patch appears.

## Currently accepted (dismissed) alerts

| Package | Reason |
|---------|--------|
| `image-size` (≤2.0.2, 2 DoS CVEs) | No upstream patch; build-time only, inputs are my own content. |
| `sharp` (0.34.5, libvips CVEs) | Reached only via `nuxt-og-image`, which is disabled (`ogImage.enabled = false`). Other copies already patched. |

Revisit `image-size` when a patch ships — automated security fixes will open the PR
automatically.

## One-line mental model

> Triage → reachable? → patch available? → **direct: bump / transitive: override / none: accept-with-reason** → validate build → ship via PR.

## Reporting a vulnerability

This is a personal blog with no user data or accounts. If you spot a security issue,
open a GitHub issue or use the repo's private security advisory feature.
