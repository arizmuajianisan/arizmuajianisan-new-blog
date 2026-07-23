<script setup lang="ts">
const route = useRoute()
const tagParam = computed(() => String(route.params.tag))

const { data: posts } = await useBlogPosts()

const matching = computed(() =>
  (posts.value ?? []).filter(post =>
    (post.tags ?? []).some(tag => tagSlug(tag) === tagParam.value)
  )
)

const label = computed(() => tagLabel(tagParam.value))

if (import.meta.server && matching.value.length === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Tag not found', fatal: true })
}

useSeoMeta({
  title: () => `Posts tagged "${label.value}"`,
  description: () => `All blog posts tagged ${label.value}.`
})
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader
      :title="label"
      :description="`${matching.length} post${matching.length === 1 ? '' : 's'} tagged with this topic.`"
    >
      <template #links>
        <UButton
          to="/tags"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="subtle"
        >
          All tags
        </UButton>
      </template>
    </UPageHeader>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PostCard
        v-for="post in matching"
        :key="post.path"
        :post="post"
      />
    </div>
  </UContainer>
</template>
