export interface AddressResponse {
  id: string
  userId: string
  alias: string
  recipientName: string
  phone: string
  street: string
  exteriorNumber: string
  interiorNumber: string | null
  colonia: string
  cp: string
  municipio: string
  estado: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
