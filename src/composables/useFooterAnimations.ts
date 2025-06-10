import type { Ref } from 'vue'
import { type BaseAnimationOptions, SECTION_DEFAULTS } from './animation.config'

interface FooterAnimationRefs {
  footerRef: Ref<HTMLElement | null>
  brandSectionRef: Ref<HTMLElement | null>
  contactSectionRef: Ref<HTMLElement | null>
  bottomSectionRef: Ref<HTMLElement | null>
}

interface FooterAnimationConfig extends BaseAnimationOptions {
  triggerStart?: string
  staggerDelay?: number
}

/**
 * Enhanced Footer animations composable with GSAP encapsulation
 */
export const useFooterAnimations = (
  refs: FooterAnimationRefs,
  options: FooterAnimationConfig = {},
) => {
  const { cleanup: baseCleanup } = useAnimations()
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Track ScrollTrigger instances for cleanup
  const footerScrollTriggers: ScrollTrigger[] = []

  /**
   * Initialize all Footer section animations
   */
  const initializeAnimations = () => {
    if (
      !import.meta.client ||
      !$gsap ||
      !$ScrollTrigger ||
      !refs.footerRef.value
    ) {
      return
    }

    const {
      triggerStart = 'top 60%',
      duration = 0.8,
      ease = 'power2.out',
      staggerDelay = 0.2,
    } = options

    // Get all animated elements
    const animatedElements = [
      refs.brandSectionRef.value,
      refs.contactSectionRef.value,
      refs.bottomSectionRef.value,
    ].filter(Boolean)

    if (animatedElements.length === 0) {
      console.warn('No animated elements found in footer')
      return
    }

    // Set initial hidden state
    $gsap.set(animatedElements, {
      opacity: 0,
      y: 50,
      willChange: 'transform, opacity',
    })

    // Create main scroll trigger
    const mainTrigger = $ScrollTrigger.create({
      trigger: refs.footerRef.value,
      start: triggerStart,
      once: true,
      onEnter: () => {
        startFooterAnimations(animatedElements, {
          duration,
          ease,
          staggerDelay,
        })
      },
    })

    footerScrollTriggers.push(mainTrigger)
  }

  /**
   * Start footer animations with timeline coordination
   */
  const startFooterAnimations = (
    elements: HTMLElement[],
    config: { duration: number; ease: string; staggerDelay: number },
  ): void => {
    const timeline = $gsap.timeline()

    // Animate brand section
    timeline.to(refs.brandSectionRef.value, {
      opacity: 1,
      y: 0,
      duration: config.duration,
      ease: config.ease,
    })

    // Animate contact section
    timeline.to(
      refs.contactSectionRef.value,
      {
        opacity: 1,
        y: 0,
        duration: config.duration,
        ease: config.ease,
      },
      `-=${config.duration * 0.6}`,
    )

    // Animate bottom section
    timeline.to(
      refs.bottomSectionRef.value,
      {
        opacity: 1,
        y: 0,
        duration: config.duration * 0.75,
        ease: config.ease,
        onComplete: () => {
          // Clean up will-change for performance
          elements.forEach(el => {
            if (el) el.style.willChange = 'auto'
          })
        },
      },
      `-=${config.duration * 0.4}`,
    )
  }

  /**
   * Enhanced cleanup for Footer-specific ScrollTriggers
   */
  const cleanup = (): void => {
    footerScrollTriggers.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill()
      }
    })
    footerScrollTriggers.length = 0
    baseCleanup()
  }

  /**
   * Refresh animations
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
    if (import.meta.client) {
      // Wait for next tick to ensure DOM is ready
      nextTick(() => {
        initializeAnimations()
      })
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    initializeAnimations,
    cleanup,
    refresh,
  }
}
