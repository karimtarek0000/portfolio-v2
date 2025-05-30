import type { Ref } from 'vue'
import {
  type HeaderAnimationOptions,
  SECTION_DEFAULTS,
} from './animation.config'

/**
 * Enhanced Header animations composable with improved performance and DRY principles
 */
export const useHeaderAnimations = (options: HeaderAnimationOptions = {}) => {
  const { animateHeader, cleanup } = useAnimations()

  const headerRef = ref<HTMLElement | null>(null)

  // Merge with section-specific defaults
  const config = {
    ...SECTION_DEFAULTS.header,
    ...options,
  }

  // Optimized initialization with proper cleanup
  watchEffect(onCleanup => {
    if (headerRef.value && import.meta.client) {
      animateHeader(headerRef, {
        start: config.triggerStart,
        duration: config.duration,
        stagger: config.staggerDelay,
        ease: config.ease,
        once: true,
      })
    }

    // Cleanup on effect invalidation
    onCleanup(() => {
      // Individual cleanup handled by watchEffect
    })
  })

  // Global lifecycle management
  onUnmounted(cleanup)

  return {
    headerRef,
    cleanup,
  }
}
