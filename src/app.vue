<script setup lang="ts">
const data = useState('data')

await callOnce(async () => {
  const { data: fetchedData } = await useFetch(
    'https://jsonblob.com/api/jsonBlob/019d77b3-00f2-7555-85df-569b41b21e75',
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
