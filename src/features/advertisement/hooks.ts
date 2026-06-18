import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

export interface AdvertisementMedia {
  _id: string
  fileName: string
  key: string
  mimetype: string
  location: string
  createdAt: string
  updatedAt: string
}

export interface Advertisement {
  _id: string
  link: string
  media: AdvertisementMedia
  duration: number
}

export interface GetAdFeedResponse {
  success: boolean
  message: string
  data: {
    advertisement: Advertisement
  }
}

export function useGetAdFeed(categoryId?: string) {
  return useQuery<GetAdFeedResponse>({
    queryKey: ['advertisement-feed', categoryId],
    queryFn: async () => {
      const url = categoryId 
        ? `/advertisement/feed?categoryId=${categoryId}` 
        : '/advertisement/feed';
      const res = await apiClient.get<GetAdFeedResponse>(url)
      return res.data
    },
  })
}
