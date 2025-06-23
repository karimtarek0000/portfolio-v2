import type { Ref } from 'vue'
import { nextTick, onMounted, onUnmounted } from 'vue'
import { type BaseAnimationOptions, SECTION_DEFAULTS } from './animation.config'

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface ServicesAnimationRefs {
  sectionRef: Ref<HTMLElement | null>
  servicesContainerRef: Ref<HTMLElement | null>
  serviceCardRefs: Ref<HTMLElement[]>
}

interface ServicesAnimationConfig extends BaseAnimationOptions {
  triggerStart?: string
  staggerDelay?: number
  cardHoverEnabled?: boolean
}

interface HoverElements {
  icon?: HTMLElement | null
  svg?: SVGElement | null
  iconBg?: HTMLElement | null
  techTags?: NodeListOf<HTMLElement>
  title?: HTMLElement | null
  bullets?: NodeListOf<HTMLElement>
  overlay?: HTMLElement | null
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_DEFAULTS = {
  TRIGGER_START: 'top 80%',
  DURATION: 0.8,
  EASE: 'power2.out',
  STAGGER_DELAY: 0.1,
  HOVER_DURATION: 0.4,
  CARD_HOVER_SCALE: 1.03,
  CARD_HOVER_Y: -12,
  ICON_HOVER_SCALE: 1.2,
  // Mobile optimizations
  MOBILE_DURATION: 0.6,
  MOBILE_STAGGER_DELAY: 0.08,
  MOBILE_CARD_SCALE: 0.98,
  MOBILE_Y_OFFSET: 30,
} as const

const SELECTORS = {
  ICON: '.service-card__icon',
  ICON_SVG: '.service-card__icon svg',
  ICON_BG: '.service-card__icon-bg',
  TECH_TAG: '.service-card__tech-tag',
  TITLE: '.service-card__title',
  FEATURE_BULLET: '.service-card__feature-bullet',
  OVERLAY: '.service-card__overlay',
} as const

// ============================================================================
// SERVICES ANIMATIONS COMPOSABLE
// ============================================================================

/**
 * Enhanced Services animations composable with optimized performance
 * Follows the project's established animation patterns with improved efficiency
 */
export const useServicesAnimations = (
  refs: ServicesAnimationRefs,
  options: ServicesAnimationConfig = {},
) => {
  const { cleanup: baseCleanup } = useAnimations()
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Track ScrollTrigger instances and hover handlers for cleanup
  const servicesScrollTriggers: ScrollTrigger[] = []
  const hoverHandlers = new WeakMap<
    HTMLElement,
    { enter: () => void; leave: () => void }
  >()

  // Get device-optimized settings
  const deviceSettings = getDeviceOptimizedSettings(options)

  /**
   * Optimized element selection with caching
   */
  const getHoverElements = (card: HTMLElement): HoverElements => ({
    icon: card.querySelector(SELECTORS.ICON) as HTMLElement | null,
    svg: card.querySelector(SELECTORS.ICON_SVG) as SVGElement | null,
    iconBg: card.querySelector(SELECTORS.ICON_BG) as HTMLElement | null,
    techTags: card.querySelectorAll(
      SELECTORS.TECH_TAG,
    ) as NodeListOf<HTMLElement>,
    title: card.querySelector(SELECTORS.TITLE) as HTMLElement | null,
    bullets: card.querySelectorAll(
      SELECTORS.FEATURE_BULLET,
    ) as NodeListOf<HTMLElement>,
    overlay: card.querySelector(SELECTORS.OVERLAY) as HTMLElement | null,
  })

  /**
   * Initialize all Services section animations with performance optimizations
   */
  const initializeAnimations = () => {
    if (
      !import.meta.client ||
      !$gsap ||
      !$ScrollTrigger ||
      !refs.servicesContainerRef.value
    ) {
      return
    }

    const {
      triggerStart = ANIMATION_DEFAULTS.TRIGGER_START,
      duration = ANIMATION_DEFAULTS.DURATION,
      ease = ANIMATION_DEFAULTS.EASE,
      cardHoverEnabled = true,
      isMobile = false,
    } = deviceSettings

    // Get valid service card elements
    const serviceCards = refs.serviceCardRefs.value.filter(Boolean)

    if (serviceCards.length === 0) {
      console.warn('useServicesAnimations: No service card elements found')
      return
    }

    // Mobile-optimized initial state
    const initialState = isMobile
      ? {
          opacity: 0,
          y: ANIMATION_DEFAULTS.MOBILE_Y_OFFSET,
          scale: ANIMATION_DEFAULTS.MOBILE_CARD_SCALE,
          willChange: 'transform, opacity',
        }
      : {
          opacity: 0,
          y: 50,
          scale: 0.95,
          willChange: 'transform, opacity',
        }

    // Batch set initial state for better performance
    $gsap.set(serviceCards, initialState)

    // Create optimized scroll triggers with mobile considerations
    serviceCards.forEach((card, index) => {
      const cardTrigger = $ScrollTrigger.create({
        trigger: card,
        start: triggerStart,
        once: true,
        fastScrollEnd: isMobile, // Optimize for mobile scrolling
        onEnter: () =>
          animateCardEntry(card, {
            duration,
            ease,
            delay:
              index *
              (deviceSettings.staggerDelay || ANIMATION_DEFAULTS.STAGGER_DELAY),
            isMobile,
          }),
      })

      servicesScrollTriggers.push(cardTrigger)
    })

    // Add hover animations only for non-mobile devices
    if (cardHoverEnabled && !isMobile) {
      addCardHoverEffects(serviceCards)
    }
  }

  /**
   * Enhanced card entry animation with mobile optimizations
   */
  const animateCardEntry = (
    card: HTMLElement,
    config: {
      duration: number
      ease: string
      delay: number
      isMobile?: boolean
    },
  ) => {
    const animationProps = config.isMobile
      ? {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay,
          force3D: true, // Hardware acceleration for mobile
          transformOrigin: 'center center',
        }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: config.duration,
          ease: config.ease,
          delay: config.delay,
        }

    $gsap.to(card, {
      ...animationProps,
      onComplete: () => {
        // Clean up will-change for performance
        $gsap.set(card, { willChange: 'auto' })

        // Remove transform origin after animation for mobile
        if (config.isMobile) {
          $gsap.set(card, { transformOrigin: '' })
        }
      },
    })
  }

  /**
   * Optimized hover enter animation
   */
  const createHoverEnterAnimation = (
    card: HTMLElement,
    elements: HoverElements,
  ) => {
    return () => {
      // Skip complex animations on mobile devices
      if (deviceSettings.isMobile) return

      // Kill any existing animations to prevent conflicts
      const targets = [
        card,
        elements.icon,
        elements.svg,
        elements.iconBg,
        elements.title,
        elements.overlay,
      ]
      $gsap.killTweensOf(targets.filter(Boolean))

      // Main card animation with magnetic effect
      $gsap.to(card, {
        scale: ANIMATION_DEFAULTS.CARD_HOVER_SCALE,
        y: ANIMATION_DEFAULTS.CARD_HOVER_Y,
        duration: ANIMATION_DEFAULTS.HOVER_DURATION,
        ease: 'power3.out',
      })

      // Icon animations
      if (elements.icon) {
        $gsap.to(elements.icon, {
          scale: ANIMATION_DEFAULTS.ICON_HOVER_SCALE,
          rotation: 12,
          y: -6,
          duration: 0.5,
          ease: 'back.out',
        })
      }

      // SVG enhancement
      if (elements.svg) {
        $gsap.to(elements.svg, {
          scale: 1.15,
          rotation: -5,
          duration: 0.4,
          ease: 'elastic.out',
        })
      }

      // Background glow
      if (elements.iconBg) {
        $gsap.to(elements.iconBg, {
          opacity: 1,
          scale: 2.2,
          duration: 0.5,
          ease: 'power2.out',
        })
      }

      // Tech tags animation
      if (elements.techTags?.length) {
        $gsap.to(elements.techTags, {
          scale: 1.08,
          y: -2,
          duration: 0.25,
          ease: 'back.out',
          stagger: 0.04,
        })
      }

      // Title enhancement
      if (elements.title) {
        $gsap.to(elements.title, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      // Feature bullets
      if (elements.bullets?.length) {
        $gsap.to(elements.bullets, {
          scale: 1.3,
          duration: 0.3,
          ease: 'back.out',
          stagger: 0.03,
        })
      }

      // Overlay effect
      if (elements.overlay) {
        $gsap.to(elements.overlay, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }
  }

  /**
   * Optimized hover leave animation
   */
  const createHoverLeaveAnimation = (
    card: HTMLElement,
    elements: HoverElements,
  ) => {
    return () => {
      // Skip complex animations on mobile devices
      if (deviceSettings.isMobile) return

      // Kill all ongoing animations for smooth reset
      const allTargets = [
        card,
        elements.icon,
        elements.svg,
        elements.iconBg,
        elements.techTags,
        elements.title,
        elements.bullets,
        elements.overlay,
      ].filter(Boolean)

      $gsap.killTweensOf(allTargets)

      // Batch reset animations for better performance
      const resetTimeline = $gsap.timeline()

      resetTimeline.to(
        card,
        {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.2)',
        },
        0,
      )

      if (elements.icon) {
        resetTimeline.to(
          elements.icon,
          {
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.8)',
          },
          0,
        )
      }

      if (elements.svg) {
        resetTimeline.to(
          elements.svg,
          {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'elastic.out(1, 0.6)',
          },
          0,
        )
      }

      if (elements.iconBg) {
        resetTimeline.to(
          elements.iconBg,
          {
            opacity: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          0,
        )
      }

      if (elements.techTags?.length) {
        resetTimeline.to(
          elements.techTags,
          {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.5)',
            stagger: 0.02,
          },
          0,
        )
      }

      if (elements.title) {
        resetTimeline.to(
          elements.title,
          {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          0,
        )
      }

      if (elements.bullets?.length) {
        resetTimeline.to(
          elements.bullets,
          {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.5)',
            stagger: 0.02,
          },
          0,
        )
      }

      if (elements.overlay) {
        resetTimeline.to(
          elements.overlay,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0,
        )
      }
    }
  }

  /**
   * Add optimized interactive hover effects to service cards
   */
  const addCardHoverEffects = (cards: HTMLElement[]): void => {
    // Only add hover effects for non-mobile devices
    if (deviceSettings.isMobile) return

    cards.forEach(card => {
      const elements = getHoverElements(card)

      const handleMouseEnter = createHoverEnterAnimation(card, elements)
      const handleMouseLeave = createHoverLeaveAnimation(card, elements)

      // Store handlers for cleanup
      hoverHandlers.set(card, {
        enter: handleMouseEnter,
        leave: handleMouseLeave,
      })

      // Add event listeners with passive options for better performance
      card.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      card.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    })
  }

  /**
   * Optimized hover effect cleanup
   */
  const removeCardHoverEffects = (cards: HTMLElement[]): void => {
    cards.forEach(card => {
      const handlers = hoverHandlers.get(card)
      if (handlers) {
        card.removeEventListener('mouseenter', handlers.enter)
        card.removeEventListener('mouseleave', handlers.leave)
        hoverHandlers.delete(card)
      }

      // Kill any ongoing animations
      $gsap.killTweensOf(card)
    })
  }

  /**
   * Enhanced cleanup with better memory management
   */
  const cleanup = (): void => {
    // Clean up ScrollTriggers
    servicesScrollTriggers.forEach(trigger => {
      trigger?.kill?.()
    })
    servicesScrollTriggers.length = 0

    // Clean up hover effects
    const serviceCards = refs.serviceCardRefs.value.filter(Boolean)
    if (serviceCards.length > 0) {
      removeCardHoverEffects(serviceCards)
    }

    // Note: WeakMap doesn't need manual clearing as it allows garbage collection

    // Call base cleanup
    baseCleanup()
  }

  /**
   * Refresh animations (useful for responsive changes)
   */
  const refresh = (): void => {
    if (import.meta.client && $ScrollTrigger) {
      // Update mobile detection on refresh (for orientation changes)
      const updatedSettings = getDeviceOptimizedSettings(options)
      Object.assign(deviceSettings, updatedSettings)

      $ScrollTrigger.refresh()
    }
  }

  // Handle orientation change for mobile optimization
  const handleOrientationChange = () => {
    if (import.meta.client && deviceSettings.isMobile) {
      setTimeout(refresh, 100) // Small delay for orientation to settle
    }
  }

  // ============================================================================
  // LIFECYCLE MANAGEMENT
  // ============================================================================

  onMounted(() => {
    if (import.meta.client) {
      nextTick(initializeAnimations)

      // Listen for orientation changes on mobile
      if (deviceSettings.isMobile) {
        window.addEventListener('orientationchange', handleOrientationChange, {
          passive: true,
        })
      }
    }
  })

  onUnmounted(() => {
    if (import.meta.client && deviceSettings.isMobile) {
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
    cleanup()
  })

  return {
    initializeAnimations,
    cleanup,
    refresh,
    addCardHoverEffects,
    removeCardHoverEffects,
    // Expose mobile detection for external use
    isMobile: () => deviceSettings.isMobile,
  }
}

/**
 * Detect mobile devices for performance optimization
 */
const isMobileDevice = (): boolean => {
  if (!import.meta.client) return false

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 768
  )
}

/**
 * Get optimized animation settings for current device
 */
const getDeviceOptimizedSettings = (baseOptions: ServicesAnimationConfig) => {
  const isMobile = isMobileDevice()

  return {
    ...baseOptions,
    duration: isMobile
      ? ANIMATION_DEFAULTS.MOBILE_DURATION
      : baseOptions.duration || ANIMATION_DEFAULTS.DURATION,
    staggerDelay: isMobile
      ? ANIMATION_DEFAULTS.MOBILE_STAGGER_DELAY
      : baseOptions.staggerDelay || ANIMATION_DEFAULTS.STAGGER_DELAY,
    cardHoverEnabled: isMobile ? false : baseOptions.cardHoverEnabled !== false,
    isMobile,
  }
}
