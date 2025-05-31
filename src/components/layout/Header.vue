<template>
  <header
    ref="heroContainerRef"
    class="overflow-hidden layout-container lg:h-dvh"
  >
    <!-- ------------------ -->
    <!-- ------NAVBAR------ -->
    <!-- ------------------ -->
    <LayoutNavbar />

    <div class="hero">
      <!-- ANIMATIONS -->
      <div
        ref="lottieContainerRef"
        class="h-[400px] w-[400px] mt-32 *:shrink-0 flex flex-col justify-center items-center"
      >
        <client-only>
          <Vue3Lottie
            style="transform: translate3d(0px, 130px, 0px)"
            animationLink="https://lottie.host/707ad562-0d36-49dc-bc46-b46fa8ce1896/fGbyNuf4y4.json"
          />
        </client-only>
        <client-only>
          <Vue3Lottie
            style="transform: translate3d(0px, -70px, 0px)"
            animationLink="https://lottie.host/eca2fac4-6448-4276-8f61-783f40d33d66/n7MP5EFvxv.json"
            :loop="false"
            :speed="2"
          />
        </client-only>
      </div>

      <!-- TITLE -->
      <h1 ref="titleRef" class="hero__title">
        <span class="graident">
          <span class="text-[#FFC948]">i'm,</span> karim tarek
        </span>
        <span class="graident text-md text-nowrap"
          >frontend software engineer</span
        >
      </h1>

      <!-- SOCIAL ICONS -->
      <div
        ref="socialIconsRef"
        class="flex justify-center mt-5 hero__social-icons gap-x-5"
      >
        <a
          v-for="{ title, iconName, link } in socialIcons"
          :key="title"
          class="transition-transform duration-300 hover:-translate-y-1"
          :href="link"
          :alt="title"
          target="_blank"
        >
          <SharedRenderSVG
            :iconName="iconName"
            sizes="w-[2.4rem] h-[2.4rem]"
            :fill="isDark ? 'white' : 'black'"
          />
        </a>
      </div>

      <!-- DOWNLOAD CV -->
      <SharedButton
        ref="downloadButtonRef"
        as="a"
        href="https://drive.google.com/uc?export=download&id=1x6uYDQssXpTFXOgMInQfElMgTmQMhlS-"
        download
        class="flex items-center mt-10 hero__download-button gap-x-2"
      >
        Download CV
        <SharedRenderSVG
          iconName="downloadcv"
          sizes="h-[2rem] w-[2rem]"
          :fill="isDark ? 'black' : 'white'"
        />
      </SharedButton>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from 'vue3-lottie'

const { isDark } = useToggleTheme()

// Template refs for animations
const heroContainerRef = ref<HTMLElement | null>(null)
const lottieContainerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const socialIconsRef = ref<HTMLElement | null>(null)
const downloadButtonRef = ref<HTMLElement | null>(null)

// Initialize hero animations
useHeroAnimations(
  {
    heroContainerRef,
    lottieContainerRef,
    titleRef,
    socialIconsRef,
    downloadButtonRef,
  },
  {
    enableAutoPlay: true,
    staggerDelay: 0.15,
    duration: 1.4,
    ease: 'power3.out',
  },
)

const socialIcons = [
  {
    title: 'github',
    iconName: 'github',
    link: '',
  },
  {
    title: 'linkedin',
    iconName: 'linkedin',
    link: '',
  },
  {
    title: 'whatsapp',
    iconName: 'whatsapp',
    link: 'https://wa.me/12345678900',
  },
]
</script>

<style scoped>
.hero {
  @apply flex flex-col items-center justify-center relative;
}

.hero__title {
  @apply flex flex-col text-center justify-center text-lg font-bold capitalize select-none;
}

/* Initial hidden states for animation elements */
.hero__title span {
  opacity: 0;
}

.hero__social-icons a {
  opacity: 0;
}

/* Hide download button initially to prevent flash before animation */
.hero__download-button {
  opacity: 0;
  transform: translateY(60px); /* Match GSAP initial position */
}

/* Show elements after animations complete */
.hero.animations-complete .hero__title span,
.hero.animations-complete .hero__social-icons a,
.hero.animations-complete .hero__download-button {
  opacity: 1;
}

/* Smooth transitions for hover effects after animations complete */
.hero.animations-complete .hero__social-icons a {
  transition: transform 0.3s ease;
}

.hero.animations-complete .hero__download-button {
  transition: transform 0.3s ease;
}

/* Disable default hover animations during entrance */
.hero .hero__social-icons a:hover {
  transform: none !important;
}

.hero.animations-complete .hero__social-icons a:hover {
  transform: translateY(-4px) !important;
}
</style>
