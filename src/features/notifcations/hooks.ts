import { useApiMutation } from "@/hooks/api/use-api-mutation"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

export interface Notification {
  _id: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

export interface GetNotificationsResponse {
  success: boolean
  message: string
  data: {
    notifications: Notification[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
    }
  }
}

export interface GetNotificationsCountResponse {
  success: boolean
  message: string
  data: { count: number }
}

export function useGetNotifications() {
  return useQuery<GetNotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await apiClient.get<GetNotificationsResponse>('/notification/me')
      return res.data
    },
  })
}

export function useGetNotificationsCount() {
  return useQuery<GetNotificationsCountResponse>({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const res = await apiClient.get<GetNotificationsCountResponse>('/notification/count')
      return res.data
    },
  })
}

export function useMarkNotificationRead(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, { id: string }>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, { id: string }>({
    endpoint: '/notification/read',
    method: 'PATCH',
    invalidateKeys: ['notifications', 'notifications-count'],
    toBody: ({ id }) => ({ id }),
    mutationOptions: options,
  })
}

export function useMarkAllNotificationsRead(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, void>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, void>({
    endpoint: '/notification/all',
    method: 'PATCH',
    invalidateKeys: ['notifications', 'notifications-count'],
    mutationOptions: options,
  })
}

export function useClearAllNotifications(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, void>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, void>({
    endpoint: '/notification/clear',
    method: 'DELETE',
    invalidateKeys: ['notifications', 'notifications-count'],
    mutationOptions: options,
  })
}

export function useDeleteNotification(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, { id: string }>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, { id: string }>({
    endpoint: (vars) => `/notification/${vars.id}/delete`,
    method: 'DELETE',
    invalidateKeys: ['notifications', 'notifications-count'],
    mutationOptions: options,
  })
}