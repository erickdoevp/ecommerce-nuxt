import { createPublicApi } from '~/api/public-api'
import type { CollectionDetail } from '../types/collection-search'

export const useCollectionDetail = (slug: string) => {
  const api = createPublicApi()

  const { data, pending, error, refresh } = useAsyncData(
    `collection-detail-${slug}`,
    async () => await api<CollectionDetail>(`/collections/${slug}`, { method: 'GET' })
  )

  return { collection: data, pending, error, refresh }
}
