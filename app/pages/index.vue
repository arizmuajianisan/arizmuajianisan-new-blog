<script setup lang="ts">
const { data: posts } = await useBlogPosts()

const featured = computed(() => (posts.value ?? []).filter(p => p.featured))

// Small helper so the hero elements share one coordinated slide-up + fade
// entrance, each nudged later than the last for a staggered reveal.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 550, delay, ease: 'easeOut' } }
})

// What I do — a few core areas of focus, kept short and editable.
const skills = [
  { icon: 'i-lucide-code-2', title: 'Software Development', description: 'Building web apps and tools end to end.' },
  { icon: 'i-lucide-server', title: 'Self-Hosting', description: 'Running my own services on my own metal.' },
  { icon: 'i-lucide-git-branch', title: 'DevOps / CI-CD', description: 'Automating builds, tests, and deploys.' },
  { icon: 'i-lucide-container', title: 'Containerization', description: 'Docker-first, reproducible environments.' },
  { icon: 'i-lucide-network', title: 'Networking', description: 'Reverse proxies, tunnels, and secure routing.' },
  { icon: 'i-lucide-terminal', title: 'Linux Administration', description: 'Comfortable living in the shell.' }
]

// Tools I reach for, grouped by layer of the stack.
const stack = [
  { group: 'Infrastructure', items: ['Docker', 'Traefik', 'Cloudflare', 'Linux'] },
  { group: 'Development', items: ['TypeScript', 'Nuxt', 'Vue', 'Node'] },
  { group: 'Tooling', items: ['Git', 'GitHub Actions'] }
]
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
              to="/posts"
              trailing-icon="i-lucide-arrow-right"
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
      title="What I do"
      description="The areas I work in and enjoy writing about."
    >
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(skill, i) in skills"
          :key="skill.title"
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 450, delay: (i % 3) * 80, ease: 'easeOut' } }"
          class="group flex flex-col gap-3 rounded-xl border border-default bg-elevated/40 p-5 ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:ring-white/5"
        >
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            <UIcon
              :name="skill.icon"
              class="size-5"
            />
          </div>
          <h3 class="font-semibold text-highlighted">
            {{ skill.title }}
          </h3>
          <p class="text-sm text-muted">
            {{ skill.description }}
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Tech stack"
      description="The tools I reach for, day to day."
    >
      <div class="flex flex-col gap-8">
        <div
          v-for="(layer, i) in stack"
          :key="layer.group"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 450, delay: i * 90, ease: 'easeOut' } }"
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
        >
          <span class="mono-label text-primary sm:w-40 sm:shrink-0">// {{ layer.group }}</span>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="item in layer.items"
              :key="item"
              color="neutral"
              variant="subtle"
              size="lg"
              class="font-mono"
            >
              {{ item }}
            </UBadge>
          </div>
        </div>
      </div>
    </UPageSection>

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

    <UContainer class="pb-20 sm:pb-24">
      <div class="flex justify-center">
        <UButton
          to="/posts"
          trailing-icon="i-lucide-arrow-right"
          size="lg"
          variant="subtle"
        >
          Read all posts
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
