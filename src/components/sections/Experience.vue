<script lang="ts" setup>
// ============================================================================
// DATA LAYER - Experience data and related utilities
// ============================================================================

interface ExperienceItem {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

const experience = shallowRef<ExperienceItem[]>([
  {
    company: 'HectarApp',
    position: 'Frontend Engineer',
    startDate: '2022-01-01',
    endDate: 'Present',
    description: 'Developing and maintaining web applications.',
  },
  {
    company: 'HectarApp',
    position: 'Frontend Engineer',
    startDate: '2022-01-01',
    endDate: '2023-01-01',
    description: 'Developing and maintaining web applications.',
  },
  {
    company: 'HectarApp',
    position: 'Frontend Engineer',
    startDate: '2022-01-01',
    endDate: 'Present',
    description: 'Developing and maintaining web applications.',
  },
])

// ============================================================================
// UTILITIES - Pure functions for data transformation
// ============================================================================

const formatDate = (date: string): string => {
  if (date === 'Present') return date
  const d = new Date(date)
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(d)
}

const createExperienceKey = (item: ExperienceItem, index: number): string =>
  `${item.company}-${item.position}-${index}`

// ============================================================================
// ANIMATION CONFIGURATION - Centralized animation constants
// ============================================================================

const ANIMATION_CONFIG = {
  header: {
    triggerStart: 'top 70%',
    duration: 0.7,
    staggerDelay: 0.12,
    ease: 'power2.out',
  },
  timeline: {
    start: 'top 95%',
    animationType: 'fadeUp' as const,
    once: true,
  },
  timing: {
    headerCompletion: {
      start: 'top 65%',
      duration: 700, // ms
      staggerDelay: 120, // ms
      buffer: 100, // ms
    },
  },
  styles: {
    initial: {
      opacity: '0',
      transform: 'translateY(30px)',
      willChange: 'transform, opacity',
    },
  },
} as const

// ============================================================================
// STATE MANAGEMENT - Reactive state for animations and DOM refs
// ============================================================================

// DOM References
const timelineItemsRef = ref<HTMLElement[]>([])
const sharedHeaderRef = ref<HTMLElement | null>(null)
const scrollTriggers = ref<ScrollTrigger[]>([])
const documentElementRef = ref<HTMLElement | null>(null)

// Animation State
const isHeaderVisible = ref(false)
const isHeaderAnimationComplete = ref(false)
const shouldAnimateTimeline = computed(
  () => isHeaderVisible.value && isHeaderAnimationComplete.value,
)

// JavaScript enabled state for CSS targeting
const isJavaScriptEnabled = ref(false)
const documentElementClasses = computed(() => ({
  js: isJavaScriptEnabled.value,
}))

// ============================================================================
// SIDE EFFECTS - DOM manipulation and external integrations
// ============================================================================

// External dependencies
const { animateOnScroll, cleanup: cleanupScrollAnimations } =
  useScrollAnimation()

/**
 * Utility function to check client-side execution
 */
const isClient = (): boolean => import.meta.client

/**
 * Apply initial styles to prevent SSR flash
 */
const applyInitialStyles = (elements: HTMLElement[]): void => {
  if (!isClient()) return

  elements.forEach(element => {
    if (element) {
      Object.assign(element.style, ANIMATION_CONFIG.styles.initial)
    }
  })
}

/**
 * Create scroll trigger with common configuration
 */
const createScrollTrigger = (options: {
  trigger: HTMLElement
  start: string
  once?: boolean
  onEnter: () => void
}): ScrollTrigger => {
  const { $ScrollTrigger } = useNuxtApp()

  return $ScrollTrigger.create({
    trigger: options.trigger,
    start: options.start,
    once: options.once ?? true,
    onEnter: options.onEnter,
  })
}

/**
 * Create animation timing using requestAnimationFrame
 */
const createAnimationTimer = (duration: number, callback: () => void): void => {
  requestAnimationFrame(() => {
    let startTime: number

    const tick = (currentTime: number) => {
      if (!startTime) startTime = currentTime

      if (currentTime - startTime >= duration) {
        callback()
      } else {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  })
}

/**
 * Initialize header animation tracking
 */
const initializeHeaderTracking = (): void => {
  if (!isClient() || !sharedHeaderRef.value) return

  // Track header visibility
  const visibilityTrigger = createScrollTrigger({
    trigger: sharedHeaderRef.value,
    start: ANIMATION_CONFIG.header.triggerStart,
    onEnter: () => {
      isHeaderVisible.value = true
    },
  })

  // Track header animation completion
  const completionTrigger = createScrollTrigger({
    trigger: sharedHeaderRef.value,
    start: ANIMATION_CONFIG.timing.headerCompletion.start,
    onEnter: () => {
      const { duration, staggerDelay, buffer } =
        ANIMATION_CONFIG.timing.headerCompletion
      const totalDuration = duration + staggerDelay + buffer

      createAnimationTimer(totalDuration, () => {
        isHeaderAnimationComplete.value = true
      })
    },
  })

  scrollTriggers.value.push(visibilityTrigger, completionTrigger)
}

/**
 * Initialize timeline animations
 */
const initializeTimelineAnimation = (): void => {
  if (!isClient() || !timelineItemsRef.value.length) return

  animateOnScroll(timelineItemsRef, ANIMATION_CONFIG.timeline.animationType, {
    start: ANIMATION_CONFIG.timeline.start,
    once: ANIMATION_CONFIG.timeline.once,
  })
}

/**
 * Hide timeline items immediately on client
 */
const hideTimelineItems = (): void => {
  applyInitialStyles(timelineItemsRef.value)
}

/**
 * Cleanup all scroll triggers and animations
 */
const cleanupAll = (): void => {
  cleanupScrollAnimations()

  if (isClient()) {
    scrollTriggers.value.forEach(trigger => trigger.kill())
    scrollTriggers.value = []
  }
}

// ============================================================================
// LIFECYCLE MANAGEMENT - Vue lifecycle hooks and watchers
// ============================================================================

// Watch for timeline animation trigger condition
watch(
  shouldAnimateTimeline,
  shouldAnimate => {
    if (shouldAnimate) {
      nextTick(initializeTimelineAnimation)
    }
  },
  { immediate: false },
)

// Watch for timeline items changes
watch(
  timelineItemsRef,
  () => {
    nextTick(hideTimelineItems)
  },
  { deep: true },
)

// Component lifecycle
onMounted(() => {
  if (isClient()) {
    // Store reference to document element
    documentElementRef.value = document.documentElement
    isJavaScriptEnabled.value = true

    nextTick(() => {
      hideTimelineItems()
      initializeHeaderTracking()
    })
  }
})

// Watch for JavaScript enabled state to apply to document element using ref
watch(
  isJavaScriptEnabled,
  enabled => {
    if (isClient() && enabled && documentElementRef.value) {
      documentElementRef.value.classList.add('js')
    }
  },
  { immediate: true },
)

onUnmounted(cleanupAll)
</script>

<template>
  <section class="py-10 mt-20 glassmorphism">
    <div ref="sharedHeaderRef">
      <SharedHeader
        title="experience"
        :animation-options="ANIMATION_CONFIG.header"
      />
    </div>

    <div class="timeline">
      <div
        v-for="(item, index) in experience"
        :key="createExperienceKey(item, index)"
        :ref="(el) => { if (el) timelineItemsRef[index] = el as HTMLElement }"
        class="timeline__item group"
      >
        <div class="timeline__container">
          <!-- Timeline dot and line -->
          <div class="timeline__dot-wrapper">
            <div class="timeline__dot timeline__element--ssr-safe">
              <div class="timeline__inner-dot"></div>
            </div>
            <div class="timeline__line timeline__element--ssr-safe"></div>
          </div>

          <!-- Content section -->
          <div class="timeline__content timeline__element--ssr-safe">
            <!-- Header with company and date -->
            <div class="timeline__header">
              <h3 class="timeline__company">{{ item.company }}</h3>
              <span class="timeline__date">
                {{ formatDate(item.startDate) }} -
                {{ formatDate(item.endDate) }}
              </span>
            </div>

            <!-- Job details -->
            <div class="timeline__body">
              <p class="timeline__position">
                <span class="timeline__bullet"></span>
                {{ item.position }}
              </p>
              <p class="timeline__description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.timeline {
  @apply mt-8 space-y-8;
}

.timeline__container {
  @apply flex justify-center gap-x-4;
}

.timeline__dot-wrapper {
  @apply flex flex-col items-center;
}

.timeline__dot {
  @apply flex items-center justify-center w-8 h-8 transition-all duration-500 rounded-full 
         dark:bg-gray-800/80 ring-2 ring-blue-400/20 group-hover:ring-blue-400/50 
         group-hover:shadow-lg group-hover:shadow-blue-500/10;
  /* Enhanced animation support */
  transform-origin: center center;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.timeline__inner-dot {
  @apply w-3 h-3 transition-all duration-500 rounded-full dark:bg-blue-400 
         group-hover:scale-110 group-hover:bg-primary-2 bg-primary-3;
}

.timeline__line {
  @apply w-[2px] h-24 my-2 bg-gradient-to-b from-blue-400/30 via-gray-700 to-transparent;
  /* Enhanced animation support */
  transform-origin: top center;
  transition: transform 0.3s ease-out;
}

.timeline__content {
  @apply w-full max-w-lg px-5 py-4 transition-all duration-300 border-l-2 border-gray-700/50 
         rounded-r-md backdrop-blur-sm group-hover:border-primary-2 group-hover:translate-x-1 
         dark:group-hover:bg-gray-800/30 group-hover:bg-gray-800/10;
  /* Enhanced animation support */
  transition: transform 0.3s ease-out, opacity 0.3s ease-out,
    border-color 0.3s ease-out;
}

.timeline__header {
  @apply flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-gray-700/50;
}

.timeline__company {
  @apply text-sm font-bold dark:text-blue-400 dark:group-hover:text-blue-300;
}

.timeline__date {
  @apply px-2 py-1 tracking-wider text-primary-3;
}

.timeline__body {
  @apply mt-3 space-y-2;
}

.timeline__position {
  @apply flex items-center text-sm font-medium text-primary-2;
}

.timeline__bullet {
  @apply inline-block w-1.5 h-1.5 bg-primary-2 rounded-full -ms-0.5 me-2;
}

.timeline__description {
  @apply pl-3 text-sm leading-relaxed transition-all duration-300 border-l border-gray-700 
         group-hover:border-primary-2 text-primary-3;
}

/* 
 * SSR-safe hiding: Elements are visible by default for better UX
 * The useScrollAnimation composable will handle hiding and showing
 */
@media screen {
  .timeline__item {
    /* Immediately hide timeline items on client-side, similar to SharedHeader */
    opacity: 0;
    transform: translateY(30px);
    will-change: transform, opacity;
  }
}

/* Ensure elements remain visible during SSR and print */
@media print {
  .timeline__item {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .timeline__item {
    opacity: 1 !important;
    transform: none !important;
  }

  .timeline__dot,
  .timeline__line,
  .timeline__content {
    transition: none;
  }
}

/* Performance optimizations for mobile */
@media (max-width: 768px) {
  .timeline__content {
    will-change: auto;
  }

  .timeline__dot {
    will-change: auto;
  }

  .timeline__line {
    will-change: auto;
  }
}
</style>
