<template>
  <header class="header">
    <h2 class="header__title graident" v-text="title" />
    <p class="header__subtitle" v-text="subTitle" />
  </header>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  subTitle?: string;
}>();
</script>

<style scoped>
.header {
  @apply flex flex-col items-center;
}
.header__title {
  @apply font-medium text-center capitalize text-md;
  letter-spacing: 2px;
}
.header__subtitle {
  @apply text-sm mb-10;
}
</style>
