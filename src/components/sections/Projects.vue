<template>
  <section class="py-10 mt-20 projects glassmorphism">
    <SharedHeader title="projects" />

    <ClientOnly>
      <div class="projects__slider-container">
        <swiper-container
          :space-between="24"
          :centered-slides="true"
          :breakpoints="breakpoints"
          :navigation="false"
          :pagination="{ clickable: true }"
          :initial-slide="0"
          :keyboard="{ enabled: true }"
          :grab-cursor="true"
          :autoplay="autoplayConfig"
          :effect="'slide'"
          :speed="700"
          class="projects__slider"
          aria-label="Project showcase slider"
          role="region"
        >
          <swiper-slide
            v-for="(project, index) in projects"
            :key="`slide-${index}`"
            class="projects__slide"
            :aria-label="`Project ${index + 1} of ${projects.length}: ${
              project.title
            }`"
          >
            <article class="projects__card">
              <img
                :src="project.image"
                :alt="`Screenshot of ${project.title} project`"
                class="projects__image"
                loading="lazy"
                width="800"
                height="500"
              />
              <div class="projects__overlay" />
              <div class="projects__content">
                <header class="projects__header">
                  <h3 class="projects__title">
                    {{ project.title }}
                  </h3>
                  <div
                    class="projects__tech-stack"
                    role="list"
                    aria-label="Technologies used"
                  >
                    <span
                      v-for="tech in project.technologies"
                      :key="tech"
                      class="text-white bg-green-500 projects__tech-tag"
                      role="listitem"
                      :aria-label="`Technology: ${tech}`"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </header>

                <p class="projects__description">
                  {{ project.description }}
                </p>

                <footer class="projects__actions">
                  <!-- Visit button -->
                  <a
                    :href="project.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="projects__link projects__link--secondary"
                    :aria-label="`Visit ${project.title} project (opens in new tab)`"
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

                  <!-- Source button -->
                  <button
                    v-if="project.github"
                    class="mx-3 projects__link projects__link--secondary"
                    :aria-label="`View ${project.title} source code on GitHub`"
                  >
                    <span class="projects__link-text">Source</span>
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
                  </button>
                </footer>
              </div>
            </article>
          </swiper-slide>
        </swiper-container>
      </div>

      <template #fallback>
        <div class="projects__slider-container">
          <div class="projects__skeleton">
            <div class="projects__skeleton-slide">
              <div class="projects__skeleton-card">
                <div class="projects__skeleton-image"></div>
                <div class="projects__skeleton-content">
                  <div class="projects__skeleton-title"></div>
                  <div class="projects__skeleton-tags">
                    <div class="projects__skeleton-tag"></div>
                    <div class="projects__skeleton-tag"></div>
                    <div class="projects__skeleton-tag"></div>
                  </div>
                  <div class="projects__skeleton-description">
                    <div class="projects__skeleton-line"></div>
                    <div class="projects__skeleton-line"></div>
                    <div
                      class="projects__skeleton-line projects__skeleton-line--short"
                    ></div>
                  </div>
                  <div class="projects__skeleton-button"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </section>
</template>

<script lang="ts" setup>
interface Project {
  image: string
  title: string
  description: string
  technologies: string[]
  website: string
  github?: string
  featured?: boolean
}

const autoplayConfig = {
  delay: 3000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  reverseDirection: false,
}

const projects: Project[] = [
  {
    image: 'https://picsum.photos/id/1015/800/500',
    title: 'E-Commerce Platform',
    description:
      'A modern e-commerce platform built with Vue 3 and Nuxt, featuring real-time inventory management and seamless payment integration.',
    technologies: ['Vue', 'Nuxt', 'Tailwind', 'Swiper'],
    website: 'https://example.com/ecommerce',
    github: 'https://github.com/user/ecommerce',
    featured: true,
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
  640: {
    slidesPerView: 1,
    spaceBetween: 24,
    centeredSlides: true,
  },
  1024: {
    slidesPerView: 1.8,
    spaceBetween: 32,
    centeredSlides: true,
  },
  1280: {
    slidesPerView: 2.5,
    spaceBetween: 32,
    centeredSlides: true,
  },
}
</script>

<style scoped>
.projects__slider-container {
  @apply mt-8 relative min-h-[500px];
}

.projects__slider {
  --swiper-pagination-color: #fff;
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 0.4;
  --swiper-pagination-bullet-size: 12px;
  --swiper-pagination-bullet-horizontal-gap: 6px;
  @apply overflow-visible w-full h-[500px];
}

.projects__slide {
  @apply transition-all duration-500 opacity-60 blur-[1px] grayscale-[20%] scale-[0.92] will-change-transform h-[500px] w-auto;
}

.projects__slide.swiper-slide-active {
  @apply opacity-100 blur-0 grayscale-0 scale-100 z-[2];
}

.projects__slide.swiper-slide-next,
.projects__slide.swiper-slide-prev {
  @apply opacity-80 blur-[0.5px] grayscale-[5%] scale-[0.96] z-[1];
}

.projects__card {
  @apply relative flex flex-col justify-end items-start w-full rounded-2xl overflow-hidden shadow-2xl bg-black/60 h-[500px] min-h-[500px];
}

.projects__image {
  @apply absolute inset-0 z-0 object-cover object-center w-full h-full will-change-transform transition-opacity duration-300 scale-100;
  transition: transform 0.4s ease-in-out, filter 0.8s ease-in-out;
}

.projects__card:hover .projects__image {
  @apply scale-105 brightness-90;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__slide.swiper-slide-active .projects__card:hover .projects__image {
  @apply scale-110 brightness-75;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__slide:hover .projects__card .projects__image {
  @apply scale-105 brightness-90;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__slide.swiper-slide-active:hover .projects__card .projects__image {
  @apply scale-110 brightness-75;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__overlay {
  @apply absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none;
}

.projects__content {
  @apply relative z-20 flex flex-col w-full gap-4 p-8 pointer-events-auto translate-y-24 opacity-0 transition-all duration-700 ease-out;
}

.projects__slide.swiper-slide-active .projects__content {
  @apply translate-y-0 opacity-100;
}

.projects__header {
  @apply mb-4;
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

.projects__description {
  @apply max-w-xl mb-4 text-sm leading-relaxed text-white/80 transition-opacity duration-500;
}

.projects__actions {
  @apply flex items-center gap-2 mt-auto;
}

.projects__link {
  @apply rounded-full px-8 py-2 font-bold border-[1.5px] border-primary-2/30 shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-2 backdrop-blur-md bg-opacity-90 select-none relative overflow-hidden tracking-[0.09em] z-[1] text-white;
}

.dark .projects__link {
  @apply text-white border-primary-2/50;
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
  @apply absolute inset-0 opacity-50 pointer-events-none transition-all duration-300 z-[2];
  content: '';
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 200%;
  background-position: 0% 50%;
}

.projects__link::after {
  @apply absolute top-0 w-[60%] h-full opacity-0 transition-all duration-300 z-[3] -left-[60%];
  content: '';
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
  @apply opacity-100 left-[110%];
}

.projects__link:hover,
.projects__link:focus {
  @apply scale-[1.065];
  box-shadow: 0 8px 40px 0 rgba(var(--primary-2), 0.32),
    0 2px 12px 0 rgba(var(--primary-3), 0.22),
    0 0 16px 2px rgba(var(--primary-2), 0.18);
}

.projects__link-icon {
  @apply w-5 h-5 inline-block align-middle transition-transform duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)];
  color: inherit;
  transition-timing-function: cubic-bezier(0.4, 2, 0.6, 1);
}

.projects__link:hover .projects__link-icon,
.projects__link:focus .projects__link-icon {
  @apply translate-x-1 scale-110;
}

.projects__link--secondary {
  @apply bg-transparent border-gray-500 text-gray-300 hover:border-gray-400 hover:text-white scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.1)];
  background: transparent !important;
}

.projects__link--secondary:hover {
  @apply shadow-[0_4px_16px_rgba(0,0,0,0.2)];
}

.projects__skeleton {
  @apply flex justify-center items-center w-full h-[500px];
}

.projects__skeleton-slide {
  @apply w-full max-w-md h-[500px];
}

.projects__skeleton-card {
  @apply relative w-full h-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse;
}

.projects__skeleton-image {
  @apply absolute inset-0 bg-gray-300 dark:bg-gray-600;
}

.projects__skeleton-content {
  @apply absolute bottom-0 left-0 right-0 p-8 space-y-4;
}

.projects__skeleton-title {
  @apply h-6 bg-gray-300 dark:bg-gray-600 rounded w-[60%];
}

.projects__skeleton-tags {
  @apply flex gap-2;
}

.projects__skeleton-tag {
  @apply h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-[60px];
}

.projects__skeleton-description {
  @apply space-y-2;
}

.projects__skeleton-line {
  @apply h-4 bg-gray-300 dark:bg-gray-600 rounded;
}

.projects__skeleton-line--short {
  @apply w-[70%];
}

.projects__skeleton-button {
  @apply h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-[120px];
}

.projects__image[data-loading='true'] {
  @apply opacity-50;
}

.projects__link:focus,
.projects__tech-tag:focus {
  @apply outline-none ring-2 ring-primary-2 ring-offset-2 ring-offset-gray-900;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .projects__content {
    @apply p-6 gap-3;
  }

  .projects__title {
    @apply text-sm;
  }

  .projects__description {
    @apply text-sm leading-relaxed;
  }

  .projects__tech-tag {
    @apply px-2 py-1 text-sm;
  }

  .projects__link {
    @apply px-6 py-2 text-sm;
  }
}
</style>
