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

export function useGetAdFeed() {
  return useQuery<GetAdFeedResponse>({
    queryKey: ['advertisement-feed'],
    queryFn: async () => {
      const res = await apiClient.get<GetAdFeedResponse>('/advertisement/feed')
      return res.data
    },
  })
}
