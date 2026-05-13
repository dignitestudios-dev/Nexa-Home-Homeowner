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

interface User {
  _id: string
  name: string | null
  email: string | null
  phone: string
  profilePicture: string | null
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

interface CompleteProfileVars {
  profilePicture?: File
  name: string
  referralCode?: string
}

interface CompleteProfileResponse {
  success: boolean
  message: string
}
