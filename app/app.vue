<script setup>
useHead({
  titleTemplate: title => title ? `${title} · LA BENDITA` : 'LA BENDITA | Lencería',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'LA BENDITA | Lencería'
const description = 'Lencería LA BENDITA: piezas de encaje, malla y seda diseñadas para realzar tu esencia.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
