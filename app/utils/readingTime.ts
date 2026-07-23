/**
 * Estimate reading time in minutes from a word count, assuming ~200 wpm.
 */
export function readingTime(words: number): number {
  return Math.max(1, Math.round(words / 200))
}
