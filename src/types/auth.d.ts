interface SendPhoneOtpVars {
  phone: string
  role: "user"
}

interface SendPhoneOtpResponse {
  success: boolean
  message: string
}

interface VerifyPhoneOtpVars {
  phone: string
  role: "user"
  otp: string
}

interface SendChangeEmailOtpVars {
  email: string
}

interface VerifyChangeEmailOtpVars {
  email: string
  otp: string
}

interface ProfilePicture {
  location: string
}

type UserRole = "user"

type AuthType = "jwt" | "google" | "apple"

type PrimaryIdentifier = "phone" | "email"

type IdentityStatus =
  | "not-provided"
  | "pending"
  | "approved"
  | "rejected"

type ProviderServicePlan = "none" | "basic" | "premium"

interface User {
  _id: string

  name: string | null
  email: string | null
  contactEmail: string | null
  phone: string

  profilePicture: ProfilePicture | null

  role: UserRole
  authType: AuthType
  primaryIdentifier: PrimaryIdentifier
  identityStatus: IdentityStatus

  isPartnerApproved: boolean
  isPasswordSet: boolean

  overview: string | null
  referralCode: string | null

  providerServicePlan: ProviderServicePlan

  isEmailVerified: boolean
  isPhoneVerified: boolean
  isProfileCompleted: boolean
  businessDocsSubmitted: boolean
  portfolioMediaUploaded: boolean
  isDeactivatedByAdmin: boolean
  hasAddress: boolean
  createdAt: string
  updatedAt: string
}

interface AuthData {
  token: string
  user: User
}

interface VerifyPhoneOtpResponse {
  success: boolean
  message: string
  data?: AuthData
}

interface GetOwnUserResponse {
  success: boolean
  message: string
  data: User
}

interface CompleteProfileVars {
  profilePicture?: {
    location: string
    file: File
  }
  name: string
  referralCode?: string
}

interface CompleteProfileResponse {
  success: boolean
  message: string
}

interface SocialAuthVars {
  idToken: string
  method: "google" | "apple"
  role: "user"
}

interface SocialAuthResponse {
  success: boolean
  message: string
  data?: AuthData
}