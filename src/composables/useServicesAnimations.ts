import type { Ref } from 'vue'
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

// ============================================================================
// SERVICES ANIMATIONS COMPOSABLE
// ============================================================================

/**
 * Enhanced Services animations composable with GSAP encapsulation
 * Follows the project's established animation patterns
 */
export const useServicesAnimations = (
  refs: ServicesAnimationRefs,
  options: ServicesAnimationConfig = {},
) => {
  const { cleanup: baseCleanup } = useAnimations()
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Track ScrollTrigger instances for cleanup
  const servicesScrollTriggers: ScrollTrigger[] = []

  /**
   * Initialize all Services section animations
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
      triggerStart = 'top 80%',
      duration = 0.8,
      ease = 'power2.out',
      staggerDelay = 0.15,
      cardHoverEnabled = true,
    } = options

    // Get valid service card elements
    const serviceCards = refs.serviceCardRefs.value.filter(Boolean)

    if (serviceCards.length === 0) {
      console.warn('No service card elements found for animation')
      return
    }

    // Set initial hidden state for cards
    $gsap.set(serviceCards, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      willChange: 'transform, opacity',
    })

    // Create main scroll trigger for services section
    const mainTrigger = $ScrollTrigger.create({
      trigger: refs.servicesContainerRef.value,
      start: triggerStart,
      once: true,
      onEnter: () => {
        startServicesAnimations(serviceCards, {
          duration,
          ease,
          staggerDelay,
        })
      },
    })

    servicesScrollTriggers.push(mainTrigger)

    // Add hover animations if enabled
    if (cardHoverEnabled) {
      addCardHoverEffects(serviceCards)
    }
  }

  /**
   * Start services card animations with timeline coordination
   */
  const startServicesAnimations = (
    cards: HTMLElement[],
    config: { duration: number; ease: string; staggerDelay: number },
  ): void => {
    const timeline = $gsap.timeline()

    // Animate each service card with stagger
    cards.forEach((card, index) => {
      timeline.to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: config.duration,
          ease: config.ease,
          onComplete: () => {
            // Clean up will-change for performance
            card.style.willChange = 'auto'
          },
        },
        index * config.staggerDelay,
      )
    })
  }

  /**
   * Add interactive hover effects to service cards
   */
  const addCardHoverEffects = (cards: HTMLElement[]): void => {
    cards.forEach(card => {
      // Enhanced hover animation for service cards
      const handleMouseEnter = () => {
        // Main card animation with magnetic effect
        $gsap.to(card, {
          scale: 1.03,
          y: -12,
          duration: 0.4,
          ease: 'power3.out',
        })

        // Enhanced icon animation - faster and more beautiful
        const icon = card.querySelector('.service-card__icon')
        if (icon) {
          // Kill any existing animations first
          $gsap.killTweensOf(icon)

          // Main icon bounce with overshoot
          $gsap.to(icon, {
            scale: 1.2,
            rotation: 12,
            duration: 0.5,
            ease: 'back.out(3)',
          })

          // Floating animation with slight oscillation
          $gsap.to(icon, {
            y: -6,
            duration: 0.3,
            ease: 'power2.out',
            delay: 0.1,
          })

          // Add continuous gentle floating while hovered
          $gsap.to(icon, {
            y: -4,
            duration: 2,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            delay: 0.4,
          })

          // Animate the SVG inside the icon for extra flair
          const svg = icon.querySelector('svg')
          if (svg) {
            // Initial pop
            $gsap.fromTo(
              svg,
              { scale: 0.9 },
              {
                scale: 1.15,
                duration: 0.4,
                ease: 'elastic.out(1.2, 0.4)',
                delay: 0.2,
              },
            )

            // Add a subtle rotation to the SVG
            $gsap.to(svg, {
              rotation: -5,
              duration: 1.5,
              ease: 'power1.inOut',
              repeat: -1,
              yoyo: true,
              delay: 0.5,
            })
          }
        }

        // Enhanced background glow with multiple layers
        const iconBg = card.querySelector('.service-card__icon-bg')
        if (iconBg) {
          // Main glow animation
          $gsap.to(iconBg, {
            opacity: 1,
            scale: 2.2,
            duration: 0.5,
            ease: 'power2.out',
          })

          // Pulsing effect with varying intensity
          $gsap.to(iconBg, {
            scale: 2.4,
            opacity: 0.8,
            duration: 1.8,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            delay: 0.3,
          })

          // Add rotation to the glow for extra dynamism
          $gsap.to(iconBg, {
            rotation: 360,
            duration: 8,
            ease: 'none',
            repeat: -1,
            delay: 0.2,
          })
        }

        // Enhanced sparkle effect to tech tags with wave animation
        const techTags = card.querySelectorAll('.service-card__tech-tag')
        if (techTags.length > 0) {
          // Initial bounce
          $gsap.to(techTags, {
            scale: 1.08,
            y: -2,
            duration: 0.25,
            ease: 'back.out(2)',
            stagger: 0.04,
            delay: 0.3,
          })

          // Continuous gentle wave effect
          techTags.forEach((tag, index) => {
            $gsap.to(tag, {
              y: -1,
              duration: 1.5 + index * 0.1,
              ease: 'power1.inOut',
              repeat: -1,
              yoyo: true,
              delay: 0.5 + index * 0.1,
            })
          })
        }

        // Add shimmer effect to the title
        const title = card.querySelector('.service-card__title')
        if (title) {
          $gsap.to(title, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
            delay: 0.2,
          })
        }

        // Add subtle scale to feature bullets
        const bullets = card.querySelectorAll('.service-card__feature-bullet')
        if (bullets.length > 0) {
          $gsap.to(bullets, {
            scale: 1.3,
            duration: 0.3,
            ease: 'back.out(2)',
            stagger: 0.03,
            delay: 0.4,
          })
        }

        // Add card overlay glow effect
        const overlay = card.querySelector('.service-card__overlay')
        if (overlay) {
          $gsap.to(overlay, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        }
      }

      const handleMouseLeave = () => {
        // Kill all ongoing animations for smooth reset
        $gsap.killTweensOf([
          card,
          card.querySelector('.service-card__icon'),
          card.querySelector('.service-card__icon svg'),
          card.querySelector('.service-card__icon-bg'),
          card.querySelectorAll('.service-card__tech-tag'),
          card.querySelector('.service-card__title'),
          card.querySelectorAll('.service-card__feature-bullet'),
          card.querySelector('.service-card__overlay'),
        ])

        // Reset main card with bounce
        $gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.2)',
        })

        // Reset icon with satisfying spring animation
        const icon = card.querySelector('.service-card__icon')
        if (icon) {
          $gsap.to(icon, {
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.8)',
          })

          // Reset SVG with elastic ease
          const svg = icon.querySelector('svg')
          if (svg) {
            $gsap.to(svg, {
              scale: 1,
              rotation: 0,
              duration: 0.4,
              ease: 'elastic.out(1, 0.6)',
            })
          }
        }

        // Reset background glow smoothly
        const iconBg = card.querySelector('.service-card__icon-bg')
        if (iconBg) {
          $gsap.to(iconBg, {
            opacity: 0,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
        }

        // Reset tech tags with staggered animation
        const techTags = card.querySelectorAll('.service-card__tech-tag')
        if (techTags.length > 0) {
          $gsap.to(techTags, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.5)',
            stagger: 0.02,
          })
        }

        // Reset title
        const title = card.querySelector('.service-card__title')
        if (title) {
          $gsap.to(title, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
        }

        // Reset feature bullets
        const bullets = card.querySelectorAll('.service-card__feature-bullet')
        if (bullets.length > 0) {
          $gsap.to(bullets, {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.5)',
            stagger: 0.02,
          })
        }

        // Reset overlay
        const overlay = card.querySelector('.service-card__overlay')
        if (overlay) {
          $gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
        }
      }

      // Add event listeners
      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      // Store cleanup functions for later removal
      card.setAttribute('data-hover-listeners', 'true')
    })
  }

  /**
   * Remove hover effect listeners
   */
  const removeCardHoverEffects = (cards: HTMLElement[]): void => {
    cards.forEach(card => {
      if (card.getAttribute('data-hover-listeners')) {
        // Clone and replace to remove all event listeners
        const newCard = card.cloneNode(true) as HTMLElement
        card.parentNode?.replaceChild(newCard, card)
      }
    })
  }

  /**
   * Enhanced cleanup for Services-specific ScrollTriggers and interactions
   */
  const cleanup = (): void => {
    // Clean up ScrollTriggers
    servicesScrollTriggers.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill()
      }
    })
    servicesScrollTriggers.length = 0

    // Clean up hover effects
    const serviceCards = refs.serviceCardRefs.value.filter(Boolean)
    if (serviceCards.length > 0) {
      removeCardHoverEffects(serviceCards)
    }

    // Call base cleanup
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
    addCardHoverEffects,
    removeCardHoverEffects,
  }
}
