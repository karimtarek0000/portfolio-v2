<template>
  <figcaption class="skill-item">
    <div class="skill-item__icon">
      <div :class="['p-5 overflow-hidden rounded-full', skill.color]">
        <SharedRenderSVG :iconName="skill.iconName" sizes="h-[4rem] w-[4rem]" />
      </div>
    </div>
    <span class="skill-item__title" v-text="skill.title" />
  </figcaption>
</template>

<script lang="ts" setup>
import type { Skill } from '~/data/skills'

interface Props {
  skill: Skill
}

defineProps<Props>()
</script>

<style scoped>
.skill-item {
  @apply flex flex-col items-center p-1 basis-1/2 md:basis-1/3 lg:basis-1/4;
}

.skill-item__icon {
  @apply p-1 rounded-full ease-in-out duration-300 transition-transform lg:hover:-translate-y-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600;
}

.skill-item__title {
  @apply mb-2 mt-3 capitalize;
}
</style>
