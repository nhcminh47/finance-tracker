<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>