import type { ComponentPublicInstance, Ref } from 'vue'
import {
  type SkillsAnimationOptions,
  SECTION_DEFAULTS,
} from './animation.config'

// Simple debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Enhanced Skills animations composable with improved performance and DRY principles
 */
export const useSkillsAnimation = (options: SkillsAnimationOptions = {}) => {
  const { animateSkills, cleanup } = useAnimations()

  // State management with improved typing
  const containerRef = ref<HTMLElement | null>(null)
  const skillItems = ref<HTMLElement[]>([])

  // Merge with section-specific defaults
  const config = {
    ...SECTION_DEFAULTS.skills,
    ...options,
  }

  /**
   * Enhanced skill reference setter with better performance
   */
  const setSkillRef = (
    el: Element | ComponentPublicInstance | null,
    index: number,
  ): void => {
    if (!el) return

    const element =
      el instanceof HTMLElement
        ? el
        : ((el as ComponentPublicInstance)?.$el as HTMLElement)

    if (element && element instanceof HTMLElement) {
      // Efficiently manage array size
      const currentLength = skillItems.value.length
      if (index >= currentLength) {
        skillItems.value = [
          ...skillItems.value,
          ...new Array(index - currentLength + 1).fill(null),
        ]
      }
      skillItems.value[index] = element
    }
  }

  /**
   * Optimized animation initialization
   */
  const initializeAnimations = (): void => {
    const validItems = skillItems.value.filter(Boolean)
    if (!validItems.length) return

    // Use unified animation system with merged config
    animateSkills(skillItems, {
      start: config.triggerStart,
      duration: config.duration,
      stagger: config.itemDelay,
      ease: config.ease,
      itemsPerRow: config.itemsPerRow,
      rowDelay: config.rowDelay,
    })
  }

  // Optimized watcher with debouncing for better performance
  const debouncedInitialize = debounce(initializeAnimations, 50)

  watch(
    () => skillItems.value.filter(Boolean).length,
    newLength => {
      if (newLength > 0) {
        nextTick(debouncedInitialize)
      }
    },
    { flush: 'post' },
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
