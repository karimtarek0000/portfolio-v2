<script lang="ts" setup>
const experience = shallowRef([
  {
    company: 'HectarApp',
    position: 'Software Engineer',
    startDate: '2022-01-01',
    endDate: 'Present',
    description: 'Developing and maintaining web applications.',
  },
])

// Add function to format dates nicely
const formatDate = date => {
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
    <SharedHeader title="experience" />

    <div class="mt-8 space-y-8">
      <div v-for="item in experience" :key="item.company" class="group">
        <div class="flex justify-center gap-x-4">
          <!-- Timeline dot and line -->
          <!-- <div class="flex flex-col items-center">
            <div
              class="flex items-center justify-center w-8 h-8 transition-all duration-500 rounded-full bg-gray-800/80 ring-2 ring-blue-400/20 group-hover:ring-blue-400/50 group-hover:shadow-lg group-hover:shadow-blue-500/10"
            >
              <div
                class="w-3 h-3 transition-all duration-500 bg-blue-400 rounded-full group-hover:scale-110 group-hover:bg-primary-2"
              ></div>
            </div>
            <div
              class="w-[2px] h-24 my-2 bg-gradient-to-b from-blue-400/30 via-gray-700 to-transparent"
            ></div>
          </div> -->

          <!-- Content section -->
          <div
            class="w-full max-w-md px-5 py-4 transition-all duration-300 border-l-2 border-gray-700/50 rounded-r-md backdrop-blur-sm group-hover:border-primary-2 group-hover:translate-x-1 group-hover:bg-gray-800/30 sm:w-[25rem]"
          >
            <!-- Header with company and date -->
            <div
              class="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-gray-700/50"
            >
              <h3
                class="text-sm font-bold dark:text-blue-400 group-hover:text-blue-300"
              >
                {{ item.company }}
              </h3>
              <span
                class="px-2 py-1 tracking-wider text-gray-300 rounded-full bg-gray-800/70"
              >
                {{ formatDate(item.startDate) }} -
                {{ formatDate(item.endDate) }}
              </span>
            </div>

            <!-- Job details -->
            <div class="mt-3 space-y-2">
              <p class="flex items-center text-sm font-medium text-primary-2">
                <span
                  class="inline-block w-1.5 h-1.5 bg-primary-2 rounded-full -ms-0.5 me-2"
                ></span>
                {{ item.position }}
              </p>
              <p
                class="pl-3 text-sm leading-relaxed border-l border-gray-700 text-primary-3"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* No custom CSS needed - using only Tailwind classes */
</style>
