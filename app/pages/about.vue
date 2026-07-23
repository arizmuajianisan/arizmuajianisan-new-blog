<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'About Ariz Muajianisan — software developer and writer.'
})
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader
      title="About"
      description="A little bit about me."
    />

    <div class="prose dark:prose-invert max-w-none mt-8">
      <!-- TODO: Replace this placeholder with real bio content. -->
      <p>
        Hi, I'm <strong>Ariz Muajianisan</strong>. I'm a software developer who enjoys
        building things, self-hosting, and writing about what I learn along the way.
      </p>
      <p>
        This page is a placeholder — a fuller introduction is on the way. In the
        meantime, take a look at <NuxtLink to="/">my posts</NuxtLink> or my
        <NuxtLink to="/showcase">showcase</NuxtLink>.
      </p>

      <h2>Get in touch</h2>
      <p>
        You can find me on
        <a
          href="https://github.com/arizmuajianisan"
          target="_blank"
          rel="noopener"
        >GitHub</a>
        and <a
          href="https://x.com/arizmuajianisan"
          target="_blank"
          rel="noopener"
        >X</a>.
      </p>
    </div>
  </UContainer>
</template>
