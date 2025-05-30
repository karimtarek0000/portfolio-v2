import { useNuxtApp } from '#app'
import type { Ref } from 'vue'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type AnimationType =
  | 'fadeUp'
  | 'fadeIn'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'textReveal'

interface BaseAnimationOptions {
  start?: string
  end?: string
  duration?: number
  delay?: number
  ease?: string
  once?: boolean
  scrub?: boolean | number
  stagger?: number
}

interface ScrollAnimationOptions extends BaseAnimationOptions {
  trigger?: HTMLElement | string
  onEnter?: () => void
  onLeave?: () => void
  onUpdate?: (self: ScrollTrigger) => void
}

interface TextAnimationOptions extends BaseAnimationOptions {
  opacity?: {
    base: number
    range: number
  }
  transform?: {
    yOffset: number
    scale: number
  }
}

interface TimelineAnimationOptions extends BaseAnimationOptions {
  scaleDirection?: 'bottom-to-top' | 'top-to-bottom'
  itemsPerRow?: number
  rowDelay?: number
}

// ============================================================================
// ANIMATION CONFIGURATIONS
// ============================================================================

const ANIMATION_PRESETS = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    final: { opacity: 1, y: 0 },
    transform: 'translateY(30px)',
  },
  fadeIn: {
    initial: { opacity: 0 },
    final: { opacity: 1 },
    transform: '',
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    final: { opacity: 1, x: 0 },
    transform: 'translateX(50px)',
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    final: { opacity: 1, x: 0 },
    transform: 'translateX(-50px)',
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    final: { opacity: 1, scale: 1 },
    transform: 'scale(0.9)',
  },
  textReveal: {
    initial: { opacity: 0.1 },
    final: { opacity: 1 },
    transform: '',
  },
} as const

const DEFAULT_OPTIONS: Required<BaseAnimationOptions> = {
  start: 'top 85%',
  end: 'bottom 20%',
  duration: 0.8,
  delay: 0,
  ease: 'power2.out',
  once: true,
  scrub: false,
  stagger: 0.1,
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

// Global caches for performance optimization
const styleCache = new WeakMap<HTMLElement, boolean>()
const deviceCache = new Map<string, any>()
const scrollTriggers: ScrollTrigger[] = []

// Client-side check
const isClient = (): boolean => import.meta.client

// Device detection with caching
const getDeviceInfo = () => {
  const getCachedValue = (key: string, calculator: () => any) => {
    if (deviceCache.has(key)) return deviceCache.get(key)
    const value = calculator()
    deviceCache.set(key, value)
    return value
  }

  return {
    isMobile: () =>
      getCachedValue(
        'isMobile',
        () => typeof window !== 'undefined' && window.innerWidth < 768,
      ),
    prefersReducedMotion: () =>
      getCachedValue(
        'reducedMotion',
        () =>
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ),
    clearCache: () => deviceCache.clear(),
  }
}

// ============================================================================
// CORE ANIMATION COMPOSABLE
// ============================================================================

export const useAnimations = () => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()
  const device = getDeviceInfo()

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Get valid DOM elements from various ref types
   */
  const getValidElements = (
    elementsRef: Ref<HTMLElement[]> | Ref<HTMLElement | null> | HTMLElement[],
  ): HTMLElement[] => {
    let elements: HTMLElement[] = []

    if (Array.isArray(elementsRef)) {
      elements = elementsRef
    } else if (elementsRef && 'value' in elementsRef) {
      elements = Array.isArray(elementsRef.value)
        ? elementsRef.value
        : elementsRef.value
        ? [elementsRef.value]
        : []
    }

    return elements.filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        typeof el.getBoundingClientRect === 'function',
    )
  }

  /**
   * Apply styles with caching to prevent duplicate DOM writes
   */
  const applyStyles = (
    elements: HTMLElement[],
    styles: Record<string, string>,
  ): void => {
    if (!isClient()) return

    elements.forEach(element => {
      if (!element || styleCache.has(element)) return

      Object.assign(element.style, styles)
      styleCache.set(element, true)
    })
  }

  /**
   * Get optimized animation config based on device capabilities
   */
  const getOptimizedConfig = (
    options: Partial<BaseAnimationOptions>,
  ): Required<BaseAnimationOptions> => {
    const isMobile = device.isMobile()
    const isReducedMotion = device.prefersReducedMotion()

    const config = { ...DEFAULT_OPTIONS, ...options }

    if (isReducedMotion) {
      config.duration = Math.min(config.duration, 0.3)
      config.stagger = 0
    } else if (isMobile) {
      config.duration *= 0.8
      config.stagger *= 0.5
    }

    return config
  }

  /**
   * Create and track scroll trigger
   */
  const createScrollTrigger = (options: {
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
      start: options.start || DEFAULT_OPTIONS.start,
      end: options.end,
      once: options.once ?? DEFAULT_OPTIONS.once,
      scrub: options.scrub ?? DEFAULT_OPTIONS.scrub,
      refreshPriority: -1, // Performance optimization
      onEnter: options.onEnter,
      onUpdate: options.onUpdate,
      onLeave: options.onLeave,
    })

    scrollTriggers.push(trigger)
    return trigger
  }

  // ============================================================================
  // ANIMATION METHODS
  // ============================================================================

  /**
   * Animate elements on scroll with various animation types
   */
  const animateOnScroll = (
    elements: Ref<HTMLElement[]> | Ref<HTMLElement | null> | HTMLElement[],
    type: AnimationType = 'fadeUp',
    options: Partial<ScrollAnimationOptions> = {},
  ): void => {
    if (!isClient()) return

    const validElements = getValidElements(elements)
    if (!validElements.length) return

    const config = getOptimizedConfig(options)
    const preset = ANIMATION_PRESETS[type]

    // Apply initial hiding styles
    const initialStyles = {
      opacity: '0',
      transform: preset.transform,
      willChange: 'transform, opacity',
    }
    applyStyles(validElements, initialStyles)

    // Set GSAP initial state
    $gsap.set(validElements, {
      ...preset.initial,
      willChange: 'transform, opacity',
    })

    // Create animations for each element
    validElements.forEach((element, index) => {
      createScrollTrigger({
        trigger:
          options.trigger instanceof HTMLElement ? options.trigger : element,
        start: config.start,
        end: config.end,
        once: config.once,
        onEnter: () => {
          $gsap.to(element, {
            ...preset.final,
            duration: config.duration,
            delay: config.delay + index * config.stagger,
            ease: config.ease,
            onComplete: () => {
              element.style.willChange = 'auto'
              styleCache.delete(element)
            },
          })
          options.onEnter?.()
        },
        onLeave: options.onLeave,
      })
    })
  }

  /**
   * Animate text lines with progressive reveal
   */
  const animateTextLines = (
    container: Ref<HTMLElement | null> | HTMLElement,
    options: Partial<TextAnimationOptions> = {},
  ): void => {
    if (!isClient()) return

    const containerElement =
      container instanceof HTMLElement ? container : container?.value

    if (!containerElement) return

    const lines = Array.from(
      containerElement.querySelectorAll('p, span, .animate-line'),
    )
    if (!lines.length) return

    const config = getOptimizedConfig(options)

    // Apply initial styles
    lines.forEach(line => {
      const element = line as HTMLElement
      if (!styleCache.has(element)) {
        const opacity = options.opacity?.base ?? 0.1
        Object.assign(element.style, {
          opacity: opacity.toString(),
          willChange: 'opacity',
        })
        styleCache.set(element, true)
      }
    })

    // Set GSAP initial state
    $gsap.set(lines, {
      opacity: options.opacity?.base ?? 0.1,
      willChange: 'opacity',
    })

    // Create scroll animation
    createScrollTrigger({
      trigger: containerElement,
      start: config.start,
      end: config.end,
      scrub: config.scrub === false ? 1 : config.scrub,
      once: config.once,
      onUpdate: self => {
        const progress = self.progress
        const lineCount = lines.length
        const baseOpacity = options.opacity?.base ?? 0.4
        const opacityRange = options.opacity?.range ?? 0.6

        lines.forEach((line, index) => {
          const lineProgress = Math.max(
            0,
            Math.min(1, progress * lineCount - index),
          )
          const opacity = baseOpacity + lineProgress * opacityRange

          // Apply enhanced transforms if specified
          const updates: any = { opacity }

          if (options.transform) {
            const { yOffset = 0, scale = 0 } = options.transform
            updates.y = (1 - lineProgress) * yOffset
            updates.scale = 0.98 + lineProgress * scale
          }

          $gsap.set(line, updates)
        })
      },
      onLeave: () => {
        lines.forEach(line => {
          ;(line as HTMLElement).style.willChange = 'auto'
        })
      },
    })
  }

  /**
   * Animate header elements with staggered reveals
   */
  const animateHeader = (
    headerRef: Ref<HTMLElement | null>,
    options: Partial<ScrollAnimationOptions> = {},
  ): void => {
    if (!isClient() || !headerRef.value) return

    const config = getOptimizedConfig(options)
    const elements = [
      headerRef.value.querySelector('.header__title'),
      headerRef.value.querySelector('.header__subtitle'),
    ].filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    // Apply initial styles
    const initialStyles = {
      opacity: '0',
      transform: 'translateY(20px) scale(0.98)',
      willChange: 'transform, opacity',
    }
    applyStyles(elements, initialStyles)

    // Set GSAP initial state
    const preset = device.prefersReducedMotion()
      ? { opacity: 0 }
      : device.isMobile()
      ? { opacity: 0, y: 20 }
      : { opacity: 0, y: 30, scale: 0.95 }

    $gsap.set(elements, {
      ...preset,
      willChange: 'transform, opacity',
    })

    // Create timeline animation
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
          },
        },
        index === 0 ? 0 : '<',
      )
    })

    createScrollTrigger({
      trigger: headerRef.value,
      start: config.start,
      once: config.once,
      onEnter: () => tl.play(),
    })
  }

  /**
   * Animate skills in grouped rows
   */
  const animateSkills = (
    skillsRef: Ref<HTMLElement[]>,
    options: Partial<TimelineAnimationOptions> = {},
  ): void => {
    if (!isClient()) return

    const validElements = getValidElements(skillsRef)
    if (!validElements.length) return

    const config = getOptimizedConfig(options)
    const itemsPerRow = options.itemsPerRow ?? 4
    const rowDelay = options.rowDelay ?? 0.2

    // Group elements into rows
    const rows: HTMLElement[][] = []
    for (let i = 0; i < validElements.length; i += itemsPerRow) {
      rows.push(validElements.slice(i, i + itemsPerRow))
    }

    // Apply initial styles
    applyStyles(validElements, {
      opacity: '0',
      transform: 'translateY(30px) scale(0.9)',
      willChange: 'transform, opacity',
    })

    // Animate each row
    rows.forEach((rowItems, rowIndex) => {
      if (!rowItems.length) return

      createScrollTrigger({
        trigger: rowItems[0],
        start: config.start,
        once: config.once,
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
                })
              },
            },
          )
        },
      })
    })
  }

  /**
   * Animate timeline elements (lines and dots)
   */
  const animateTimeline = (
    linesRef: Ref<HTMLElement[]>,
    dotsRef: Ref<HTMLElement[]>,
    options: Partial<TimelineAnimationOptions> = {},
  ): void => {
    if (!isClient()) return

    const config = getOptimizedConfig(options)
    const lines = getValidElements(linesRef)
    const dots = getValidElements(dotsRef)

    // Animate timeline lines
    if (lines.length) {
      applyStyles(lines, {
        scaleY: '0',
        transformOrigin:
          options.scaleDirection === 'top-to-bottom'
            ? 'top center'
            : 'bottom center',
        willChange: 'transform',
      })

      $gsap.set(lines, {
        scaleY: 0,
        transformOrigin:
          options.scaleDirection === 'top-to-bottom'
            ? 'top center'
            : 'bottom center',
        willChange: 'transform',
      })

      lines.forEach((line, index) => {
        createScrollTrigger({
          trigger: line,
          start: 'top 80%',
          once: config.once,
          onEnter: () => {
            $gsap.to(line, {
              scaleY: 1,
              duration: 0.6,
              ease: config.ease,
              delay: index * 0.1,
              onComplete: () => {
                line.style.willChange = 'auto'
              },
            })
          },
        })
      })
    }

    // Animate timeline dots
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
          onEnter: () => {
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
  }

  // ============================================================================
  // LIFECYCLE MANAGEMENT
  // ============================================================================

  /**
   * Clean up all animations and triggers
   */
  const cleanup = (): void => {
    if (!isClient()) return

    scrollTriggers.forEach(trigger => trigger.kill())
    scrollTriggers.length = 0
    styleCache.clear?.()
    device.clearCache()
  }

  /**
   * Refresh animations on resize
   */
  const refresh = (): void => {
    if (!isClient()) return

    device.clearCache()
    $ScrollTrigger?.refresh()
  }

  // Lifecycle hooks
  onUnmounted(cleanup)

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

    // Lifecycle
    cleanup,
    refresh,

    // Device info
    device,
  }
}

// ============================================================================
// TYPED EXPORT FOR BETTER DX
// ============================================================================

export type AnimationsComposable = ReturnType<typeof useAnimations>
export type {
  AnimationType,
  ScrollAnimationOptions,
  TextAnimationOptions,
  TimelineAnimationOptions,
}
