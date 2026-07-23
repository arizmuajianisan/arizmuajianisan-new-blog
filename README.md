# arizmuajianisan

[![Made with Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

My personal/professional blog — notes on software, self-hosting, DevOps, and the tools I use for my work. Built with **Nuxt 4**, **@nuxt/content**, and **Nuxt UI**, deployed to **Cloudflare Workers**.

Migrated from a previous Astro blog. Posts are plain Markdown.

## Features

- Markdown-driven blog (`@nuxt/content` v3)
- Homepage with a welcome hero, a **featured** post section, and all posts newest-first
- Tag/category browsing (`/tags` and `/tags/<tag>`)
- Showcase and About pages
- Dark / light theme toggle
- SEO: sitemap, RSS feed, Open Graph + canonical tags, `BlogPosting` structured data
- Fully prerendered (static) — fast and cheap to host

## Tech stack

| Concern         | Tool                                                |
| --------------- | --------------------------------------------------- |
| Framework       | Nuxt 4                                              |
| UI / styling    | Nuxt UI v4 + Tailwind CSS v4                        |
| Content         | @nuxt/content v3 (Markdown)                         |
| SEO             | @nuxtjs/seo (sitemap, og-image, schema-org, robots) |
| Hosting         | Cloudflare Workers (`wrangler`)                     |
| Package manager | pnpm                                                |

## Setup

Install dependencies:

```bash
pnpm install
```

> **Note:** `better-sqlite3` is a build-time dependency used by `@nuxt/content` to
> generate the content database. Its native build is approved in
> `pnpm-workspace.yaml` (`better-sqlite3: true`). If install warns about ignored
> build scripts, run `pnpm rebuild better-sqlite3`.

## Development

Start the dev server on `http://localhost:3000`:

```bash
pnpm dev
```

Drafts (`draft: true` in frontmatter) are **visible in dev** and **hidden in production**.

## Build & deploy

Build (prerenders every route to static HTML):

```bash
pnpm build
```

Preview the production build on the Cloudflare Workers runtime locally:

```bash
pnpm preview:cf   # nuxt build && wrangler dev
```

Deploy to Cloudflare Workers:

```bash
pnpm deploy       # nuxt build && wrangler deploy
```

Other scripts: `pnpm lint`, `pnpm typecheck`, `pnpm cf-typegen`.

## Writing posts

Posts live in `content/blog/<year>/<slug>.md`. The URL is `@nuxt/content`'s native
path including the year, e.g. `content/blog/2025/fix-grub-error.md` → `/blog/2025/fix-grub-error`.

Frontmatter schema (defined and normalized in `content.config.ts`):

```yaml
---
title: "Post title"
author: "arizmuajianisan"
pubDatetime: 2025-12-09T14:50:00Z # ISO8601 or date-only (2025-12-09)
description: "Short summary used for SEO and post listings."
featured: false # true → shown in the homepage Featured section
draft: false # true → hidden in production
tags:
  - linux # normalized to lowercase + deduped automatically
  - grub
ogImage: "/images/optional-og.jpg" # optional; defaults to /arizmuajianisan-og.jpg
---
```

Notes:

- **Images:** put them in `public/images/` and reference with an absolute path, e.g. `![alt](/images/grub-error.jpg)`. (Astro's `@/assets/...` syntax does not work here.)
- **Tags** are case-insensitive — `Docker` and `docker` collapse to one tag.
- **Slugs** should be hyphenated; the route is `/blog/<year>/<filename-without-ext>`.

## Configuration notes

### Theme colors — `app/app.config.ts`

```ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: "emerald", // accent: buttons, links, badges, card spotlight glow
      neutral: "zinc", // grays: text, borders, backgrounds
    },
  },
});
```

`primary` accepts any Tailwind color (`blue`, `violet`, `rose`, …); `neutral` is the
gray ramp (`slate`, `gray`, `zinc`, `neutral`, `stone`). Both light and dark modes
update automatically. Fonts and any fully custom color palettes go in
`app/assets/css/main.css` (`@theme` block).

The cursor-following glow on post cards is the `spotlight` prop on `UPageCard`
(`app/components/PostCard.vue`, `FeaturedPost.vue`). Tune it with
`spotlight-color="..."` or `:ui="{ root: '[--spotlight-size:250px]' }"`, or remove
the `spotlight` prop to disable it.

### Typography — font, size, spacing

Tuned for comfortable reading on both desktop and mobile. Three files control it:

- **Font** — `app/assets/css/main.css`:

  ```css
  @theme static {
    --font-sans: 'Inter', sans-serif;
  }
  ```

  `@nuxt/fonts` (bundled with Nuxt UI) auto-downloads and self-hosts whatever font
  name you set here — change `'Inter'` to any Google-available font.

- **Reading column, body size** — `app/pages/blog/[...slug].vue`:
  - The article is constrained to `mx-auto max-w-2xl` (~70 characters per line — the
    biggest readability win on wide screens). Widen with `max-w-3xl` or tighten with
    `max-w-xl`.
  - Body text is `text-[1.0625rem] sm:text-lg` → **17px on mobile, 18px on desktop**
    (up from 16px). Bump to `sm:text-xl` for 20px, etc.

- **Line spacing** — `app/app.config.ts` (`ui.prose.p` / `ui.prose.li`):

  ```ts
  prose: {
    p: { base: 'leading-[1.75]' },
    li: { base: 'leading-[1.75]' }
  }
  ```

  `leading-[1.75]` is unitless, so it scales with the font size. Use a smaller value
  (e.g. `1.65`) for tighter lines or larger (`1.85`) for looser.

The post `<h1>` size is `text-3xl sm:text-4xl` in the page; in-content headings
(`h2`–`h4`) can be themed under `ui.prose.h2` etc. in `app/app.config.ts`. The font
and line-spacing changes are global; the reading-column width and size bump are
scoped to blog posts.

### Site / SEO — `nuxt.config.ts`

```ts
site: {
  url: 'https://arizmuajianisan.com',  // ⚠️ set the real domain before deploying
  name: 'Ariz Muajianisan',
  description: '...'
}
```

`site.url` feeds canonical URLs, the sitemap, and the RSS feed — update it before the
first deploy. Open Graph images are **static** (`ogImage.enabled: false`) because
runtime OG-image generation does not run on Cloudflare Workers; the default image is
`public/arizmuajianisan-og.jpg`, overridable per-post via the `ogImage` frontmatter.

### Cloudflare Workers — `wrangler.jsonc` + `nuxt.config.ts`

The site uses the Nitro `cloudflare_module` preset and **prerenders every route**
(`nitro.prerender`). Because of this, the `@nuxt/content` database is only used at
build time — **no Cloudflare D1 database is required** at runtime; the Worker just
serves static HTML and assets.

> During build you'll see a warning: _"Deploying to Cloudflare requires using D1
> database…"_. This is **safe to ignore** here — all routes are static, so no
> runtime database query ever happens.

The RSS feed (`/rss.xml`) is a prerendered Nitro route (`server/routes/rss.xml.ts`).

## Project structure

```
content/blog/<year>/*.md   Blog posts (Markdown)
public/images/             Post images and assets
public/arizmuajianisan-og.jpg  Default Open Graph image
app/pages/                 index, blog/[...slug], tags/, about, showcase
app/components/            PostCard, FeaturedPost, TagBadge, PostMeta, AppLogo
app/layouts/default.vue    Header (nav + theme toggle), footer, social links
app/composables/useBlog.ts Post querying + draft filtering + postPath()
app/utils/                 formatDate, tags, readingTime
content.config.ts          Content collection schema + normalization
server/routes/rss.xml.ts   RSS feed
nuxt.config.ts             Modules, site/SEO, Nitro Cloudflare preset, prerender
wrangler.jsonc             Cloudflare Workers deploy config
```

## License

This project is **dual-licensed**:

- **Code / template** — [MIT](./LICENSE) © Ariz Muajianisan. The website source
  (everything except the blog content below) is free to use, modify, and
  redistribute.
- **Blog content** — [CC BY-NC-ND 4.0](./LICENSE-CONTENT.md) © Ariz Muajianisan. The
  posts in `content/` and their images in `public/images/` may be shared with
  attribution, but **not** used commercially or modified/redistributed as derivatives.

You're welcome to use this as a template for your own blog under MIT. If you do,
replace the personal content — the posts in `content/`, the images in `public/`
(including `arizmuajianisan-og.jpg` and `favicon.svg`), the name/handles in the
layout and config, and `site.url` — with your own. The CC BY-NC-ND license covers my
writing, not the template you build on top of it.
