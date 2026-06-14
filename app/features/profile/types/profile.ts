export interface UserRole {
  id: string
  name: string
}

export interface UserDetailResponse {
  id: string
  name: string
  firstLastName: string
  secondLastName: string
  displayName: string
  email: string
  username: string
  phoneNumber: string
  avatarImgUrl: string | null
  privacyPolicyAccepted: boolean
  privacyPolicyAcceptedAt: string | null
  privacyPolicyVersion: string | null
  lastSignInAt: string | null
  createdAt: string
  updatedAt: string
  roles: UserRole[]
}

export interface UpdateProfileRequest {
  name?: string
  firstLastName?: string
  secondLastName?: string
  phoneNumber?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
