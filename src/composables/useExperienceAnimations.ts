import type { Ref } from 'vue'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface ExperienceAnimationOptions {
  triggerStart?: string
  duration?: number
  staggerDelay?: number
  ease?: string
  enableParallax?: boolean
}

interface ExperienceAnimationRefs {
  timelineRef: Ref<HTMLElement | null>
  timelineItemsRef: Ref<HTMLElement[]>
}

export const useExperienceAnimations = (
  options: ExperienceAnimationOptions = {},
) => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Configuration with performance-optimized defaults
  const config = {
    triggerStart: 'top 85%',
    duration: 0.8,
    staggerDelay: 0.2,
    ease: 'power2.out',
    enableParallax: false, // Disabled by default for mobile performance
    ...options,
  }

  // State management
  const scrollTriggers = ref<ScrollTrigger[]>([])
  const isHiddenInitially = ref(false)

  // Animation constants optimized for mobile
  const ANIMATION_CONFIG = {
    initial: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    final: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    timeline: {
      initial: {
        opacity: 0,
        scaleX: 0,
      },
      final: {
        opacity: 1,
        scaleX: 1,
      },
    },
  } as const

  /**
   * Detect mobile device for performance optimizations
   */
  const isMobileDevice = (): boolean => {
    if (!import.meta.client) return false
    return window.innerWidth < 768 || 'ontouchstart' in window
  }

  /**
   * Immediately hide elements to prevent SSR flash using direct DOM manipulation
   */
  const hideElementsImmediately = (elements: HTMLElement[]): void => {
    if (!import.meta.client || !elements.length) return

    elements.forEach(element => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(40px) scale(0.95)'
      element.style.willChange = 'transform, opacity'
    })

    isHiddenInitially.value = true
  }

  /**
   * Set initial animation state with GSAP
   */
  const setInitialState = (elements: HTMLElement[]): void => {
    if (!elements.length || !import.meta.client) return

    $gsap.set(elements, {
      ...ANIMATION_CONFIG.initial,
      willChange: 'transform, opacity',
    })
  }

  /**
   * Animate timeline lines with stagger effect
   */
  const animateTimelineLines = (timelineRef: HTMLElement): void => {
    if (!timelineRef) return

    const timelineLines = timelineRef.querySelectorAll('.timeline__line')
    if (!timelineLines.length) return

    // Set initial state for timeline lines
    $gsap.set(timelineLines, ANIMATION_CONFIG.timeline.initial)

    // Animate timeline lines with stagger
    timelineLines.forEach((line, index) => {
      const trigger = $ScrollTrigger.create({
        trigger: line,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          $gsap.to(line, {
            ...ANIMATION_CONFIG.timeline.final,
            duration: config.duration * 0.8,
            ease: config.ease,
            delay: index * (config.staggerDelay * 0.3),
            transformOrigin: 'top center',
            onComplete: () => {
              $gsap.set(line, { willChange: 'auto' })
            },
          })
        },
      })

      scrollTriggers.value.push(trigger)
    })
  }

  /**
   * Animate timeline dots with bounce effect
   */
  const animateTimelineDots = (timelineRef: HTMLElement): void => {
    if (!timelineRef) return

    const timelineDots = timelineRef.querySelectorAll('.timeline__dot')
    if (!timelineDots.length) return

    // Set initial state for dots
    $gsap.set(timelineDots, {
      scale: 0,
      opacity: 0,
      willChange: 'transform, opacity',
    })

    // Animate dots with bounce effect
    timelineDots.forEach((dot, index) => {
      const trigger = $ScrollTrigger.create({
        trigger: dot,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          $gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: config.duration * 0.6,
            ease: 'back.out(1.7)',
            delay: index * (config.staggerDelay * 0.4),
            onComplete: () => {
              $gsap.set(dot, { willChange: 'auto' })
            },
          })
        },
      })

      scrollTriggers.value.push(trigger)
    })
  }

  /**
   * Create main timeline item animations
   */
  const createTimelineItemAnimations = (items: HTMLElement[]): void => {
    if (!items.length) return

    const isMobile = isMobileDevice()

    items.forEach((item, index) => {
      const contentElement = item.querySelector(
        '.timeline__content',
      ) as HTMLElement
      if (!contentElement) return

      const trigger = $ScrollTrigger.create({
        trigger: item,
        start: config.triggerStart,
        once: true,
        refreshPriority: isMobile ? -1 : 0,
        onEnter: () => {
          // Animate the content with slide-in effect
          $gsap.to(contentElement, {
            ...ANIMATION_CONFIG.final,
            duration: config.duration,
            ease: config.ease,
            delay: index * config.staggerDelay,
            onComplete: () => {
              $gsap.set(contentElement, { willChange: 'auto' })
            },
          })

          // Add subtle parallax for content text on desktop
          if (!isMobile && config.enableParallax) {
            createContentParallax(contentElement)
          }
        },
      })

      scrollTriggers.value.push(trigger)
    })
  }

  /**
   * Add subtle parallax effect for timeline content (desktop only)
   */
  const createContentParallax = (contentElement: HTMLElement): void => {
    if (!contentElement || isMobileDevice()) return

    const trigger = $ScrollTrigger.create({
      trigger: contentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: self => {
        const progress = self.progress
        const yTransform = progress * 15 // Subtle movement

        $gsap.set(contentElement, {
          y: yTransform,
          willChange: 'transform',
        })
      },
      onLeave: () => {
        $gsap.set(contentElement, { willChange: 'auto' })
      },
    })

    scrollTriggers.value.push(trigger)
  }

  /**
   * Initialize all experience animations with SSR-safe approach
   */
  const initializeAnimations = (refs: ExperienceAnimationRefs): void => {
    if (!import.meta.client || !refs.timelineRef.value) return

    const timelineElement = refs.timelineRef.value
    const timelineItems = refs.timelineItemsRef.value.filter(Boolean)

    if (!timelineItems.length) return

    // Immediately hide content elements to prevent flash
    const contentElements = timelineItems
      .map(item => item.querySelector('.timeline__content'))
      .filter(Boolean) as HTMLElement[]

    if (contentElements.length) {
      hideElementsImmediately(contentElements)
      setInitialState(contentElements)
    }

    // Initialize animations in sequence
    nextTick(() => {
      animateTimelineLines(timelineElement)
      animateTimelineDots(timelineElement)
      createTimelineItemAnimations(timelineItems)
    })
  }

  /**
   * Clean up all animations and scroll triggers
   */
  const cleanup = (): void => {
    if (!import.meta.client) return

    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
  }

  /**
   * Handle resize with debounced reinitialization
   */
  let resizeTimeout: NodeJS.Timeout
  const handleResize = (refs: ExperienceAnimationRefs): void => {
    if (!import.meta.client) return

    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      cleanup()
      nextTick(() => initializeAnimations(refs))
    }, 150) // Debounce for performance
  }

  /**
   * Setup lifecycle hooks with SSR-safe approach
   */
  const setupLifecycle = (refs: ExperienceAnimationRefs): void => {
    if (!import.meta.client) return

    // Initialize animations when component is mounted
    onMounted(() => {
      nextTick(() => initializeAnimations(refs))
    })

    // Handle window resize
    const debouncedResize = () => handleResize(refs)
    window.addEventListener('resize', debouncedResize)

    // Cleanup on unmount
    onUnmounted(() => {
      window.removeEventListener('resize', debouncedResize)
      cleanup()
    })
  }

  return {
    initializeAnimations,
    cleanup,
    setupLifecycle,
    config,
  }
}
