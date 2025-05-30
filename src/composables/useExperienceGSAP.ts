import type { Ref } from 'vue'
import {
  type AnimationType,
  type ExperienceAnimationConfig,
  SECTION_DEFAULTS,
} from './animation.config'

// ============================================================================
// ENHANCED INTERFACES WITH BETTER TYPING
// ============================================================================

export interface ExperienceGSAPCallbacks {
  onHeaderVisible?: () => void
  onHeaderAnimationComplete?: () => void
  onTimelineComplete?: () => void
}

export interface ExperienceGSAPRefs {
  timelineItemsRef: Ref<HTMLElement[]>
  sharedHeaderRef: Ref<HTMLElement | null>
  documentElementRef: Ref<HTMLElement | null>
  timelineLinesRef: Ref<HTMLElement[]>
  timelineDotsRef: Ref<HTMLElement[]>
}

export interface ExperienceAnimationState {
  isHeaderVisible: boolean
  isHeaderAnimationComplete: boolean
  isJavaScriptEnabled: boolean
  isTimelineComplete: boolean
}

// ============================================================================
// ENHANCED EXPERIENCE ANIMATIONS COMPOSABLE
// ============================================================================

/**
 * Enhanced Experience animations using unified animation system with improved performance,
 * maintainability, and DRY principles
 */
export const useExperienceGSAP = (
  config: Partial<ExperienceAnimationConfig> = {},
  callbacks: ExperienceGSAPCallbacks = {},
  refs: ExperienceGSAPRefs,
  // Deprecated parameter maintained for backward compatibility
  _animateOnScrollFn?: any,
) => {
  const { animateOnScroll, animateTimeline, cleanup } = useAnimations()

  // ============================================================================
  // CONFIGURATION MANAGEMENT
  // ============================================================================

  // Smart configuration merging with section defaults
  const animationConfig = reactive({
    header: {
      ...SECTION_DEFAULTS.experience.header,
      ...config.header,
    },
    timeline: {
      ...SECTION_DEFAULTS.experience.timeline,
      ...config.timeline,
    },
    timelineLines: {
      ...SECTION_DEFAULTS.experience.timelineLines,
      ...config.timelineLines,
    },
  })

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const state = reactive<ExperienceAnimationState>({
    isHeaderVisible: false,
    isHeaderAnimationComplete: false,
    isJavaScriptEnabled: false,
    isTimelineComplete: false,
  })

  // ============================================================================
  // ANIMATION METHODS
  // ============================================================================

  /**
   * Initialize timeline items animation with error handling
   */
  const initializeTimelineItems = (): void => {
    try {
      const items = refs.timelineItemsRef.value.filter(Boolean)
      if (!items.length) return

      animateOnScroll(
        refs.timelineItemsRef,
        animationConfig.timeline.animationType as AnimationType,
        {
          start: animationConfig.timeline.start,
          once: animationConfig.timeline.once,
          onEnter: () => {
            callbacks.onTimelineComplete?.()
            state.isTimelineComplete = true
          },
        },
      )
    } catch (error) {
      console.warn('Failed to initialize timeline items animation:', error)
    }
  }

  /**
   * Initialize timeline lines and dots with synchronized animation
   */
  const initializeTimelineElements = (): void => {
    try {
      const hasLines = refs.timelineLinesRef.value.length > 0
      const hasDots = refs.timelineDotsRef.value.length > 0

      if (hasLines && hasDots) {
        const { $gsap } = useNuxtApp()
        const lines = refs.timelineLinesRef.value.filter(Boolean)
        const dots = refs.timelineDotsRef.value.filter(Boolean)

        // Set initial styles for lines
        lines.forEach(line => {
          $gsap.set(line, {
            scaleY: 0,
            transformOrigin:
              animationConfig.timelineLines.scaleDirection === 'top-to-bottom'
                ? 'top center'
                : 'bottom center',
            willChange: 'transform',
          })
        })

        // Set initial styles for dots
        dots.forEach(dot => {
          $gsap.set(dot, {
            scale: 0,
            transformOrigin: 'center center',
            willChange: 'transform',
          })
        })

        // Create synchronized animations for each line-dot pair
        lines.forEach((line, index) => {
          const correspondingDot = dots[index]

          const { createScrollTrigger } = useAnimations()
          createScrollTrigger({
            trigger: line,
            start: 'top 80%',
            once: true,
            callbacks: {
              onEnter: () => {
                // Start line animation
                $gsap.to(line, {
                  scaleY: 1,
                  duration: animationConfig.timelineLines.duration,
                  ease: animationConfig.timelineLines.ease,
                  delay: index * animationConfig.timelineLines.stagger,
                  onComplete: () => {
                    line.style.willChange = 'auto'
                  },
                })

                // Start dot animation simultaneously (or with small delay)
                if (correspondingDot) {
                  $gsap.to(correspondingDot, {
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                    delay: index * animationConfig.timelineLines.stagger, // Same timing as line
                    onComplete: () => {
                      correspondingDot.style.willChange = 'auto'
                    },
                  })
                }
              },
            },
          })
        })
      } else if (hasLines) {
        // Fallback to original line-only animation
        animateTimeline(refs.timelineLinesRef, ref([]), {
          scaleDirection: animationConfig.timelineLines.scaleDirection,
          once: true,
          duration: animationConfig.timelineLines.duration,
          ease: animationConfig.timelineLines.ease,
          stagger: animationConfig.timelineLines.stagger,
        })
      }
    } catch (error) {
      console.warn('Failed to initialize timeline elements animation:', error)
    }
  }

  /**
   * Set JavaScript enabled flag with DOM validation
   */
  const enableJavaScript = (): void => {
    try {
      if (refs.documentElementRef.value || document?.documentElement) {
        const docElement =
          refs.documentElementRef.value || document.documentElement
        docElement.classList.add('js')
        state.isJavaScriptEnabled = true
      }
    } catch (error) {
      console.warn('Failed to set JavaScript enabled flag:', error)
    }
  }

  /**
   * Centralized animation initialization with proper sequencing
   */
  const initializeAnimations = (): void => {
    if (!import.meta.client) return

    nextTick(() => {
      // Initialize in optimal sequence for performance
      enableJavaScript()
      initializeTimelineItems()
      initializeTimelineElements()
    })
  }

  // ============================================================================
  // LIFECYCLE MANAGEMENT
  // ============================================================================

  // Enhanced lifecycle with proper cleanup
  onMounted(() => {
    if (import.meta.client) {
      // Set document element reference if not provided
      if (!refs.documentElementRef.value) {
        refs.documentElementRef.value = document.documentElement
      }

      initializeAnimations()
    }
  })

  onUnmounted(() => {
    cleanup()
    // Reset state on unmount
    Object.assign(state, {
      isHeaderVisible: false,
      isHeaderAnimationComplete: false,
      isJavaScriptEnabled: false,
      isTimelineComplete: false,
    })
  })

  // ============================================================================
  // ENHANCED PUBLIC API
  // ============================================================================

  return {
    // Configuration (readonly for immutability)
    animationConfig: readonly(animationConfig),

    // Animation state (readonly for external access)
    isHeaderVisible: readonly(toRef(state, 'isHeaderVisible')),
    isHeaderAnimationComplete: readonly(
      toRef(state, 'isHeaderAnimationComplete'),
    ),
    isJavaScriptEnabled: readonly(toRef(state, 'isJavaScriptEnabled')),
    isTimelineComplete: readonly(toRef(state, 'isTimelineComplete')),

    // Enhanced state object for bulk access
    animationState: readonly(state),

    // Core functions with improved error handling
    initializeAnimations,
    initializeTimelineItems,
    initializeTimelineElements,
    enableJavaScript,

    // Lifecycle management
    cleanup,

    // Configuration updates (for dynamic scenarios)
    updateConfig: (newConfig: Partial<ExperienceAnimationConfig>) => {
      Object.assign(animationConfig, {
        header: { ...animationConfig.header, ...newConfig.header },
        timeline: { ...animationConfig.timeline, ...newConfig.timeline },
        timelineLines: {
          ...animationConfig.timelineLines,
          ...newConfig.timelineLines,
        },
      })
    },
  }
}
