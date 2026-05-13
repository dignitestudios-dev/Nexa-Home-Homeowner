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

export function useVerifyPhoneOtp(
  options?: Parameters<typeof useApiMutation<VerifyPhoneOtpResponse, VerifyPhoneOtpVars>>[0]['mutationOptions']
) {
  return useApiMutation<VerifyPhoneOtpResponse, VerifyPhoneOtpVars>({
    endpoint: '/auth/verify-phone-otp',
    method: 'POST',
    mutationOptions: options,
  })
}
