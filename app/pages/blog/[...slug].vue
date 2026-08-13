<script setup lang="ts">
const route = useRoute()
const site = useSiteConfig()

// Content paths are stored without a trailing slash, but Cloudflare's canonical
// URL for a post carries one (the no-slash URL 301/307-redirects to it). Strip
// any trailing slash so the query matches the same document on both the server
// and the client — otherwise a direct hit on the trailing-slash URL queries
// with the slash, finds nothing, and the page renders blank after hydration.
const contentPath = route.path.replace(/\/+$/, '') || '/'

const { data: post } = await useAsyncData(`post-${contentPath}`, () => {
  return queryCollection('blog')
    .path(contentPath)
    .first()
})

if (!post.value || (!import.meta.dev && post.value.draft)) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

// Build prev/next from the draft-filtered, date-ordered post list (newest first)
// so navigation never links to drafts and follows publication order.
const { data: posts } = await useBlogPosts()
const currentIndex = computed(() =>
  (posts.value ?? []).findIndex(p => p.path === post.value?.path)
)
const newerPost = computed(() => {
  const i = currentIndex.value
  return i > 0 ? posts.value![i - 1] : null
})
const olderPost = computed(() => {
  const list = posts.value ?? []
  const i = currentIndex.value
  return i >= 0 && i < list.length - 1 ? list[i + 1] : null
})

const ogImage = computed(() => post.value?.ogImage || '/arizmuajianisan-og.jpg')
const canonicalUrl = computed(() => `${site.url}${postPath(post.value!)}`)

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  ogImage: () => ogImage.value,
  ogType: 'article',
  articlePublishedTime: () => post.value?.pubDatetime
    ? new Date(post.value.pubDatetime).toISOString()
    : undefined,
  articleTag: () => post.value?.tags
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

if (post.value) {
  useSchemaOrg([
    defineArticle({
      headline: post.value.title,
      description: post.value.description,
      image: ogImage.value,
      datePublished: new Date(post.value.pubDatetime).toISOString(),
      author: { name: post.value.author }
    })
  ])
}
</script>

<template>
  <UContainer
    v-if="post"
    class="py-12"
  >
    <div class="mx-auto max-w-2xl">
      <UButton
        to="/"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="link"
        class="-ml-2 mb-6"
      >
        Back to posts
      </UButton>

      <article
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"
        class="rounded-2xl border border-default bg-elevated/40 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm sm:p-10 dark:ring-white/5"
      >
        <header class="mb-8 flex flex-col gap-4">
          <span class="mono-label text-primary">// article</span>

          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            {{ post.title }}
          </h1>

          <p class="text-lg text-muted">
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
        </header>

        <USeparator class="mb-8" />

        <div class="prose dark:prose-invert max-w-none text-[1.0625rem] sm:text-lg">
          <ContentRenderer :value="post" />
        </div>
      </article>

      <USeparator class="my-10" />

      <nav
        v-if="newerPost || olderPost"
        class="grid gap-4 sm:grid-cols-2"
      >
        <UPageCard
          v-bind="newerPost ? { to: postPath(newerPost) } : {}"
          :class="!newerPost && 'invisible'"
        >
          <span class="text-xs text-muted">Newer post</span>
          <p class="font-medium text-highlighted">
            {{ newerPost?.title }}
          </p>
        </UPageCard>

        <UPageCard
          v-bind="olderPost ? { to: postPath(olderPost) } : {}"
          :class="!olderPost && 'invisible'"
        >
          <span class="text-xs text-muted">Older post</span>
          <p class="font-medium text-highlighted">
            {{ olderPost?.title }}
          </p>
        </UPageCard>
      </nav>
    </div>
  </UContainer>
</template>
