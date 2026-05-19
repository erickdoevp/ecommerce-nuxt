export interface MediaImage {
  id: string
  file: File
  originalUrl: string
  displayUrl: string
  editedBlob?: Blob | null
}
