<script setup lang="ts">
const { data: posts } = await useBlogPosts()

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts.value ?? []) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
})

useSeoMeta({
  title: 'Tags',
  description: 'Browse all blog posts by category and tag.'
})
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader
      title="Tags"
      description="Browse posts by category."
    />

    <div class="mt-8 flex flex-wrap gap-2">
      <TagBadge
        v-for="item in tags"
        :key="item.tag"
        :tag="item.tag"
        :count="item.count"
      />
    </div>
  </UContainer>
</template>
