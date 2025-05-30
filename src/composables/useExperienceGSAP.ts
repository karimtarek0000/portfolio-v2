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

// Centralized client-side check for performance
const isClient = (): boolean => import.meta.client

// Cache DOM style application for performance (WeakMap doesn't need clearing)
const cachedStyleApplication = new WeakMap<HTMLElement, boolean>()

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

  // Merge provided config with defaults (shallow merge for performance)
  const animationConfig = Object.assign({}, DEFAULT_ANIMATION_CONFIG, config)

  // Consolidated state management
  const state = reactive({
    scrollTriggers: [] as ScrollTrigger[],
    isHeaderVisible: false,
    isHeaderAnimationComplete: false,
    isJavaScriptEnabled: false,
  })

  // Performance-optimized computed property
  const shouldAnimateTimeline = computed(
    () => state.isHeaderVisible && state.isHeaderAnimationComplete,
  )

  /**
   * Optimized style application with caching
   */
  const applyInitialStyles = (elements: HTMLElement[]): void => {
    if (!isClient()) return

    const { initial } = animationConfig.styles

    elements.forEach(element => {
      if (!element || cachedStyleApplication.has(element)) return

      // Batch DOM writes for performance
      Object.assign(element.style, initial)
      cachedStyleApplication.set(element, true)
    })
  }

  /**
   * Reusable scroll trigger factory with common configuration
   */
  const createScrollTrigger = (options: {
    trigger: HTMLElement
    start: string
    once?: boolean
    onEnter: () => void
  }): ScrollTrigger => {
    const trigger = $ScrollTrigger.create({
      trigger: options.trigger,
      start: options.start,
      once: options.once ?? true,
      onEnter: options.onEnter,
      // Performance optimization: reduce refresh rate
      refreshPriority: -1,
    })

    state.scrollTriggers.push(trigger)
    return trigger
  }

  /**
   * High-performance animation timer using requestAnimationFrame
   */
  const createAnimationTimer = (
    duration: number,
    callback: () => void,
  ): void => {
    if (!isClient()) return

    let startTime = 0

    const tick = (currentTime: number) => {
      if (!startTime) startTime = currentTime

      if (currentTime - startTime >= duration) {
        callback()
      } else {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }

  /**
   * Consolidated header tracking with reduced DOM queries
   */
  const initializeHeaderTracking = (headerElement: HTMLElement): void => {
    if (!isClient() || !headerElement) return

    // Batch scroll trigger creation for performance
    const triggers = [
      // Header visibility trigger
      {
        start: animationConfig.header.triggerStart,
        onEnter: () => {
          state.isHeaderVisible = true
          callbacks.onHeaderVisible()
        },
      },
      // Header completion trigger
      {
        start: animationConfig.timing.headerCompletion.start,
        onEnter: () => {
          const { duration, staggerDelay, buffer } =
            animationConfig.timing.headerCompletion
          const totalDuration = duration + staggerDelay + buffer

          createAnimationTimer(totalDuration, () => {
            state.isHeaderAnimationComplete = true
            callbacks.onHeaderAnimationComplete()
          })
        },
      },
    ]

    triggers.forEach(triggerConfig => {
      createScrollTrigger({
        trigger: headerElement,
        start: triggerConfig.start,
        onEnter: triggerConfig.onEnter,
      })
    })
  }

  /**
   * Timeline animation initialization with validation
   */
  const initializeTimelineAnimation = (): void => {
    const timelineItems = refs.timelineItemsRef.value
    if (!isClient() || !timelineItems?.length) return

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
   * Optimized element hiding with batch operations
   */
  const hideTimelineItems = (): void => {
    const items = refs.timelineItemsRef.value
    if (!items?.length) return

    applyInitialStyles(items)
  }

  /**
   * Main initialization with optimized execution order
   */
  const initializeAnimations = (): void => {
    if (!isClient()) return

    nextTick(() => {
      // Batch DOM operations
      hideTimelineItems()

      const headerElement = refs.sharedHeaderRef.value
      if (headerElement) {
        initializeHeaderTracking(headerElement)
      }
    })
  }

  /**
   * Optimized cleanup with batch operations
   */
  const cleanup = (): void => {
    if (!isClient()) return

    // Batch cleanup for performance
    state.scrollTriggers.forEach(trigger => trigger.kill())
    state.scrollTriggers.length = 0
  }

  /**
   * Lifecycle setup with optimized watchers
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

    // Optimized timeline items watcher with debouncing
    let timelineWatcherTimeout: ReturnType<typeof setTimeout>
    watch(
      () => refs.timelineItemsRef.value,
      () => {
        clearTimeout(timelineWatcherTimeout)
        timelineWatcherTimeout = setTimeout(() => {
          nextTick(hideTimelineItems)
        }, 16) // RAF-aligned debouncing
      },
      { deep: true, flush: 'post' },
    )

    // Document element setup (runs once)
    watch(
      () => state.isJavaScriptEnabled,
      enabled => {
        if (isClient() && enabled && refs.documentElementRef.value) {
          refs.documentElementRef.value.classList.add('js')
        }
      },
      { immediate: true },
    )

    // Optimized lifecycle hooks
    onMounted(() => {
      if (isClient()) {
        // Cache document element reference
        refs.documentElementRef.value = document.documentElement
        state.isJavaScriptEnabled = true
        initializeAnimations()
      }
    })

    onUnmounted(() => {
      cleanup()
      clearTimeout(timelineWatcherTimeout)
    })
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
    createScrollTrigger,
    createAnimationTimer,
    isClient,
  }
}
