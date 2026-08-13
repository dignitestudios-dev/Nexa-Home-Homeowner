import { useApiMutation } from "@/hooks/api/use-api-mutation"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

// User settings shape
export interface UserSettings {
  job?: boolean
  jobNotifications?: boolean
  newJobPosted?: boolean
  review?: boolean
  reviewNotifications?: boolean
  newReviewReceived?: boolean
  engagement?: boolean
  engagementNotifications?: boolean
  [key: string]: boolean | undefined
}

export interface GetSettingsResponse {
  success: boolean
  message: string
  data: {
    _id: string
    notifications: UserSettings
  }
}

export type ToggleSettingsVars = Partial<UserSettings>

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