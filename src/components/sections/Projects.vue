<template>
  <section class="py-10 mt-20 projects glassmorphism">
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
      :preload-images="false"
      :lazy="true"
      class="projects__slider"
      aria-label="Project showcase slider"
    >
      <swiper-slide
        v-for="(project, n) in projects"
        :key="n"
        class="projects__slide"
      >
        <article class="projects__card">
          <img
            :src="project.image"
            :alt="project.title"
            class="projects__image"
            loading="lazy"
            :width="800"
            :height="500"
          />
          <div class="projects__overlay" />
          <div class="projects__content">
            <h3 class="projects__title">
              {{ project.title }}
            </h3>
            <div class="projects__tech-stack">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="projects__tech-tag"
                :class="techColorMap[tech] || 'projects__tech-tag--default'"
              >
                {{ tech }}
              </span>
            </div>
            <p class="projects__description">
              {{ project.description }}
            </p>
            <div class="projects__actions">
              <a
                :href="project.website"
                target="_blank"
                rel="noopener noreferrer"
                class="projects__link"
              >
                <span class="projects__link-text">Visit</span>
                <svg
                  class="projects__link-icon"
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
</script>

<style scoped>
.projects__slider {
  --swiper-navigation-color: rgb(var(--primary-2));
  --swiper-pagination-color: rgb(var(--primary-2));
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 0.4;
  --swiper-pagination-bullet-size: 12px;
  --swiper-pagination-bullet-horizontal-gap: 6px;
  @apply mt-8 overflow-visible;
}

.projects__slide {
  @apply transition-all duration-500 opacity-50 blur-[2px] grayscale-[30%] scale-[0.9] will-change-transform;
}

.projects__slide.swiper-slide-active {
  @apply opacity-100 blur-0 grayscale-0 scale-100 z-[2];
}

.projects__slide.swiper-slide-next,
.projects__slide.swiper-slide-prev {
  @apply opacity-70 blur-[1px] grayscale-[10%] scale-[0.95] z-[1];
}

.projects__card {
  @apply relative flex flex-col justify-end items-start h-[420px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-black/60;
}

.projects__image {
  @apply absolute inset-0 z-0 object-cover object-center w-full h-full transition-all duration-500 will-change-transform;
}

.projects__card:hover .projects__image {
  @apply scale-105 brightness-90;
}

.projects__overlay {
  @apply absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none;
}

.projects__content {
  @apply relative z-20 flex flex-col w-full gap-4 p-8 pointer-events-auto translate-y-10 opacity-0 transition-all duration-700 ease-out;
}

.projects__slide.swiper-slide-active .projects__content {
  @apply translate-y-0 opacity-100;
}

.projects__title {
  @apply mb-2 font-extrabold leading-tight text-white drop-shadow-lg text-lg transition-all duration-500;
}

.projects__tech-stack {
  @apply flex flex-wrap gap-2 mb-2;
}

.projects__tech-tag {
  @apply px-3 py-1 text-sm font-semibold transition transform rounded-full cursor-pointer select-none;
}

.projects__tech-tag--default {
  @apply bg-gray-400 text-white;
}

.projects__description {
  @apply max-w-xl mb-4 text-sm leading-relaxed text-white/80 transition-opacity duration-500;
}

.projects__actions {
  @apply flex items-center gap-2 mt-auto;
}

.projects__link {
  @apply rounded-full px-8 py-2 font-bold border shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-2 backdrop-blur-md bg-opacity-90 select-none relative overflow-hidden tracking-[0.09em] z-[1] text-white will-change-transform;
  border: 1.5px solid rgba(var(--primary-2), 0.3);
  background: linear-gradient(
    120deg,
    rgba(var(--primary-2), 1) 0%,
    rgba(var(--primary-3), 0.95) 40%,
    rgba(var(--primary-2), 1) 100%
  );
  box-shadow: 0 4px 32px 0 rgba(var(--primary-2), 0.25),
    0 1.5px 8px 0 rgba(var(--primary-3), 0.15);
}

.dark .projects__link {
  @apply text-white;
  border: 1.5px solid rgba(var(--primary-2), 0.5);
  background: linear-gradient(
    120deg,
    rgba(var(--primary-2), 1) 0%,
    rgba(var(--primary-3), 0.9) 40%,
    rgba(var(--primary-2), 1) 100%
  );
  box-shadow: 0 4px 32px 0 rgba(var(--primary-2), 0.35),
    0 1.5px 8px 0 rgba(var(--primary-3), 0.25);
}

.projects__link::before {
  content: '';
  @apply absolute inset-0 opacity-50 pointer-events-none transition-all duration-300 z-[2];
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 200%;
  background-position: 0% 50%;
}

.projects__link::after {
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

.projects__link:hover::before,
.projects__link:focus::before {
  @apply opacity-70;
  background-position: 100% 50%;
}

.projects__link:hover::after,
.projects__link:focus::after {
  @apply opacity-100;
  left: 110%;
}

.projects__link:hover,
.projects__link:focus {
  @apply scale-[1.065];
  box-shadow: 0 8px 40px 0 rgba(var(--primary-2), 0.32),
    0 2px 12px 0 rgba(var(--primary-3), 0.22),
    0 0 16px 2px rgba(var(--primary-2), 0.18);
}

.projects__link-text {
  @apply font-bold tracking-wider uppercase;
}

.projects__link-icon {
  @apply w-5 h-5 inline-block align-middle transition-transform duration-300;
  color: inherit;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition-timing-function: cubic-bezier(0.4, 2, 0.6, 1);
}

.projects__link:hover .projects__link-icon,
.projects__link:focus .projects__link-icon {
  @apply translate-x-1 scale-110;
}
</style>
