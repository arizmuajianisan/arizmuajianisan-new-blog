<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'Ariz Muajianisan is a lead tech at a Japanese manufacturer — IT manager for infrastructure and support, hardware development, and an IoT initiative — and he still writes the code.'
})

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 550, delay, ease: 'easeOut' } }
})

const roles = [
  { label: 'Lead Tech', value: 'The main role. I lead the technology and the digitalization.' },
  { label: 'IT Manager', value: 'Infrastructure and IT support.' },
  { label: 'Hardware', value: 'I lead the hardware development.' },
  { label: 'IoT', value: 'An initiative I started for the line, now used across the group.' }
]

const work = [
  {
    icon: 'i-lucide-code-2',
    title: 'Lead Tech',
    paragraphs: [
      'This is the main role. At a Japanese manufacturing company I lead the technology and the digitalization. I have been at it for more than eleven years. The seat is management, and I still look into the code. I like researching what is new, and checking whether it is actually useful.',
      'After about two years of leading the development team, I could see a problem we had made ourselves. The apps were separate. People had to remember a URL for each one, and a login for each one. So I designed a superapp: sign in once, and the rest of the system is inside. What I was building was an ERP.',
      'I also set a golden rule for the developers. One tech stack, chosen and kept, so the next person can continue the work.'
    ]
  },
  {
    icon: 'i-lucide-server',
    title: 'IT Manager, infrastructure and IT support',
    paragraphs: [
      'I manage the infrastructure and the IT support around it.',
      'Our engineers used to deploy by hand, straight onto the server. There was no CI/CD. A single change could break another application. I introduced Docker and Jenkins, limited access to the server, and developed one of the engineers into a DevOps role.',
      'For monitoring I introduced Zabbix, on the endpoints and the servers, so we hear about a problem before the floor has to report it.'
    ]
  },
  {
    icon: 'i-lucide-cpu',
    title: 'Hardware development',
    paragraphs: [
      'I also lead the hardware development. The devices on the line are part of the same job as the software and the servers.'
    ]
  },
  {
    icon: 'i-lucide-radio',
    title: 'The IoT initiative',
    paragraphs: [
      'The initiative I started is a controller for the jigs, built on an ESP32. It does the job of a PLC, cheaper, and with room to go further. The feature I care about most is the over-the-air update. Devices already in the plant, and devices already overseas, can take new firmware without a visit. The group company adopted it.'
    ]
  }
]
</script>

<template>
  <div>
    <UContainer class="py-14 sm:py-20">
      <div class="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p
            v-motion
            v-bind="rise(0)"
            class="mono-label text-primary"
          >
            About
          </p>
          <h1
            v-motion
            v-bind="rise(80)"
            class="mt-4 max-w-xl text-4xl font-bold tracking-tight text-highlighted sm:text-5xl"
          >
            Lead Tech at a Japanese manufacturer.
          </h1>
          <div
            v-motion
            v-bind="rise(160)"
            class="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted"
          >
            <p>
              I lead the technology and the digitalization. More than eleven years of it. I am in a management seat, and I still write code, review it, and research what will make the work better.
            </p>
            <p>
              The job sits in four parts. Lead tech is the main one. Under that I am IT Manager for infrastructure and IT support, I lead the hardware development, and I started the IoT initiative on the line.
            </p>
          </div>
        </div>

        <aside
          v-motion
          :initial="{ opacity: 0, y: 28 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: 'easeOut' } }"
          class="rounded-2xl border border-default bg-elevated/50 p-6 ring-1 ring-black/5 sm:p-8 dark:ring-white/5"
        >
          <p class="mono-label text-muted">
            The roles
          </p>
          <ol class="mt-6 space-y-6">
            <li
              v-for="(role, i) in roles"
              :key="role.label"
              class="flex gap-4"
            >
              <span class="mono-label mt-0.5 text-primary">
                {{ i + 1 }}
              </span>
              <div>
                <p class="font-semibold text-highlighted">
                  {{ role.label }}
                </p>
                <p class="mt-1 text-sm leading-relaxed text-muted">
                  {{ role.value }}
                </p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </UContainer>

    <UContainer class="pb-6">
      <h2 class="text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl">
        My work
      </h2>
      <p class="mt-3 max-w-2xl text-muted">
        The same list, with the story behind each one.
      </p>

      <ol class="mt-12">
        <li
          v-for="(item, i) in work"
          :key="item.title"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 450, delay: 40, ease: 'easeOut' } }"
          class="grid grid-cols-[2.75rem_1fr] gap-x-4 sm:gap-x-6"
        >
          <div class="flex flex-col items-center">
            <div class="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <UIcon
                :name="item.icon"
                class="size-5"
                aria-hidden="true"
              />
            </div>
            <div
              v-if="i < work.length - 1"
              class="my-2 w-px flex-1 bg-default"
              aria-hidden="true"
            />
          </div>
          <div :class="i < work.length - 1 ? 'pb-12' : 'pb-4'">
            <h3 class="text-xl font-semibold text-highlighted">
              {{ item.title }}
            </h3>
            <div class="mt-3 max-w-2xl space-y-4 leading-relaxed text-muted">
              <p
                v-for="(paragraph, p) in item.paragraphs"
                :key="p"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </li>
      </ol>
    </UContainer>

    <UContainer class="py-10 sm:py-14">
      <figure class="max-w-3xl rounded-2xl border border-default bg-slate-950 px-6 py-8 text-slate-100 shadow-2xl shadow-slate-950/20 ring-1 ring-white/5 sm:px-10 sm:py-12">
        <UIcon
          name="i-lucide-quote"
          class="size-6 text-primary"
          aria-hidden="true"
        />
        <blockquote class="mt-5 text-xl font-medium leading-snug tracking-tight sm:text-2xl">
          I see AI like a car. The driver needs the skill. Without that skill, the car will not work properly, and you can crash. Using AI is the same.
        </blockquote>
        <figcaption class="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400">
          That is why I still write code, review the code, and do the research. I want to use it well, and I want the work to get better.
        </figcaption>
      </figure>
    </UContainer>

    <UContainer class="pb-20 sm:pb-24">
      <div class="flex max-w-3xl flex-col justify-between gap-6 rounded-2xl border border-default bg-elevated/40 p-6 ring-1 ring-black/5 sm:p-8 dark:ring-white/5">
        <div>
          <p class="mono-label text-primary">
            Studio
          </p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight text-highlighted">
            Teras Labs
          </h2>
          <p class="mt-3 max-w-xl leading-relaxed text-muted">
            Outside the day job I build
            <a
              href="https://teraslabs.com"
              target="_blank"
              rel="noopener"
              class="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >teraslabs.com</a>,
            a studio that helps people solve their digitalization problems.
          </p>
        </div>
        <div>
          <UButton
            to="https://teraslabs.com"
            target="_blank"
            external
            trailing-icon="i-lucide-arrow-up-right"
            color="neutral"
            variant="subtle"
          >
            Visit Teras Labs
          </UButton>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <UButton
          to="/posts"
          trailing-icon="i-lucide-arrow-right"
          variant="subtle"
          color="neutral"
        >
          Read the posts
        </UButton>
        <UButton
          to="/showcase"
          icon="i-lucide-layout-grid"
          color="neutral"
          variant="ghost"
        >
          Showcase
        </UButton>
        <UButton
          to="https://github.com/arizmuajianisan"
          target="_blank"
          external
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
        >
          GitHub
        </UButton>
        <UButton
          to="https://x.com/arizmuajianisan"
          target="_blank"
          external
          icon="i-simple-icons-x"
          color="neutral"
          variant="ghost"
        >
          X
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
