<template>
  <button
    @click="toggleHandler"
    class="relative w-20 h-8 border rounded-full border-primary-2/80 border-1"
  >
    <span :class="mergeClasses(classes, moveClass)"></span>
  </button>
</template>

<script lang="ts" setup>
const classes =
  "absolute transition-transform block w-10 h-10 rounded-full bg-primary-2 -start-1 top-1/2 -translate-y-2/4";
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
