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
  <UContainer
    v-if="project"
    class="py-12"
  >
    <div class="mx-auto max-w-2xl">
      <UButton
        to="/showcase"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="link"
        class="-ml-2 mb-6"
      >
        Back to showcase
      </UButton>

      <article
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"
        class="rounded-2xl border border-default bg-elevated/40 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-10 dark:ring-white/5"
      >
        <header class="mb-8 flex flex-col gap-4">
          <span class="mono-label text-primary">// project</span>

          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            {{ project.title }}
          </h1>

          <p class="text-lg text-muted">
            {{ project.description }}
          </p>

          <div
            v-if="project.tech?.length"
            class="flex flex-wrap gap-1.5"
          >
            <UBadge
              v-for="item in project.tech"
              :key="item"
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ item }}
            </UBadge>
          </div>

          <div
            v-if="project.url || project.repo"
            class="flex flex-wrap gap-2"
          >
            <UButton
              v-if="project.url"
              :to="project.url"
              external
              target="_blank"
              icon="i-lucide-external-link"
              color="primary"
              variant="solid"
              size="sm"
            >
              Visit project
            </UButton>
            <UButton
              v-if="project.repo"
              :to="project.repo"
              external
              target="_blank"
              icon="i-simple-icons-github"
              color="neutral"
              variant="subtle"
              size="sm"
            >
              Source
            </UButton>
          </div>
        </header>

        <USeparator class="mb-8" />

        <div class="prose dark:prose-invert max-w-none text-[1.0625rem] sm:text-lg">
          <ContentRenderer :value="project" />
        </div>
      </article>
    </div>
  </UContainer>
</template>
