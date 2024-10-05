<template>
  <header class="layout-container h-dvh">
    <LayoutNavbar />

    <div class="hero">
      <h1 class="hero__title">
        <span class="graident">karim tarek</span>
        <span class="graident text-md">frontend software engineer</span>
      </h1>
    </div>
  </header>
</template>

<script lang="ts" setup>
// import { Vue3Lottie } from 'vue3-lottie'
</script>

<style>
.hero {
  @apply flex items-center justify-center;
}
.hero__title {
  @apply flex flex-col text-center justify-center text-lg font-bold capitalize select-none;
}
.graident {
  @apply text-transparent bg-clip-text bg-gradient-to-t 
  from-primary-gradient1/60 from-10% to-[rgb(var(--primary-2))];
}
</style>
