import type { Ref } from 'vue'
import {
  type ExperienceAnimationConfig,
  type AnimationType,
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
   * Initialize timeline lines and dots with enhanced sequencing
   */
  const initializeTimelineElements = (): void => {
    try {
      const hasLines = refs.timelineLinesRef.value.length > 0
      const hasDots = refs.timelineDotsRef.value.length > 0

      if (hasLines || hasDots) {
        animateTimeline(refs.timelineLinesRef, refs.timelineDotsRef, {
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
        const docElement = refs.documentElementRef.value || document.documentElement
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
    isHeaderAnimationComplete: readonly(toRef(state, 'isHeaderAnimationComplete')),
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
        timelineLines: { ...animationConfig.timelineLines, ...newConfig.timelineLines },
      })
    },
  }
}
