<script setup lang="ts">
const props = defineProps<{
  tag: string
  count?: number
}>()

const label = computed(() => tagLabel(props.tag))
const to = computed(() => `/tags/${tagSlug(props.tag)}`)
</script>

<template>
  <UButton
    :to="to"
    color="neutral"
    variant="subtle"
    size="sm"
    icon="i-lucide-hash"
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
