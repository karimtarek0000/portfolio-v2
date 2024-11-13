<template>
  <section class="py-10 mt-20 glassmorphism">
    <SharedHeader title="experience" />

    <div class="timeline">
      <div class="timeline__wrapper">
        <div class="timeline__wrapper__timeline"></div>
        <div class="timeline__wrapper__line" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style scoped>
.timeline__wrapper {
  @apply flex flex-col items-center;
}
.timeline__wrapper__timeline {
  @apply flex items-center justify-center bg-blue-500 border-2 border-blue-500 rounded-full after:rounded-full after:w-3 after:h-3 after:bg-black w-7 h-7;
}
.timeline__wrapper__line {
  @apply w-[2px] h-8 my-3 bg-blue-500;
}
</style>
