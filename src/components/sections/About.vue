<template>
  <section ref="sectionRef" class="py-10 mt-20 glassmorphism">
    <!-- Use SharedHeader with animations instead of custom header -->
    <SharedHeader title="about" :animation-options="headerAnimationOptions" />

    <!-- Text content broken into lines for animation -->
    <div
      ref="textContainerRef"
      class="px-5 space-y-2 text-sm font-normal select-none dark:text-gray-300"
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
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ipsam vitae nemo, commodi voluptates cumque earum consequuntur enim quia quibusdam',
  'omnis odio possimus doloribus sapiente ut. Doloremque repellat corrupti ea totam officia assumenda. Voluptatem ducimus corporis laborum incidunt,',
  'commodi fuga? Nemo quis iure temporibus. Repellendus aliquam ullam minima. Animi quia at illo nobis nihil cupiditate similique numquam eaque dolor',
  'maiores possimus autem fugit officia laboriosam quam, assumenda porro natus cum repellat soluta! Similique, debitis assumenda. Ipsam fugit,',
  'quaerat quod nemo maiores voluptate earum praesentium quo vero at molestias libero eligendi cupiditate ipsa possimus quos corporis pariatur',
  'cum accusamus. Suscipit, eligendi.',
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
