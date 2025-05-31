<template>
  <section ref="sectionRef" class="py-10 mt-20 glassmorphism">
    <!-- Use SharedHeader with animations instead of custom header -->
    <SharedHeader
      title="about"
      :animation-options="{
        triggerStart: 'top 75%',
        duration: 1.0,
        staggerDelay: 0.2,
        ease: 'back.out(1.2)',
      }"
    />

    <!-- Text content broken into lines for animation -->
    <div
      ref="textContainerRef"
      class="px-5 space-y-2 text-sm font-normal select-none dark:text-gray-300"
    >
      <p class="animate-line-ssr-safe animate-line paragraph-hidden">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ipsam vitae
        nemo, commodi voluptates cumque earum consequuntur enim quia quibusdam
      </p>
      <p class="animate-line-ssr-safe animate-line paragraph-hidden">
        omnis odio possimus doloribus sapiente ut. Doloremque repellat corrupti
        ea totam officia assumenda. Voluptatem ducimus corporis laborum
        incidunt,
      </p>
      <p class="animate-line-ssr-safe animate-line paragraph-hidden">
        commodi fuga? Nemo quis iure temporibus. Repellendus aliquam ullam
        minima. Animi quia at illo nobis nihil cupiditate similique numquam
        eaque dolor
      </p>
      <p class="animate-line-ssr-safe animate-line paragraph-hidden">
        maiores possimus autem fugit officia laboriosam quam, assumenda porro
        natus cum repellat soluta! Similique, debitis assumenda. Ipsam fugit,
      </p>
      <p class="animate-line-ssr-safe animate-line paragraph-hidden">
        quaerat quod nemo maiores voluptate earum praesentium quo vero at
        molestias libero eligendi cupiditate ipsa possimus quos corporis
        pariatur
      </p>
      <p class="animate-line-ssr-safe animate-line paragraph-hidden">
        cum accusamus. Suscipit, eligendi.
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { initializeAnimations, cleanup } = useAboutAnimations()

// Template refs
const sectionRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // DON'T initialize text animations immediately - wait for SharedHeader to finish

  // When SharedHeader starts animating, wait for it to complete before initializing text animations
  if (import.meta.client) {
    const { $ScrollTrigger } = useNuxtApp()

    $ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 75%', // Same trigger point as SharedHeader
      once: true,
      onEnter: () => {
        // Wait for SharedHeader animation to complete (duration: 1.0s + staggerDelay: 0.2s = ~1.2s)
        setTimeout(() => {
          // Remove the hidden class from paragraphs
          if (textContainerRef.value) {
            const paragraphs =
              textContainerRef.value.querySelectorAll('.animate-line')
            paragraphs.forEach((p: HTMLElement) => {
              p.classList.remove('paragraph-hidden')
            })
          }

          // NOW initialize the text animations with the existing config
          // This will set paragraphs to base opacity 0.3 and enable scroll animations (0.3 to 1.0)
          initializeAnimations({
            textContainerRef,
          })
        }, 1200) // Wait for SharedHeader to finish
      },
    })
  }
})

onUnmounted(() => {
  // Clean up ScrollTrigger instances when component unmounts
  cleanup()
})
</script>

<style scoped>
.paragraph-hidden {
  opacity: 0;
}
</style>
