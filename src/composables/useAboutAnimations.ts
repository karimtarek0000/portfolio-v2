import { useNuxtApp } from '#app'
import type { Ref } from 'vue'

interface AboutAnimationRefs {
  textContainerRef: Ref<HTMLElement | null>
}

interface AboutAnimationOptions {
  textAnimation?: {
    start?: string
    end?: string
    scrub?: boolean | number
    once?: boolean
  }
}

export const useAboutAnimations = () => {
  const { animateTextLines, cleanup } = useScrollAnimation()

  /**
   * Initialize animations for the About section (text only)
   * Leverages the shared useScrollAnimation composable for consistency
   */
  const initializeAnimations = (
    refs: AboutAnimationRefs,
    options: AboutAnimationOptions = {},
  ) => {
    if (!import.meta.client) return

    const { textContainerRef } = refs

    // Use optimized configuration with About-specific defaults
    const textConfig = {
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1,
      once: false,
      ...options.textAnimation,
    }

    // Delegate to shared animation composable for DRY compliance
    animateTextLines(textContainerRef, textConfig)
  }

  /**
   * Enhanced text line animation specifically for About section
   * Uses the shared useScrollAnimation infrastructure for consistency
   */
  const animateAboutText = (
    containerRef: Ref<HTMLElement | null>,
    options: AboutAnimationOptions['textAnimation'] = {},
  ) => {
    if (!import.meta.client || !containerRef.value) return

    const { $gsap, $ScrollTrigger } = useNuxtApp()
    const container = containerRef.value
    const lines = Array.from(container.querySelectorAll('.animate-line'))

    if (!lines.length) return

    // Batch immediate hiding for performance (reusing pattern from other composables)
    lines.forEach(line => {
      const element = line as HTMLElement
      Object.assign(element.style, {
        opacity: '0.2',
        transform: 'translateY(10px)',
        willChange: 'opacity, transform',
      })
    })

    // Set initial GSAP state efficiently
    $gsap.set(lines, {
      opacity: 0.2,
      y: 10,
      willChange: 'opacity, transform',
    })

    // Create optimized scroll animation with About-specific enhancements
    $ScrollTrigger.create({
      trigger: container,
      start: options.start || 'top 75%',
      end: options.end || 'bottom 25%',
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
      onLeave: () => {
        // Performance: clear will-change after animation
        lines.forEach(line => {
          ;(line as HTMLElement).style.willChange = 'auto'
        })
      },
    })
  }

  return {
    initializeAnimations,
    animateAboutText,
    cleanup, // Delegate cleanup to shared composable
  }
}
