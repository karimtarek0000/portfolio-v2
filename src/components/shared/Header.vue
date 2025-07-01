<template>
  <header ref="headerRef" class="header">
    <h2
      class="header__title header__element--ssr-safe graident"
      v-text="title"
    />
    <p
      v-if="subTitle"
      class="header__subtitle header__element--ssr-safe"
      v-text="subTitle"
    />
  </header>
</template>

<script lang="ts" setup>
interface Props {
  title: string
  subTitle?: string
  // Animation configuration options
  animationOptions?: {
    triggerStart?: string
    duration?: number
    staggerDelay?: number
    ease?: string
    enableParallax?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  animationOptions: () => ({}),
})

// Initialize header animations with custom options
const { headerRef } = useHeaderAnimations(props.animationOptions)
</script>

<style scoped>
.header {
  @apply flex flex-col items-center;
}

.header__title {
  @apply font-medium text-center capitalize text-md;
  letter-spacing: 2px;
  /* Ensure smooth transitions for animations */
  transition: transform 0.3s ease-out;
}

.header__subtitle {
  @apply text-sm mb-10 text-center px-2;
  /* Ensure smooth transitions for animations */
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

/* 
 * SSR-safe hiding: Only hide elements on client-side using CSS
 * This provides immediate hiding without waiting for JavaScript
 */
@media screen {
  .header__element--ssr-safe {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
    will-change: transform, opacity;
  }
}

/* Ensure elements remain visible during SSR and print */
@media print {
  .header__element--ssr-safe {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .header__element--ssr-safe {
    opacity: 0;
    transform: none;
  }
}
</style>
