import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        author: z.string().transform(s => s.trim()),
        // Accept both full ISO8601 (2024-12-23T03:42:51Z) and date-only (2026-04-21)
        pubDatetime: z.coerce.date(),
        description: z.string(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        // Normalize tags: trim + lowercase + dedupe (source casing is inconsistent)
        tags: z.array(z.string())
          .default([])
          .transform(arr => [...new Set(arr.map(t => t.trim().toLowerCase()))]),
        ogImage: z.string().optional()
      })
    }),
    showcase: defineCollection({
      type: 'page',
      source: 'showcase/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        // Tech stack shown as badges on the card and detail page
        tech: z.array(z.string()).default([]),
        // Live/demo URL — leave empty for private client projects
        url: z.string().optional(),
        // Optional source repository
        repo: z.string().optional(),
        // Optional cover image for the card, e.g. /images/showcase/project.png
        image: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        // Manual ordering on the showcase page (lower = first).
        // Named "weight" rather than "order" — the latter collides with the SQL
        // ORDER keyword in @nuxt/content's query layer.
        weight: z.number().default(0)
      })
    })
  }
})
