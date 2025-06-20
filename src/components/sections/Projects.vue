<template>
  <section class="py-10 mt-20 projects glassmorphism">
    <SharedHeader
      title="projects"
      :animation-options="{
        triggerStart: 'top 85%',
        duration: 1.2,
        staggerDelay: 0.25,
        ease: 'elastic.out(1, 0.3)',
      }"
    />

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
                      class="projects__tech-tag"
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
                  <SharedButton
                    as="a"
                    variant="outline"
                    size="md"
                    :href="project.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`Visit ${project.title} project (opens in new tab)`"
                  >
                    <span>Visit</span>
                    <svg
                      class="w-5 h-5 inline-block align-middle transition-transform duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] group-hover:translate-x-1 group-hover:scale-110"
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
                  </SharedButton>

                  <!-- Source button -->
                  <SharedButton
                    v-if="project.github"
                    as="a"
                    :href="project.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="md"
                    class="mx-3"
                    :aria-label="`View ${project.title} source code on GitHub (opens in new tab)`"
                  >
                    <span>Source</span>
                    <svg
                      class="w-5 h-5 inline-block align-middle transition-transform duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] group-hover:translate-x-1 group-hover:scale-110"
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
                  </SharedButton>
                </footer>
              </div>
            </article>
          </swiper-slide>
        </swiper-container>
      </div>
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
  delay: 10000000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  reverseDirection: false,
}

const projects: Project[] = [
  {
    image: 'https://picsum.photos/id/1015/800/500',
    title: 'test 1',
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
  @apply mt-8 relative min-h-[580px];
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
  @apply relative z-20 justify-center h-full flex flex-col w-full p-6 pointer-events-auto translate-y-24 opacity-0 transition-all duration-700 ease-out sm:p-8;
}

.projects__slide.swiper-slide-active .projects__content {
  @apply translate-y-0 opacity-100;
}

.projects__header {
  @apply mb-4;
}

.projects__title {
  @apply mb-2 font-extrabold leading-tight text-white drop-shadow-lg text-sm transition-all duration-500 sm:text-lg;
}

.projects__tech-stack {
  @apply flex flex-wrap gap-2 mb-2;
}

.projects__tech-tag {
  @apply px-2 py-1  font-semibold transition transform rounded-full text-white bg-green-500  cursor-pointer select-none sm:px-5 py-2 px-5 sm:py-2;
}

.projects__description {
  @apply max-w-xl mb-4 text-sm leading-relaxed text-white/80 transition-opacity duration-500;
}

.projects__actions {
  @apply flex items-center mt-5 gap-2;
}
</style>
