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
const colors = ref<string[]>([])
const sizes = ref<string[]>([])
const isInitializing = ref(false)

export const useProductForm = () => {
  async function loadProductData(productData: ProductDetail): Promise<void> {
    isInitializing.value = true

    product.name = productData.name
    product.slug = productData.slug
    product.basePrice = productData.basePrice
    product.categoryId = productData.category.id
    product.description = productData.description
    product.status = productData.status

    images.value = productData.images.map(url => ({
      id: crypto.randomUUID() as string,
      existingUrl: url.url,
      originalUrl: url.url,
      displayUrl: url.url
    }))

    variantGrid.value = productData.variants.map(v => ({
      id: v.id,
      color: v.color.name,
      colorId: v.color.id,
      size: v.size.name,
      sizeId: v.size.id
    }))

    variantData.value = Object.fromEntries(
      productData.variants.map(v => [v.id, {
        sku: v.sku,
        adjustAmount: v.priceAdjustment,
        costPrice: v.costPrice,
        initialStock: v.availableStock,
        image: v.imageUrl || null
      }])
    )

    colors.value = [...new Set(productData.variants.map(v => v.color.name))]
    sizes.value = [...new Set(productData.variants.map(v => v.size.name))]

    await nextTick()
    isInitializing.value = false
  }

  function cleanProductData(): void {
    product.name = ''
    product.slug = ''
    product.basePrice = 0
    product.categoryId = ''
    product.description = ''
    product.status = 'DRAFT'
    images.value = []
    colors.value = []
    sizes.value = []
    variantGrid.value = []
    variantData.value = {}
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
    colors,
    sizes,
    isInitializing,
    loadProductData,
    cleanProductData
  }
}
