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
    opacity?: {
      base: number
      range: number
    }
    transform?: {
      yOffset: number
      scale: number
    }
  }
}

// Performance-optimized defaults for About section
const ABOUT_ANIMATION_DEFAULTS = {
  start: 'top 75%',
  end: 'bottom 25%',
  scrub: 1,
  once: false,
  opacity: {
    base: 0.3,
    range: 0.7,
  },
  transform: {
    yOffset: 10,
    scale: 0.02,
  },
} as const

export const useAboutAnimations = () => {
  const { animateTextLines, cleanup } = useScrollAnimation()
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  /**
   * Initialize animations for the About section using shared infrastructure
   * Leverages useScrollAnimation for DRY compliance and performance optimization
   */
  const initializeAnimations = (
    refs: AboutAnimationRefs,
    options: AboutAnimationOptions = {},
  ) => {
    if (!import.meta.client) return

    const { textContainerRef } = refs

    // Merge with optimized defaults - create compatible config
    const config = {
      start: options.textAnimation?.start ?? ABOUT_ANIMATION_DEFAULTS.start,
      end: options.textAnimation?.end ?? ABOUT_ANIMATION_DEFAULTS.end,
      scrub: options.textAnimation?.scrub ?? ABOUT_ANIMATION_DEFAULTS.scrub,
      once: options.textAnimation?.once ?? ABOUT_ANIMATION_DEFAULTS.once,
      opacity: {
        base:
          options.textAnimation?.opacity?.base ??
          ABOUT_ANIMATION_DEFAULTS.opacity.base,
        range:
          options.textAnimation?.opacity?.range ??
          ABOUT_ANIMATION_DEFAULTS.opacity.range,
      },
      transform: {
        yOffset:
          options.textAnimation?.transform?.yOffset ??
          ABOUT_ANIMATION_DEFAULTS.transform.yOffset,
        scale:
          options.textAnimation?.transform?.scale ??
          ABOUT_ANIMATION_DEFAULTS.transform.scale,
      },
    }

    // Check if enhanced animations are needed
    const needsEnhancedAnimation =
      options.textAnimation?.transform || options.textAnimation?.opacity

    if (needsEnhancedAnimation) {
      // Use enhanced animation for About-specific effects
      animateAboutTextEnhanced(textContainerRef, config)
    } else {
      // Delegate to shared animation composable for standard text animation
      animateTextLines(textContainerRef, {
        start: config.start,
        end: config.end,
        scrub: config.scrub,
        once: config.once,
      })
    }
  }

  /**
   * Enhanced text animation with About-specific effects (scale + custom opacity)
   * Only used when enhanced features are explicitly requested for performance
   */
  const animateAboutTextEnhanced = (
    containerRef: Ref<HTMLElement | null>,
    options: {
      start: string
      end: string
      scrub: boolean | number
      once: boolean
      opacity: { base: number; range: number }
      transform: { yOffset: number; scale: number }
    },
  ) => {
    if (!import.meta.client || !containerRef.value) return

    const container = containerRef.value
    const lines = Array.from(container.querySelectorAll('.animate-line'))

    if (!lines.length) return

    // Use shared style cache pattern for performance
    const initialStyles = {
      opacity: options.opacity.base.toString(),
      transform: `translateY(${options.transform.yOffset}px)`,
      willChange: 'opacity, transform',
    }

    // Batch initial state application
    lines.forEach(line => {
      Object.assign((line as HTMLElement).style, initialStyles)
    })

    // Set GSAP initial state efficiently
    $gsap.set(lines, {
      opacity: options.opacity.base,
      y: options.transform.yOffset,
      willChange: 'opacity, transform',
    })

    // Create optimized scroll animation with enhanced effects
    $ScrollTrigger.create({
      trigger: container,
      start: options.start,
      end: options.end,
      scrub: options.scrub,
      once: options.once,
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

          // Calculate enhanced effects
          const opacity =
            options.opacity.base + lineProgress * options.opacity.range
          const y = (1 - lineProgress) * options.transform.yOffset
          const scale = 0.98 + lineProgress * options.transform.scale

          $gsap.set(line, { opacity, y, scale })
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
    cleanup, // Delegate cleanup to shared composable
  }
}
