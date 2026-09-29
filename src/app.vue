<script setup lang="ts">
const data = useState('data')

await callOnce(async () => {
  const { data: fetchedData } = await useFetch(
    'https://jsonblob.com/api/jsonBlob/01a0ee19-633c-7645-ae66-5232e8d7899e',
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
