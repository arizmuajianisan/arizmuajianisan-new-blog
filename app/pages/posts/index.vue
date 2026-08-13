<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { data: posts } = await useBlogPosts()

// Live text query is local UI state; the selected tag lives in the URL (?tag=slug)
// so filters are deep-linkable and TagBadge can detect its own active state.
const search = ref('')
const activeTag = computed(() =>
  route.query.tag ? String(route.query.tag) : null
)

// All tags with post counts, most-used first (then alphabetical) — the same
// shape the old /tags cloud used, now driving the inline filter row.
//
// Tags are keyed by their normalized (lowercased) form so casing variants in
// frontmatter (e.g. "Docker" vs "docker") collapse into a single chip. The
// content schema is meant to lowercase tags, but @nuxt/content v3 does not
// apply that array transform to stored data, so we normalize here defensively.
const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts.value ?? []) {
    for (const tag of post.tags ?? []) {
      const key = tag.trim().toLowerCase()
      if (!key) continue
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
})

const filtered = computed(() => {
  let list = posts.value ?? []

  if (activeTag.value) {
    list = list.filter(post =>
      (post.tags ?? []).some(tag => tagSlug(tag) === activeTag.value)
    )
  }

  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(post =>
      post.title.toLowerCase().includes(q)
      || post.description.toLowerCase().includes(q)
      || (post.tags ?? []).some(tag => tag.includes(q))
    )
  }

  return list
})

const hasFilters = computed(() => !!activeTag.value || !!search.value.trim())

// Reset text search and drop the ?tag query while staying on /posts.
function clearFilters() {
  search.value = ''
  router.replace({ query: {} })
}

useSeoMeta({
  title: 'Posts',
  description: 'Browse and search every post — filter by tag or search by keyword.'
})
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader
      title="Posts"
      description="Everything I've written. Filter by tag or search by keyword."
    />

    <!-- Filter bar: search + tag chips sit above the grid -->
    <div class="mt-8 flex flex-col gap-5">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        size="lg"
        placeholder="Search posts…"
        :ui="{ root: 'w-full sm:max-w-md' }"
        autocomplete="off"
      >
        <template
          v-if="search"
          #trailing
        >
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            aria-label="Clear search"
            @click="search = ''"
          />
        </template>
      </UInput>

      <div class="flex flex-wrap items-center gap-1.5">
        <UButton
          to="/posts"
          :color="activeTag ? 'neutral' : 'primary'"
          :variant="activeTag ? 'subtle' : 'solid'"
          size="sm"
          icon="i-lucide-layers"
          class="transition-all duration-200 ease-out hover:scale-105"
        >
          All
        </UButton>
        <TagBadge
          v-for="item in tags"
          :key="item.tag"
          :tag="item.tag"
          :count="item.count"
        />
      </div>

      <p class="mono-label text-muted">
        {{ filtered.length }} {{ filtered.length === 1 ? 'post' : 'posts' }}
        <span v-if="hasFilters"> · filtered</span>
      </p>
    </div>

    <USeparator class="my-8" />

    <div
      v-if="filtered.length"
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="(post, i) in filtered"
        :key="post.path"
        v-motion
        :initial="{ opacity: 0, y: 28 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: (i % 3) * 80, ease: 'easeOut' } }"
      >
        <PostCard :post="post" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-default py-16 text-center"
    >
      <UIcon
        name="i-lucide-search-x"
        class="size-8 text-muted"
      />
      <p class="text-muted">
        No posts match your filters.
      </p>
      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-rotate-ccw"
        @click="clearFilters"
      >
        Clear filters
      </UButton>
    </div>
  </UContainer>
</template>
