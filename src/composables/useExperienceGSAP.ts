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
  // Use shared utilities for consistency and performance
  const { applyStyles } = useBatchStyleApplication()
  const { createTrigger, cleanup: cleanupTriggers } = useScrollTriggerFactory()
  const { validateContainer, getValidElements } = useElementValidation()
  const { createTimer } = useAnimationTimer()
  const { debounce } = useDebounce()

  // Merge provided config with defaults (shallow merge for performance)
  const animationConfig = Object.assign({}, DEFAULT_ANIMATION_CONFIG, config)

  // Consolidated state management
  const state = reactive({
    isHeaderVisible: false,
    isHeaderAnimationComplete: false,
    isJavaScriptEnabled: false,
  })

  // Performance-optimized computed property
  const shouldAnimateTimeline = computed(
    () => state.isHeaderVisible && state.isHeaderAnimationComplete,
  )

  /**
   * Optimized style application using shared utilities
   */
  const applyInitialStyles = (elements: HTMLElement[]): void => {
    if (!isClientSide()) return

    // Use shared style application for consistency and caching
    applyStyles(elements, {
      opacity: '0',
      transform: 'translateY(30px)',
      willChange: 'transform, opacity',
    })
  }

  /**
   * Consolidated header tracking with reduced DOM queries using shared utilities
   */
  const initializeHeaderTracking = (headerElement: HTMLElement): void => {
    if (!isClientSide() || !headerElement) return

    // Header visibility trigger using shared factory
    createTrigger({
      trigger: headerElement,
      start: animationConfig.header.triggerStart,
      onEnter: () => {
        state.isHeaderVisible = true
        callbacks.onHeaderVisible()
      },
    })

    // Header completion trigger using shared factory
    createTrigger({
      trigger: headerElement,
      start: animationConfig.timing.headerCompletion.start,
      onEnter: () => {
        const { duration, staggerDelay, buffer } =
          animationConfig.timing.headerCompletion
        const totalDuration = duration + staggerDelay + buffer

        // Use shared animation timer utility
        createTimer(totalDuration, () => {
          state.isHeaderAnimationComplete = true
          callbacks.onHeaderAnimationComplete()
        })
      },
    })
  }

  /**
   * Timeline animation initialization with validation using shared utilities
   */
  const initializeTimelineAnimation = (): void => {
    const timelineItems = getValidElements(refs.timelineItemsRef)
    if (!timelineItems.length) return

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
   * Optimized element hiding using shared utilities
   */
  const hideTimelineItems = (): void => {
    const items = getValidElements(refs.timelineItemsRef)
    if (!items.length) return

    applyInitialStyles(items)
  }

  /**
   * Main initialization with optimized execution order
   */
  const initializeAnimations = (): void => {
    if (!isClientSide()) return

    nextTick(() => {
      // Batch DOM operations
      hideTimelineItems()

      if (validateContainer(refs.sharedHeaderRef)) {
        initializeHeaderTracking(refs.sharedHeaderRef.value!)
      }
    })
  }

  /**
   * Optimized cleanup using shared utilities
   */
  const cleanup = (): void => {
    cleanupTriggers()
  }

  /**
   * Lifecycle setup with optimized watchers using shared utilities
   */
  const setupLifecycle = (): void => {
    // Single watcher for timeline animation trigger
    const stopTimelineWatcher = watch(
      shouldAnimateTimeline,
      shouldAnimate => {
        if (shouldAnimate) {
          nextTick(initializeTimelineAnimation)
          // Stop watching after first trigger for performance
          stopTimelineWatcher()
        }
      },
      { immediate: false },
    )

    // Optimized timeline items watcher with debouncing using shared utility
    const debouncedHideItems = debounce(() => {
      nextTick(hideTimelineItems)
    }, 16) // RAF-aligned debouncing

    watch(() => refs.timelineItemsRef.value, debouncedHideItems, {
      deep: true,
      flush: 'post',
    })

    // Document element setup (runs once)
    watch(
      () => state.isJavaScriptEnabled,
      enabled => {
        if (isClientSide() && enabled && refs.documentElementRef.value) {
          refs.documentElementRef.value.classList.add('js')
        }
      },
      { immediate: true },
    )

    // Optimized lifecycle hooks
    onMounted(() => {
      if (isClientSide()) {
        // Cache document element reference
        refs.documentElementRef.value = document.documentElement
        state.isJavaScriptEnabled = true
        initializeAnimations()
      }
    })

    onUnmounted(cleanup)
  }

  // Initialize lifecycle setup
  setupLifecycle()

  // Return optimized API with readonly state
  return {
    // Animation configuration (readonly for immutability)
    animationConfig: readonly(animationConfig),

    // Animation state (readonly for external access)
    isHeaderVisible: readonly(toRef(state, 'isHeaderVisible')),
    isHeaderAnimationComplete: readonly(
      toRef(state, 'isHeaderAnimationComplete'),
    ),
    shouldAnimateTimeline: readonly(shouldAnimateTimeline),
    isJavaScriptEnabled: readonly(toRef(state, 'isJavaScriptEnabled')),

    // Core functions
    initializeAnimations,
    cleanup,

    // Utilities (exposed for testing/debugging)
    applyInitialStyles,
  }
}
