import type { Collections } from '@nuxt/content'

export type ShowcaseProject = Collections['showcase']

/** Route path for a project (e.g. /showcase/project-one). */
export function projectPath(project: Pick<ShowcaseProject, 'path' | 'stem'>): string {
  return project.path ?? `/${project.stem}`
}

/**
 * Fetch all showcase projects ordered by their `weight` field (ascending).
 * Drafts are excluded in production but visible during `nuxt dev`.
 */
export async function useShowcaseProjects() {
  return await useAsyncData('showcase-projects', () => {
    const query = queryCollection('showcase').order('weight', 'ASC')
    if (!import.meta.dev) {
      query.where('draft', '<>', true)
    }
    return query.all()
  })
}
