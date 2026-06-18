import { useApiMutation } from '@/hooks/api/use-api-mutation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/cookies';

export const ADDRESS_QUERY_KEY = 'addresses'

export function useCompleteProfile(
  options?: Parameters<typeof useApiMutation<CompleteProfileResponse, CompleteProfileVars>>[0]['mutationOptions']
) {
  return useApiMutation<CompleteProfileResponse, CompleteProfileVars>({
    endpoint: '/user/complete-profile',
    method: 'POST',
    isMultiPart: true,
    invalidateKeys: [ADDRESS_QUERY_KEY, 'userOwn'],
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
    staleTime: 0,
  })
}

export function useGetOwnUser() {
  return useQuery<GetOwnUserResponse>({
    queryKey: ['userOwn'],
    queryFn: async () => {
      const res = await apiClient.get<GetOwnUserResponse>('/user/own')
      return res.data
    },
    enabled: !!getToken(),
  })
}

export function useSetDefaultAddress(
  options?: Parameters<typeof useApiMutation<AddAddressResponse, { id: string }>>[0]['mutationOptions']
) {
  return useApiMutation<AddAddressResponse, { id: string }>({
    endpoint: (vars) => `/address/set-default/${vars.id}`,
    method: 'POST',
    invalidateKeys: [ADDRESS_QUERY_KEY, ""],
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
    invalidateKeys: [ADDRESS_QUERY_KEY, "userOwn"],
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

export function useGetRecentActivityCategories() {
  return useQuery<GetCategoriesResponse>({
    queryKey: ['categories-recent-activity'],
    queryFn: async () => {
      const res = await apiClient.get<GetCategoriesResponse>('/category/my-jobs')
      return res.data
    },
  })
}

export function useGetJobs(params: { tab: JobTab; page: number; limit: number; search?: string }) {
  return useQuery<GetJobsResponse>({
    queryKey: ['jobs', params],
    queryFn: async () => {
      const res = await apiClient.get<GetJobsResponse>('/job/my-jobs', {
        params: {
          tab: params.tab,
          page: params.page,
          limit: params.limit,
          search: params.search,
        },
      })
      return res.data
    },
  })
}

export interface GetJobsCountResponse {
  success: boolean
  message: string
  data: {
    count: number
  }
}

export function useGetJobsCount(enabled: boolean = true) {
  return useQuery<GetJobsCountResponse>({
    queryKey: ['jobs-count'],
    queryFn: async () => {
      const res = await apiClient.get<GetJobsCountResponse>('/job/my-jobs/count')
      return res.data
    },
    enabled,
    staleTime: Infinity,
    gcTime: 0,
  })
}

export function useGetJobDetail(id: string) {
  return useQuery<GetJobDetailResponse>({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await apiClient.get<GetJobDetailResponse>(`/job/user/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useGetMatchingProviders(
  params: { addressId: string; category: string; radius: number; search?: string },
  enabled: boolean
) {
  return useQuery<GetMatchingProvidersResponse>({
    queryKey: ['matching-providers', params],
    queryFn: async () => {
      const res = await apiClient.get<GetMatchingProvidersResponse>('/job/matching-providers', { params })
      return res.data
    },
    enabled,
  })
}

export function useUpdateJobStatus(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, { jobId: string; providerId: string }>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, { jobId: string; providerId: string }>({
    endpoint: (vars) => `/job/${vars.jobId}/status`,
    method: 'PATCH',
    invalidateKeys: ['job', 'jobs'],
    toBody: ({ providerId }) => ({ status: 'accepted', providerId }),
    mutationOptions: options,
  })
}

export function useCompleteJob(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, { jobId: string }>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, { jobId: string }>({
    endpoint: (vars) => `/job/${vars.jobId}/status`,
    method: 'PATCH',
    invalidateKeys: ['job', 'jobs'],
    toBody: () => ({ status: 'completed' }),
    mutationOptions: options,
  })
}

export interface ProviderMedia {
  _id: string
  fileName: string
  key: string
  location: string
  createdAt: string
  updatedAt: string
}

export interface Coordinates {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface DefaultAddress {
  _id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: Coordinates;
}

export interface ProviderDetail {
  _id: string
  name: string
  rating: number
  profilePicture: ProviderMedia | null
  jobCount: number
  overview: string | null
  services: string[]
  portfolioMedia: ProviderMedia[]
  defaultAddress: DefaultAddress;
  isVerifiedBadge: boolean
  createdAt: string
  updatedAt: string
}

export interface GetProviderDetailResponse {
  success: boolean
  message: string
  data: ProviderDetail
}

export function useGetProviderDetail(id: string) {
  return useQuery<GetProviderDetailResponse>({
    queryKey: ['provider', id],
    queryFn: async () => {
      const res = await apiClient.get<GetProviderDetailResponse>(`/user/provider/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export interface ProviderReviewUser {
  _id: string
  name: string
  profilePicture: { location?: string; url?: string } | null
}

export interface ProviderReview {
  _id: string
  reviewer: ProviderReviewUser
  receiver: ProviderReviewUser
  job: { _id: string; title: string; status: string }
  category: { _id: string; name: string; slug: string }
  stars: number
  description: string
  isOwn: boolean
  createdAt: string
}

export interface GetProviderReviewsResponse {
  success: boolean
  message: string
  data: {
    summary: {
      averageRating: number
      totalReviews: number
      distribution: Record<string, number>
    }
    reviews: ProviderReview[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
}

export function useGetProviderReviews(userId: string, page: number) {
  return useQuery<GetProviderReviewsResponse>({
    queryKey: ['provider-reviews', userId, page],
    queryFn: async () => {
      const res = await apiClient.get<GetProviderReviewsResponse>('/review', {
        params: { type: 'received', userId, page, limit: 6 },
      })
      return res.data
    },
    enabled: !!userId,
  })
}

export function useSubmitReview(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, { jobId: string; stars: number; description: string }>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, { jobId: string; stars: number; description: string }>({
    endpoint: '/review',
    method: 'POST',
    invalidateKeys: ['job'],
    mutationOptions: options,
  })
}

export function useCreateJob(
  options?: Parameters<typeof useApiMutation<CreateJobResponse, CreateJobVars>>[0]['mutationOptions']
) {
  return useApiMutation<CreateJobResponse, CreateJobVars>({
    endpoint: '/job/create',
    method: 'POST',
    isMultiPart: true,
    invalidateKeys: ['jobs', "notifications"],
    toBody: (vars) => {
      const fd = new FormData()
      fd.append('addressId', vars.addressId)
      fd.append('category', vars.category)
      fd.append('title', vars.title)
      fd.append('description', vars.description)
      fd.append('when', vars.when)
      fd.append('type', vars.type)
      fd.append('radius', String(vars.radius))
      fd.append('sendToAll', String(vars.sendToAll))
      if (vars.contactPreference) {
        vars.contactPreference.forEach((c) => fd.append('contactPreference', c))
      }
      if (!vars.sendToAll && vars.providerIds) {
        vars.providerIds.forEach((id) => fd.append('providerIds', id))
      }
      if (vars.images) {
        vars.images.forEach((img) => fd.append('images', img))
      }
      return fd
    },
    mutationOptions: options,
  })
}
