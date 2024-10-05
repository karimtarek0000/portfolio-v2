<template>
  <header class="layout-container h-dvh">
    <LayoutNavbar />

    <div class="hero">
      <h1 class="hero__title">frontend software engineer</h1>
    </div>
  </header>
</template>

<script lang="ts" setup></script>

<style>
.hero {
  @apply flex items-center justify-center;
}
.hero__title {
  @apply text-lg font-bold capitalize select-none text-transparent bg-clip-text bg-gradient-to-t 
  from-primary-gradient1/60 from-10% to-[rgb(var(--primary-2))];
}
</style>
