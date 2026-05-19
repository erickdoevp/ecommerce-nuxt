import { createAdminApi } from '~/api/admin-api'
import type { SelectOption } from '~/components/types/select'
import type { SimpleColor } from '../types/color'

export const useListColor = () => {
  const entities = ref<SelectOption[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string>('')

  async function getColors() {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<SimpleColor[]>('/colors', {
        method: 'GET'
      })
      entities.value = data.map(c => ({
        label: c.name,
        value: c.id
      }))
    } catch (ferror) {
      error.value = ferror instanceof Error ? ferror.message : String(ferror)
    } finally {
      isLoading.value = false
    }
  }
  return {
    getColors,
    isLoading,
    error,
    selectColors: entities
  }
}
