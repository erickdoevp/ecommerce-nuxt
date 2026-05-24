import { createAdminApi } from '~/api/admin-api'
import type { SelectOption } from '~/components/types/select'
import type { Category } from '../types/category'

function buildTree(cats: Category[]): Category[] {
  const map = new Map<string, Category>()
  for (const cat of cats) map.set(cat.id, { ...cat, children: [] })

  const roots: Category[] = []
  for (const cat of map.values()) {
    if (cat.parent?.id) {
      const parent = map.get(cat.parent.id)
      if (parent) parent.children!.push(cat)
    } else {
      roots.push(cat)
    }
  }
  return roots
}

function flattenCategories(cats: Category[], depth = 0): SelectOption[] {
  return cats.flatMap(cat => [
    { label: cat.name, value: cat.id },
    ...flattenCategories(cat.children ?? [], depth + 1)
  ])
}

export const useListCategory = () => {
  const selectCategories = ref<SelectOption[]>([])
  const entities = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref('')

  async function getCategories() {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<Category[]>('/categories', { method: 'GET' })
      const tree = buildTree(data)
      entities.value = tree
      selectCategories.value = flattenCategories(tree)
    } catch (ferror) {
      error.value = ferror instanceof Error ? ferror.message : String(ferror)
    } finally {
      isLoading.value = false
    }
  }

  return { getCategories, isLoading, error, selectCategories, categories: entities }
}
