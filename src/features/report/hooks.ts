import { useApiMutation } from "@/hooks/api/use-api-mutation"
import { apiClient } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"

export interface ReportIssue {
  _id: string
  user: string
  role: string
  title: string
  description: string
  status: string
  reportedDate: string
  resolvedDate: string | null
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface GetReportIssuesResponse {
  success: boolean
  message: string
  data: {
    issues: ReportIssue[]
    pagination: Pagination
  }
}
export interface CreateReportIssueVars {
  title: string
  description: string
}

export function useGetReportIssues(params: { page: number; limit: number; status?: 'pending' | 'resolved' }) {
  return useQuery<GetReportIssuesResponse>({
    queryKey: ['report-issues', params],
    queryFn: async () => {
      const res = await apiClient.get<GetReportIssuesResponse>('/report-issue/my', { params })
      return res.data
    },
  })
}

export function useCreateReportIssue(
  options?: Parameters<typeof useApiMutation<{ success: boolean; message: string }, CreateReportIssueVars>>[0]['mutationOptions']
) {
  return useApiMutation<{ success: boolean; message: string }, CreateReportIssueVars>({
    endpoint: '/report-issue',
    method: 'POST',
    invalidateKeys: ['report-issues'],
    mutationOptions: options,
  })
}