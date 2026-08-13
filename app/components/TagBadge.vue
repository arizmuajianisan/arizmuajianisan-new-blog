<script setup lang="ts">
const props = defineProps<{
  tag: string
  count?: number
}>()

const route = useRoute()

const label = computed(() => tagLabel(props.tag))
const slug = computed(() => tagSlug(props.tag))
const to = computed(() => `/posts?tag=${slug.value}`)

// A tag is "active" when we're on the posts hub with this tag selected — give
// it the emerald brand fill so the current filter is unmistakable.
const isActive = computed(() =>
  route.path === '/posts' && route.query.tag === slug.value
)
</script>

<template>
  <UButton
    :to="to"
    :color="isActive ? 'primary' : 'neutral'"
    :variant="isActive ? 'solid' : 'subtle'"
    size="sm"
    icon="i-lucide-hash"
    class="transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm hover:shadow-primary/20"
  >
    {{ label }}
    <template
      v-if="count !== undefined"
      #trailing
    >
      <UBadge
        color="neutral"
        variant="solid"
        size="sm"
      >
        {{ count }}
      </UBadge>
    </template>
  </UButton>
</template>
