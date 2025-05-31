import { useNuxtApp } from '#app'
import type { Ref } from 'vue'
import {
  type AnimationCallbacks,
  type AnimationType,
  type BaseAnimationOptions,
  type ElementInput,
  type ScrollAnimationOptions,
  type TextAnimationOptions,
  type TimelineAnimationOptions,
  ANIMATION_PRESETS,
  DEFAULT_OPTIONS,
  PERFORMANCE_CONFIG,
} from './animation.config'

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

// Singleton caches for performance optimization
class AnimationCache {
  private static instance: AnimationCache
  private styleCache = new WeakMap<HTMLElement, boolean>()
  private deviceCache = new Map<string, any>()
  private scrollTriggers: ScrollTrigger[] = []
  private cleanupTimer?: ReturnType<typeof setInterval>

  static getInstance(): AnimationCache {
    if (!AnimationCache.instance) {
      AnimationCache.instance = new AnimationCache()
    }
    return AnimationCache.instance
  }

  getStyleCache() {
    return this.styleCache
  }
  getDeviceCache() {
    return this.deviceCache
  }
  getScrollTriggers() {
    return this.scrollTriggers
  }

  addScrollTrigger(trigger: ScrollTrigger) {
    this.scrollTriggers.push(trigger)
  }

  clearCaches() {
    this.styleCache = new WeakMap()
    this.deviceCache.clear()
  }

  cleanup() {
    this.scrollTriggers.forEach(trigger => trigger.kill())
    this.scrollTriggers.length = 0
    this.clearCaches()
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }
  }

  startPeriodicCleanup() {
    // Only start cleanup on client side to avoid SSR issues
    if (this.cleanupTimer || !process.client) return

    this.cleanupTimer = setInterval(() => {
      this.deviceCache.clear()
    }, PERFORMANCE_CONFIG.CACHE_CLEAR_INTERVAL)
  }
}

// Device detection utility with improved caching
const createDeviceDetector = () => {
  const cache = AnimationCache.getInstance().getDeviceCache()

  const getCachedValue = <T>(key: string, calculator: () => T): T => {
    if (cache.has(key)) return cache.get(key)
    const value = calculator()
    cache.set(key, value)
    return value
  }

  return {
    isMobile: () =>
      getCachedValue(
        'isMobile',
        () =>
          process.client &&
          typeof window !== 'undefined' &&
          window.innerWidth < 768,
      ),
    prefersReducedMotion: () =>
      getCachedValue(
        'reducedMotion',
        () =>
          process.client &&
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ),
    isClient: () => getCachedValue('isClient', () => process.client),
    clearCache: () => cache.clear(),
  }
}

// Simple debounce function to avoid external dependency
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// ============================================================================
// CORE ANIMATION COMPOSABLE
// ============================================================================

export const useAnimations = () => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()
  const device = createDeviceDetector()
  const cache = AnimationCache.getInstance()

  // Start periodic cleanup only on client side
  onMounted(() => {
    if (process.client) {
      cache.startPeriodicCleanup()
    }
  })

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Enhanced element validation with better type checking
   */
  const getValidElements = (elementsRef: ElementInput): HTMLElement[] => {
    let elements: HTMLElement[] = []

    if (Array.isArray(elementsRef)) {
      elements = elementsRef
    } else if (elementsRef && 'value' in elementsRef) {
      const value = elementsRef.value
      elements = Array.isArray(value) ? value : value ? [value] : []
    }

    return elements.filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el.isConnected && // Check if element is still in DOM
        typeof el.getBoundingClientRect === 'function',
    )
  }

  /**
   * Get single container element from ElementInput
   */
  const getContainerElement = (container: ElementInput): HTMLElement | null => {
    if (Array.isArray(container)) {
      return container[0] || null
    } else if (container && 'value' in container) {
      const value = container.value
      return Array.isArray(value) ? value[0] || null : value
    }
    return (container as HTMLElement) || null
  }

  /**
   * Optimized style application with batching
   */
  const applyStyles = (
    elements: HTMLElement[],
    styles: Record<string, string>,
  ): void => {
    if (!device.isClient()) return

    const styleCache = cache.getStyleCache()

    // Batch DOM writes for better performance
    if (process.client) {
      requestAnimationFrame(() => {
        elements.forEach(element => {
          if (!element || styleCache.has(element)) return

          Object.assign(element.style, styles)
          styleCache.set(element, true)
        })
      })
    }
  }

  /**
   * Smart configuration merging with device-specific optimizations
   */
  const getOptimizedConfig = (
    options: Partial<BaseAnimationOptions>,
  ): Required<BaseAnimationOptions> => {
    const isMobile = device.isMobile()
    const isReducedMotion = device.prefersReducedMotion()

    let config = { ...DEFAULT_OPTIONS, ...options }

    // Apply device-specific optimizations
    if (isReducedMotion) {
      config = {
        ...config,
        duration: Math.min(
          config.duration,
          PERFORMANCE_CONFIG.REDUCED_MOTION_MAX_DURATION,
        ),
        stagger: 0,
        delay: 0,
      }
    } else if (isMobile) {
      config = {
        ...config,
        duration:
          config.duration * PERFORMANCE_CONFIG.MOBILE_DURATION_MULTIPLIER,
        stagger: config.stagger * PERFORMANCE_CONFIG.MOBILE_STAGGER_MULTIPLIER,
      }
    }

    return config
  }

  /**
   * Enhanced ScrollTrigger creation with better error handling
   */
  const createScrollTrigger = (options: {
    trigger: HTMLElement
    start?: string
    end?: string
    once?: boolean
    scrub?: boolean | number
    callbacks?: AnimationCallbacks
  }): ScrollTrigger | null => {
    if (!device.isClient()) return null

    try {
      const trigger = $ScrollTrigger.create({
        trigger: options.trigger,
        start: options.start || DEFAULT_OPTIONS.start,
        end: options.end,
        once: options.once ?? DEFAULT_OPTIONS.once,
        scrub: options.scrub ?? DEFAULT_OPTIONS.scrub,
        refreshPriority: PERFORMANCE_CONFIG.REFRESH_PRIORITY,
        onEnter: options.callbacks?.onEnter,
        onUpdate: options.callbacks?.onUpdate,
        onLeave: options.callbacks?.onLeave,
      })

      cache.addScrollTrigger(trigger)
      return trigger
    } catch (error) {
      console.warn('Failed to create ScrollTrigger:', error)
      return null
    }
  }

  // ============================================================================
  // ENHANCED ANIMATION METHODS
  // ============================================================================

  /**
   * Universal animation method with improved error handling and performance
   */
  const animateOnScroll = (
    elements: ElementInput,
    type: AnimationType = 'fadeUp',
    options: Partial<ScrollAnimationOptions> = {},
  ): void => {
    if (!device.isClient()) return

    const validElements = getValidElements(elements)
    if (!validElements.length) {
      console.warn('No valid elements found for animation')
      return
    }

    const config = getOptimizedConfig(options)
    const preset = ANIMATION_PRESETS[type]

    // Apply initial styles with batching
    applyStyles(validElements, {
      opacity: '0',
      transform: preset.transform,
      willChange: 'transform, opacity',
    })

    // Set GSAP initial state
    $gsap.set(validElements, {
      ...preset.initial,
      willChange: 'transform, opacity',
    })

    // Create optimized animations
    validElements.forEach((element, index) => {
      createScrollTrigger({
        trigger:
          options.trigger instanceof HTMLElement ? options.trigger : element,
        start: config.start,
        end: config.end,
        once: config.once,
        callbacks: {
          onEnter: () => {
            $gsap.to(element, {
              ...preset.final,
              duration: config.duration,
              delay: config.delay + index * config.stagger,
              ease: config.ease,
              onComplete: () => {
                element.style.willChange = 'auto'
                cache.getStyleCache().delete(element)
                options.onEnter?.()
              },
            })
          },
          onLeave: options.onLeave,
        },
      })
    })
  }

  /**
   * Enhanced text animation with better performance and accessibility
   */
  const animateTextLines = (
    container: ElementInput,
    options: Partial<TextAnimationOptions> = {},
  ): void => {
    if (!device.isClient()) return

    const containerElement = getContainerElement(container)

    if (!containerElement) {
      console.warn('No valid container found for text animation')
      return
    }

    const lines = Array.from(
      containerElement.querySelectorAll('p, span, .animate-line'),
    ) as HTMLElement[]

    if (!lines.length) return

    const config = getOptimizedConfig(options)
    const baseOpacity = options.opacity?.base ?? 0.1

    // Apply initial styles efficiently
    lines.forEach(line => {
      if (!cache.getStyleCache().has(line)) {
        Object.assign(line.style, {
          opacity: baseOpacity.toString(),
          willChange: 'opacity',
        })
        cache.getStyleCache().set(line, true)
      }
    })

    $gsap.set(lines, {
      opacity: baseOpacity,
      willChange: 'opacity',
    })

    // Create optimized scroll animation
    createScrollTrigger({
      trigger: containerElement,
      start: config.start,
      end: config.end,
      once: config.once,
      callbacks: {
        onUpdate: self => {
          const progress = self.progress
          const lineCount = lines.length
          const opacityRange = options.opacity?.range ?? 0.6

          // Batch updates for better performance
          const updates = lines.map((line, index) => {
            const lineProgress = Math.max(
              0,
              Math.min(1, progress * lineCount - index),
            )
            const opacity = baseOpacity + lineProgress * opacityRange

            const updateObj: any = { opacity }

            if (options.transform) {
              const { yOffset = 0, scale = 0 } = options.transform
              updateObj.y = (1 - lineProgress) * yOffset
              updateObj.scale = 0.98 + lineProgress * scale
            }

            return { element: line, updates: updateObj }
          })

          // Apply all updates in a single batch
          updates.forEach(({ element, updates }) => {
            $gsap.set(element, updates)
          })
        },
        onLeave: () => {
          lines.forEach(line => {
            line.style.willChange = 'auto'
            cache.getStyleCache().delete(line)
          })
        },
      },
    })
  }

  /**
   * Enhanced header animation with better performance
   */
  const animateHeader = (
    headerRef: Ref<HTMLElement | null>,
    options: Partial<ScrollAnimationOptions> = {},
  ): void => {
    if (!device.isClient() || !headerRef.value) return

    const config = getOptimizedConfig(options)
    const elements = [
      headerRef.value.querySelector('.header__title'),
      headerRef.value.querySelector('.header__subtitle'),
    ].filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    // Apply initial styles
    applyStyles(elements, {
      opacity: '0',
      transform: 'translateY(20px) scale(0.98)',
      willChange: 'transform, opacity',
    })

    // Set device-optimized initial state
    const preset = device.prefersReducedMotion()
      ? { opacity: 0 }
      : device.isMobile()
      ? { opacity: 0, y: 20 }
      : { opacity: 0, y: 30, scale: 0.95 }

    $gsap.set(elements, {
      ...preset,
      willChange: 'transform, opacity',
    })

    // Create optimized timeline
    const tl = $gsap.timeline({
      paused: true,
      defaults: {
        ease: config.ease,
        duration: config.duration,
      },
    })

    elements.forEach((element, index) => {
      const finalState = device.prefersReducedMotion()
        ? { opacity: 1 }
        : { opacity: 1, y: 0, scale: 1 }

      tl.to(
        element,
        {
          ...finalState,
          delay: index * config.stagger,
          onComplete: () => {
            element.style.willChange = 'auto'
            cache.getStyleCache().delete(element)
          },
        },
        index === 0 ? 0 : '<',
      )
    })

    createScrollTrigger({
      trigger: headerRef.value,
      start: config.start,
      once: config.once,
      callbacks: {
        onEnter: () => tl.play(),
      },
    })
  }

  /**
   * Enhanced skills animation with row-based grouping
   */
  const animateSkills = (
    skillsRef: Ref<HTMLElement[]>,
    options: Partial<TimelineAnimationOptions> = {},
  ): void => {
    if (!device.isClient()) return

    const validElements = getValidElements(skillsRef)
    if (!validElements.length) return

    const config = getOptimizedConfig(options)
    const itemsPerRow = options.itemsPerRow ?? 4
    const rowDelay = options.rowDelay ?? 0.2

    // Group elements into rows efficiently
    const rows: HTMLElement[][] = []
    for (let i = 0; i < validElements.length; i += itemsPerRow) {
      const row = validElements.slice(i, i + itemsPerRow)
      if (row.length) rows.push(row)
    }

    // Apply initial styles
    applyStyles(validElements, {
      opacity: '0',
      transform: 'translateY(30px) scale(0.9)',
      willChange: 'transform, opacity',
    })

    // Animate each row with staggered timing
    rows.forEach((rowItems, rowIndex) => {
      createScrollTrigger({
        trigger: rowItems[0],
        start: config.start,
        once: config.once,
        callbacks: {
          onEnter: () => {
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
                stagger: config.stagger,
                delay: rowIndex * rowDelay,
                onComplete: () => {
                  rowItems.forEach(item => {
                    item.style.willChange = 'auto'
                    cache.getStyleCache().delete(item)
                  })
                },
              },
            )
          },
        },
      })
    })
  }

  /**
   * Enhanced timeline animation with better sequencing
   */
  const animateTimeline = (
    linesRef: Ref<HTMLElement[]>,
    dotsRef: Ref<HTMLElement[]>,
    options: Partial<TimelineAnimationOptions> = {},
  ): void => {
    if (!device.isClient()) return

    const config = getOptimizedConfig(options)
    const lines = getValidElements(linesRef)
    const dots = getValidElements(dotsRef)

    // Animate timeline lines with optimized transforms
    if (lines.length) {
      const transformOrigin =
        options.scaleDirection === 'top-to-bottom'
          ? 'top center'
          : 'bottom center'

      applyStyles(lines, {
        scaleY: '0',
        transformOrigin,
        willChange: 'transform',
      })

      $gsap.set(lines, {
        scaleY: 0,
        transformOrigin,
        willChange: 'transform',
      })

      lines.forEach((line, index) => {
        createScrollTrigger({
          trigger: line,
          start: 'top 80%',
          once: config.once,
          callbacks: {
            onEnter: () => {
              $gsap.to(line, {
                scaleY: 1,
                duration: 0.6,
                ease: config.ease,
                delay: index * 0.1,
                onComplete: () => {
                  line.style.willChange = 'auto'
                  cache.getStyleCache().delete(line)
                },
              })
            },
          },
        })
      })
    }

    // Animate timeline dots with elastic easing
    if (dots.length) {
      $gsap.set(dots, {
        scale: 0,
        transformOrigin: 'center center',
      })

      dots.forEach((dot, index) => {
        createScrollTrigger({
          trigger: dot,
          start: 'top 90%',
          once: config.once,
          callbacks: {
            onEnter: () => {
              $gsap.to(dot, {
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.4)',
                delay: index * 0.15,
                onComplete: () => {
                  cache.getStyleCache().delete(dot)
                },
              })
            },
          },
        })
      })
    }
  }

  // ============================================================================
  // LIFECYCLE & UTILITY METHODS
  // ============================================================================

  /**
   * Enhanced cleanup with proper resource management
   */
  const cleanup = (): void => {
    if (!device.isClient()) return
    cache.cleanup()
  }

  /**
   * Smart refresh with debouncing
   */
  const refresh = debounce((): void => {
    if (!device.isClient()) return
    device.clearCache()
    $ScrollTrigger?.refresh()
  }, 100)

  // Lifecycle management
  onUnmounted(cleanup)

  // Auto-cleanup on page navigation
  if (process.client) {
    onMounted(() => {
      window.addEventListener('beforeunload', cleanup)
    })

    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', cleanup)
      }
    })
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    // Core animation methods
    animateOnScroll,
    animateTextLines,
    animateHeader,
    animateSkills,
    animateTimeline,

    // Utilities
    getValidElements,
    applyStyles,
    createScrollTrigger,
    getOptimizedConfig,

    // Lifecycle
    cleanup,
    refresh,

    // Device info
    device,

    // Cache management
    clearCache: () => cache.clearCaches(),
  }
}

// ============================================================================
// TYPED EXPORTS
// ============================================================================

export type AnimationsComposable = ReturnType<typeof useAnimations>
