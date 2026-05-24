export interface MediaImage {
  id: string
  file?: File
  existingUrl?: string
  originalUrl: string
  displayUrl: string
  editedBlob?: Blob | null
}
