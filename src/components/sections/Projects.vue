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
      class="mt-8 project-slider"
      aria-label="Project showcase slider"
      @slidechange="onSlideChange"
    >
      <swiper-slide
        v-for="(project, n) in projects"
        :key="n"
        class="project-slider__slide"
      >
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
                class="project-slider__visit-btn dark:text-primary-2 dark:border-primary-2"
                aria-label="Visit project website for {{ project.title }}"
                tabindex="0"
              >
                <span class="font-bold tracking-wider uppercase">Visit</span>
                <svg
                  class="w-5 h-5 project-slider__arrow-icon"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 12h14m-7-7l7 7-7 7"
                  />
                </svg>
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
  @apply overflow-visible;
}

.project-slider__slide {
  @apply transition-all duration-500 opacity-50 blur-[2px] grayscale-[30%] scale-[0.9];
}

.project-slider__slide.swiper-slide-active {
  @apply opacity-100 blur-0 grayscale-0 scale-100 z-[2];
}

.project-slider__slide.swiper-slide-next,
.project-slider__slide.swiper-slide-prev {
  @apply opacity-70 blur-[1px] grayscale-[10%] scale-[0.95] z-[1];
}

.project-slider__visit-btn {
  @apply rounded-full px-8 py-2 font-bold border shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-2 backdrop-blur-md bg-opacity-80 select-none relative overflow-hidden tracking-[0.09em] z-[1];
  color: rgb(var(--primary-1));
  border: 1.5px solid rgba(var(--primary-2), 0.18);
  background: linear-gradient(
    120deg,
    rgba(var(--primary-2), 0.98) 0%,
    rgba(var(--primary-3), 0.92) 40%,
    rgba(var(--primary-2), 0.98) 100%
  );
  box-shadow: 0 4px 32px 0 rgba(var(--primary-2), 0.18),
    0 1.5px 8px 0 rgba(var(--primary-3), 0.1);
}

.dark .project-slider__visit-btn {
  color: rgb(var(--primary-2));
  border: 1.5px solid rgba(var(--primary-2), 0.45);
  background: linear-gradient(
    120deg,
    rgba(var(--primary-2), 0.98) 0%,
    rgba(var(--primary-3), 0.85) 40%,
    rgba(var(--primary-2), 0.98) 100%
  );
  box-shadow: 0 4px 32px 0 rgba(var(--primary-2), 0.28),
    0 1.5px 8px 0 rgba(var(--primary-3), 0.18);
}

.project-slider__visit-btn::before {
  content: '';
  @apply absolute inset-0 opacity-40 pointer-events-none transition-all duration-300 z-[2];
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 200%;
  background-position: 0% 50%;
}

.project-slider__visit-btn::after {
  content: '';
  @apply absolute top-0 w-[60%] h-full opacity-0 transition-all duration-300 z-[3];
  left: -60%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  filter: blur(2px);
}

.project-slider__visit-btn:hover::before,
.project-slider__visit-btn:focus::before {
  @apply opacity-70;
  background-position: 100% 50%;
}

.project-slider__visit-btn:hover::after,
.project-slider__visit-btn:focus::after {
  @apply opacity-100;
  left: 110%;
}

.project-slider__visit-btn:hover,
.project-slider__visit-btn:focus {
  @apply scale-[1.065];
  box-shadow: 0 8px 40px 0 rgba(var(--primary-2), 0.32),
    0 2px 12px 0 rgba(var(--primary-3), 0.22),
    0 0 16px 2px rgba(var(--primary-2), 0.18);
}

.project-slider__arrow-icon {
  @apply inline-block align-middle transition-transform duration-300;
  color: inherit;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition-timing-function: cubic-bezier(0.4, 2, 0.6, 1);
}

.project-slider__visit-btn:hover .project-slider__arrow-icon,
.project-slider__visit-btn:focus .project-slider__arrow-icon {
  @apply translate-x-1 scale-110;
}

/* Ensure overlays do not block interaction */
.relative.z-20 {
  @apply pointer-events-auto;
}

.absolute.z-10 {
  @apply pointer-events-none;
}
</style>
