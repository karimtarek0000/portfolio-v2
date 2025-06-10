<template>
  <section ref="sectionRef" class="py-10 mt-20 glassmorphism">
    <!-- Use SharedHeader with animations instead of custom header -->
    <SharedHeader title="about" :animation-options="headerAnimationOptions" />

    <!-- Text content broken into lines for animation -->
    <div
      ref="textContainerRef"
      class="max-w-[1000px] px-5 mx-auto space-y-2 text-sm font-normal select-none dark:text-gray-300"
    >
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        class="animate-line-ssr-safe animate-line paragraph-hidden"
      >
        {{ paragraph }}
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
// ============================================================================
// REACTIVE DATA
// ============================================================================

// Template refs
const sectionRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)

// Configuration for SharedHeader animations
const headerAnimationOptions = {
  triggerStart: 'top 75%',
  duration: 1.0,
  staggerDelay: 0.2,
  ease: 'back.out(1.2)',
}

// Text content - moved to reactive data for better maintainability
const paragraphs = [
  'Frontend Developer with 3+ years of experience in building high-performance, responsive,',
  'and user-friendly web applications. Proficient in modern frontend technologies, including',
  'JavaScript, TypeScript, and component-based architectures. Skilled in optimizing web',
  'performance, integrating APIs, and ensuring clean, maintainable code. Continuously learning',
  'and staying up to date with the latest industry trends and best practices. A strong team',
  'player who thrives in solving complex problems.',
]

// ============================================================================
// COMPOSABLES & ANIMATIONS
// ============================================================================

// Pass refs and configuration directly to the composable
// All lifecycle management is now handled internally
const { refresh } = useAboutAnimations(
  {
    sectionRef,
    textContainerRef,
  },
  {
    triggerStart: 'top 75%',
    textRevealDelay: 1200,
  },
)
</script>

<style scoped>
.paragraph-hidden {
  opacity: 0;
}
</style>
