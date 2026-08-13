// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@vueuse/motion/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://arizmuajianisan.com',
    name: 'Ariz Muajianisan',
    description: 'Personal blog of Ariz Muajianisan — notes on software, self-hosting, DevOps, and the tools I use for my work.'
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          }
        }
      }
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  // Resolve icons entirely from the locally-installed @iconify-json packages so the
  // build/prerender never depends on api.iconify.design (also silences dev warnings).
  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons']
    },
    clientBundle: {
      scan: true
    },
    fallbackToApi: false
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'cloudflare_module',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about', '/showcase', '/tags', '/rss.xml', '/sitemap.xml'],
      failOnError: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Static OG images only (default + per-post frontmatter). Runtime OG generation
  // does not run on Cloudflare Workers, so it is disabled.
  ogImage: {
    enabled: false
  }
})
