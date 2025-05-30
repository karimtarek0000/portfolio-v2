import type { Ref } from 'vue'

interface ScrollAnimationOptions {
  trigger: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  once?: boolean
  onEnter?: () => void
  onLeave?: () => void
}

export const useScrollAnimation = () => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  /**
   * Animate text lines with progressive opacity based on scroll position
   */
  const animateTextLines = (
    containerRef: Ref<HTMLElement | null>,
    options: Partial<ScrollAnimationOptions> = {},
  ) => {
    if (!import.meta.client || !containerRef.value) return

    const container = containerRef.value
    const lines = container.querySelectorAll('p, span, .animate-line')

    if (!lines.length) return

    // Set initial state - low opacity for all lines
    $gsap.set(lines, {
      opacity: 0.1,
      willChange: 'opacity',
    })

    // Create scroll-triggered animation
    $ScrollTrigger.create({
      trigger: container,
      start: options.start || 'top 80%',
      end: options.end || 'bottom 20%',
      scrub: options.scrub !== undefined ? options.scrub : 1,
      once: options.once || false,
      onUpdate: self => {
        const progress = self.progress

        lines.forEach((line, index) => {
          // Calculate individual line progress based on scroll position
          const lineProgress = Math.max(
            0,
            Math.min(1, progress * lines.length - index),
          )

          // Interpolate opacity from 0.7 to 1.0
          const opacity = 0.4 + lineProgress * 0.6

          $gsap.set(line, { opacity })
        })
      },
      onEnter: options.onEnter,
      onLeave: options.onLeave,
    })
  }

  /**
   * Animate elements on scroll with fade and transform effects
   */
  const animateOnScroll = (
    elementsRef: Ref<HTMLElement[]> | Ref<HTMLElement | null>,
    animationType: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' = 'fadeUp',
    options: Partial<ScrollAnimationOptions> = {},
  ) => {
    if (!import.meta.client) return

    // Properly extract and filter DOM elements
    let elements: HTMLElement[] = []

    if (Array.isArray(elementsRef.value)) {
      elements = elementsRef.value.filter(
        (el): el is HTMLElement => el != null && el instanceof HTMLElement,
      )
    } else if (elementsRef.value && elementsRef.value instanceof HTMLElement) {
      elements = [elementsRef.value]
    }

    if (!elements.length) {
      console.warn('No valid DOM elements found for animation')
      return
    }

    elements.forEach((element, index) => {
      // Double-check that element is a valid DOM node
      if (!element || typeof element.getBoundingClientRect !== 'function') {
        console.warn('Invalid element found, skipping animation:', element)
        return
      }

      // Set initial state based on animation type
      const initialState: any = { willChange: 'transform, opacity' }
      const animateToState: any = { opacity: 1, ease: 'power2.out' }

      switch (animationType) {
        case 'fadeUp':
          initialState.opacity = 0
          initialState.y = 30
          animateToState.y = 0
          break
        case 'fadeIn':
          initialState.opacity = 0
          break
        case 'slideLeft':
          initialState.opacity = 0
          initialState.x = 50
          animateToState.x = 0
          break
        case 'slideRight':
          initialState.opacity = 0
          initialState.x = -50
          animateToState.x = 0
          break
      }

      $gsap.set(element, initialState)

      $ScrollTrigger.create({
        trigger: element,
        start: options.start || 'top 85%',
        end: options.end || 'bottom 20%',
        once: options.once !== undefined ? options.once : true,
        onEnter: () => {
          $gsap.to(element, {
            ...animateToState,
            duration: 0.8,
            delay: index * 0.1,
          })
          options.onEnter?.()
        },
        onLeave: options.onLeave,
      })
    })
  }

  /**
   * Cleanup all ScrollTrigger instances
   */
  const cleanup = () => {
    if (import.meta.client && $ScrollTrigger) {
      $ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }

  return {
    animateTextLines,
    animateOnScroll,
    cleanup,
  }
}
