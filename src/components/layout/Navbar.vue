<template>
  <nav>
    <SharedRenderSVG
      iconName="logo-large"
      sizes="w-[4rem] h-[10rem]"
      :fill="isDark ? 'white' : 'black'"
    />
  </nav>
</template>

<script lang="ts" setup>
const { isDark } = useToggleTheme();
</script>

<style></style>
