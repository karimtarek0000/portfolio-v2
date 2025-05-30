import { useNuxtApp } from '#app'
import type { Ref } from 'vue'

interface AboutAnimationRefs {
  textContainerRef: Ref<HTMLElement | null>
}

interface AboutAnimationOptions {
  textAnimation?: {
    start?: string
    end?: string
    scrub?: number | boolean
    once?: boolean
  }
}

export const useAboutAnimations = () => {
  const { animateTextLines, cleanup } = useScrollAnimation()

  /**
   * Initialize animations for the About section (text only)
   */
  const initializeAnimations = (
    refs: AboutAnimationRefs,
    options: AboutAnimationOptions = {},
  ) => {
    if (!import.meta.client) return

    const { textContainerRef } = refs

    // Text animation configuration
    const textConfig = {
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1,
      once: false,
      ...options.textAnimation,
    }

    // Animate text lines with progressive opacity
    animateTextLines(textContainerRef, textConfig)
  }

  /**
   * Custom text line animation specifically for About section
   * with enhanced visual effects
   */
  const animateAboutText = (
    containerRef: Ref<HTMLElement | null>,
    options: AboutAnimationOptions['textAnimation'] = {},
  ) => {
    if (!import.meta.client || !containerRef.value) return

    const { $gsap, $ScrollTrigger } = useNuxtApp()
    const container = containerRef.value
    const lines = container.querySelectorAll('.animate-line')

    if (!lines.length) return

    // Enhanced initial state for About section
    $gsap.set(lines, {
      opacity: 0.2,
      y: 10,
      willChange: 'opacity, transform',
    })

    $ScrollTrigger.create({
      trigger: container,
      start: options.start || 'top 75%',
      end: options.end || 'bottom 25%',
      scrub: options.scrub !== undefined ? options.scrub : 1,
      once: options.once || false,
      onUpdate: self => {
        const progress = self.progress

        lines.forEach((line, index) => {
          const lineProgress = Math.max(
            0,
            Math.min(1, progress * lines.length - index),
          )

          // Enhanced opacity and transform for About section
          const opacity = 0.3 + lineProgress * 0.7
          const y = (1 - lineProgress) * 10

          $gsap.set(line, {
            opacity,
            y,
            scale: 0.98 + lineProgress * 0.02,
          })
        })
      },
    })
  }

  return {
    initializeAnimations,
    animateAboutText,
    cleanup,
  }
}
