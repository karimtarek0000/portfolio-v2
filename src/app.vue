<script setup lang="ts">
const data = useState('data')

await callOnce(async () => {
  const { data: fetchedData } = await useFetch(
    'https://jsonblob.com/api/jsonBlob/019ef059-35d9-78d2-bb77-2d9409e6a34c',
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
