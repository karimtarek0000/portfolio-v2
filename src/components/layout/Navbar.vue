<template>
  <nav class="navbar">
    <NuxtLink to="/">
      <SharedRenderSVG
        iconName="logo-large"
        sizes="w-[3.5rem] h-[10rem]"
        :fill="isDark ? 'white' : 'black'"
      />
    </NuxtLink>
    <SharedToggleMode />
  </nav>
</template>

<script lang="ts" setup>
const { isDark } = useToggleTheme();
</script>

<style>
.navbar {
  @apply flex items-center px-3 justify-between w-full;
}
</style>
