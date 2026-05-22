import { useApiMutation } from '@/hooks/api/use-api-mutation'

export function useSendPhoneOtp(
  options?: Parameters<typeof useApiMutation<SendPhoneOtpResponse, SendPhoneOtpVars>>[0]['mutationOptions']
) {
  return useApiMutation<SendPhoneOtpResponse, SendPhoneOtpVars>({
    endpoint: '/auth/send-phone-otp',
    method: 'POST',
    mutationOptions: options,
  })
}

export function useSendChangePhoneOtp(
  options?: Parameters<typeof useApiMutation<SendPhoneOtpResponse, Omit<SendPhoneOtpVars, 'role'>>>[0]['mutationOptions']
) {
  return useApiMutation<SendPhoneOtpResponse, Omit<SendPhoneOtpVars, 'role'>>({
    endpoint: '/auth/change-phone',
    method: 'POST',
    mutationOptions: options,
  
  })
}

export function useVerifyPhoneOtp(
  options?: Parameters<typeof useApiMutation<VerifyPhoneOtpResponse, VerifyPhoneOtpVars>>[0]['mutationOptions']
) {
  return useApiMutation<VerifyPhoneOtpResponse, VerifyPhoneOtpVars>({
    endpoint: '/auth/verify-phone-otp',
    method: 'POST',
    invalidateKeys: ["userOwn"],
    mutationOptions: options,
  })
}

export function useVerifyChangePhoneOtp(
  options?: Parameters<typeof useApiMutation<VerifyPhoneOtpResponse, Omit<VerifyPhoneOtpVars, 'role'>>>[0]['mutationOptions']
) {
  return useApiMutation<VerifyPhoneOtpResponse, Omit<VerifyPhoneOtpVars, 'role'>>({
    endpoint: '/auth/verify-change-phone',
    method: 'POST',
    mutationOptions: options,
      invalidateKeys: ["userOwn"],
  })
}

export function useSendChangeEmailOtp(
  options?: Parameters<typeof useApiMutation<SendPhoneOtpResponse, SendChangeEmailOtpVars>>[0]['mutationOptions']
) {
  return useApiMutation<SendPhoneOtpResponse, SendChangeEmailOtpVars>({
    endpoint: '/auth/change-email',
    method: 'POST',
    mutationOptions: options,
  })
}

export function useVerifyChangeEmailOtp(
  options?: Parameters<typeof useApiMutation<VerifyPhoneOtpResponse, VerifyChangeEmailOtpVars>>[0]['mutationOptions'],
  invalidateKeys?: string[]
) {
  return useApiMutation<VerifyPhoneOtpResponse, VerifyChangeEmailOtpVars>({
    endpoint: '/auth/verify-change-email',
    method: 'POST',
    invalidateKeys: invalidateKeys || [],
    mutationOptions: options,
  })
}

export function useSocialAuth(
  options?: Parameters<typeof useApiMutation<SocialAuthResponse, SocialAuthVars>>[0]['mutationOptions']
) {
  return useApiMutation<SocialAuthResponse, SocialAuthVars>({
    endpoint: '/auth',
    method: 'POST',
    mutationOptions: options,
  })
}
