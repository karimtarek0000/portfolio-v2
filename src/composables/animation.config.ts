import type { Ref } from 'vue'

// ============================================================================
// SHARED TYPES & INTERFACES
// ============================================================================

export type AnimationType =
  | 'fadeUp'
  | 'fadeIn'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'textReveal'

export interface BaseAnimationOptions {
  start?: string
  end?: string
  duration?: number
  delay?: number
  ease?: string
  once?: boolean
  scrub?: boolean | number
  stagger?: number
}

export interface ScrollAnimationOptions extends BaseAnimationOptions {
  trigger?: HTMLElement | string
  onEnter?: () => void
  onLeave?: () => void
  onUpdate?: (self: ScrollTrigger) => void
}

export interface TextAnimationOptions extends BaseAnimationOptions {
  opacity?: {
    base: number
    range: number
  }
  transform?: {
    yOffset: number
    scale: number
  }
}

export interface TimelineAnimationOptions extends BaseAnimationOptions {
  scaleDirection?: 'bottom-to-top' | 'top-to-bottom'
  itemsPerRow?: number
  rowDelay?: number
}

export interface SkillsAnimationOptions extends BaseAnimationOptions {
  triggerStart?: string
  rowDelay?: number
  itemDelay?: number
  itemsPerRow?: number
}

export interface HeaderAnimationOptions extends BaseAnimationOptions {
  triggerStart?: string
  staggerDelay?: number
  enableParallax?: boolean
}

export interface AboutAnimationOptions {
  textAnimation?: TextAnimationOptions
}

export interface ExperienceAnimationConfig {
  header?: HeaderAnimationOptions
  timeline?: {
    start?: string
    animationType?: AnimationType
    once?: boolean
  }
  timelineLines?: TimelineAnimationOptions
}

// ============================================================================
// ANIMATION PRESETS & CONFIGURATIONS
// ============================================================================

export const ANIMATION_PRESETS = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    final: { opacity: 1, y: 0 },
    transform: 'translateY(30px)',
  },
  fadeIn: {
    initial: { opacity: 0 },
    final: { opacity: 1 },
    transform: '',
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    final: { opacity: 1, x: 0 },
    transform: 'translateX(50px)',
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    final: { opacity: 1, x: 0 },
    transform: 'translateX(-50px)',
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    final: { opacity: 1, scale: 1 },
    transform: 'scale(0.9)',
  },
  textReveal: {
    initial: { opacity: 0.1 },
    final: { opacity: 1 },
    transform: '',
  },
} as const

export const DEFAULT_OPTIONS: Required<BaseAnimationOptions> = {
  start: 'top 85%',
  end: 'bottom 20%',
  duration: 0.8,
  delay: 0,
  ease: 'power2.out',
  once: true,
  scrub: false,
  stagger: 0.1,
}

// Section-specific default configurations
export const SECTION_DEFAULTS = {
  about: {
    textAnimation: {
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1,
      once: false,
      opacity: { base: 0.3, range: 0.7 },
      transform: { yOffset: 10, scale: 0.02 },
    },
  },
  header: {
    triggerStart: 'top 85%',
    duration: 0.8,
    staggerDelay: 0.15,
    ease: 'power2.out',
  },
  skills: {
    triggerStart: 'top 90%',
    duration: 0.6,
    itemDelay: 0.1,
    ease: 'power2.out',
    itemsPerRow: 4,
    rowDelay: 0.2,
  },
  experience: {
    header: {
      triggerStart: 'top 75%',
      duration: 0.7,
      staggerDelay: 0.12,
      ease: 'power2.out',
    },
    timeline: {
      start: 'top 70%',
      animationType: 'fadeUp' as const,
      once: true,
    },
    timelineLines: {
      start: 'top 80%',
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.15,
      scaleDirection: 'bottom-to-top' as const,
    },
  },
  footer: {
    triggerStart: 'top 60%',
    duration: 0.8,
    ease: 'power2.out',
    staggerDelay: 0.2,
  },
} as const

// ============================================================================
// UTILITY TYPES & HELPERS
// ============================================================================

export type ElementRef = Ref<HTMLElement | null>
export type ElementsRef = Ref<HTMLElement[]>
export type ElementInput = ElementRef | ElementsRef | HTMLElement[]

export interface AnimationCallbacks {
  onEnter?: () => void
  onLeave?: () => void
  onComplete?: () => void
  onUpdate?: (self: ScrollTrigger) => void
}

// Performance optimization constants
export const PERFORMANCE_CONFIG = {
  REFRESH_PRIORITY: -1,
  MOBILE_DURATION_MULTIPLIER: 0.8,
  MOBILE_STAGGER_MULTIPLIER: 0.5,
  REDUCED_MOTION_MAX_DURATION: 0.3,
  CACHE_CLEAR_INTERVAL: 60000, // 1 minute
} as const
