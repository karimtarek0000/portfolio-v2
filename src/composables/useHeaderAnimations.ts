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

  // Use shared utilities for consistency and performance
  const { isMobile, prefersReducedMotion } = useDeviceDetection()
  const { applyStyles } = useBatchStyleApplication()
  const { createTrigger, cleanup: cleanupTriggers } = useScrollTriggerFactory()
  const { validateContainer } = useElementValidation()
  const { setWillChange, clearWillChange } = useWillChangeManager()
  const { debounce } = useDebounce()

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
  const isHiddenInitially = ref(false)

  // Animation constants optimized for performance
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
    // Reduced motion for mobile devices
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
   * Get animation configuration based on device capabilities using shared utilities
   */
  const getAnimationConfig = () => {
    const isReducedMotion = prefersReducedMotion()
    const isMobileDevice = isMobile()

    if (isReducedMotion) {
      return {
        initial: { opacity: 0 },
        final: { opacity: 1 },
        duration: 0.3,
      }
    }

    return isMobileDevice
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
   * Immediately hide elements using shared utilities for consistency
   */
  const hideElementsImmediately = (): void => {
    if (!isClientSide() || !headerRef.value || isHiddenInitially.value) return

    const elements = getHeaderElements(headerRef.value)
    const animationElements = [elements.title, elements.subtitle].filter(
      Boolean,
    ) as HTMLElement[]

    if (!animationElements.length) return

    // Use shared style application for consistency and performance
    applyStyles(animationElements, {
      opacity: '0',
      transform: 'translateY(20px) scale(0.98)',
      willChange: 'transform, opacity',
    })

    isHiddenInitially.value = true
  }

  /**
   * Set initial animation state with GSAP using shared utilities
   */
  const setInitialState = (elements: HTMLElement[]): void => {
    if (!elements.length || !isClientSide()) return

    const animConfig = getAnimationConfig()

    $gsap.set(elements, {
      ...animConfig.initial,
      willChange: 'transform, opacity',
    })
  }

  /**
   * Create the main header animation with optimized performance
   */
  const createHeaderAnimation = (elements: HTMLElement[]): void => {
    if (!elements.length) return

    const animConfig = getAnimationConfig()
    const isMobileDevice = isMobile()

    // Set will-change for performance
    setWillChange(elements)

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
            // Clear will-change after animation using shared utility
            clearWillChange([element])
          },
        },
        index === 0 ? 0 : '<',
      )
    })

    // Create scroll trigger using shared factory
    createTrigger({
      trigger: headerRef.value!,
      start: config.triggerStart,
      once: true,
      onEnter: () => tl.play(),
    })
  }

  /**
   * Add subtle parallax effect for desktop using shared utilities
   */
  const createParallaxEffect = (titleElement: HTMLElement): void => {
    if (!titleElement || !config.enableParallax || isMobile()) return

    createTrigger({
      trigger: headerRef.value!,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      once: false,
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
  }

  /**
   * Initialize all header animations with SSR-safe approach
   */
  const initializeAnimations = (): void => {
    if (!validateContainer(headerRef)) return

    const elements = getHeaderElements(headerRef.value!)
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
   * Clean up all animations using shared utilities
   */
  const cleanup = (): void => {
    cleanupTriggers()
  }

  /**
   * Handle resize with debounced reinitialization using shared utility
   */
  const handleResize = debounce(() => {
    cleanup()
    nextTick(initializeAnimations)
  }, 150)

  /**
   * Setup lifecycle management with SSR-safe approach
   */
  const setupLifecycle = (): void => {
    // Watch for headerRef changes and immediately hide elements
    watchEffect(() => {
      if (headerRef.value && isClientSide()) {
        // Hide elements immediately to prevent SSR flash
        hideElementsImmediately()
      }
    })

    onMounted(() => {
      // Initialize animations after DOM is ready
      nextTick(() => {
        initializeAnimations()

        if (isClientSide()) {
          window.addEventListener('resize', handleResize, { passive: true })
        }
      })
    })

    onUnmounted(() => {
      cleanup()

      if (isClientSide()) {
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
