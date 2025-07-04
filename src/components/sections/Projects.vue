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
              <NuxtImg
                provider="cloudinary"
                :src="project.image"
                sizes="sm:100vw lg:50vw xl:80vw"
                :alt="`Screenshot of ${project.title} project`"
                class="projects__image"
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
const data: Ref<Data> = useState('data')
const projects = shallowRef(data.value.projects)

const autoplayConfig = {
  delay: 10000000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
  reverseDirection: false,
}

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
  @apply mt-8 relative lg:min-h-[580px] px-5 lg:px-0;
}

.projects__slider {
  --swiper-pagination-color: #fff;
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 0.4;
  --swiper-pagination-bullet-size: 12px;
  --swiper-pagination-bullet-horizontal-gap: 6px;
  @apply overflow-visible w-full;
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
  @apply absolute inset-0 z-0 object-cover lg:object-fill max-w-full object-center w-full h-full will-change-transform transition-opacity duration-300 scale-100;
  transition: transform 0.4s ease-in-out, filter 0.8s ease-in-out;
}

.projects__card:hover .projects__image {
  @apply scale-105 brightness-90;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__slide.swiper-slide-active .projects__card:hover .projects__image {
  @apply scale-110 brightness-90;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__slide:hover .projects__card .projects__image {
  @apply scale-105 brightness-90;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__slide.swiper-slide-active:hover .projects__card .projects__image {
  @apply scale-110 brightness-90;
  transition: transform 0.8s ease-in-out, filter 0.8s ease-in-out;
}

.projects__overlay {
  @apply fixed -inset-1 z-10 pointer-events-none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: auto;
}

.projects__content {
  @apply relative z-20 justify-evenly lg:justify-center items-center lg:items-start h-full flex flex-col w-full p-6 pointer-events-auto translate-y-24 opacity-0 transition-all duration-700 ease-out sm:p-8;
}

.projects__slide.swiper-slide-active .projects__content {
  @apply translate-y-0 opacity-100;
}

.projects__header {
  @apply mb-4;
}

.projects__title {
  @apply mb-10 lg:mb-4 text-center font-extrabold leading-tight text-white drop-shadow-lg text-md lg:text-start transition-all duration-500 sm:text-lg;
}

.projects__tech-stack {
  @apply flex flex-wrap gap-2 mb-2;
}

.projects__tech-tag {
  @apply px-2 py-1  font-semibold transition transform rounded-full text-white bg-green-500  cursor-pointer select-none sm:px-5 py-2 px-5 sm:py-2;
}

.projects__description {
  @apply max-w-xl text-center lg:text-start mb-4 text-sm leading-relaxed text-white/80 transition-opacity duration-500;
}

.projects__actions {
  @apply flex items-center mt-5 gap-2;
}
</style>
