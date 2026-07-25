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
    :title="post.title"
    :description="post.description"
    spotlight
    class="group h-full transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
  >
    <template #footer>
      <div class="flex flex-col gap-3 w-full">
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
    </template>
  </UPageCard>
</template>
