import type { Ref } from 'vue'

interface HeaderAnimationOptions {
  triggerStart?: string
  duration?: number
  staggerDelay?: number
  ease?: string
  enableParallax?: boolean
}

interface HeaderElements {
  title: HTMLElement | null
  subtitle: HTMLElement | null
}

export const useHeaderAnimations = (options: HeaderAnimationOptions = {}) => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  // Configuration with performance-optimized defaults
  const config = {
    triggerStart: 'top 85%',
    duration: 0.8,
    staggerDelay: 0.15,
    ease: 'power2.out',
    enableParallax: false, // Disabled by default for mobile performance
    ...options,
  }

  // State management
  const headerRef = ref<HTMLElement | null>(null)
  const scrollTriggers = ref<ScrollTrigger[]>([])
  const isHiddenInitially = ref(false)

  // Animation constants optimized for mobile
  const ANIMATION_CONFIG = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    final: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    // Reduce motion for mobile devices
    mobile: {
      initial: {
        opacity: 0,
        y: 20,
      },
      final: {
        opacity: 1,
        y: 0,
      },
    },
  } as const

  /**
   * Check if device prefers reduced motion for accessibility
   */
  const prefersReducedMotion = (): boolean => {
    if (!import.meta.client) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Check if device is mobile for performance optimization
   */
  const isMobileDevice = (): boolean => {
    if (!import.meta.client) return false
    return (
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    )
  }

  /**
   * Get animation configuration based on device capabilities
   */
  const getAnimationConfig = () => {
    const isMobile = isMobileDevice()
    const reducedMotion = prefersReducedMotion()

    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        final: { opacity: 1 },
        duration: 0.3,
      }
    }

    return isMobile
      ? { ...ANIMATION_CONFIG.mobile, duration: config.duration * 0.7 }
      : { ...ANIMATION_CONFIG, duration: config.duration }
  }

  /**
   * Extract header elements safely
   */
  const getHeaderElements = (container: HTMLElement): HeaderElements => {
    return {
      title: container.querySelector('.header__title') as HTMLElement,
      subtitle: container.querySelector('.header__subtitle') as HTMLElement,
    }
  }

  /**
   * Immediately hide elements on client-side to prevent SSR flash
   * This runs synchronously as soon as the component is mounted
   */
  const hideElementsImmediately = (): void => {
    if (!import.meta.client || !headerRef.value || isHiddenInitially.value)
      return

    const elements = getHeaderElements(headerRef.value)
    const animationElements = [elements.title, elements.subtitle].filter(
      Boolean,
    ) as HTMLElement[]

    if (!animationElements.length) return

    // Use direct style manipulation for immediate effect (faster than GSAP)
    animationElements.forEach(element => {
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px) scale(0.98)'
      element.style.willChange = 'transform, opacity'
    })

    isHiddenInitially.value = true
  }

  /**
   * Set initial animation state with GSAP (called after immediate hiding)
   */
  const setInitialState = (elements: HTMLElement[]): void => {
    if (!elements.length || !import.meta.client) return

    const animConfig = getAnimationConfig()

    $gsap.set(elements, {
      ...animConfig.initial,
      willChange: 'transform, opacity',
    })
  }

  /**
   * Create the main header animation
   */
  const createHeaderAnimation = (elements: HTMLElement[]): void => {
    if (!elements.length) return

    const animConfig = getAnimationConfig()
    const isMobile = isMobileDevice()

    // Create timeline for smooth sequencing
    const tl = $gsap.timeline({
      paused: true,
      defaults: {
        ease: config.ease,
        duration: animConfig.duration,
      },
    })

    // Animate elements with stagger for visual appeal
    elements.forEach((element, index) => {
      const delay = index * config.staggerDelay

      tl.to(
        element,
        {
          ...animConfig.final,
          delay,
          onComplete: () => {
            // Clear will-change after animation for performance
            $gsap.set(element, { willChange: 'auto' })
          },
        },
        index === 0 ? 0 : '<',
      )
    })

    // Create scroll trigger
    const trigger = $ScrollTrigger.create({
      trigger: headerRef.value,
      start: config.triggerStart,
      once: true, // Fire only once for performance
      onEnter: () => {
        tl.play()
      },
      // Reduced refresh rate on mobile for performance
      refreshPriority: isMobile ? -1 : 0,
    })

    scrollTriggers.value.push(trigger)
  }

  /**
   * Add subtle parallax effect for desktop (performance-conscious)
   */
  const createParallaxEffect = (titleElement: HTMLElement): void => {
    if (!titleElement || !config.enableParallax || isMobileDevice()) return

    const trigger = $ScrollTrigger.create({
      trigger: headerRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1, // Smooth scrubbing
      onUpdate: self => {
        const progress = self.progress
        const yTransform = progress * 20 // Subtle movement

        $gsap.set(titleElement, {
          y: yTransform,
          willChange: 'transform',
        })
      },
      onLeave: () => {
        $gsap.set(titleElement, { willChange: 'auto' })
      },
    })

    scrollTriggers.value.push(trigger)
  }

  /**
   * Initialize all header animations with SSR-safe approach
   */
  const initializeAnimations = (): void => {
    if (!import.meta.client || !headerRef.value) return

    const elements = getHeaderElements(headerRef.value)
    const animationElements = [elements.title, elements.subtitle].filter(
      Boolean,
    ) as HTMLElement[]

    if (!animationElements.length) return

    // Set proper initial state with GSAP
    setInitialState(animationElements)

    // Create main animation
    createHeaderAnimation(animationElements)

    // Add parallax for desktop if enabled
    if (elements.title && config.enableParallax) {
      createParallaxEffect(elements.title)
    }
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
  const handleResize = (): void => {
    if (!import.meta.client) return

    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      cleanup()
      nextTick(initializeAnimations)
    }, 150) // Debounce for performance
  }

  /**
   * Setup lifecycle management with SSR-safe approach
   */
  const setupLifecycle = (): void => {
    // Watch for headerRef changes and immediately hide elements
    watchEffect(() => {
      if (headerRef.value && import.meta.client) {
        // Hide elements immediately to prevent SSR flash
        hideElementsImmediately()
      }
    })

    onMounted(() => {
      // Initialize animations after DOM is ready
      nextTick(() => {
        initializeAnimations()

        if (import.meta.client) {
          window.addEventListener('resize', handleResize, { passive: true })
        }
      })
    })

    onUnmounted(() => {
      cleanup()

      if (import.meta.client) {
        clearTimeout(resizeTimeout)
        window.removeEventListener('resize', handleResize)
      }
    })
  }

  // Initialize lifecycle hooks
  setupLifecycle()

  return {
    headerRef,
    initializeAnimations,
    cleanup,
  }
}
