<template>
  <button
    @click="toggleHandler"
    class="relative flex items-center justify-between w-20 h-8 px-1 border rounded-full border-primary-2/80 border-1"
  >
    <RenderSVG iconName="dark-mode" sizes="h-[5rem]" fill="white" />
    <RenderSVG iconName="light-mode" sizes="h-[5rem]" fill="white" />
    <span :class="mergeClasses(classes, moveClass)">
      <RenderSVG iconName="dark-mode" sizes="h-[5rem]" />
      <!-- <RenderSVG iconName="light-mode" sizes="h-[5rem]" /> -->
    </span>
  </button>
</template>

<script lang="ts" setup>
const classes =
  "absolute flex items-center justify-center transition-transform block w-10 h-10 rounded-full bg-primary-2 -start-1 top-1/2 -translate-y-2/4";
const moveClass = ref("translate-x-0");

const toggleHandler = () => {
  if (moveClass.value === "translate-x-12") {
    moveClass.value = "translate-x-0";
    return;
  }
  moveClass.value = "translate-x-12";
};
</script>

<style scoped></style>
