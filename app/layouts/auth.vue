<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen bg-muted flex justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Volver a la tienda -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-xs tracking-widest text-dimmed hover:text-muted transition-colors"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="w-3.5 h-3.5"
        />
        VOLVER A LA TIENDA
      </NuxtLink>

      <slot />
    </div>
  </div>
</template>
