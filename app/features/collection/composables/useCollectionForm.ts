import type { MediaImage } from '~/features/product/types/image'
import { extractText } from '~/features/product/utils/extract-text'
import type { CollectionSchema } from '../schemas/collection.schema'

const form = reactive<CollectionSchema>({
  name: '',
  slug: '',
  description: '',
  active: true,
  position: 1
})

const image = ref<MediaImage | null>(null)

export const useCollectionForm = () => {
  function cleanForm(): void {
    form.name = ''
    form.slug = ''
    form.description = ''
    form.active = true
    form.position = 1
    if (image.value?.originalUrl?.startsWith('blob:')) URL.revokeObjectURL(image.value.originalUrl)
    if (image.value?.displayUrl && image.value.displayUrl !== image.value.originalUrl && image.value.displayUrl.startsWith('blob:')) {
      URL.revokeObjectURL(image.value.displayUrl)
    }
    image.value = null
  }

  return {
    form,
    image,
    cleanForm,
    wordCount: computed(() => {
      if (!form.description || typeof form.description !== 'object') return 0
      const text = extractText(form.description).trim()
      return text ? text.split(/\s+/).filter(Boolean).length : 0
    })
  }
}
