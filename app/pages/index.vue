<script setup lang="ts">
const { data: posts } = await useBlogPosts()

const featured = computed(() => (posts.value ?? []).filter(p => p.featured))
const allPosts = computed(() => posts.value ?? [])
</script>

<template>
  <div>
    <UPageHero
      title="Hi, I'm Ariz Muajianisan"
      description="Welcome to my corner of the web. I write about software development, self-hosting, DevOps, and the tools I rely on for my work. Here you'll find practical guides and notes from things I build and break along the way."
      :links="[{
        label: 'Browse all posts',
        to: '#posts',
        trailingIcon: 'i-lucide-arrow-down',
        size: 'lg'
      }, {
        label: 'About me',
        to: '/about',
        icon: 'i-lucide-user',
        color: 'neutral',
        variant: 'subtle',
        size: 'lg'
      }]"
    />

    <UPageSection
      v-if="featured.length"
      title="Featured"
      description="Posts worth starting with."
    >
      <div class="grid gap-6 sm:grid-cols-2">
        <FeaturedPost
          v-for="post in featured"
          :key="post.path"
          :post="post"
        />
      </div>
    </UPageSection>

    <UPageSection
      id="posts"
      title="All posts"
      description="Everything I've written, newest first."
    >
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard
          v-for="post in allPosts"
          :key="post.path"
          :post="post"
        />
      </div>
    </UPageSection>
  </div>
</template>
