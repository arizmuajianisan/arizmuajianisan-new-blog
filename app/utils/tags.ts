/**
 * Convert a tag into a URL-safe slug. Tags are already normalized to lowercase
 * in the content schema, so this only needs to handle spaces and stray chars.
 */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Convert a normalized (lowercase) tag into a display label, e.g.
 * "self-hosted" -> "Self Hosted".
 */
export function tagLabel(tag: string): string {
  return tag
    .split(/[-\s]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
