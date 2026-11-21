<script setup lang="ts">
const route = useRoute()
const site = useSiteConfig()

// Content paths are stored without a trailing slash, but Cloudflare's canonical
// URL carries one (the no-slash URL redirects to it). Strip any trailing slash
// so the query matches the same document on both the server and the client —
// otherwise a direct hit on the trailing-slash URL finds nothing and the page
// renders blank after hydration.
const contentPath = route.path.replace(/\/+$/, '') || '/'

const { data: project } = await useAsyncData(`project-${contentPath}`, () => {
  return queryCollection('showcase')
    .path(contentPath)
    .first()
})

if (!project.value || (!import.meta.dev && project.value.draft)) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const ogImage = computed(() => project.value?.image || '/arizmuajianisan-og.jpg')
const canonicalUrl = computed(() => `${site.url}${projectPath(project.value!)}`)

useSeoMeta({
  title: () => project.value?.title,
  description: () => project.value?.description,
  ogTitle: () => project.value?.title,
  ogDescription: () => project.value?.description,
  ogImage: () => ogImage.value
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})
</script>

<template>
  <ArticleShell
    v-if="project"
    :item="project"
    back-to="/showcase"
    back-label="Back to showcase"
    eyebrow="// project"
  >
    <template #meta="{ item }">
      <div
        v-if="item.tech?.length"
        class="flex flex-wrap gap-1.5"
      >
        <UBadge
          v-for="tech in item.tech"
          :key="tech"
          color="neutral"
          variant="subtle"
          size="sm"
        >
          {{ tech }}
        </UBadge>
      </div>

      <div
        v-if="item.url || item.repo"
        class="flex flex-wrap gap-2"
      >
        <UButton
          v-if="item.url"
          :to="item.url"
          external
          target="_blank"
          rel="noopener"
          icon="i-lucide-external-link"
          color="primary"
          variant="solid"
          size="sm"
        >
          Visit project
        </UButton>
        <UButton
          v-if="item.repo"
          :to="item.repo"
          external
          target="_blank"
          rel="noopener"
          icon="i-simple-icons-github"
          color="neutral"
          variant="subtle"
          size="sm"
        >
          Source
        </UButton>
      </div>
    </template>

    <template #default="{ item }">
      <ContentRenderer :value="item" />
    </template>
  </ArticleShell>
</template>
