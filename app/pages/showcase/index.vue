<script setup lang="ts">
const { data: projects } = await useShowcaseProjects()

useSeoMeta({
  title: 'Showcase',
  description: 'A showcase of projects and work by Ariz Muajianisan.'
})
</script>

<template>
  <UContainer class="py-12">
    <UPageHeader
      title="Showcase"
      description="A selection of projects and work. Click a project for details."
    />

    <UPageGrid
      v-if="projects?.length"
      class="mt-8"
    >
      <UPageCard
        v-for="project in projects"
        :key="project.path"
        :to="projectPath(project)"
        :title="project.title"
        :description="project.description"
        spotlight
        class="h-full"
      >
        <template
          v-if="project.tech?.length"
          #footer
        >
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="item in project.tech"
              :key="item"
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ item }}
            </UBadge>
          </div>
        </template>
      </UPageCard>
    </UPageGrid>

    <p
      v-else
      class="mt-8 text-muted"
    >
      No projects yet — check back soon.
    </p>
  </UContainer>
</template>
