import type { ProductSchema } from '../schemas/product.schema'
import type { MediaImage } from '../types/image'
import type { ProductDetail } from '../types/product-detail'
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
  function loadProductData(productData: ProductDetail): void {
    product.name = productData.name
    product.slug = productData.slug
    product.basePrice = productData.basePrice
    product.categoryId = productData.category.id
    product.description = productData.description
    product.status = productData.status
  }
  function cleanProductData(): void {
    product.name = ''
    product.slug = ''
    product.basePrice = 0
    product.categoryId = ''
    product.description = ''
    product.status = 'DRAFT'
  }
  return {
    form: product,
    wordCount: computed(() => {
      if (!product.description || typeof product.description !== 'object') return 0
      const text = extractText(product.description).trim()
      return text ? text.split(/\s+/).filter(Boolean).length : 0
    }),
    images,
    variantGrid,
    variantData,
    loadProductData,
    cleanProductData
  }
}
