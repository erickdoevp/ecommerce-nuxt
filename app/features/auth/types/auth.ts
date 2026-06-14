export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
}

export interface AuthError {
  message: string
  statusCode?: number
}

export interface SignUpRequest {
  username: string
  password: string
  email: string
  name: string
  firstLastName: string
  secondLastName: string
  phoneNumber: string
  acceptedPrivacyPolicy: boolean
  turnstileToken: string
}

export interface SignUpResponse {
  accessToken: string
  tokenType: string
}

export interface SignInRequest {
  usernameOrEmail: string
  password: string
  turnstileToken: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}
