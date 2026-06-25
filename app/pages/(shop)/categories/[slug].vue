<script setup lang="ts">
definePageMeta({
  layout: 'store'
})

const { slug } = useRoute().params
</script>

<template>
  <div>
    <h1>Categoria: {{ slug }}</h1>
  </div>
</template>

<style scoped>

</style>
