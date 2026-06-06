import { createAdminApi } from '~/api/admin-api'
import type { CategoryOption } from '../types/category'
import type { CategoryTree } from '../types/category-tree'

function flattenCategories(cats: CategoryTree[] | undefined, depth = 0): CategoryOption[] {
  return cats?.flatMap(cat => [
    { label: cat.name, value: cat.id, depth, isParent: (cat.children?.length ?? 0) > 0 },
    ...flattenCategories(cat?.children, depth + 1)
  ]) || []
}

export const useTreeCategory = () => {
  const entities = ref<CategoryTree[]>([])
  const tree = ref<CategoryOption[]>([])
  const isLoading = ref(false)
  const error = ref('')

  async function getCategories() {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<CategoryTree[]>('/categories/tree', { method: 'GET' })
      entities.value = data
      tree.value = flattenCategories(data)
    } catch (ferror) {
      error.value = extractApiError(ferror)
    } finally {
      isLoading.value = false
    }
  }

  return { getCategories, isLoading, error, categories: entities, treeSelectCategory: tree }
}
