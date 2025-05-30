import type { Ref } from 'vue'

interface ExperienceAnimationConfig {
  header: {
    triggerStart: string
    duration: number
    staggerDelay: number
    ease: string
  }
  timeline: {
    start: string
    animationType: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
    once: boolean
  }
  timing: {
    headerCompletion: {
      start: string
      duration: number
      staggerDelay: number
      buffer: number
    }
  }
  styles: {
    initial: {
      opacity: string
      transform: string
      willChange: string
    }
  }
}

interface ExperienceGSAPCallbacks {
  onHeaderVisible: () => void
  onHeaderAnimationComplete: () => void
}

interface ExperienceGSAPRefs {
  timelineItemsRef: Ref<HTMLElement[]>
  sharedHeaderRef: Ref<HTMLElement | null>
  documentElementRef: Ref<HTMLElement | null>
}

/**
 * Default animation configuration for Experience component
 */
const DEFAULT_ANIMATION_CONFIG: ExperienceAnimationConfig = {
  header: {
    triggerStart: 'top 70%',
    duration: 0.7,
    staggerDelay: 0.12,
    ease: 'power2.out',
  },
  timeline: {
    start: 'top 95%',
    animationType: 'fadeUp',
    once: true,
  },
  timing: {
    headerCompletion: {
      start: 'top 65%',
      duration: 700, // ms
      staggerDelay: 120, // ms
      buffer: 100, // ms
    },
  },
  styles: {
    initial: {
      opacity: '0',
      transform: 'translateY(30px)',
      willChange: 'transform, opacity',
    },
  },
} as const

/**
 * GSAP composable specifically for Experience component animations
 * Handles ScrollTrigger creation, animation timing, lifecycle management, and cleanup
 */
export const useExperienceGSAP = (
  config: Partial<ExperienceAnimationConfig> = {},
  callbacks: ExperienceGSAPCallbacks,
  refs: ExperienceGSAPRefs,
  animateOnScrollFn: (
    elementsRef: Ref<HTMLElement[]>,
    animationType: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight',
    options: { start: string; once: boolean },
  ) => void,
) => {
  const { $ScrollTrigger } = useNuxtApp()

  // Merge provided config with defaults
  const animationConfig = { ...DEFAULT_ANIMATION_CONFIG, ...config }

  // State management for scroll triggers
  const scrollTriggers = ref<ScrollTrigger[]>([])

  // Animation state
  const isHeaderVisible = ref(false)
  const isHeaderAnimationComplete = ref(false)
  const shouldAnimateTimeline = computed(
    () => isHeaderVisible.value && isHeaderAnimationComplete.value,
  )

  // JavaScript enabled state for CSS targeting
  const isJavaScriptEnabled = ref(false)

  /**
   * Utility function to check client-side execution
   */
  const isClient = (): boolean => import.meta.client

  /**
   * Apply initial styles to prevent SSR flash
   */
  const applyInitialStyles = (elements: HTMLElement[]): void => {
    if (!isClient()) return

    elements.forEach(element => {
      if (element) {
        Object.assign(element.style, animationConfig.styles.initial)
      }
    })
  }

  /**
   * Create scroll trigger with common configuration
   */
  const createScrollTrigger = (options: {
    trigger: HTMLElement
    start: string
    once?: boolean
    onEnter: () => void
  }): ScrollTrigger => {
    return $ScrollTrigger.create({
      trigger: options.trigger,
      start: options.start,
      once: options.once ?? true,
      onEnter: options.onEnter,
    })
  }

  /**
   * Create animation timing using requestAnimationFrame
   */
  const createAnimationTimer = (
    duration: number,
    callback: () => void,
  ): void => {
    requestAnimationFrame(() => {
      let startTime: number

      const tick = (currentTime: number) => {
        if (!startTime) startTime = currentTime

        if (currentTime - startTime >= duration) {
          callback()
        } else {
          requestAnimationFrame(tick)
        }
      }

      requestAnimationFrame(tick)
    })
  }

  /**
   * Initialize header animation tracking
   */
  const initializeHeaderTracking = (headerElement: HTMLElement): void => {
    if (!isClient() || !headerElement) return

    // Track header visibility
    const visibilityTrigger = createScrollTrigger({
      trigger: headerElement,
      start: animationConfig.header.triggerStart,
      onEnter: () => {
        isHeaderVisible.value = true
        callbacks.onHeaderVisible()
      },
    })

    // Track header animation completion
    const completionTrigger = createScrollTrigger({
      trigger: headerElement,
      start: animationConfig.timing.headerCompletion.start,
      onEnter: () => {
        const { duration, staggerDelay, buffer } =
          animationConfig.timing.headerCompletion
        const totalDuration = duration + staggerDelay + buffer

        createAnimationTimer(totalDuration, () => {
          isHeaderAnimationComplete.value = true
          callbacks.onHeaderAnimationComplete()
        })
      },
    })

    scrollTriggers.value.push(visibilityTrigger, completionTrigger)
  }

  /**
   * Initialize timeline animations using external scroll animation composable
   */
  const initializeTimelineAnimation = (): void => {
    if (!isClient() || !refs.timelineItemsRef.value.length) return

    animateOnScrollFn(
      refs.timelineItemsRef,
      animationConfig.timeline.animationType,
      {
        start: animationConfig.timeline.start,
        once: animationConfig.timeline.once,
      },
    )
  }

  /**
   * Hide timeline items immediately on client
   */
  const hideTimelineItems = (): void => {
    applyInitialStyles(refs.timelineItemsRef.value)
  }

  /**
   * Initialize all animations and setup lifecycle
   */
  const initializeAnimations = (): void => {
    if (!isClient()) return

    nextTick(() => {
      hideTimelineItems()
      if (refs.sharedHeaderRef.value) {
        initializeHeaderTracking(refs.sharedHeaderRef.value)
      }
    })
  }

  /**
   * Setup lifecycle watchers and event handlers
   */
  const setupLifecycle = (): void => {
    // Watch for timeline animation trigger condition
    watch(
      shouldAnimateTimeline,
      shouldAnimate => {
        if (shouldAnimate) {
          nextTick(initializeTimelineAnimation)
        }
      },
      { immediate: false },
    )

    // Watch for timeline items changes
    watch(
      refs.timelineItemsRef,
      () => {
        nextTick(hideTimelineItems)
      },
      { deep: true },
    )

    // Watch for JavaScript enabled state to apply to document element using ref
    watch(
      isJavaScriptEnabled,
      enabled => {
        if (isClient() && enabled && refs.documentElementRef.value) {
          refs.documentElementRef.value.classList.add('js')
        }
      },
      { immediate: true },
    )

    // Component lifecycle
    onMounted(() => {
      if (isClient()) {
        // Store reference to document element
        refs.documentElementRef.value = document.documentElement
        isJavaScriptEnabled.value = true
        initializeAnimations()
      }
    })

    onUnmounted(() => {
      cleanup()
    })
  }

  /**
   * Cleanup all scroll triggers
   */
  const cleanup = (): void => {
    if (isClient()) {
      scrollTriggers.value.forEach(trigger => trigger.kill())
      scrollTriggers.value = []
    }
  }

  // Initialize lifecycle setup
  setupLifecycle()

  return {
    // Animation configuration (read-only)
    animationConfig: readonly(animationConfig),

    // Animation state (read-only)
    isHeaderVisible: readonly(isHeaderVisible),
    isHeaderAnimationComplete: readonly(isHeaderAnimationComplete),
    shouldAnimateTimeline: readonly(shouldAnimateTimeline),
    isJavaScriptEnabled: readonly(isJavaScriptEnabled),

    // Core animation functions
    initializeAnimations,
    cleanup,

    // Utility functions (exposed for testing/debugging)
    applyInitialStyles,
    createScrollTrigger,
    createAnimationTimer,
    isClient,
  }
}
