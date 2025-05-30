import type { Ref } from 'vue'

interface ExperienceAnimationConfig {
  header?: {
    triggerStart?: string
    duration?: number
    staggerDelay?: number
    ease?: string
  }
  timeline?: {
    start?: string
    animationType?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
    once?: boolean
  }
  timelineLines?: {
    start?: string
    duration?: number
    ease?: string
    staggerDelay?: number
    scaleDirection?: 'bottom-to-top' | 'top-to-bottom'
  }
}

interface ExperienceGSAPCallbacks {
  onHeaderVisible?: () => void
  onHeaderAnimationComplete?: () => void
}

interface ExperienceGSAPRefs {
  timelineItemsRef: Ref<HTMLElement[]>
  sharedHeaderRef: Ref<HTMLElement | null>
  documentElementRef: Ref<HTMLElement | null>
  timelineLinesRef: Ref<HTMLElement[]>
  timelineDotsRef: Ref<HTMLElement[]>
}

/**
 * Simplified Experience animations using the unified animation system
 */
export const useExperienceGSAP = (
  config: Partial<ExperienceAnimationConfig> = {},
  callbacks: ExperienceGSAPCallbacks = {},
  refs: ExperienceGSAPRefs,
  // Keep compatibility with existing signature but ignore the function
  _animateOnScrollFn?: any,
) => {
  const { animateOnScroll, animateTimeline, cleanup } = useAnimations()

  // Default configuration
  const animationConfig = {
    header: {
      triggerStart: 'top 70%',
      duration: 0.7,
      staggerDelay: 0.12,
      ease: 'power2.out',
      ...config.header,
    },
    timeline: {
      start: 'top 95%',
      animationType: 'fadeUp' as const,
      once: true,
      ...config.timeline,
    },
    timelineLines: {
      start: 'top 90%',
      duration: 0.8,
      ease: 'power2.out',
      staggerDelay: 0.15,
      scaleDirection: 'bottom-to-top' as const,
      ...config.timelineLines,
    },
  }

  // State management
  const state = reactive({
    isHeaderVisible: false,
    isHeaderAnimationComplete: false,
    isJavaScriptEnabled: false,
  })

  // Initialize animations
  const initializeAnimations = (): void => {
    if (!import.meta.client) return

    nextTick(() => {
      // Animate timeline items
      if (refs.timelineItemsRef.value.length) {
        animateOnScroll(
          refs.timelineItemsRef,
          animationConfig.timeline.animationType,
          {
            start: animationConfig.timeline.start,
            once: animationConfig.timeline.once,
          },
        )
      }

      // Animate timeline lines and dots
      if (
        refs.timelineLinesRef.value.length ||
        refs.timelineDotsRef.value.length
      ) {
        animateTimeline(refs.timelineLinesRef, refs.timelineDotsRef, {
          scaleDirection: animationConfig.timelineLines.scaleDirection,
          once: true,
        })
      }

      // Set JavaScript enabled flag
      if (refs.documentElementRef.value) {
        refs.documentElementRef.value.classList.add('js')
        state.isJavaScriptEnabled = true
      }
    })
  }

  // Lifecycle management
  onMounted(() => {
    if (import.meta.client) {
      refs.documentElementRef.value = document.documentElement
      initializeAnimations()
    }
  })

  onUnmounted(cleanup)

  return {
    // Animation configuration (readonly for immutability)
    animationConfig: readonly(animationConfig),

    // Animation state (readonly for external access)
    isHeaderVisible: readonly(toRef(state, 'isHeaderVisible')),
    isHeaderAnimationComplete: readonly(
      toRef(state, 'isHeaderAnimationComplete'),
    ),
    isJavaScriptEnabled: readonly(toRef(state, 'isJavaScriptEnabled')),

    // Core functions
    initializeAnimations,
    cleanup,
  }
}
