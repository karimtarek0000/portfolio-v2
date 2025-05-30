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
      <p class="animate-line-ssr-safe">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum ipsam vitae
        nemo, commodi voluptates cumque earum consequuntur enim quia quibusdam
      </p>
      <p class="animate-line-ssr-safe">
        omnis odio possimus doloribus sapiente ut. Doloremque repellat corrupti
        ea totam officia assumenda. Voluptatem ducimus corporis laborum
        incidunt,
      </p>
      <p class="animate-line-ssr-safe">
        commodi fuga? Nemo quis iure temporibus. Repellendus aliquam ullam
        minima. Animi quia at illo nobis nihil cupiditate similique numquam
        eaque dolor
      </p>
      <p class="animate-line-ssr-safe">
        maiores possimus autem fugit officia laboriosam quam, assumenda porro
        natus cum repellat soluta! Similique, debitis assumenda. Ipsam fugit,
      </p>
      <p class="animate-line-ssr-safe">
        quaerat quod nemo maiores voluptate earum praesentium quo vero at
        molestias libero eligendi cupiditate ipsa possimus quos corporis
        pariatur
      </p>
      <p class="animate-line-ssr-safe">cum accusamus. Suscipit, eligendi.</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { initializeAnimations, cleanup } = useAboutAnimations()

// Template refs
const sectionRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Initialize only text animations, header has its own animations now
  initializeAnimations({
    textContainerRef,
  })
})

onUnmounted(() => {
  // Clean up ScrollTrigger instances when component unmounts
  cleanup()
})
</script>
