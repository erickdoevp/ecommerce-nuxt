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
  default: boolean
  createdAt: string
  updatedAt: string
}

// Body de creación (POST) y edición (PUT): mismo shape, reemplazo completo.
export interface AddressRequest {
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
}

// GET /addresses/postal-codes/{cp} → 200 con municipio/estado, o 404 si no existe.
export interface PostalCodeResponse {
  cp: string
  municipio: string
  estado: string
}
