<template>
  <nav>
    <SharedRenderSVG
      iconName="logo-large"
      sizes="w-[3.5rem] h-[10rem]"
      :fill="isDark ? 'white' : 'black'"
    />
  </nav>
</template>

<script lang="ts" setup>
const { isDark } = useToggleTheme();
</script>

<style></style>
