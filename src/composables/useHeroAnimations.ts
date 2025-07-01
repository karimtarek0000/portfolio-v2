import type { Ref } from 'vue'

interface HeroAnimationRefs {
  heroContainerRef: Ref<HTMLElement | null>
  lottieContainerRef: Ref<HTMLElement | null>
  titleRef: Ref<HTMLElement | null>
  socialIconsRef: Ref<HTMLElement | null>
  downloadButtonRef: Ref<HTMLElement | null>
}

interface HeroAnimationOptions {
  enableAutoPlay?: boolean
  staggerDelay?: number
  duration?: number
  ease?: string
}

// Performance optimization constants
const PERFORMANCE_CONFIG = {
  MOBILE_DURATION_MULTIPLIER: 0.8,
  REDUCED_MOTION_MAX_DURATION: 0.3,
  ANIMATION_DELAY: 16, // One frame delay for better DOM readiness
} as const

/**
 * Device detection utility for performance optimization
 */
const createDeviceDetector = () => {
  const cache = new Map<string, any>()

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
        () => import.meta.client && window.innerWidth < 768,
      ),
    prefersReducedMotion: () =>
      getCachedValue(
        'reducedMotion',
        () =>
          import.meta.client &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ),
    isClient: () => getCachedValue('isClient', () => import.meta.client),
    clearCache: () => cache.clear(),
  }
}

/**
 * Hero section animations composable for entrance animations without scroll triggers
 */
export const useHeroAnimations = (
  refs: HeroAnimationRefs,
  options: HeroAnimationOptions = {},
) => {
  const { $gsap } = useNuxtApp()
  const device = createDeviceDetector()

  // Apply device-specific optimizations to config
  const getOptimizedConfig = () => {
    const baseConfig = {
      enableAutoPlay: true,
      staggerDelay: 0.2,
      duration: 1.2,
      ease: 'power3.out',
      ...options,
    }

    const isMobile = device.isMobile()
    const isReducedMotion = device.prefersReducedMotion()

    if (isReducedMotion) {
      return {
        ...baseConfig,
        duration: Math.min(
          baseConfig.duration,
          PERFORMANCE_CONFIG.REDUCED_MOTION_MAX_DURATION,
        ),
        staggerDelay: 0,
        enableAutoPlay: false, // Respect user preference
      }
    }

    if (isMobile) {
      return {
        ...baseConfig,
        duration:
          baseConfig.duration * PERFORMANCE_CONFIG.MOBILE_DURATION_MULTIPLIER,
        staggerDelay: baseConfig.staggerDelay * 0.5,
      }
    }

    return baseConfig
  }

  let masterTimeline: GSAPTimeline | null = null
  let interactionCleanup: (() => void)[] = []

  /**
   * Batch DOM queries for better performance
   */
  const getAnimationElements = () => {
    const buttonElement = refs.downloadButtonRef.value
    const buttonEl =
      buttonElement &&
      typeof buttonElement === 'object' &&
      '$el' in buttonElement
        ? (buttonElement as any).$el
        : buttonElement

    const elements = {
      lottie: refs.lottieContainerRef.value,
      titleSpans: refs.titleRef.value?.querySelectorAll('span') || [],
      socialLinks: refs.socialIconsRef.value?.querySelectorAll('div a') || [],
      button: buttonEl,
    }

    return elements
  }

  /**
   * Initialize hero entrance animations
   */
  const initializeHeroAnimations = (): void => {
    if (!device.isClient()) return

    const config = getOptimizedConfig()

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      // Create master timeline for coordinated animations
      masterTimeline = $gsap.timeline({
        paused: !config.enableAutoPlay,
        defaults: {
          ease: config.ease,
        },
      })

      // Set initial states
      setInitialStates(config)

      // Build animation sequence
      buildAnimationTimeline(config)

      // Auto-play if enabled
      if (config.enableAutoPlay) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          masterTimeline?.play()
        }, PERFORMANCE_CONFIG.ANIMATION_DELAY)
      }
    })
  }

  /**
   * Set initial states for all animated elements with batched operations
   */
  const setInitialStates = (
    config: ReturnType<typeof getOptimizedConfig>,
  ): void => {
    const elements = getAnimationElements()
    const isReducedMotion = device.prefersReducedMotion()

    // Batch GSAP.set operations for better performance
    const batchOperations: Array<() => void> = []

    // Lottie container - scale and fade
    if (elements.lottie) {
      batchOperations.push(() => {
        $gsap.set(elements.lottie, {
          opacity: 0,
          scale: isReducedMotion ? 1 : 0.8,
          y: isReducedMotion ? 0 : 30,
          willChange: 'transform, opacity',
        })
      })
    }

    // Title elements - split and stagger
    if (elements.titleSpans.length) {
      batchOperations.push(() => {
        $gsap.set(elements.titleSpans, {
          opacity: 0,
          y: isReducedMotion ? 0 : 50,
          rotationX: isReducedMotion ? 0 : -90,
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
        })
      })
    }

    // Social icons - scale and rotate
    if (elements.socialLinks.length) {
      batchOperations.push(() => {
        $gsap.set(elements.socialLinks, {
          opacity: 0,
          scale: isReducedMotion ? 1 : 0,
          rotation: isReducedMotion ? 0 : -180,
          willChange: 'transform, opacity',
        })
      })
    }

    // Download button - smooth bottom-to-top translation setup
    if (elements.button) {
      batchOperations.push(() => {
        $gsap.set(elements.button, {
          opacity: 0,
          y: isReducedMotion ? 0 : 60,
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
        })
      })
    }

    // Execute all batch operations
    batchOperations.forEach(operation => operation())
  }

  /**
   * Build the master animation timeline with optimizations
   */
  const buildAnimationTimeline = (
    config: ReturnType<typeof getOptimizedConfig>,
  ): void => {
    if (!masterTimeline) return

    const elements = getAnimationElements()
    const isReducedMotion = device.prefersReducedMotion()

    // Simplified timeline for reduced motion
    if (isReducedMotion) {
      buildReducedMotionTimeline(elements)
      return
    }

    // 1. Lottie animation entrance (0s)
    if (elements.lottie) {
      masterTimeline.to(
        elements.lottie,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: config.duration * 0.8,
          ease: 'back.out(1.7)',
        },
        0,
      )
    }

    // 2. Title animation with stagger (0.3s)
    if (elements.titleSpans.length) {
      masterTimeline.to(
        elements.titleSpans,
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: config.duration * 0.6,
          ease: 'back.out(1.2)',
          stagger: config.staggerDelay,
        },
        0.3,
      )
    }

    // 3. Social icons with fast elastic bounce (0.6s)
    if (elements.socialLinks.length) {
      masterTimeline.to(
        elements.socialLinks,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
          stagger: 0.08,
        },
        0.6,
      )
    }

    // 4. Download button synchronized with social icons ending
    if (elements.button) {
      masterTimeline
        .to(
          elements.button,
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: 'power3.out',
          },
          0.6,
        )
        .set(elements.button, {
          cursor: 'pointer',
        })
        .to(
          elements.button,
          {
            duration: 0.48,
            ease: 'power3.out',
          },
          '-=0.3',
        )
    }

    // 5. Add subtle floating animation for lottie container (only on desktop)
    if (elements.lottie && !device.isMobile()) {
      masterTimeline.to(
        elements.lottie,
        {
          y: -10,
          duration: 2,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        },
        1.5,
      )
    }

    // 6. Add hover-ready class after animations complete
    masterTimeline.call(() => {
      if (refs.heroContainerRef.value) {
        refs.heroContainerRef.value.classList.add('animations-complete')
      }
    })
  }

  /**
   * Simplified timeline for users who prefer reduced motion
   */
  const buildReducedMotionTimeline = (
    elements: ReturnType<typeof getAnimationElements>,
  ): void => {
    if (!masterTimeline) return

    const simpleDuration = PERFORMANCE_CONFIG.REDUCED_MOTION_MAX_DURATION

    // Simple fade-in for all elements simultaneously
    const allElements = [
      elements.lottie,
      ...Array.from(elements.titleSpans),
      ...Array.from(elements.socialLinks),
      elements.button,
    ].filter(Boolean)

    if (allElements.length) {
      masterTimeline.to(allElements, {
        opacity: 1,
        duration: simpleDuration,
        ease: 'none',
      })
    }
  }

  /**
   * Play the hero animations manually
   */
  const playAnimations = (): void => {
    if (masterTimeline) {
      masterTimeline.restart()
    } else {
      initializeHeroAnimations()
    }
  }

  /**
   * Pause the animations
   */
  const pauseAnimations = (): void => {
    masterTimeline?.pause()
  }

  /**
   * Resume the animations
   */
  const resumeAnimations = (): void => {
    masterTimeline?.resume()
  }

  /**
   * Add interaction animations for enhanced UX with memory management
   */
  const addInteractionAnimations = (): void => {
    if (!device.isClient()) return

    const elements = getAnimationElements()

    // Social icons hover effect with cleanup tracking - removed rotation
    if (elements.socialLinks.length) {
      elements.socialLinks.forEach(link => {
        const handleMouseEnter = () => {
          $gsap.to(link, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out',
          })
        }

        const handleMouseLeave = () => {
          $gsap.to(link, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        }

        // Add event listeners
        link.addEventListener('mouseenter', handleMouseEnter)
        link.addEventListener('mouseleave', handleMouseLeave)

        // Track cleanup functions
        interactionCleanup.push(() => {
          link.removeEventListener('mouseenter', handleMouseEnter)
          link.removeEventListener('mouseleave', handleMouseLeave)
        })
      })
    }
  }

  /**
   * Enhanced cleanup with proper memory management
   */
  const cleanup = (): void => {
    // Kill master timeline
    if (masterTimeline) {
      masterTimeline.kill()
      masterTimeline = null
    }

    // Remove event listeners
    interactionCleanup.forEach(cleanupFn => cleanupFn())
    interactionCleanup = []

    // Reset will-change properties in batches
    const elements = getAnimationElements()
    const allElements = [
      elements.lottie,
      ...Array.from(elements.titleSpans),
      ...Array.from(elements.socialLinks),
      elements.button,
    ].filter(Boolean) as HTMLElement[]

    // Batch DOM operations
    requestAnimationFrame(() => {
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.willChange = 'auto'
        }
      })
    })

    // Clear device cache
    device.clearCache()
  }

  // Lifecycle management
  onMounted(() => {
    if (import.meta.client) {
      initializeHeroAnimations()
      addInteractionAnimations()
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    initializeHeroAnimations,
    playAnimations,
    pauseAnimations,
    resumeAnimations,
    cleanup,
  }
}
