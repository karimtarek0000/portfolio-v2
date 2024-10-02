<template>
  <button v-if="false" @click="toggleHandler" :class="buttonClasses">
    <RenderSVG
      iconName="dark-mode"
      sizes="w-[1.2rem] h-[5rem]"
      :fill="isDark ? 'white' : 'black'"
    />
    <RenderSVG iconName="light-mode" sizes="w-[1.2rem] h-[5rem]" fill="white" />
    <span :class="mergeClasses(spanClasses, moveClass)">
      <RenderSVG v-if="isDark" iconName="dark-mode" sizes="h-[5rem]" />
      <RenderSVG v-else iconName="light-mode" sizes="h-[5rem]" fill="white" />
    </span>
  </button>
</template>

<script lang="tsx" setup>
const { isDark, moveClass, toggleHandler } = useToggleTheme();

// ------------ Classes ------------ //
const buttonClasses =
  "relative flex items-center justify-between w-20 h-8 px-2 transition-all border rounded-full focus-visible:ring-1 focus-visible:ring-yellow-100 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus-visible:outline-none border-primary-2/80 border-1";
const spanClasses =
  "absolute flex items-center justify-center transition-transform block w-10 h-10 rounded-full bg-primary-2 -start-1 top-1/2 -translate-y-2/4";
</script>
