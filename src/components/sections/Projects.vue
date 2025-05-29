<template>
  <section class="py-10 mt-20 glassmorphism">
    <SharedHeader title="projects" />
    <swiper-container
      ref="swiperRef"
      :slides-per-view="1"
      :space-between="32"
      :centered-slides="true"
      :loop="true"
      :breakpoints="breakpoints"
      :navigation="true"
      :pagination="{ clickable: true }"
      effect="coverflow"
      class="mt-8 project-slider"
      aria-label="Project showcase slider"
      @slidechange="onSlideChange"
    >
      <swiper-slide v-for="(project, n) in projects" :key="n">
        <article
          class="relative flex flex-col justify-end items-start h-[420px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-black/60 group"
        >
          <img
            :src="project.image"
            :alt="project.title"
            class="absolute inset-0 z-0 object-cover object-center w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
          />
          <div
            class="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          />
          <div class="relative z-20 flex flex-col w-full gap-4 p-8">
            <h3
              :class="[
                'mb-2 font-extrabold leading-tight text-white drop-shadow-lg text-lg transition-all duration-500',
                activeIndex === n
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4',
              ]"
              :aria-label="project.title"
            >
              {{ project.title }}
            </h3>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-3 py-1 text-sm font-semibold transition transform rounded-full cursor-pointer select-none"
                :class="techColorMap[tech] || 'bg-gray-400 text-white'"
                tabindex="0"
                :aria-label="tech + ' technology'"
              >
                {{ tech }}
              </span>
            </div>
            <p
              :class="[
                'max-w-xl mb-4 text-sm leading-relaxed text-white/80 transition-opacity duration-500',
                activeIndex === n ? 'opacity-100' : 'opacity-0',
              ]"
            >
              {{
                isDescriptionTruncated(project, n)
                  ? truncatedDescription(project)
                  : project.description
              }}
              <button
                v-if="
                  isDescriptionTruncated(project, n) && !expandedDescriptions[n]
                "
                @click="() => expandDescription(n)"
                class="ml-2 text-sm underline rounded text-primary-2 hover:text-primary-3 focus:outline-none focus:ring-2 focus:ring-primary-2"
                aria-label="Read more about project description"
              >
                Read more
              </button>
            </p>
            <div class="flex items-center gap-2 mt-auto">
              <a
                :href="project.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm primary-btn"
                aria-label="View website for {{ project.title }}"
                tabindex="0"
              >
                View Website
              </a>
            </div>
          </div>
        </article>
      </swiper-slide>
    </swiper-container>
  </section>
</template>

<script lang="ts" setup>
const techColorMap: Record<string, string> = {
  JavaScript: 'bg-yellow-300 text-black',
  TypeScript: 'bg-blue-500 text-white',
  Vue: 'bg-green-500 text-white',
  Nuxt: 'bg-emerald-700 text-white',
  Tailwind: 'bg-cyan-400 text-black',
  Swiper: 'bg-purple-400 text-white',
  HTML: 'bg-orange-400 text-white',
  CSS: 'bg-blue-300 text-black',
  'Node.js': 'bg-green-700 text-white',
  Express: 'bg-gray-700 text-white',
  MongoDB: 'bg-green-600 text-white',
  Jest: 'bg-pink-400 text-white',
  Vitest: 'bg-lime-400 text-black',
  Lottie: 'bg-indigo-400 text-white',
}

const projects = [
  {
    image: 'https://picsum.photos/id/1015/800/500',
    title: 'test 1',
    description:
      "It's only a legend until you discover it. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.",
    technologies: ['Vue', 'Nuxt', 'Tailwind', 'Swiper'],
    website: 'https://example.com/fountain',
  },
  {
    image: 'https://picsum.photos/id/1016/800/500',
    title: 'test 2',
    description:
      'Believe in yourself and your team. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.',
    technologies: ['JavaScript', 'Vue', 'Tailwind'],
    website: 'https://example.com/ted',
  },
  {
    image: 'https://picsum.photos/id/1018/800/500',
    title: 'test 3',
    description:
      'Exciting new releases this June. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.',
    technologies: ['TypeScript', 'Nuxt', 'Tailwind'],
    website: 'https://example.com/new',
  },
  {
    image: 'https://picsum.photos/id/1020/800/500',
    title: 'test 4',
    description:
      'Uncover the secrets hidden within. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.',
    technologies: ['Vue', 'Swiper', 'Lottie'],
    website: 'https://example.com/mystery',
  },
  {
    image: 'https://picsum.photos/id/1024/800/500',
    title: 'test 5',
    description:
      'A journey beyond imagination. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.',
    technologies: ['Nuxt', 'Tailwind', 'Vitest'],
    website: 'https://example.com/escape',
  },
]

const breakpoints = {
  640: { slidesPerView: 1 },
  1024: { slidesPerView: 1.5 },
  1280: { slidesPerView: 2.2 },
}

const DESCRIPTION_LIMIT = 120
const expandedDescriptions = ref<Record<number, boolean>>({})
const activeIndex = ref(0)
const swiperRef = ref<any>(null)

function isDescriptionTruncated(project: any, idx: number) {
  return (
    project.description.length > DESCRIPTION_LIMIT &&
    !expandedDescriptions.value[idx]
  )
}
function truncatedDescription(project: any) {
  return project.description.slice(0, DESCRIPTION_LIMIT) + '...'
}
function expandDescription(idx: number) {
  expandedDescriptions.value[idx] = true
}
function onSlideChange(e: any) {
  // Swiper web component emits event with detail.swiper.activeIndex
  const swiper = e?.detail?.swiper
  if (swiper) {
    // Because of loop mode, use realIndex
    activeIndex.value = swiper.realIndex
  }
}
</script>

<style scoped>
.project-slider {
  --swiper-navigation-color: rgb(var(--primary-2));
  --swiper-pagination-color: rgb(var(--primary-2));
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 0.4;
  --swiper-pagination-bullet-size: 12px;
  --swiper-pagination-bullet-horizontal-gap: 6px;
}

/* Fade/scale effect for side slides */
swiper-slide {
  transition: transform 0.5s, opacity 0.5s, filter 0.5s;
  opacity: 0.5;
  filter: blur(2px) grayscale(30%);
  transform: scale(0.92);
}
swiper-slide.swiper-slide-active {
  opacity: 1;
  filter: none;
  transform: scale(1);
  z-index: 2;
}
swiper-slide.swiper-slide-next,
swiper-slide.swiper-slide-prev {
  opacity: 0.7;
  filter: blur(1px) grayscale(10%);
  transform: scale(0.97);
  z-index: 1;
}

/* Ensure overlays do not block interaction */
.relative.z-20 {
  pointer-events: auto;
}
.absolute.z-10 {
  pointer-events: none;
}

.primary-btn {
  @apply bg-primary-2 text-primary-1 rounded-full px-5 py-2 font-bold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-2 hover:bg-primary-3 active:scale-95;
}
</style>
