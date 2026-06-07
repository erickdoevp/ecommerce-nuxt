import { createAdminApi } from '~/api/admin-api'
import type { SelectOption } from '~/components/types/select'
import type { TaxConfig } from '../types/tax'

export const useListTax = () => {
  const entities = ref<SelectOption[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string>('')

  async function getTaxConfigs() {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<TaxConfig[]>('/tax', { method: 'GET' })
      entities.value = data.map(t => ({
        label: t.name,
        value: t.id
      }))
    } catch (ferror) {
      error.value = extractApiError(ferror)
    } finally {
      isLoading.value = false
    }
  }

  return {
    getTaxConfigs,
    isLoading,
    error,
    selectTax: entities
  }
}
