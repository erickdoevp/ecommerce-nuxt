import { createPublicApi } from '~/api/public-api'
import type { SimpleColor } from '../types/color'

// Listado público de colores (para los filtros de la tienda).
export const usePublicColors = () => {
  const api = createPublicApi()

  const { data } = useAsyncData(
    'public-colors',
    () => api<SimpleColor[]>('/colors', { method: 'GET' }),
    { default: () => [] as SimpleColor[] }
  )

  return { colors: data }
}
