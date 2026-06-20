<script setup lang="ts">
import StoreBestSellers from '~/features/home/components/StoreBestSellers.vue'
import StoreCategories from '~/features/home/components/StoreCategories.vue'
import StoreCollections from '~/features/home/components/StoreCollections.vue'
import StoreHero from '~/features/home/components/StoreHero.vue'
import StoreNewArrivals from '~/features/home/components/StoreNewArrivals.vue'
import StoreStory from '~/features/home/components/StoreStory.vue'

definePageMeta({
  layout: 'store'
})
</script>

<template>
  <div>
    <StoreHero />
    <StoreCategories />
    <StoreCollections />
    <StoreBestSellers />
    <StoreNewArrivals />
    <StoreStory />
  </div>
</template>
