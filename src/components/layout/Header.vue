<template>
  <header class="overflow-hidden layout-container lg:h-dvh">
    <!-- ------------------ -->
    <!-- ------NAVBAR------ -->
    <!-- ------------------ -->
    <LayoutNavbar />

    <div class="hero">
      <!-- ANIMATIONS -->
      <div
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
          />
        </client-only>
      </div>

      <!-- TITLE -->
      <h1 class="hero__title">
        <span class="graident">
          <span class="text-[#FFC948]">i'm,</span> karim tarek
        </span>
        <span class="graident text-md text-nowrap"
          >frontend software engineer</span
        >
      </h1>

      <!-- SOCIAL ICONS -->
      <div class="flex justify-center mt-5 gap-x-5">
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
        as="a"
        href="https://drive.google.com/uc?export=download&id=1x6uYDQssXpTFXOgMInQfElMgTmQMhlS-"
        download
        class="flex items-center mt-10 gap-x-2"
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
import { Vue3Lottie } from "vue3-lottie";
const { isDark } = useToggleTheme();

const socialIcons = [
  {
    title: "github",
    iconName: "github",
    link: "",
  },
  {
    title: "linkedin",
    iconName: "linkedin",
    link: "",
  },
  {
    title: "whatsapp",
    iconName: "whatsapp",
    link: "https://wa.me/12345678900",
  },
];
</script>

<style scoped>
.hero {
  @apply flex flex-col items-center justify-center relative;
}
.hero__title {
  @apply flex flex-col text-center justify-center text-lg font-bold capitalize select-none;
}
</style>
