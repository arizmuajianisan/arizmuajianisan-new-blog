export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'zinc'
    },
    // Open up line spacing on body copy for comfortable long-form reading.
    // leading-[1.75] is unitless, so it scales with the font size set on the
    // prose container (see app/pages/blog/[...slug].vue).
    prose: {
      p: {
        base: 'leading-[1.75]'
      },
      li: {
        base: 'leading-[1.75]'
      }
    }
  }
})
