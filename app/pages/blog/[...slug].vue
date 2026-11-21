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
  <ArticleShell
    v-if="post"
    :item="post"
    back-to="/posts"
    back-label="Back to posts"
    eyebrow="// article"
  >
    <template #meta="{ item }">
      <PostMeta
        :date="item.pubDatetime"
        :author="item.author"
      />

      <div
        v-if="item.tags?.length"
        class="flex flex-wrap gap-1.5"
      >
        <TagBadge
          v-for="tag in item.tags"
          :key="tag"
          :tag="tag"
        />
      </div>
    </template>

    <template #default="{ item }">
      <ContentRenderer :value="item" />
    </template>

    <template #after>
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
    </template>
  </ArticleShell>
</template>
