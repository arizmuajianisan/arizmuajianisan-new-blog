<script setup lang="ts">
const { data: posts } = await useBlogPosts()

const featured = computed(() => (posts.value ?? []).filter(p => p.featured))
const allPosts = computed(() => posts.value ?? [])

// Small helper so the hero elements share one coordinated slide-up + fade
// entrance, each nudged later than the last for a staggered reveal.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 550, delay, ease: 'easeOut' } }
})
</script>

<template>
  <div>
    <UContainer class="py-14 sm:py-20">
      <div class="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <!-- Identity column -->
        <div class="flex flex-col gap-6">
          <div
            v-motion
            v-bind="rise(0)"
            class="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1"
          >
            <span class="relative flex size-2">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary/70" />
              <span class="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span class="mono-label text-primary">Online · building</span>
          </div>

          <h1
            v-motion
            v-bind="rise(90)"
            class="text-4xl font-bold tracking-tight text-highlighted sm:text-5xl"
          >
            Hi, I'm Ariz<br class="hidden sm:block"> Muajianisan
          </h1>

          <p
            v-motion
            v-bind="rise(180)"
            class="max-w-xl text-lg text-muted"
          >
            Welcome to my corner of the web. I write about software development,
            self-hosting, DevOps, and the tools I rely on for my work — practical
            guides and notes from the things I build and break along the way.
          </p>

          <div
            v-motion
            v-bind="rise(270)"
            class="flex flex-wrap gap-3"
          >
            <UButton
              to="#posts"
              trailing-icon="i-lucide-arrow-down"
              size="lg"
            >
              Browse all posts
            </UButton>
            <UButton
              to="/about"
              icon="i-lucide-user"
              color="neutral"
              variant="subtle"
              size="lg"
            >
              About me
            </UButton>
          </div>
        </div>

        <!-- Terminal identity card -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 32, scale: 0.97 }"
          :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 600, delay: 220, ease: 'easeOut' } }"
          class="overflow-hidden rounded-xl border border-default bg-slate-950 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5"
        >
          <!-- title bar -->
          <div class="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <span class="size-3 rounded-full bg-[#ff5f57]" />
            <span class="size-3 rounded-full bg-[#febc2e]" />
            <span class="size-3 rounded-full bg-[#28c840]" />
            <span class="mono-label ml-2 text-slate-400">ariz@web — ~/identity</span>
          </div>

          <!-- terminal body -->
          <div class="space-y-3 p-5 font-mono text-sm leading-relaxed">
            <p>
              <span class="text-primary">➜</span>
              <span class="text-slate-500"> ~</span>
              <span class="text-slate-200"> whoami</span>
            </p>
            <p class="pl-4 text-slate-400">
              software developer · self-hoster · tinkerer
            </p>

            <p class="pt-2">
              <span class="text-primary">➜</span>
              <span class="text-slate-500"> ~</span>
              <span class="text-slate-200"> cat stack.txt</span>
            </p>
            <p class="flex flex-wrap gap-x-2 gap-y-1 pl-4 text-slate-300">
              <span class="text-primary/80">docker</span>
              <span class="text-slate-600">·</span>
              <span class="text-primary/80">traefik</span>
              <span class="text-slate-600">·</span>
              <span class="text-primary/80">cloudflare</span>
              <span class="text-slate-600">·</span>
              <span class="text-primary/80">linux</span>
              <span class="text-slate-600">·</span>
              <span class="text-primary/80">devops</span>
            </p>

            <p class="pt-2">
              <span class="text-primary">➜</span>
              <span class="text-slate-500"> ~</span>
              <span class="text-slate-200"> uptime</span>
            </p>
            <p class="pl-4 text-slate-400">
              building &amp; breaking things, daily
              <span class="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary/80" />
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <UPageSection
      v-if="featured.length"
      title="Featured"
      description="Posts worth starting with."
    >
      <div class="grid gap-6 sm:grid-cols-2">
        <!-- v-motion lives on a wrapper div, never on the card's own <a> root:
             the directive mutates the element's style during hydration, which
             leaves a NuxtLink root un-clickable until a client-side re-render. -->
        <div
          v-for="(post, i) in featured"
          :key="post.path"
          v-motion
          :initial="{ opacity: 0, y: 28 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: i * 80, ease: 'easeOut' } }"
        >
          <FeaturedPost :post="post" />
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="posts"
      title="All posts"
      description="Everything I've written, newest first."
    >
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(post, i) in allPosts"
          :key="post.path"
          v-motion
          :initial="{ opacity: 0, y: 28 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: (i % 3) * 80, ease: 'easeOut' } }"
        >
          <PostCard :post="post" />
        </div>
      </div>
    </UPageSection>
  </div>
</template>
