import { createAdminApi } from '~/api/admin-api'
import type { SelectOption } from '~/components/types/select'
import type { Category } from '../types/category'

function flattenCategories(cats: Category[], depth = 0): SelectOption[] {
  return cats.flatMap(cat => [
    { label: cat.name, value: cat.id },
    ...flattenCategories(cat.children ?? [], depth + 1)
  ])
}

export const useListCategory = () => {
  const entities = ref<SelectOption[]>([])
  const isLoading = ref(false)
  const error = ref('')

  async function getCategories() {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<Category[]>('/categories', { method: 'GET' })
      entities.value = flattenCategories(data)
    } catch (ferror) {
      error.value = ferror instanceof Error ? ferror.message : String(ferror)
    } finally {
      isLoading.value = false
    }
  }

  return { getCategories, isLoading, error, selectCategories: entities }
}
