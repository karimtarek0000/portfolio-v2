<template>
  <header ref="heroContainerRef" class="overflow-hidden layout-container h-dvh">
    <!-- ------------------ -->
    <!-- ------NAVBAR------ -->
    <!-- ------------------ -->
    <ClientOnly>
      <LayoutNavbar />
    </ClientOnly>

    <div class="mt-5 hero">
      <!-- ANIMATIONS -->
      <div
        ref="lottieContainerRef"
        class="h-[200px] w-[200px] md:h-[400px] md:w-[400px] mt-32 *:shrink-0 flex flex-col justify-center items-center"
      >
        <ClientOnly>
          <Vue3Lottie
            class="translate-y-[10px] md:translate-y-[130px]"
            size="200"
            animationLink="https://lottie.host/707ad562-0d36-49dc-bc46-b46fa8ce1896/fGbyNuf4y4.json"
          />
          <Vue3Lottie
            class="-translate-y-[50px] md:-translate-y-[70px]"
            animationLink="https://lottie.host/eca2fac4-6448-4276-8f61-783f40d33d66/n7MP5EFvxv.json"
            :loop="false"
            :speed="2"
          />
        </ClientOnly>
      </div>

      <!-- TITLE -->
      <h1 ref="titleRef" class="hero__title">
        <span class="text-[3rem] md:text-lg graident">
          <span class="text-[#FFC948]">i'm,</span> {{ data?.info.name }}
        </span>
        <span class="graident text-md text-nowrap">{{ data?.info.title }}</span>
      </h1>

      <!-- SOCIAL ICONS -->
      <div ref="socialIconsRef" class="flex justify-center mt-5 gap-x-5">
        <ClientOnly>
          <SharedSocialLinks type="header" />
        </ClientOnly>
      </div>

      <!-- BUTTONS CONTAINER -->
      <div class="flex items-center gap-4 mt-10">
        <!-- VIEW CV -->
        <SharedButton
          as="a"
          class="hero__button"
          ref="viewButtonRef"
          :href="data?.info.links.previewCV"
          target="_blank"
          rel="noopener noreferrer"
        >
          View CV
          <ClientOnly>
            <SharedRenderSVG
              iconName="viewcv"
              sizes="h-[2rem] w-[2rem]"
              :fill="isDark ? 'black' : 'white'"
            />
          </ClientOnly>
        </SharedButton>

        <!-- DOWNLOAD CV -->
        <SharedButton
          as="button"
          class="hero__button"
          ref="downloadButtonRef"
          @click="handleDownload"
        >
          Download CV
          <ClientOnly>
            <SharedRenderSVG
              iconName="downloadcv"
              sizes="h-[2rem] w-[2rem]"
              :fill="isDark ? 'black' : 'white'"
            />
          </ClientOnly>
        </SharedButton>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
const Vue3Lottie = defineAsyncComponent(() =>
  import('vue3-lottie').then(mod => mod.Vue3Lottie),
)

const { isDark } = useToggleTheme()
const data: Ref<Data> = useState('data')

// Template refs for animations
const heroContainerRef = ref<HTMLElement | null>(null)
const lottieContainerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const socialIconsRef = ref<HTMLElement | null>(null)
const downloadButtonRef = ref<HTMLElement | null>(null)
const viewButtonRef = ref<HTMLElement | null>(null)

// Initialize hero animations
useHeroAnimations(
  {
    heroContainerRef,
    lottieContainerRef,
    titleRef,
    socialIconsRef,
    downloadButtonRef,
    viewButtonRef,
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
  link.href = data.value.info.links.downloadCV
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
  @apply opacity-[0.01];
}

.hero__social-icons a {
  @apply opacity-[0.01];
}

/* Hide download button initially to prevent flash before animation */
.hero__button {
  @apply opacity-[0.01] translate-y-0;
}
</style>
