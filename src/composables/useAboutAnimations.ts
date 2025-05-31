import type { Ref } from 'vue'
import {
  type AboutAnimationOptions,
  type TextAnimationOptions,
  SECTION_DEFAULTS,
} from './animation.config'

interface AboutAnimationRefs {
  sectionRef: Ref<HTMLElement | null>
  textContainerRef: Ref<HTMLElement | null>
}

interface AboutAnimationConfig {
  headerAnimationDuration?: number
  headerStaggerDelay?: number
  triggerStart?: string
  textRevealDelay?: number
}

/**
 * Enhanced About animations composable with improved performance and complete GSAP encapsulation
 */
export const useAboutAnimations = (
  refs: AboutAnimationRefs,
  options: AboutAnimationConfig = {},
) => {
  const {
    animateTextLines,
    cleanup: baseCleanup,
    createScrollTrigger,
  } = useAnimations()
  const { $ScrollTrigger } = useNuxtApp()

  // Track our specific ScrollTrigger instances for cleanup
  const aboutScrollTriggers: ScrollTrigger[] = []

  /**
   * Initialize all About section animations with smart coordination
   */
  const initializeAnimations = () => {
    if (
      !import.meta.client ||
      !refs.sectionRef.value ||
      !refs.textContainerRef.value
    ) {
      return
    }

    const {
      headerAnimationDuration = 1.0,
      headerStaggerDelay = 0.2,
      triggerStart = 'top 75%',
      textRevealDelay = 1200,
    } = options

    // Create main ScrollTrigger for coordinating animations
    const mainTrigger = $ScrollTrigger.create({
      trigger: refs.sectionRef.value,
      start: triggerStart,
      once: true,
      onEnter: () => {
        // Prepare text elements by removing hidden class
        prepareTextElements(refs.textContainerRef.value!)

        // Wait for SharedHeader animation to complete before starting text animations
        setTimeout(() => {
          startTextAnimations(refs.textContainerRef, options)
        }, textRevealDelay)
      },
    })

    aboutScrollTriggers.push(mainTrigger)
  }

  /**
   * Prepare text elements for animation by removing hidden classes
   */
  const prepareTextElements = (container: HTMLElement): void => {
    const paragraphs = container.querySelectorAll('.animate-line')
    paragraphs.forEach((p: Element) => {
      if (p instanceof HTMLElement) {
        p.classList.remove('paragraph-hidden')
      }
    })
  }

  /**
   * Start text line animations with optimized configuration
   */
  const startTextAnimations = (
    textContainerRef: Ref<HTMLElement | null>,
    options: AboutAnimationConfig = {},
  ): void => {
    // Merge with section-specific defaults for consistency
    const textConfig: TextAnimationOptions = {
      ...SECTION_DEFAULTS.about.textAnimation,
      ...options,
    }

    // Use the unified animation system for text animations
    animateTextLines(textContainerRef, textConfig)
  }

  /**
   * Enhanced cleanup that handles About-specific ScrollTriggers
   */
  const cleanup = (): void => {
    // Clean up our specific ScrollTriggers
    aboutScrollTriggers.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill()
      }
    })
    aboutScrollTriggers.length = 0

    // Call base cleanup for text animations
    baseCleanup()
  }

  /**
   * Refresh animations (useful for responsive changes)
   */
  const refresh = (): void => {
    if (import.meta.client && $ScrollTrigger) {
      $ScrollTrigger.refresh()
    }
  }

  // ============================================================================
  // LIFECYCLE MANAGEMENT
  // ============================================================================

  onMounted(() => {
    // Only initialize animations on client side
    if (import.meta.client) {
      initializeAnimations()
    }
  })

  onUnmounted(() => {
    // Clean up ScrollTrigger instances when component unmounts
    cleanup()
  })

  return {
    initializeAnimations,
    cleanup,
    refresh,
  }
}
