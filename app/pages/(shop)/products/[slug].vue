<script setup lang="ts">
const slug = useRoute().params.slug
</script>

<template>
  <div>
    <h1>Producto: {{ slug }}</h1>
  </div>
</template>

<style scoped>

</style>
