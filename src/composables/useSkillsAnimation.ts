import type { Ref } from 'vue'

interface SkillsAnimationOptions {
  triggerStart?: string
  duration?: number
  staggerDelay?: number
  rowDelay?: number
  ease?: string
}

export const useSkillsAnimation = () => {
  const { $gsap, $ScrollTrigger } = useNuxtApp()

  const skillItems = ref<HTMLElement[]>([])

  /**
   * Set ref for skill item elements
   */
  const setSkillRef = (
    el: Element | ComponentPublicInstance | null,
    index: number,
  ) => {
    if (el && '$el' in el) {
      skillItems.value[index] = el.$el as HTMLElement
    } else if (el instanceof HTMLElement) {
      skillItems.value[index] = el
    }
  }

  /**
   * Get number of items per row based on screen size
   */
  const getItemsPerRow = (): number => {
    if (!import.meta.client) return 4

    const width = window.innerWidth
    if (width >= 1024) return 4 // lg breakpoint
    if (width >= 768) return 3 // md breakpoint
    return 2 // mobile
  }

  /**
   * Group skills into rows based on screen size
   */
  const groupSkillsIntoRows = (items: HTMLElement[]): HTMLElement[][] => {
    const itemsPerRow = getItemsPerRow()
    const rows: HTMLElement[][] = []

    for (let i = 0; i < items.length; i += itemsPerRow) {
      rows.push(items.slice(i, i + itemsPerRow))
    }

    return rows
  }

  /**
   * Initialize staggered row animation for skills
   */
  const initStaggeredAnimation = (
    containerRef: Ref<HTMLElement | null>,
    options: SkillsAnimationOptions = {},
  ) => {
    if (
      !import.meta.client ||
      !containerRef.value ||
      !skillItems.value.length
    ) {
      return
    }

    const {
      triggerStart = 'top 85%',
      duration = 0.6,
      staggerDelay = 0.1,
      rowDelay = 0.2,
      ease = 'back.out(1.7)',
    } = options

    // Group skills into rows
    const rows = groupSkillsIntoRows(skillItems.value)

    // Set initial state for all items
    $gsap.set(skillItems.value, {
      opacity: 0,
      y: 50,
      scale: 0.8,
    })

    // Animate each row with stagger
    rows.forEach((rowItems, rowIndex) => {
      $ScrollTrigger.create({
        trigger: rowItems[0],
        start: triggerStart,
        once: true,
        onEnter: () => {
          $gsap.to(rowItems, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration,
            ease,
            stagger: staggerDelay,
            delay: rowIndex * rowDelay,
          })
        },
      })
    })
  }

  /**
   * Cleanup animation triggers
   */
  const cleanup = (containerRef: Ref<HTMLElement | null>) => {
    if (import.meta.client && $ScrollTrigger) {
      $ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === containerRef.value) {
          trigger.kill()
        }
      })
    }
  }

  return {
    skillItems,
    setSkillRef,
    initStaggeredAnimation,
    cleanup,
  }
}
