import { useApiMutation } from "@/hooks/api/use-api-mutation"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

// User settings shape — add provider keys if needed later
export interface UserSettings {
  newJobPosted: boolean
  // jobMatchesCategory: boolean
  // expertSelected: boolean
  // newReviewReceived: boolean
}

export interface GetSettingsResponse {
  success: boolean
  message: string
  data: {
    _id: string
    notifications: UserSettings
  }
}

export interface ToggleSettingsVars {
  newJobPosted?: boolean
  // jobMatchesCategory?: boolean
  // expertSelected?: boolean
  // newReviewReceived?: boolean
}

export function useGetSettings() {
  return useQuery<GetSettingsResponse>({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await apiClient.get<GetSettingsResponse>('/settings')
      return res.data
    },
  })
}

export function useToggleSettings(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, ToggleSettingsVars>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, ToggleSettingsVars>({
    endpoint: '/settings',
    method: 'PATCH',
    invalidateKeys: ['settings'],
    mutationOptions: options,
  })
}