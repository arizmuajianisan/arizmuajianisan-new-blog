<script setup lang="ts" generic="T extends { title: string, description?: string }">
/**
 * Shared layout for long-form detail pages (blog posts, showcase projects).
 * Owns the page width, back link, article card, header and prose styling so
 * every detail page stays visually consistent. Edit widths/typography here.
 *
 * The content item is passed back to every slot as a non-null `item`, so
 * pages keep full typing inside slots (v-if narrowing doesn't reach them).
 */
defineProps<{
  item: T
  backTo: string
  backLabel: string
  eyebrow: string
}>()

defineSlots<{
  default: (props: { item: T }) => unknown
  meta?: (props: { item: T }) => unknown
  after?: (props: { item: T }) => unknown
}>()
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-4xl">
      <UButton
        :to="backTo"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="link"
        class="-ml-2 mb-6"
      >
        {{ backLabel }}
      </UButton>

      <article
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"
        class="rounded-2xl border border-default bg-elevated/40 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-10 dark:ring-white/5"
      >
        <header class="mb-8 flex flex-col gap-4">
          <span class="mono-label text-primary">{{ eyebrow }}</span>

          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            {{ item.title }}
          </h1>

          <p
            v-if="item.description"
            class="text-lg text-muted"
          >
            {{ item.description }}
          </p>

          <slot
            name="meta"
            :item="item"
          />
        </header>

        <USeparator class="mb-8" />

        <div class="prose dark:prose-invert max-w-none text-[1.0625rem] sm:text-lg">
          <slot :item="item" />
        </div>
      </article>

      <slot
        name="after"
        :item="item"
      />
    </div>
  </UContainer>
</template>
