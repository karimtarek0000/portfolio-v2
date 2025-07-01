<template>
  <header ref="heroContainerRef" class="overflow-hidden layout-container h-dvh">
    <!-- ------------------ -->
    <!-- ------NAVBAR------ -->
    <!-- ------------------ -->
    <ClientOnly>
      <LayoutNavbar />
    </ClientOnly>

    <div class="hero">
      <!-- ANIMATIONS -->
      <div
        ref="lottieContainerRef"
        class="h-[200px] w-[200px] md:h-[400px] md:w-[400px] mt-32 *:shrink-0 flex flex-col justify-center items-center"
      >
        <client-only>
          <Vue3Lottie
            class="translate-y-[10px] md:translate-y-[130px]"
            size="200"
            animationLink="https://lottie.host/707ad562-0d36-49dc-bc46-b46fa8ce1896/fGbyNuf4y4.json"
          />
        </client-only>
        <client-only>
          <Vue3Lottie
            class="-translate-y-[50px] md:-translate-y-[70px]"
            animationLink="https://lottie.host/eca2fac4-6448-4276-8f61-783f40d33d66/n7MP5EFvxv.json"
            :loop="false"
            :speed="2"
          />
        </client-only>
      </div>

      <!-- TITLE -->
      <h1 ref="titleRef" class="hero__title">
        <span class="text-[3rem] md:text-lg graident">
          <span class="text-[#FFC948]">i'm,</span> karim tarek
        </span>
        <span class="graident text-md text-nowrap"
          >frontend software engineer</span
        >
      </h1>

      <!-- SOCIAL ICONS -->
      <div ref="socialIconsRef" class="flex justify-center mt-5 gap-x-5">
        <ClientOnly>
          <SharedSocialLinks type="header" />
        </ClientOnly>
      </div>

      <!-- DOWNLOAD CV -->
      <ClientOnly>
        <SharedButton
          ref="downloadButtonRef"
          as="button"
          @click="handleDownload"
          class="hero__download-button"
        >
          Download CV
          <SharedRenderSVG
            iconName="downloadcv"
            sizes="h-[2rem] w-[2rem]"
            :fill="isDark ? 'black' : 'white'"
          />
        </SharedButton>
      </ClientOnly>
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

// Handle CV download
function handleDownload() {
  const link = document.createElement('a')
  link.href =
    'https://drive.google.com/uc?export=download&id=1x6uYDQssXpTFXOgMInQfElMgTmQMhlS-'
  link.download = 'Karim_Tarek_CV.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
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
  @apply opacity-0;
}

.hero__social-icons a {
  @apply opacity-0;
}

/* Hide download button initially to prevent flash before animation */
.hero__download-button {
  @apply opacity-0 translate-y-[60px] flex items-center mt-10 gap-x-2;
}
</style>
