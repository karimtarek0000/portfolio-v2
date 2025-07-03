<script lang="ts" setup>
const { data } = await useFetch<Data>(
  'https://jsonblob.com/api/jsonBlob/1390326166061244416',
  {
    key: 'data',
  },
)

useState('data', () => data)
</script>

<template>
  <main class="layout-container">
    <SectionsSkills />
    <SectionsAbout />
    <SectionsExperience />
    <SectionsServices />
  </main>
  <SectionsProjects />
</template>
