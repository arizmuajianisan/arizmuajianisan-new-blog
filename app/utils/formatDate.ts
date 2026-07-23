/**
 * Format a post date (accepts Date, ISO8601 string, or date-only string)
 * into a readable label like "9 December 2025".
 */
export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
