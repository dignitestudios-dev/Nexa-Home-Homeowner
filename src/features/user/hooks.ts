import { useApiMutation } from '@/hooks/api/use-api-mutation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const ADDRESS_QUERY_KEY = 'addresses'

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
      if (vars.profilePicture) fd.append('profilePicture', vars.profilePicture.file)
      if (vars.referralCode) fd.append('referralCode', vars.referralCode)
      return fd
    },
    mutationOptions: options,
  })
}

export function useGetAddresses() {
  return useQuery<GetAllAddressesResponse>({
    queryKey: [ADDRESS_QUERY_KEY],
    queryFn: async () => {
      const res = await apiClient.get<GetAllAddressesResponse>('/address/get-all')
      return res.data
    },
  })
}

export function useGetOwnUser() {
  return useQuery<GetOwnUserResponse>({
    queryKey: ['userOwn'],
    queryFn: async () => {
      const res = await apiClient.get<GetOwnUserResponse>('/user/own')
      return res.data
    },
  })
}

export function useSetDefaultAddress(
  options?: Parameters<typeof useApiMutation<AddAddressResponse, { id: string }>>[0]['mutationOptions']
) {
  return useApiMutation<AddAddressResponse, { id: string }>({
    endpoint: (vars) => `/address/set-default/${vars.id}`,
    method: 'POST',
    invalidateKeys: [ADDRESS_QUERY_KEY],
    mutationOptions: options,
  })
}

export function useDeleteAddress(
  options?: Parameters<typeof useApiMutation<AddAddressResponse, { id: string }>>[0]['mutationOptions']
) {
  return useApiMutation<AddAddressResponse, { id: string }>({
    endpoint: (vars) => `/address/delete/${vars.id}`,
    method: 'POST',
    invalidateKeys: [ADDRESS_QUERY_KEY],
    mutationOptions: options,
  })
}

export function useEditAddress(
  options?: Parameters<typeof useApiMutation<AddAddressResponse, AddAddressVars & { id: string }>>[0]['mutationOptions']
) {
  return useApiMutation<AddAddressResponse, AddAddressVars & { id: string }>({
    endpoint: (vars) => `/address/edit-address/${vars.id}`,
    method: 'POST',
    invalidateKeys: [ADDRESS_QUERY_KEY],
    toBody: ({ id: _id, ...rest }) => rest,
    mutationOptions: options,
  })
}

export function useAddAddress(
  options?: Parameters<typeof useApiMutation<AddAddressResponse, AddAddressVars>>[0]['mutationOptions']
) {
  return useApiMutation<AddAddressResponse, AddAddressVars>({
    endpoint: '/address/add-address',
    method: 'POST',
    invalidateKeys: [ADDRESS_QUERY_KEY],
    mutationOptions: options,
  })
}

export function useUpdateProfile(
  options?: Parameters<typeof useApiMutation<CompleteProfileResponse, { name: string; profilePicture?: File }>>[0]['mutationOptions']
) {
  return useApiMutation<CompleteProfileResponse, { name: string; profilePicture?: File }>({
    endpoint: '/user/update-profile',
    method: 'POST',
    isMultiPart: true,
    toBody: (vars) => {
      const fd = new FormData()
      fd.append('name', vars.name)
      if (vars.profilePicture) fd.append('profilePicture', vars.profilePicture)
      return fd
    },
    invalidateKeys: ['userOwn'],
    mutationOptions: options,
  })
}

export interface CategoryIcon {
  _id: string
  filename: string
  key: string
  location: string
  mimetype: string
  size: number
  uploadedById: string | null
  uploadedByModel: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  credits?: number | null
  icon?: CategoryIcon
  createdAt: string
  updatedAt: string
}

export interface CategoryPagination {
  itemsPerPage: number
  currentPage: number
  totalItems: number
  totalPages: number
}

export interface GetCategoriesResponse {
  success: boolean
  message: string
  data: Category[]
  pagination: CategoryPagination
}

export function useGetCategories(params: { page: number; limit: number; search?: string }) {
  return useQuery<GetCategoriesResponse>({
    queryKey: ['categories', params],
    queryFn: async () => {
      const res = await apiClient.get<GetCategoriesResponse>('/category', {
        params,
      })
      return res.data
    },
  })
}
