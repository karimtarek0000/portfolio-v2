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
  // Add line animation configuration
  timelineLines: {
    start: string
    duration: number
    ease: string
    staggerDelay: number
    scaleDirection: 'bottom-to-top' | 'top-to-bottom'
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
  // Add timeline lines ref
  timelineLinesRef: Ref<HTMLElement[]>
  // Add timeline dots ref
  timelineDotsRef: Ref<HTMLElement[]>
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
  // Add default line animation config
  timelineLines: {
    start: 'top 90%',
    duration: 0.8,
    ease: 'power2.out',
    staggerDelay: 0.15,
    scaleDirection: 'bottom-to-top',
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
  const { $gsap } = useNuxtApp()

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
   * Initialize timeline line scaling animations
   */
  const initializeTimelineLineAnimations = (): void => {
    const timelineLines = getValidElements(refs.timelineLinesRef)
    if (!timelineLines.length) return

    console.log(
      'Initializing timeline line animations for',
      timelineLines.length,
      'lines',
    )

    // Apply initial styles for lines
    applyStyles(timelineLines, {
      scaleY: '0',
      transformOrigin: 'bottom center',
      willChange: 'transform',
    })

    // Set initial GSAP state
    $gsap.set(timelineLines, {
      scaleY: 0,
      transformOrigin: 'bottom center',
      willChange: 'transform',
    })

    // Create scroll-triggered animations for each line individually
    timelineLines.forEach((line, index) => {
      console.log(`Setting up animation for line ${index}`)

      createTrigger({
        trigger: line,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          console.log(`Animating line ${index}`)
          $gsap.to(line, {
            scaleY: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: index * 0.1,
            onComplete: () => {
              // Clear will-change after animation for performance
              line.style.willChange = 'auto'
              console.log(`Line ${index} animation complete`)
            },
          })
        },
      })
    })
  }

  /**
   * Initialize timeline dot scaling animations
   */
  const initializeTimelineDotAnimations = (): void => {
    const timelineDots = getValidElements(refs.timelineDotsRef)
    if (!timelineDots.length) {
      console.log('No timeline dots found')
      return
    }

    console.log(
      'Initializing timeline dot animations for',
      timelineDots.length,
      'dots',
    )

    // Set initial GSAP state immediately
    $gsap.set(timelineDots, {
      scale: 0,
      transformOrigin: 'center center',
    })

    // Create scroll-triggered animations for each dot individually
    timelineDots.forEach((dot, index) => {
      console.log(`Setting up animation for dot ${index}`, dot)

      createTrigger({
        trigger: dot,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          console.log(`Animating dot ${index}`)
          $gsap.to(dot, {
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            delay: index * 0.15,
          })
        },
      })
    })
  }

  /**
   * Timeline animation initialization with validation using shared utilities
   */
  const initializeTimelineAnimation = (): void => {
    const timelineItems = getValidElements(refs.timelineItemsRef)
    if (!timelineItems.length) return

    // Initialize main timeline item animations
    animateOnScrollFn(
      refs.timelineItemsRef,
      animationConfig.timeline.animationType,
      {
        start: animationConfig.timeline.start,
        once: animationConfig.timeline.once,
      },
    )

    // Initialize timeline line animations
    initializeTimelineLineAnimations()

    // Initialize timeline dot animations
    initializeTimelineDotAnimations()
  }

  /**
   * Optimized element hiding using shared utilities
   */
  const hideTimelineItems = (): void => {
    const items = getValidElements(refs.timelineItemsRef)
    if (!items.length) return

    applyInitialStyles(items)

    // Also hide timeline lines initially
    const timelineLines = getValidElements(refs.timelineLinesRef)
    if (timelineLines.length) {
      applyStyles(timelineLines, {
        scaleY: '0',
        transformOrigin:
          animationConfig.timelineLines.scaleDirection === 'bottom-to-top'
            ? 'bottom center'
            : 'top center',
        willChange: 'transform',
      })
    }

    // Also hide timeline dots initially
    const timelineDots = getValidElements(refs.timelineDotsRef)
    if (timelineDots.length) {
      applyStyles(timelineDots, {
        scale: '0',
        transformOrigin: 'center center',
        willChange: 'transform',
      })
    }
  }

  /**
   * Main initialization with optimized execution order
   */
  const initializeAnimations = (): void => {
    if (!isClientSide()) return

    nextTick(() => {
      // Batch DOM operations
      hideTimelineItems()

      // Initialize timeline line animations immediately (don't wait for header)
      initializeTimelineLineAnimations()

      // Initialize timeline dot animations immediately (don't wait for header)
      initializeTimelineDotAnimations()

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
    initializeTimelineLineAnimations,
    initializeTimelineDotAnimations,
  }
}
