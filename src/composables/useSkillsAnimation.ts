import type { Ref } from 'vue'

interface SkillsAnimationOptions {
  triggerStart?: string
  rowDelay?: number
  itemDelay?: number
  duration?: number
  ease?: string
  itemsPerRow?: number
}

// Performance-optimized configuration constants
const DEFAULT_CONFIG = {
  triggerStart: 'top 90%',
  rowDelay: 0.2,
  itemDelay: 0.1,
  duration: 0.6,
  ease: 'power2.out',
  itemsPerRow: 4, // Optimize batch processing
} as const

export const useSkillsAnimation = (options: SkillsAnimationOptions = {}) => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Use shared utilities for consistency and performance
  const { isMobile } = useDeviceDetection()
  const { applyStyles } = useBatchStyleApplication()
  const { createTrigger, cleanup: cleanupTriggers } = useScrollTriggerFactory()
  const { getValidElements } = useElementValidation()
  const { setWillChange, clearWillChange } = useWillChangeManager()

  // Merge configuration efficiently with device-specific optimizations
  const config = {
    ...DEFAULT_CONFIG,
    ...options,
    // Reduce animation complexity on mobile for performance
    duration: isMobile()
      ? (options.duration ?? DEFAULT_CONFIG.duration) * 0.8
      : options.duration ?? DEFAULT_CONFIG.duration,
    itemDelay: isMobile()
      ? (options.itemDelay ?? DEFAULT_CONFIG.itemDelay) * 0.5
      : options.itemDelay ?? DEFAULT_CONFIG.itemDelay,
  }

  // Consolidated state management
  const state = reactive({
    containerRef: null as HTMLElement | null,
    skillItems: [] as HTMLElement[],
  })

  // Cache for performance optimization (WeakMap auto-handles garbage collection)
  const animationCache = new WeakMap<HTMLElement, boolean>()

  /**
   * Set skill item element reference (used by template refs)
   */
  const setSkillRef = (
    el: Element | ComponentPublicInstance | null,
    index: number,
  ): void => {
    if (!el) return

    let element: HTMLElement | null = null

    if (typeof el === 'object' && '$el' in el) {
      // Handle Vue component instance
      element = (el as ComponentPublicInstance).$el as HTMLElement
    } else if (el instanceof HTMLElement) {
      // Handle direct HTML element
      element = el
    }

    if (element) {
      // Ensure the array is large enough
      if (index >= state.skillItems.length) {
        state.skillItems.length = index + 1
      }
      state.skillItems[index] = element
    }
  }

  /**
   * Optimized row grouping with performance considerations
   */
  const groupItemsIntoRows = (items: HTMLElement[]): HTMLElement[][] => {
    if (!items.length) return []

    const rows: HTMLElement[][] = []
    const itemsPerRow = config.itemsPerRow

    for (let i = 0; i < items.length; i += itemsPerRow) {
      const row = items.slice(i, i + itemsPerRow)
      if (row.length > 0) {
        rows.push(row)
      }
    }

    return rows
  }

  /**
   * Batch animate row items for performance using shared utilities
   */
  const animateRowItems = (rowItems: HTMLElement[], rowIndex: number): void => {
    if (!rowItems.length) return

    // Set will-change property for performance
    setWillChange(rowItems)

    // Batch GSAP animation for performance
    $gsap.fromTo(
      rowItems,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: config.duration,
        ease: config.ease,
        stagger: config.itemDelay,
        delay: rowIndex * config.rowDelay,
        onComplete: () => {
          // Performance: clear will-change after animation using shared utility
          clearWillChange(rowItems)
          // Mark as animated to prevent re-animation
          rowItems.forEach(item => animationCache.set(item, true))
        },
      },
    )
  }

  /**
   * Optimized scroll trigger creation using shared factory
   */
  const createRowAnimations = (rows: HTMLElement[][]): void => {
    rows.forEach((rowItems, rowIndex) => {
      if (!rowItems.length) return

      createTrigger({
        trigger: rowItems[0],
        start: config.triggerStart,
        once: true,
        onEnter: () => animateRowItems(rowItems, rowIndex),
      })
    })
  }

  /**
   * Get valid skill items with caching optimization
   */
  const getValidItems = (): HTMLElement[] => {
    const validElements = getValidElements(toRef(state, 'skillItems'))
    return validElements.filter(item => !animationCache.has(item))
  }

  /**
   * Optimized immediate hiding using shared style application
   */
  const hideItemsImmediately = (items: HTMLElement[]): void => {
    if (!isClientSide() || !items.length) return

    // Use shared style application utility for consistency
    applyStyles(items, {
      opacity: '0',
      transform: 'translateY(30px) scale(0.9)',
      willChange: 'transform, opacity',
    })

    // Mark as styled in cache
    items.forEach(item => animationCache.set(item, false)) // false = styled but not animated
  }

  /**
   * Validate animation prerequisites efficiently using shared utilities
   */
  const canInitializeAnimations = (): boolean => {
    return !!(isClientSide() && state.containerRef && state.skillItems.length)
  }

  /**
   * Main initialization with optimized execution
   */
  const initializeAnimations = (): void => {
    if (!canInitializeAnimations()) return

    const validItems = getValidItems()
    if (!validItems.length) return

    // Batch operations for performance
    hideItemsImmediately(validItems)

    const rows = groupItemsIntoRows(validItems)
    createRowAnimations(rows)
  }

  /**
   * Optimized cleanup using shared utilities
   */
  const cleanup = (): void => {
    cleanupTriggers()
  }

  /**
   * Reactive skill items watcher with debouncing using shared utility
   */
  const { debounce } = useDebounce()
  const debouncedInitialize = debounce(() => {
    if (state.skillItems.length > 0) {
      nextTick(initializeAnimations)
    }
  }, 16) // RAF-aligned debouncing

  watch(() => state.skillItems, debouncedInitialize, {
    deep: true,
    flush: 'post',
  })

  // Lifecycle management
  onUnmounted(cleanup)

  return {
    // State references
    containerRef: toRef(state, 'containerRef'),
    skillItems: toRef(state, 'skillItems'),

    // Core functions
    initializeAnimations,
    cleanup,
    setSkillRef,

    // Utilities
    canInitializeAnimations,
    getValidItems,
  }
}
