<script lang="ts" setup>
const experience = shallowRef([
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

// Add function to format dates nicely
const formatDate = (date: string) => {
  if (date === 'Present') return date
  const d = new Date(date)
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(d)
}
</script>

<template>
  <section class="py-10 mt-20 glassmorphism">
    <SharedHeader
      title="experience"
      :animation-options="{
        triggerStart: 'top 70%',
        duration: 0.7,
        staggerDelay: 0.12,
        ease: 'power2.out',
      }"
    />

    <div class="timeline">
      <div
        v-for="item in experience"
        :key="item.company"
        class="timeline__item group"
      >
        <div class="timeline__container">
          <!-- Timeline dot and line -->
          <div class="timeline__dot-wrapper">
            <div class="timeline__dot">
              <div class="timeline__inner-dot"></div>
            </div>
            <div class="timeline__line"></div>
          </div>

          <!-- Content section -->
          <div class="timeline__content">
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
}

.timeline__inner-dot {
  @apply w-3 h-3 transition-all duration-500 rounded-full dark:bg-blue-400 
         group-hover:scale-110 group-hover:bg-primary-2 bg-primary-3;
}

.timeline__line {
  @apply w-[2px] h-24 my-2 bg-gradient-to-b from-blue-400/30 via-gray-700 to-transparent;
}

.timeline__content {
  @apply w-full max-w-lg px-5 py-4 transition-all duration-300 border-l-2 border-gray-700/50 
         rounded-r-md backdrop-blur-sm group-hover:border-primary-2 group-hover:translate-x-1 
         dark:group-hover:bg-gray-800/30 group-hover:bg-gray-800/10;
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
</style>
