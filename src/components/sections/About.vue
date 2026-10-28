<script lang="ts" setup>
// ============================================================================
// REACTIVE DATA
// ============================================================================

// Template refs
const sectionRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
const data: Ref<Data> = useState('data')

// Configuration for SharedHeader animations
const headerAnimationOptions = {
  triggerStart: 'top 75%',
  duration: 1.0,
  staggerDelay: 0.2,
  ease: 'back.out(1.2)',
}

// Text content - moved to reactive data for better maintainability
const paragraphs = computed((): string[] => {
  const words = data.value.about.split(' ')
  const lines: string[] = []
  let currentLine = ''
  const maxWordsPerLine = 14

  // Process each word and group them into lines
  for (const word of words) {
    // Test if adding this word would exceed the word limit
    const potentialLine = currentLine ? `${currentLine} ${word}` : word
    const wordCount = potentialLine.split(' ').length

    if (wordCount <= maxWordsPerLine) {
      // Word fits in current line
      currentLine = potentialLine
    } else {
      // Word would exceed limit, start new line
      if (currentLine) {
        lines.push(currentLine + ',') // Add comma to completed line
        currentLine = word // Start new line with current word
      }
    }
  }

  // Add the final line with a period
  if (currentLine) {
    lines.push(currentLine + '.')
  }

  return lines
})

// ============================================================================
// COMPOSABLES & ANIMATIONS
// ============================================================================

// Pass refs and configuration directly to the composable
// All lifecycle management is now handled internally
useAboutAnimations(
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

<style scoped>
.paragraph-hidden {
  opacity: 0;
}
</style>
