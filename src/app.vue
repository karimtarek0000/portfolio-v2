<script setup lang="ts">
const data = useState('data')

await callOnce(async () => {
  const { data: fetchedData } = await useFetch(
    'https://jsonblob.com/api/jsonBlob/019cec7d-399b-7b8c-9921-2f2d90948b50',
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
