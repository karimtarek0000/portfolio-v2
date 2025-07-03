<script setup lang="ts">
const data = useState('data')

await callOnce(async () => {
  const { data: fetchedData } = await useFetch(
    'https://jsonblob.com/api/jsonBlob/1390326166061244416',
    {
      key: 'data-portfolio',
    },
  )
  data.value = fetchedData
})
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
