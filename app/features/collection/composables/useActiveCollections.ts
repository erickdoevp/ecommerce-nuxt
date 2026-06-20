import { createPublicApi } from '~/api/public-api'
import type { CollectionContent } from '../types/collection-search'

export const useActiveCollections = () => {
  const api = createPublicApi()

  const { data, pending, error, refresh } = useAsyncData(
    'active-collections',
    async () => await api<CollectionContent[]>('/collections', { method: 'GET' }),
    { default: () => [] as CollectionContent[] }
  )

  return { collections: data, pending, error, refresh }
}
