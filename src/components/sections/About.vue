<template>
  <section ref="sectionRef" class="py-10 mt-20 glassmorphism">
    <!-- Header with direct DOM ref for animation -->
    <header ref="headerRef" class="header">
      <h2 class="header__title graident">about</h2>
    </header>

    <!-- Text content broken into lines for animation -->
    <div
      ref="textContainerRef"
      class="px-5 space-y-2 text-sm font-normal select-none dark:text-gray-300"
    >
      <p class="animate-line">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ipsam vitae
        nemo, commodi voluptates cumque earum consequuntur enim quia quibusdam
      </p>
      <p class="animate-line">
        omnis odio possimus doloribus sapiente ut. Doloremque repellat corrupti
        ea totam officia assumenda. Voluptatem ducimus corporis laborum
        incidunt,
      </p>
      <p class="animate-line">
        commodi fuga? Nemo quis iure temporibus. Repellendus aliquam ullam
        minima. Animi quia at illo nobis nihil cupiditate similique numquam
        eaque dolor
      </p>
      <p class="animate-line">
        maiores possimus autem fugit officia laboriosam quam, assumenda porro
        natus cum repellat soluta! Similique, debitis assumenda. Ipsam fugit,
      </p>
      <p class="animate-line">
        quaerat quod nemo maiores voluptate earum praesentium quo vero at
        molestias libero eligendi cupiditate ipsa possimus quos corporis
        pariatur
      </p>
      <p class="animate-line">cum accusamus. Suscipit, eligendi.</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { initializeAnimations, cleanup } = useAboutAnimations()

// Template refs
const sectionRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Initialize only text animations, no header animation
  initializeAnimations({
    textContainerRef,
  })
})

onUnmounted(() => {
  // Clean up ScrollTrigger instances when component unmounts
  cleanup()
})
</script>

<style scoped>
.animate-line {
  /* Ensure smooth transitions */
  transition: opacity 0.3s ease-out;
}

/* Header styles to match SharedHeader */
.header {
  @apply flex flex-col items-center;
}

.header__title {
  @apply font-medium text-center capitalize;
  font-size: 2.7rem; /* Using your custom text-md size */
  letter-spacing: 2px;
}
</style>
