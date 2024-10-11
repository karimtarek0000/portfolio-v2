<template>
  <section class="skills-section glassmorphism">
    <header class="skills-section__header">
      <h2 class="skills-section__header__title graident">skills</h2>
      <p class="skills-section__header__subtitle">Tools and technologies</p>
    </header>

    <!-- Body -->
    <figure class="skills-section__body">
      <figcaption
        v-for="{ title, iconName, color } in skills"
        :key="title"
        class="skills-section__body__item"
      >
        <div class="skills-section__body__item__icon">
          <div :class="['p-5 overflow-hidden  rounded-full', color]">
            <SharedRenderSVG :iconName="iconName" sizes="h-[4rem] w-[4rem]" />
          </div>
        </div>
        <span class="skills-section__body__item__title" v-text="title" />
      </figcaption>
    </figure>
  </section>
</template>

<script lang="ts" setup>
const skills = [
  {
    title: "html",
    iconName: "html",
    color: "bg-[#E44E26]",
  },
  {
    title: "css",
    iconName: "css",
    color: "bg-[#1472B6]",
  },
  {
    title: "sass",
    iconName: "sass",
    color: "bg-[#40B883]",
  },
  {
    title: "bootstrap",
    iconName: "bootstrap",
    color: "bg-[#563D7C]",
  },
  {
    title: "tailwindcss",
    iconName: "tailwindcss",
    color: "bg-[#36495E]",
  },
  {
    title: "javascript",
    iconName: "js",
    color: "bg-[#FFCA27]",
  },
  {
    title: "typescript",
    iconName: "typescript",
    color: "bg-[#3278C6]",
  },
  {
    title: "vue.js",
    iconName: "vue",
    color: "bg-[#36495E]/60",
  },
  {
    title: "react.js",
    iconName: "react",
    color: "bg-black",
  },
  {
    title: "redux",
    iconName: "redux",
    color: "bg-white",
  },
  {
    title: "pinia",
    iconName: "pinia",
    color: "bg-[#52A256]",
  },
  {
    title: "nuxt.js",
    iconName: "nuxtjs",
    color: "bg-white",
  },
  {
    title: "next.js",
    iconName: "nextjs",
    color: "bg-white",
  },
  {
    title: "node.js/express",
    iconName: "nodejs",
    color: "bg-black",
  },
  {
    title: "mongodb database",
    iconName: "mongodb",
    color: "bg-[#13AA52]",
  },
  {
    title: "docker",
    iconName: "docker",
    color: "bg-[#1794D4]",
  },
];
</script>

<style scoped>
.skills-section {
  @apply px-3 py-10 mb-20;
}

/* Header */
.skills-section__header {
  @apply flex flex-col items-center mt-5 mb-10 lg:mb-20;
}
.skills-section__header__title {
  @apply font-medium text-center capitalize text-md;
  letter-spacing: 2px;
}
.skills-section__header__subtitle {
  @apply text-sm;
}

/* Body */
.skills-section__body {
  @apply content-center justify-center gap-y-5 h-full flex flex-wrap;
}
.skills-section__body__item {
  @apply flex flex-col items-center p-1 basis-1/2 lg:basis-1/4;
}
.skills-section__body__item__icon {
  @apply p-1 rounded-full ease-in-out duration-300 transition-transform lg:hover:-translate-y-3  bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600;
}
.skills-section__body__item__title {
  @apply my-2 capitalize;
}
</style>
