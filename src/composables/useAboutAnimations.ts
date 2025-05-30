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

/**
 * Simplified About animations using the unified animation system
 */
export const useAboutAnimations = () => {
  const { animateTextLines, cleanup } = useAnimations()

  /**
   * Initialize animations for the About section
   */
  const initializeAnimations = (
    refs: AboutAnimationRefs,
    options: AboutAnimationOptions = {},
  ) => {
    if (!import.meta.client) return

    const { textContainerRef } = refs

    // Use the unified animation system for text animations
    animateTextLines(textContainerRef, {
      start: options.textAnimation?.start ?? 'top 75%',
      end: options.textAnimation?.end ?? 'bottom 25%',
      scrub: options.textAnimation?.scrub ?? 1,
      once: options.textAnimation?.once ?? false,
      opacity: options.textAnimation?.opacity ?? {
        base: 0.3,
        range: 0.7,
      },
      transform: options.textAnimation?.transform ?? {
        yOffset: 10,
        scale: 0.02,
      },
    })
  }

  return {
    initializeAnimations,
    cleanup,
  }
}
