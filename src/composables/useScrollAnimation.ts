import type { Ref } from 'vue'

interface ScrollAnimationOptions {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  once?: boolean
  onEnter?: () => void
  onLeave?: () => void
}

// Animation configuration constants for performance
const ANIMATION_CONFIGS = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    final: { opacity: 1, y: 0 },
    immediateHide: 'translateY(30px)',
  },
  fadeIn: {
    initial: { opacity: 0 },
    final: { opacity: 1 },
    immediateHide: '',
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    final: { opacity: 1, x: 0 },
    immediateHide: 'translateX(50px)',
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    final: { opacity: 1, x: 0 },
    immediateHide: 'translateX(-50px)',
  },
} as const

// Cache for immediate style application to prevent reapplication (WeakMap auto-cleans)
const styleCache = new WeakMap<HTMLElement, string>()

// Centralized client check for performance
const isClient = (): boolean => import.meta.client

export const useScrollAnimation = () => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  /**
   * Optimized immediate element hiding with caching
   */
  const applyImmediateHiding = (
    elements: HTMLElement[],
    animationType: keyof typeof ANIMATION_CONFIGS,
  ): void => {
    if (!isClient()) return

    const config = ANIMATION_CONFIGS[animationType]
    const transformValue = config.immediateHide

    elements.forEach(element => {
      // Skip if already styled to prevent unnecessary DOM writes
      if (styleCache.has(element)) return

      // Batch style application for performance
      const styles = {
        opacity: '0',
        transform: transformValue,
        willChange: 'transform, opacity',
      }

      Object.assign(element.style, styles)
      styleCache.set(element, animationType)
    })
  }

  /**
   * Create optimized GSAP animation with shared configuration
   */
  const createElementAnimation = (
    element: HTMLElement,
    animationType: keyof typeof ANIMATION_CONFIGS,
    index: number,
    options: Partial<ScrollAnimationOptions>,
  ): void => {
    const config = ANIMATION_CONFIGS[animationType]

    // Set initial GSAP state with performance optimizations
    $gsap.set(element, {
      ...config.initial,
      willChange: 'transform, opacity',
    })

    $ScrollTrigger.create({
      trigger: element,
      start: options.start || 'top 85%',
      end: options.end || 'bottom 20%',
      once: options.once !== undefined ? options.once : true,
      // Performance optimization for mobile
      refreshPriority: -1,
      onEnter: () => {
        $gsap.to(element, {
          ...config.final,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          onComplete: () => {
            // Performance: clear will-change after animation
            element.style.willChange = 'auto'
            // Remove from cache to allow future reanimation if needed
            styleCache.delete(element)
          },
        })
        options.onEnter?.()
      },
      onLeave: options.onLeave,
    })
  }

  /**
   * Validate and filter DOM elements efficiently
   */
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

  /**
   * Animate text lines with progressive opacity based on scroll position
   */
  const animateTextLines = (
    containerRef: Ref<HTMLElement | null>,
    options: Partial<ScrollAnimationOptions> = {},
  ) => {
    if (!isClient() || !containerRef.value) return

    const container = containerRef.value
    const lines = Array.from(
      container.querySelectorAll('p, span, .animate-line'),
    )

    if (!lines.length) return

    // Batch immediate hiding for performance
    lines.forEach(line => {
      const element = line as HTMLElement
      if (!styleCache.has(element)) {
        Object.assign(element.style, {
          opacity: '0.1',
          willChange: 'opacity',
        })
        styleCache.set(element, 'textLine')
      }
    })

    // Set initial GSAP state efficiently
    $gsap.set(lines, {
      opacity: 0.1,
      willChange: 'opacity',
    })

    // Create optimized scroll animation
    $ScrollTrigger.create({
      trigger: container,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      scrub: options.scrub !== undefined ? options.scrub : 1,
      once: options.once || false,
      refreshPriority: -1, // Performance optimization
      onUpdate: self => {
        const progress = self.progress
        const lineCount = lines.length

        // Batch DOM updates using GSAP for optimal performance
        lines.forEach((line, index) => {
          const lineProgress = Math.max(
            0,
            Math.min(1, progress * lineCount - index),
          )
          const opacity = 0.4 + lineProgress * 0.6

          $gsap.set(line, { opacity })
        })
      },
      onEnter: options.onEnter,
      onLeave: () => {
        // Performance: clear will-change for completed lines
        lines.forEach(line => {
          ;(line as HTMLElement).style.willChange = 'auto'
        })
        options.onLeave?.()
      },
    })
  }

  /**
   * Animate elements on scroll with fade and transform effects
   */
  const animateOnScroll = (
    elementsRef: Ref<HTMLElement[]> | Ref<HTMLElement | null>,
    animationType: keyof typeof ANIMATION_CONFIGS = 'fadeUp',
    options: Partial<ScrollAnimationOptions> = {},
  ) => {
    if (!isClient()) return

    const elements = getValidElements(elementsRef)

    if (!elements.length) {
      console.warn('No valid DOM elements found for animation')
      return
    }

    // Batch immediate hiding for all elements
    applyImmediateHiding(elements, animationType)

    // Create animations for each element with optimized batching
    elements.forEach((element, index) => {
      createElementAnimation(element, animationType, index, options)
    })
  }

  /**
   * Optimized cleanup - WeakMap automatically handles garbage collection
   */
  const cleanup = () => {
    if (!isClient() || !$ScrollTrigger) return

    // Batch cleanup for performance
    $ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  return {
    animateTextLines,
    animateOnScroll,
    cleanup,
  }
}
