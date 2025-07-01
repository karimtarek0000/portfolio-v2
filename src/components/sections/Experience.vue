<script lang="ts" setup>
// ============================================================================
// TYPES & INTERFACES - Type definitions
// ============================================================================

interface ExperienceItem {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

// ============================================================================
// CONSTANTS - Application constants for better maintainability
// ============================================================================

const DATE_FORMAT_OPTIONS = {
  month: 'short' as const,
  year: 'numeric' as const,
} as const

const PRESENT_DATE_LABEL = 'Present' as const

// ============================================================================
// DATA LAYER - Experience data (consider moving to external data file)
// ============================================================================

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
// COMPUTED VALUES - Memoized calculations for performance
// ============================================================================

/**
 * Memoized date formatter instance for better performance
 */
const dateFormatter = computed(
  () => new Intl.DateTimeFormat('en', DATE_FORMAT_OPTIONS),
)

/**
 * Memoized experience count for template optimizations
 */
const experienceCount = computed(() => experience.value.length)

/**
 * Memoized last experience index for conditional rendering
 */
const lastExperienceIndex = computed(() => experienceCount.value - 1)

// ============================================================================
// UTILITIES - Pure functions for data transformation
// ============================================================================

/**
 * Formats a date string for display
 * @param date - Date string to format
 * @returns Formatted date string
 */
const formatDate = (date: string): string => {
  if (date === PRESENT_DATE_LABEL) return date
  return dateFormatter.value.format(new Date(date))
}

/**
 * Creates a unique key for experience items
 * @param item - Experience item
 * @param index - Array index
 * @returns Unique key string
 */
const createExperienceKey = (item: ExperienceItem, index: number): string =>
  `${item.company}-${item.position}-${index}`

/**
 * Checks if an experience item is the last one
 * @param index - Current index
 * @returns Boolean indicating if it's the last item
 */
const isLastExperience = (index: number): boolean =>
  index === lastExperienceIndex.value

// ============================================================================
// STATE MANAGEMENT - DOM refs with better type safety
// ============================================================================

const timelineItemsRef = ref<HTMLElement[]>([])
const timelineLinesRef = ref<HTMLElement[]>([])
const timelineDotsRef = ref<HTMLElement[]>([])
const sharedHeaderRef = ref<HTMLElement | null>(null)
const documentElementRef = ref<HTMLElement | null>(null)

/**
 * Template ref handler for timeline items
 * @param el - DOM element
 * @param index - Array index
 */
const setTimelineItemRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
): void => {
  if (el && 'nodeType' in el) {
    timelineItemsRef.value[index] = el as HTMLElement
  }
}

/**
 * Template ref handler for timeline dots
 * @param el - DOM element
 * @param index - Array index
 */
const setTimelineDotRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
): void => {
  if (el && 'nodeType' in el) {
    timelineDotsRef.value[index] = el as HTMLElement
  }
}

/**
 * Template ref handler for timeline lines
 * @param el - DOM element
 * @param index - Array index
 */
const setTimelineLineRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
): void => {
  if (el && 'nodeType' in el) {
    timelineLinesRef.value[index] = el as HTMLElement
  }
}

// ============================================================================
// EXTERNAL DEPENDENCIES - Composables integration
// ============================================================================

const { animationConfig } = useExperienceGSAP(
  {}, // Use default configuration
  {
    onHeaderVisible: () => {},
    onHeaderAnimationComplete: () => {},
  },
  {
    timelineItemsRef,
    timelineLinesRef,
    timelineDotsRef,
    sharedHeaderRef,
    documentElementRef,
  },
)

// ============================================================================
// LIFECYCLE - Cleanup for memory management
// ============================================================================

onBeforeUnmount(() => {
  // Clear refs to prevent memory leaks
  timelineItemsRef.value = []
  timelineLinesRef.value = []
  timelineDotsRef.value = []
})
</script>

<template>
  <section class="py-10 mt-20 glassmorphism">
    <div ref="sharedHeaderRef">
      <SharedHeader
        title="experience"
        :animation-options="animationConfig.header"
      />
    </div>

    <div class="mx-3 md:mx-0 timeline">
      <div
        v-for="(item, index) in experience"
        :key="createExperienceKey(item, index)"
        :ref="el => setTimelineItemRef(el, index)"
        class="timeline__item group"
      >
        <div class="timeline__container">
          <!-- Timeline dot and line -->
          <div class="timeline__dot-wrapper">
            <div
              :ref="el => setTimelineDotRef(el, index)"
              class="timeline__dot timeline__element--ssr-safe"
            >
              <div class="timeline__inner-dot"></div>
            </div>
            <div
              :ref="el => setTimelineLineRef(el, index)"
              class="timeline__line timeline__element--ssr-safe"
              :class="{
                'timeline__line--last': isLastExperience(index),
              }"
            ></div>
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
  transform: scale(0); /* Start hidden for GSAP animation */
  will-change: transform;
  transition: none; /* Disable CSS transitions to let GSAP handle animation */
}

.timeline__inner-dot {
  @apply w-3 h-3 transition-all duration-500 rounded-full dark:bg-blue-400 
         group-hover:scale-110 group-hover:bg-primary-2 bg-primary-3;
}

.timeline__line {
  @apply w-[2px] h-24 my-2 bg-gradient-to-b from-blue-400/30 via-gray-700 to-transparent;
  /* Enhanced animation support - ensure proper scaling */
  transform-origin: bottom center;
  transform: scaleY(0);
  will-change: transform;
  transition: none; /* Disable CSS transitions to let GSAP handle animation */
}

.timeline__line--last {
  /* Keep same height as other lines for consistent scaling */
  @apply h-24;
  /* Make the gradient shorter to create visual endpoint effect */
  background: linear-gradient(
    to bottom,
    rgb(96 165 250 / 0.3) 0%,
    rgb(55 65 81) 50%,
    transparent 100%
  );
}

.timeline__content {
  @apply w-full max-w-lg px-5 py-4 transition-all duration-300 border-l-2 border-gray-700/50 
         rounded-r-md  group-hover:border-primary-2 group-hover:translate-x-1 
         dark:group-hover:bg-[#2A2A2A] group-hover:bg-gray-800/10;
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
