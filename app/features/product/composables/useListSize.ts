import { createAdminApi } from '~/api/admin-api'
import type { SelectOption } from '~/components/types/select'
import type { SimpleSize } from '../types/size'

export const useListSize = () => {
  const entities = ref<SelectOption[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string>('')

  async function getSizes() {
    try {
      const api = createAdminApi()
      const data = await api<SimpleSize[]>('/sizes',
        {
          method: 'GET'
        }
      )
      entities.value = data.map(c => ({
        label: c.name,
        value: c.id
      }))
    } catch (ferror) {
      error.value = ferror instanceof Error ? ferror.message : String(ferror)
    }
  }

  return {
    getSizes,
    isLoading,
    error,
    selectSizes: entities
  }
}
