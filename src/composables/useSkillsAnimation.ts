import type { Ref } from 'vue'

interface SkillsAnimationOptions {
  triggerStart?: string
  rowDelay?: number
  itemDelay?: number
  duration?: number
  ease?: string
  itemsPerRow?: number
}

/**
 * Simplified Skills animations using the unified animation system
 */
export const useSkillsAnimation = (options: SkillsAnimationOptions = {}) => {
  const { animateSkills, cleanup } = useAnimations()

  // State management
  const containerRef = ref<HTMLElement | null>(null)
  const skillItems = ref<HTMLElement[]>([])

  /**
   * Set skill item element reference (used by template refs)
   */
  const setSkillRef = (
    el: Element | ComponentPublicInstance | null,
    index: number,
  ): void => {
    if (!el) return

    let element: HTMLElement | null = null

    if (typeof el === 'object' && '$el' in el) {
      // Handle Vue component instance
      element = (el as ComponentPublicInstance).$el as HTMLElement
    } else if (el instanceof HTMLElement) {
      // Handle direct HTML element
      element = el
    }

    if (element) {
      // Ensure the array is large enough
      if (index >= skillItems.value.length) {
        skillItems.value.length = index + 1
      }
      skillItems.value[index] = element
    }
  }

  /**
   * Initialize animations when skills are ready
   */
  const initializeAnimations = (): void => {
    if (!skillItems.value.length) return

    // Use the unified animation system for skills
    animateSkills(skillItems, {
      start: options.triggerStart ?? 'top 90%',
      duration: options.duration ?? 0.6,
      stagger: options.itemDelay ?? 0.1,
      ease: options.ease ?? 'power2.out',
      itemsPerRow: options.itemsPerRow ?? 4,
      rowDelay: options.rowDelay ?? 0.2,
    })
  }

  // Watch for skill items changes and initialize animations
  watch(
    () => skillItems.value,
    newItems => {
      if (newItems.length > 0) {
        nextTick(initializeAnimations)
      }
    },
    { deep: true, flush: 'post' },
  )

  // Lifecycle management
  onUnmounted(cleanup)

  return {
    containerRef,
    skillItems: readonly(skillItems),
    setSkillRef,
    initializeAnimations,
    cleanup,
  }
}
