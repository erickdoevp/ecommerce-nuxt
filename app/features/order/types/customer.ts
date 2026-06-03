export interface CustomerRole {
  id: number
  name: string
}

export interface CustomerDetail {
  id: string
  name: string
  firstLastName: string | null
  secondLastName: string | null
  displayName: string
  email: string
  username: string
  phoneNumber: string | null
  avatarImgUrl: string | null
  lastSignInAt: string | null
  createdAt: string
  updatedAt: string
  roles: CustomerRole[]
}
