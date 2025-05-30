<template>
  <section ref="containerRef" class="skills-section glassmorphism">
    <SharedHeader
      title="skills"
      subTitle="Languages and technologies"
      :animation-options="{
        triggerStart: 'top 80%',
        duration: 0.9,
        staggerDelay: 0.1,
        ease: 'power3.out',
        enableParallax: true,
      }"
    />

    <!-- Body -->
    <figure class="skills-section__body">
      <SharedSkillItem
        v-for="(skill, index) in skills"
        :key="skill.title"
        :ref="el => setSkillRef(el, index)"
        :skill="skill"
      />
    </figure>
  </section>
</template>

<script lang="ts" setup>
import { skillsData } from '@/data/skills'

// Data
const skills = skillsData

// Animation setup with internal lifecycle management
const { containerRef, setSkillRef } = useSkillsAnimation()
</script>

<style scoped>
.skills-section {
  @apply px-3 py-10 mt-20;
}

.skills-section__body {
  @apply content-center justify-center gap-y-5 h-full flex flex-wrap;
}
</style>
