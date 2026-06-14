<script setup lang="ts">
import StoreHeader from '~/components/shared/StoreHeader.vue'
import StoreFooter from '~/components/shared/StoreFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <StoreHeader />
    <main class="flex-1">
      <slot />
    </main>
    <StoreFooter />
  </div>
</template>
