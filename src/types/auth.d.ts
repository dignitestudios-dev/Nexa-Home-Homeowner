interface SendPhoneOtpVars {
  phone: string
  role: 'user'
}

interface SendPhoneOtpResponse {
  success: boolean
  message: string
}

interface VerifyPhoneOtpVars {
  phone: string
  role: 'user'
  otp: string
}

interface SendChangeEmailOtpVars {
  email: string
}

interface VerifyChangeEmailOtpVars {
  email: string
  otp: string
}

interface User {
  _id: string
  name: string | null
  email: string | null
  phone: string
  profilePicture: {location:string}
  role: string
  authType: string
  primaryIdentifier: string
  identityStatus: string
  isPasswordSet: boolean
  overview: string | null
  referralCode: string | null
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isProfileCompleted: boolean
  businessDocsSubmitted: boolean
  isDeactivatedByAdmin: boolean
  createdAt: string
  updatedAt: string
}

interface VerifyPhoneOtpResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: User
  }
}

interface GetOwnUserResponse {
  success: boolean
  message: string
  data: User
}

interface CompleteProfileVars {
  profilePicture?: {location: string, file: File}
  name: string
  referralCode?: string
}

interface CompleteProfileResponse {
  success: boolean
  message: string
}

interface SocialAuthVars {
  idToken: string
  method: 'google' | 'apple'
  role: 'user'
}

interface SocialAuthResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: User
  }
}
