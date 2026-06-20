<script setup lang="ts">
const slug = useRoute().params.slug
</script>

<template>
  <div>
    <h1>Colección: {{ slug }}</h1>
  </div>
</template>

<style scoped>

</style>
