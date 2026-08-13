<script setup lang="ts">
const navLinks = [
  { label: 'Home', to: '/', icon: 'i-lucide-home' },
  { label: 'Posts', to: '/posts', icon: 'i-lucide-newspaper' },
  { label: 'Showcase', to: '/showcase', icon: 'i-lucide-layout-grid' },
  { label: 'About', to: '/about', icon: 'i-lucide-user' }
]

const socialLinks = [
  { icon: 'i-simple-icons-github', to: 'https://github.com/arizmuajianisan', label: 'GitHub', external: true },
  { icon: 'i-simple-icons-x', to: 'https://x.com/arizmuajianisan', label: 'X', external: true },
  // /rss.xml is a Nitro server route (not a Vue page), so mark it external to
  // render a plain <a> and avoid a Vue Router "no match" warning.
  { icon: 'i-lucide-rss', to: '/rss.xml', label: 'RSS feed', external: true }
]

const year = new Date().getFullYear()
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center"
        >
          <AppLogo />
        </NuxtLink>
      </template>

      <UNavigationMenu
        :items="navLinks"
        :highlight="false"
      />

      <template #right>
        <div class="flex items-center gap-1.5">
          <UColorModeButton />
          <UButton
            v-for="link in socialLinks"
            :key="link.to"
            :to="link.to"
            :icon="link.icon"
            :aria-label="link.label"
            :external="link.external"
            :target="link.to.startsWith('http') ? '_blank' : undefined"
            color="neutral"
            variant="ghost"
          />
        </div>
      </template>

      <template #body>
        <UNavigationMenu
          :items="navLinks"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ year }} Ariz Muajianisan
        </p>
      </template>

      <template #right>
        <div class="flex items-center gap-1.5">
          <UButton
            v-for="link in socialLinks"
            :key="link.to"
            :to="link.to"
            :icon="link.icon"
            :aria-label="link.label"
            :external="link.external"
            :target="link.to.startsWith('http') ? '_blank' : undefined"
            color="neutral"
            variant="ghost"
          />
        </div>
      </template>
    </UFooter>
  </div>
</template>
