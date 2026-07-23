<script setup lang="ts">
const props = defineProps<{
  date: Date | string
  author?: string
  readingMinutes?: number
}>()

const formatted = computed(() => formatDate(props.date))
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
    <span class="inline-flex items-center gap-1">
      <UIcon name="i-lucide-calendar" />
      <time>{{ formatted }}</time>
    </span>
    <span
      v-if="author"
      class="inline-flex items-center gap-1"
    >
      <UIcon name="i-lucide-user" />
      {{ author }}
    </span>
    <span
      v-if="readingMinutes"
      class="inline-flex items-center gap-1"
    >
      <UIcon name="i-lucide-clock" />
      {{ readingMinutes }} min read
    </span>
  </div>
</template>
