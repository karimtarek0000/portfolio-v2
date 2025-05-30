<template>
  <figcaption class="skill-item">
    <div class="skill-item__icon">
      <div class="skill-item__inner">
        <SharedRenderSVG :iconName="skill.iconName" sizes="h-[4rem] w-[4rem]" />
      </div>
    </div>
    <span class="skill-item__title" v-text="skill.title" />
  </figcaption>
</template>

<script lang="ts" setup>
import type { Skill } from '@/data/skills'

defineProps<{
  skill: Skill
}>()
</script>

<style scoped>
.skill-item {
  @apply flex flex-col items-center p-1 basis-1/2 md:basis-1/3 lg:basis-1/4;
}

.skill-item__icon {
  @apply p-1 rounded-full ease-in-out duration-300 transition-all lg:hover:-translate-y-3 lg:hover:scale-105;
  @apply bg-white/10 dark:bg-white/5 backdrop-blur-md;
  @apply border border-white/20 dark:border-white/10;
  @apply shadow-lg shadow-black/10 dark:shadow-black/30;
  @apply hover:bg-white/20 dark:hover:bg-white/10;
  @apply hover:border-white/30 dark:hover:border-white/20;
  @apply hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/40;
}

.skill-item__inner {
  @apply p-5 rounded-full;
}

.skill-item__title {
  @apply mb-2 mt-3 capitalize text-sm font-medium;
}
</style>
