<template>
  <header class="overflow-hidden layout-container h-dvh">
    <LayoutNavbar />

    <div class="hero">
      <!-- ANIMATIONS -->
      <div class="h-[550px] w-[400px]">
        <client-only class="h-[400px] w-[400px]">
          <Vue3Lottie
            animationLink="https://lottie.host/98948314-ec15-4af8-9661-9d1b1f71a116/LHbb2MVhfx.json"
            :height="400"
            :width="400"
          />
        </client-only>
        <client-only class="h-[200px] w-[200px]">
          <Vue3Lottie
            :animationLink="isDark ? hiAnimateForDark : hiAnimateForLight"
            :height="200"
            :width="200"
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
      <div class="flex justify-center gap-x-5">
        <a
          v-for="{ title, iconName, link } in socialIcons"
          :key="title"
          class="block"
          :href="link"
          :alt="title"
          target="_blank"
        >
          <SharedRenderSVG
            :iconName="iconName"
            sizes="w-[2rem] h-[5rem]"
            :fill="isDark ? 'white' : 'black'"
          />
        </a>
      </div>

      <!-- WAVE -->
      <client-only>
        <div class="hero__wave">
          <Vue3Lottie
            animationLink="https://lottie.host/9096d992-b888-46be-9cba-ead041278377/WwE7Czpczs.json"
            :scale="1"
            :spead="0.1"
          />
        </div>
      </client-only>
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
    link: "",
  },
];

const hiAnimateForDark =
  "https://lottie.host/d8dd715b-f33c-4941-ac2c-c28cb9a5ceb3/RhmygCE1tr.json";
const hiAnimateForLight =
  "https://lottie.host/4773445f-c908-48a1-9bf1-54cd7aba786f/yhof6leJ5S.json";
</script>

<style>
.hero {
  @apply flex flex-col items-center justify-center relative;
}
.hero__title {
  @apply flex flex-col text-center justify-center text-lg font-bold capitalize select-none;
}
.hero__wave {
  @apply absolute opacity-50 pointer-events-none top-2/3 -translate-y-2/4 start-0 end-0 -z-10;
}
.graident {
  @apply text-transparent bg-clip-text bg-gradient-to-t 
  from-primary-gradient1/60 from-10% to-[rgb(var(--primary-2))];
}
</style>
