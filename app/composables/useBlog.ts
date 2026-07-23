import type { Collections } from '@nuxt/content'

export type BlogPost = Collections['blog']

/**
 * Route path for a post. We use @nuxt/content's native path
 * (e.g. /blog/2025/fix-grub-error) as the single canonical URL so there is no
 * duplicate-content collision between a flat and a year-scoped form.
 */
export function postPath(post: Pick<BlogPost, 'path' | 'stem'>): string {
  // @nuxt/content's native path (e.g. /blog/2025/fix-grub-error) is the single
  // canonical route. Fall back to the stem defensively in case path is missing.
  return post.path ?? `/${post.stem}`
}

/**
 * Fetch all blog posts ordered newest-first. Drafts are excluded in production
 * but kept visible during `nuxt dev` for previewing.
 */
export async function useBlogPosts() {
  return await useAsyncData('blog-posts', () => {
    const query = queryCollection('blog').order('pubDatetime', 'DESC')
    if (!import.meta.dev) {
      query.where('draft', '<>', true)
    }
    return query.all()
  })
}
