import type { Ref } from 'vue'

interface HeaderAnimationOptions {
  triggerStart?: string
  duration?: number
  staggerDelay?: number
  ease?: string
  enableParallax?: boolean
}

/**
 * Simplified Header animations using the unified animation system
 */
export const useHeaderAnimations = (options: HeaderAnimationOptions = {}) => {
  const { animateHeader, cleanup } = useAnimations()

  const headerRef = ref<HTMLElement | null>(null)

  // Watch for headerRef changes and initialize animations
  watchEffect(() => {
    if (headerRef.value && import.meta.client) {
      animateHeader(headerRef, {
        start: options.triggerStart ?? 'top 85%',
        duration: options.duration ?? 0.8,
        stagger: options.staggerDelay ?? 0.15,
        ease: options.ease ?? 'power2.out',
        once: true,
      })
    }
  })

  // Lifecycle management
  onUnmounted(cleanup)

  return {
    headerRef,
    cleanup,
  }
}
