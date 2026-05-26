import type { CategorySchema } from '../schemas/category.schema'
import type { MediaImage } from '~/features/product/types/image'
import { extractText } from '~/features/product/utils/extract-text'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const form = reactive<CategorySchema>({
  name: '',
  slug: '',
  description: undefined,
  parentId: undefined,
  active: true
})

const images = ref<MediaImage[]>([])
const slugManuallyEdited = ref(false)

watch(() => form.name, (newName) => {
  if (!slugManuallyEdited.value) {
    form.slug = toSlug(newName)
  }
})

export const useCategoryForm = () => {
  function resetForm() {
    form.name = ''
    form.slug = ''
    form.description = undefined
    form.parentId = undefined
    form.active = true
    for (const img of images.value) {
      URL.revokeObjectURL(img.originalUrl)
      if (img.displayUrl !== img.originalUrl) URL.revokeObjectURL(img.displayUrl)
    }
    images.value = []
    slugManuallyEdited.value = false
  }

  return {
    form,
    images,
    slugManuallyEdited,
    wordCount: computed(() => {
      if (!form.description || typeof form.description !== 'object') return 0
      const text = extractText(form.description).trim()
      return text ? text.split(/\s+/).filter(Boolean).length : 0
    }),
    resetForm
  }
}
