import type { Ref } from 'vue'
import { 
  type AboutAnimationOptions, 
  type TextAnimationOptions,
  SECTION_DEFAULTS 
} from './animation.config'

/**
 * Enhanced About animations composable with improved performance and DRY principles
 */
export const useAboutAnimations = () => {
  const { animateTextLines, cleanup } = useAnimations()

  /**
   * Initialize animations for the About section with smart defaults
   */
  const initializeAnimations = (
    refs: { textContainerRef: Ref<HTMLElement | null> },
    options: AboutAnimationOptions = {}
  ) => {
    if (!import.meta.client) return

    const { textContainerRef } = refs

    // Merge with section-specific defaults for consistency
    const textConfig: TextAnimationOptions = {
      ...SECTION_DEFAULTS.about.textAnimation,
      ...options.textAnimation,
    }

    // Use the unified animation system for text animations
    animateTextLines(textContainerRef, textConfig)
  }

  return {
    initializeAnimations,
    cleanup,
  }
}
