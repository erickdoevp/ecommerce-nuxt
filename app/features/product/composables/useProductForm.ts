import type { ProductSchema } from '../schemas/product.schema'
import type { MediaImage } from '../types/image'
import type { VariantEditable, VariantGridRow } from '../types/product-variant'
import { extractText } from '../utils/extract-text'

const product = reactive<ProductSchema>({
  name: '',
  slug: '',
  basePrice: 0,
  categoryId: '',
  description: '',
  status: 'DRAFT'
})

const images = ref<MediaImage[]>([])
const variantGrid = ref<VariantGridRow[]>([])
const variantData = ref<Record<string, VariantEditable>>({})

export const useProductForm = () => {
  return {
    form: product,
    wordCount: computed(() => {
      if (!product.description || typeof product.description !== 'object') return 0
      const text = extractText(product.description).trim()
      return text ? text.split(/\s+/).filter(Boolean).length : 0
    }),
    images,
    variantGrid,
    variantData
  }
}
