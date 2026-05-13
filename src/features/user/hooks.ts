import { useApiMutation } from '@/hooks/api/use-api-mutation'

export function useCompleteProfile(
  options?: Parameters<typeof useApiMutation<CompleteProfileResponse, CompleteProfileVars>>[0]['mutationOptions']
) {
  return useApiMutation<CompleteProfileResponse, CompleteProfileVars>({
    endpoint: '/user/complete-profile',
    method: 'POST',
    isMultiPart: true,
    toBody: (vars) => {
      const fd = new FormData()
      fd.append('name', vars.name)
      if (vars.profilePicture) fd.append('profilePicture', vars.profilePicture)
      if (vars.referralCode) fd.append('referralCode', vars.referralCode)
      return fd
    },
    mutationOptions: options,
  })
}

export function useAddAddress(
  options?: Parameters<typeof useApiMutation<AddAddressResponse, AddAddressVars>>[0]['mutationOptions']
) {
  return useApiMutation<AddAddressResponse, AddAddressVars>({
    endpoint: '/user/add-address',
    method: 'POST',
    mutationOptions: options,
  })
}
