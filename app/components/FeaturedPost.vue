<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

const props = defineProps<{
  post: BlogPost
}>()

const to = computed(() => postPath(props.post))
</script>

<template>
  <UPageCard
    :to="to"
    variant="subtle"
    spotlight
    class="group h-full transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
  >
    <div class="flex flex-col gap-4">
      <UBadge
        color="primary"
        variant="subtle"
        size="sm"
        icon="i-lucide-star"
        class="self-start"
      >
        Featured
      </UBadge>

      <h3 class="text-xl sm:text-2xl font-semibold text-highlighted group-hover:text-primary transition-colors">
        {{ post.title }}
      </h3>

      <p class="text-muted line-clamp-3">
        {{ post.description }}
      </p>

      <PostMeta
        :date="post.pubDatetime"
        :author="post.author"
      />

      <div
        v-if="post.tags?.length"
        class="flex flex-wrap gap-1.5"
      >
        <TagBadge
          v-for="tag in post.tags"
          :key="tag"
          :tag="tag"
        />
      </div>
    </div>
  </UPageCard>
</template>
