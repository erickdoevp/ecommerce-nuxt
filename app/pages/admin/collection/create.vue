<script setup lang="ts">
import CreateCollectionForm from '~/features/collection/components/CreateCollectionForm.vue'
import CollectionMediaCard from '~/features/collection/components/CollectionMediaCard.vue'
import CollectionState from '~/features/collection/components/CollectionState.vue'
import { useCollectionForm } from '~/features/collection/composables/useCollectionForm'
import { useCreateCollection } from '~/features/collection/composables/useCreateCollection'

const { form, image, cleanForm } = useCollectionForm()
const { createCollection, isLoading } = useCreateCollection()

onMounted(() => cleanForm())

async function onSave() {
  const data = {
    name: form.name,
    slug: form.slug,
    description: form.description,
    active: form.active,
    position: form.position
  }

  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))

  if (image.value?.editedBlob) {
    formData.append('image', image.value.editedBlob, 'collection.jpg')
  } else if (image.value?.file) {
    formData.append('image', image.value.file, image.value.file.name)
  }

  await createCollection(formData)
}
</script>

<template>
  <div class="page-container">
    <UContainer>
      <div class="flex flex-col gap-1 mb-6">
        <h1 class="text-xl font-semibold text-gray-900">
          Nueva colección
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Completa los datos para crear una nueva colección.
        </p>
      </div>

      <div class="flex flex-row gap-3">
        <div class="flex flex-col gap-3 w-[70%]">
          <CreateCollectionForm />
          <CollectionMediaCard />
          <div class="flex items-center justify-end gap-3">
            <UButton
              color="neutral"
              variant="outline"
              to="/admin/collection"
            >
              Cancelar
            </UButton>
            <UButton
              :loading="isLoading"
              icon="i-lucide-save"
              @click="onSave"
            >
              Crear colección
            </UButton>
          </div>
        </div>
        <div class="flex flex-col gap-3 flex-1">
          <CollectionState />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
