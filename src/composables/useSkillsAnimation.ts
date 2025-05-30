import type { Ref } from 'vue'

interface SkillsAnimationOptions {
  triggerStart?: string
  duration?: number
  staggerDelay?: number
  rowDelay?: number
  ease?: string
}

interface ResponsiveConfig {
  itemsPerRow: number
}

interface AnimationConfig {
  triggerStart: string
  duration: number
  staggerDelay: number
  rowDelay: number
  ease: string
}

export const useSkillsAnimation = (options: SkillsAnimationOptions = {}) => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Merge user options with defaults
  const config: AnimationConfig = {
    triggerStart: 'top 85%',
    duration: 0.6,
    staggerDelay: 0.1,
    rowDelay: 0.2,
    ease: 'back.out(1.7)',
    ...options,
  }

  // State management
  const skillItems = ref<HTMLElement[]>([])
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTriggers = ref<ScrollTrigger[]>([])
  const isHiddenInitially = ref(false)

  // Constants
  const INITIAL_ANIMATION_STATE = {
    opacity: 0,
    y: 50,
    scale: 0.8,
  } as const

  const FINAL_ANIMATION_STATE = {
    opacity: 1,
    y: 0,
    scale: 1,
  } as const

  const BREAKPOINTS = {
    desktop: 1024,
    tablet: 768,
  } as const

  /**
   * Set ref for skill item elements with proper type checking
   */
  const setSkillRef = (
    el: Element | ComponentPublicInstance | null,
    index: number,
  ): void => {
    if (!el) return

    const element = '$el' in el ? (el.$el as HTMLElement) : (el as HTMLElement)
    if (element instanceof HTMLElement) {
      skillItems.value[index] = element
      // Immediately hide element to prevent SSR flash
      if (import.meta.client && !isHiddenInitially.value) {
        element.style.opacity = '0'
        element.style.transform = 'translateY(50px) scale(0.8)'
        element.style.willChange = 'transform, opacity'
      }
    }
  }

  /**
   * Immediately hide all skill elements to prevent SSR flash
   */
  const hideElementsImmediately = (): void => {
    if (!import.meta.client || isHiddenInitially.value) return

    const validItems = skillItems.value.filter(Boolean)
    if (!validItems.length) return

    // Use direct style manipulation for immediate effect
    validItems.forEach(element => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(50px) scale(0.8)'
      element.style.willChange = 'transform, opacity'
    })

    isHiddenInitially.value = true
  }

  /**
   * Get responsive configuration based on current viewport
   */
  const getResponsiveConfig = (): ResponsiveConfig => {
    if (!import.meta.client) {
      return { itemsPerRow: 4 }
    }

    const { innerWidth } = window

    if (innerWidth >= BREAKPOINTS.desktop) return { itemsPerRow: 4 }
    if (innerWidth >= BREAKPOINTS.tablet) return { itemsPerRow: 3 }
    return { itemsPerRow: 2 }
  }

  /**
   * Create skill rows based on responsive layout
   */
  const createSkillRows = (items: HTMLElement[]): HTMLElement[][] => {
    const { itemsPerRow } = getResponsiveConfig()
    const rows: HTMLElement[][] = []

    for (let i = 0; i < items.length; i += itemsPerRow) {
      const row = items.slice(i, i + itemsPerRow)
      if (row.length > 0) {
        rows.push(row)
      }
    }

    return rows
  }

  /**
   * Set initial animation state for items
   */
  const setInitialState = (items: HTMLElement[]): void => {
    if (!items.length || !import.meta.client) return
    $gsap.set(items, INITIAL_ANIMATION_STATE)
  }

  /**
   * Animate items in a row with stagger effect
   */
  const animateRowItems = (rowItems: HTMLElement[], rowIndex: number): void => {
    if (!rowItems.length) return

    $gsap.to(rowItems, {
      ...FINAL_ANIMATION_STATE,
      duration: config.duration,
      ease: config.ease,
      stagger: config.staggerDelay,
      delay: rowIndex * config.rowDelay,
    })
  }

  /**
   * Create scroll triggers for each row
   */
  const createRowAnimations = (rows: HTMLElement[][]): void => {
    rows.forEach((rowItems, rowIndex) => {
      if (!rowItems.length) return

      const trigger = $ScrollTrigger.create({
        trigger: rowItems[0],
        start: config.triggerStart,
        once: true,
        onEnter: () => animateRowItems(rowItems, rowIndex),
      })

      scrollTriggers.value.push(trigger)
    })
  }

  /**
   * Validate animation prerequisites
   */
  const canInitializeAnimations = (): boolean => {
    return !!(
      import.meta.client &&
      containerRef.value &&
      skillItems.value.length
    )
  }

  /**
   * Get valid skill items (filter out null/undefined)
   */
  const getValidItems = (): HTMLElement[] => {
    return skillItems.value.filter(Boolean)
  }

  /**
   * Initialize animations when ready with SSR-safe approach
   */
  const initializeAnimations = (): void => {
    if (!canInitializeAnimations()) return

    const validItems = getValidItems()
    if (!validItems.length) return

    // Ensure elements are hidden before setting up animations
    if (!isHiddenInitially.value) {
      hideElementsImmediately()
    }

    const rows = createSkillRows(validItems)
    setInitialState(validItems)
    createRowAnimations(rows)
  }

  /**
   * Clean up all scroll triggers and reset state
   */
  const cleanupAnimations = (): void => {
    if (!import.meta.client) return

    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
  }

  /**
   * Handle window resize with debounced reinitialization
   */
  const handleResize = (): void => {
    if (!import.meta.client) return

    cleanupAnimations()
    nextTick(initializeAnimations)
  }

  /**
   * Setup lifecycle hooks with SSR-safe approach
   */
  const setupLifecycle = (): void => {
    // Watch for new skill items and hide them immediately
    watchEffect(() => {
      if (import.meta.client && skillItems.value.length > 0) {
        hideElementsImmediately()
      }
    })

    onMounted(() => {
      nextTick(() => {
        initializeAnimations()

        if (import.meta.client) {
          window.addEventListener('resize', handleResize)
        }
      })
    })

    onUnmounted(() => {
      cleanupAnimations()

      if (import.meta.client) {
        window.removeEventListener('resize', handleResize)
      }
    })
  }

  // Initialize lifecycle
  setupLifecycle()

  return {
    containerRef,
    setSkillRef,
  }
}
