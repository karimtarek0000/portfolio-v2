import type { Ref } from 'vue'

interface SkillsAnimationOptions {
  triggerStart?: string
  rowDelay?: number
  itemDelay?: number
  duration?: number
  ease?: string
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

// Cache for performance optimization (WeakMap auto-handles garbage collection)
const animationCache = new WeakMap<HTMLElement, boolean>()
const isClient = (): boolean => import.meta.client

export const useSkillsAnimation = (options: SkillsAnimationOptions = {}) => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Merge configuration efficiently
  const config = { ...DEFAULT_CONFIG, ...options }

  // Consolidated state management
  const state = reactive({
    containerRef: null as HTMLElement | null,
    skillItems: [] as HTMLElement[],
    scrollTriggers: [] as ScrollTrigger[],
  })

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
   * Batch animate row items for performance
   */
  const animateRowItems = (rowItems: HTMLElement[], rowIndex: number): void => {
    if (!rowItems.length) return

    // Batch GSAP animation for performance
    $gsap.fromTo(
      rowItems,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
        willChange: 'transform, opacity',
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
          // Performance: clear will-change after animation
          rowItems.forEach(item => {
            item.style.willChange = 'auto'
          })
        },
      },
    )
  }

  /**
   * Optimized scroll trigger creation with batching
   */
  const createRowAnimations = (rows: HTMLElement[][]): void => {
    rows.forEach((rowItems, rowIndex) => {
      if (!rowItems.length) return

      const trigger = $ScrollTrigger.create({
        trigger: rowItems[0],
        start: config.triggerStart,
        once: true,
        refreshPriority: -1, // Performance optimization
        onEnter: () => animateRowItems(rowItems, rowIndex),
      })

      state.scrollTriggers.push(trigger)
    })
  }

  /**
   * Validate animation prerequisites efficiently
   */
  const canInitializeAnimations = (): boolean => {
    return !!(isClient() && state.containerRef && state.skillItems.length)
  }

  /**
   * Get valid skill items with caching
   */
  const getValidItems = (): HTMLElement[] => {
    return state.skillItems.filter(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && !animationCache.has(item),
    )
  }

  /**
   * Optimized immediate hiding with batch operations
   */
  const hideItemsImmediately = (items: HTMLElement[]): void => {
    if (!isClient() || !items.length) return

    // Batch style application for performance
    items.forEach(item => {
      if (animationCache.has(item)) return

      Object.assign(item.style, {
        opacity: '0',
        transform: 'translateY(30px) scale(0.9)',
        willChange: 'transform, opacity',
      })
      animationCache.set(item, true)
    })
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
   * Optimized cleanup - WeakMap automatically handles garbage collection
   */
  const cleanup = (): void => {
    if (!isClient()) return

    // Batch cleanup
    state.scrollTriggers.forEach(trigger => trigger.kill())
    state.scrollTriggers.length = 0
  }

  /**
   * Reactive skill items watcher with debouncing
   */
  let watcherTimeout: ReturnType<typeof setTimeout>
  watch(
    () => state.skillItems,
    () => {
      clearTimeout(watcherTimeout)
      watcherTimeout = setTimeout(() => {
        if (state.skillItems.length > 0) {
          nextTick(initializeAnimations)
        }
      }, 16) // RAF-aligned debouncing
    },
    { deep: true, flush: 'post' },
  )

  // Lifecycle management
  onUnmounted(() => {
    cleanup()
    clearTimeout(watcherTimeout)
  })

  return {
    // State references
    containerRef: toRef(state, 'containerRef'),
    skillItems: toRef(state, 'skillItems'),

    // Core functions
    initializeAnimations,
    cleanup,
    setSkillRef, // Export the setSkillRef function

    // Utilities
    canInitializeAnimations,
    getValidItems,
  }
}
