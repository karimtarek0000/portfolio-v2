<template>
  <section class="skills-section glassmorphism">
    <header class="skills-section__header">
      <h2 class="skills-section__header__title graident">skills</h2>
      <p class="skills-section__header__subtitle">
        The skills, tools and technologies
      </p>
    </header>

    <!-- Body -->
    <figure class="skills-section__body">
      <figcaption
        v-for="{ title, iconName } in skills"
        :key="title"
        class="skills-section__body__item"
      >
        <div class="skills-section__body__item__icon">
          <SharedRenderSVG :iconName="iconName" sizes="h-[4rem] w-[4rem]" />
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
    iconName: "nextjs",
  },
  {
    title: "css",
    iconName: "github",
  },
  {
    title: "sass",
    iconName: "github",
  },
  {
    title: "bootstarp",
    iconName: "github",
  },
  {
    title: "tailwindcss",
    iconName: "github",
  },
  {
    title: "javascript",
    iconName: "github",
  },
  {
    title: "typescript",
    iconName: "github",
  },
  {
    title: "vue.js",
    iconName: "github",
  },
  // {
  //   title: "react.js",
  //   iconName: "github",
  // },
  // {
  //   title: "nuxt.js",
  //   iconName: "github",
  // },
  // {
  //   title: "next.js",
  //   iconName: "github",
  // },
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
  @apply content-center justify-center h-full flex flex-wrap;
}
.skills-section__body__item {
  @apply flex flex-col items-center p-1 w-full md:basis-1/2 lg:basis-1/4;
}
.skills-section__body__item__icon {
  @apply p-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600;
}
.skills-section__body__item__title {
  @apply my-2;
}
</style>
