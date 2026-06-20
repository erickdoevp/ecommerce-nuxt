import { createPublicApi } from '~/api/public-api'
import type { SimpleSize } from '../types/size'

// Listado público de tallas (para los filtros de la tienda).
export const usePublicSizes = () => {
  const api = createPublicApi()

  const { data } = useAsyncData(
    'public-sizes',
    () => api<SimpleSize[]>('/sizes', { method: 'GET' }),
    { default: () => [] as SimpleSize[] }
  )

  return { sizes: data }
}
