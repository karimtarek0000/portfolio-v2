<template>
  <header class="layout-container h-dvh">
    <LayoutNavbar />

    <div class="hero">
      <client-only class="h-[200px] w-[200px]">
        <Vue3Lottie
          :animationLink="isDark ? hiAnimateForDark : hiAnimateForLight"
          :height="200"
          :width="200"
        />
      </client-only>
      <h1 class="hero__title">
        <span class="graident">karim tarek</span>
        <span class="graident text-md">frontend software engineer</span>
      </h1>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from "vue3-lottie";
const { isDark } = useToggleTheme();

const hiAnimateForDark =
  "https://lottie.host/d8dd715b-f33c-4941-ac2c-c28cb9a5ceb3/RhmygCE1tr.json";
const hiAnimateForLight =
  "https://lottie.host/4773445f-c908-48a1-9bf1-54cd7aba786f/yhof6leJ5S.json";
</script>

<style>
.hero {
  @apply flex flex-col items-center justify-center;
}
.hero__title {
  @apply flex flex-col text-center justify-center text-lg font-bold capitalize select-none;
}
.graident {
  @apply text-transparent bg-clip-text bg-gradient-to-t 
  from-primary-gradient1/60 from-10% to-[rgb(var(--primary-2))];
}
</style>
