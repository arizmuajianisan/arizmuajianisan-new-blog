<script setup lang="ts">
const site = useSiteConfig()

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})

useSeoMeta({
  titleTemplate: title => title ? `${title} · ${site.name}` : site.name,
  ogSiteName: site.name,
  ogImage: '/arizmuajianisan-og.jpg',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
