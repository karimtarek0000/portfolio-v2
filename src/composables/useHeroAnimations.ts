import { gsap } from 'gsap'
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

/**
 * Hero section animations composable for entrance animations without scroll triggers
 */
export const useHeroAnimations = (
  refs: HeroAnimationRefs,
  options: HeroAnimationOptions = {},
) => {
  const { $gsap } = useNuxtApp()

  const config = {
    enableAutoPlay: true,
    staggerDelay: 0.2,
    duration: 1.2,
    ease: 'power3.out',
    ...options,
  }

  let masterTimeline: GSAPTimeline | null = null

  /**
   * Initialize hero entrance animations
   */
  const initializeHeroAnimations = (): void => {
    if (!import.meta.client) return

    // Create master timeline for coordinated animations
    masterTimeline = $gsap.timeline({
      paused: !config.enableAutoPlay,
      defaults: {
        ease: config.ease,
      },
    })

    // Set initial states
    setInitialStates()

    // Build animation sequence
    buildAnimationTimeline()

    // Auto-play if enabled
    if (config.enableAutoPlay) {
      // Small delay to ensure DOM is ready
      nextTick(() => {
        masterTimeline?.play()
      })
    }
  }

  /**
   * Set initial states for all animated elements
   */
  const setInitialStates = (): void => {
    // Lottie container - scale and fade
    if (refs.lottieContainerRef.value) {
      $gsap.set(refs.lottieContainerRef.value, {
        opacity: 0,
        scale: 0.8,
        y: 30,
        willChange: 'transform, opacity',
      })
    }

    // Title elements - split and stagger
    if (refs.titleRef.value) {
      const titleSpans = refs.titleRef.value.querySelectorAll('span')
      $gsap.set(titleSpans, {
        opacity: 0,
        y: 50,
        rotationX: -90,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity',
      })
    }

    // Social icons - scale and rotate
    if (refs.socialIconsRef.value) {
      const socialLinks = refs.socialIconsRef.value.querySelectorAll('a')
      $gsap.set(socialLinks, {
        opacity: 0,
        scale: 0,
        rotation: -180,
        willChange: 'transform, opacity',
      })
    }

    // Download button - smooth bottom-to-top translation setup
    if (refs.downloadButtonRef.value) {
      // Get the actual DOM element from Vue component
      const buttonElement =
        refs.downloadButtonRef.value.$el || refs.downloadButtonRef.value
      if (buttonElement) {
        $gsap.set(buttonElement, {
          opacity: 0,
          y: 60, // Start further down for more dramatic slide
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
        })
      }
    }
  }

  /**
   * Build the master animation timeline
   */
  const buildAnimationTimeline = (): void => {
    if (!masterTimeline) return

    // 1. Lottie animation entrance (0s)
    if (refs.lottieContainerRef.value) {
      masterTimeline.to(
        refs.lottieContainerRef.value,
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
    if (refs.titleRef.value) {
      const titleSpans = refs.titleRef.value.querySelectorAll('span')
      masterTimeline.to(
        titleSpans,
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

    // 3. Social icons with fast elastic bounce (0.6s) - Made faster
    if (refs.socialIconsRef.value) {
      const socialLinks = refs.socialIconsRef.value.querySelectorAll('a')
      masterTimeline.to(
        socialLinks,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4, // Reduced from 0.7 * 1.2 = 0.84s to 0.4s
          ease: 'back.out(1.7)', // Changed to snappier easing
          stagger: 0.08, // Reduced stagger for faster sequence
        },
        0.6, // Start earlier at 0.6s instead of 0.8s
      )
    }

    // 4. Download button synchronized with social icons ending - ultra-smooth
    if (refs.downloadButtonRef.value) {
      // Get the actual DOM element from Vue component
      const buttonElement =
        refs.downloadButtonRef.value.$el || refs.downloadButtonRef.value
      if (buttonElement) {
        // Calculate timing to sync with social icons with ultra-smooth easing
        // Social icons end at: 0.6s + 0.4s + (3 icons * 0.08s stagger) = ~1.08s
        // So button should start at: 1.08s - 0.48s = 0.6s
        masterTimeline
          .to(
            buttonElement,
            {
              opacity: 1,
              y: 0,
              duration: 0.48, // Keep synchronized duration
              ease: 'power3.out', // Even smoother with stronger deceleration
            },
            0.6,
          ) // Start same time as icons for synchronized ending
          // Add magnetic hover preparation
          .set(buttonElement, {
            cursor: 'pointer',
          })
          // Ultra-smooth glow timing with enhanced transition
          .to(
            buttonElement,
            {
              boxShadow:
                '0 4px 15px rgba(255, 201, 72, 0.1), 0 2px 8px rgba(255, 201, 72, 0.05)',
              duration: 0.48, // Match main animation duration
              ease: 'power3.out', // Consistent ultra-smooth easing
            },
            '-=0.3', // More overlap for seamless glow transition
          )
      }
    }

    // 5. Add subtle floating animation for lottie container
    if (refs.lottieContainerRef.value) {
      masterTimeline.to(
        refs.lottieContainerRef.value,
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
   * Add interaction animations for enhanced UX
   */
  const addInteractionAnimations = (): void => {
    if (!import.meta.client) return

    // Social icons hover effect
    if (refs.socialIconsRef.value) {
      const socialLinks = refs.socialIconsRef.value.querySelectorAll('a')
      socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          $gsap.to(link, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        link.addEventListener('mouseleave', () => {
          $gsap.to(link, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      })
    }

    // SharedButton hover animations removed - keeping it static
    // No hover effects for download button anymore
  }

  /**
   * Cleanup animations and event listeners
   */
  const cleanup = (): void => {
    if (masterTimeline) {
      masterTimeline.kill()
      masterTimeline = null
    }

    // Reset will-change properties
    const allElements = [
      refs.lottieContainerRef.value,
      refs.titleRef.value,
      refs.socialIconsRef.value,
      refs.downloadButtonRef.value,
    ].filter(Boolean)

    allElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.willChange = 'auto'
      }
    })
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
