/**
 * Shared animation utilities for performance optimization and DRY compliance
 * Provides common functions used across all animation composables
 */

// Global performance caches (WeakMaps auto-handle garbage collection)
const globalStyleCache = new WeakMap<HTMLElement, boolean>()
const globalDeviceCache = new Map<string, any>()

// Performance-optimized client check
export const isClientSide = (): boolean => import.meta.client

/**
 * Centralized device detection with caching
 */
export const useDeviceDetection = () => {
  const isMobile = (): boolean => {
    const key = 'isMobile'
    if (globalDeviceCache.has(key)) return globalDeviceCache.get(key)

    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    globalDeviceCache.set(key, mobile)
    return mobile
  }

  const prefersReducedMotion = (): boolean => {
    const key = 'reducedMotion'
    if (globalDeviceCache.has(key)) return globalDeviceCache.get(key)

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    globalDeviceCache.set(key, reduced)
    return reduced
  }

  const clearCache = (): void => {
    globalDeviceCache.clear()
  }

  return { isMobile, prefersReducedMotion, clearCache }
}

/**
 * High-performance style application with caching
 */
export const useBatchStyleApplication = () => {
  const applyStyles = (
    elements: HTMLElement[],
    styles: Record<string, string>,
  ): void => {
    if (!isClientSide()) return

    elements.forEach(element => {
      if (!element || globalStyleCache.has(element)) return

      Object.assign(element.style, styles)
      globalStyleCache.set(element, true)
    })
  }

  // WeakMaps don't need manual clearing - they handle garbage collection automatically
  const clearStyleCache = (): void => {
    // No-op for WeakMap - automatic cleanup
  }

  return { applyStyles, clearStyleCache }
}

/**
 * Optimized scroll trigger factory
 */
export const useScrollTriggerFactory = () => {
  const { $ScrollTrigger } = useNuxtApp()
  const triggers = ref<ScrollTrigger[]>([])

  const createTrigger = (options: {
    trigger: HTMLElement
    start?: string
    end?: string
    once?: boolean
    scrub?: boolean | number
    onEnter?: () => void
    onUpdate?: (self: any) => void
    onLeave?: () => void
  }): ScrollTrigger => {
    const trigger = $ScrollTrigger.create({
      trigger: options.trigger,
      start: options.start || 'top 85%',
      end: options.end,
      once: options.once ?? true,
      scrub: options.scrub,
      refreshPriority: -1, // Performance optimization
      onEnter: options.onEnter,
      onUpdate: options.onUpdate,
      onLeave: options.onLeave,
    })

    triggers.value.push(trigger)
    return trigger
  }

  const cleanup = (): void => {
    if (!isClientSide()) return

    triggers.value.forEach(trigger => trigger.kill())
    triggers.value.length = 0
  }

  return { createTrigger, cleanup, triggers: readonly(triggers) }
}

/**
 * Performance-optimized animation timer using RAF
 */
export const useAnimationTimer = () => {
  const createTimer = (duration: number, callback: () => void): void => {
    if (!isClientSide()) return

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

  return { createTimer }
}

/**
 * Debounced function utility for performance
 */
export const useDebounce = () => {
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number,
  ): T => {
    let timeoutId: ReturnType<typeof setTimeout>

    return ((...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }) as T
  }

  return { debounce }
}

/**
 * Element validation utility
 */
export const useElementValidation = () => {
  const getValidElements = (
    elementsRef: Ref<HTMLElement[]> | Ref<HTMLElement | null>,
  ): HTMLElement[] => {
    if (!elementsRef.value) return []

    const elements = Array.isArray(elementsRef.value)
      ? elementsRef.value
      : [elementsRef.value]

    return elements.filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        typeof el.getBoundingClientRect === 'function',
    )
  }

  const validateContainer = (
    containerRef: Ref<HTMLElement | null>,
  ): boolean => {
    return !!(containerRef.value && isClientSide())
  }

  return { getValidElements, validateContainer }
}

/**
 * Optimized will-change management
 */
export const useWillChangeManager = () => {
  const setWillChange = (
    elements: HTMLElement[],
    properties: string = 'transform, opacity',
  ): void => {
    elements.forEach(element => {
      if (element) element.style.willChange = properties
    })
  }

  const clearWillChange = (elements: HTMLElement[]): void => {
    elements.forEach(element => {
      if (element) element.style.willChange = 'auto'
    })
  }

  return { setWillChange, clearWillChange }
}
