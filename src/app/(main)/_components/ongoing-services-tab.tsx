'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetJobs } from '@/features/user/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import ServiceCard from './ui/service-card'

type Props = {
  tab: JobTab
}

const LIMIT = 12

export default function OnGoingServicesTab({ tab }: Props) {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetJobs({ tab, page, limit: LIMIT })

  const jobs = data?.data?.jobs ?? []
  const pagination = data?.data?.pagination
  const totalPages = pagination?.totalPages ?? 1

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative w-[396px] h-[168px] rounded-[12px] bg-[#F8F8F8] p-4">
            <Skeleton className="absolute right-2 top-2 h-[34px] w-[100px] rounded-full" />
            <Skeleton className="h-5 w-2/3 mt-1" />
            <Skeleton className="h-4 w-full mt-3" />
            <Skeleton className="h-4 w-4/5 mt-2" />
            <div className="absolute bottom-[10px] left-1/2 flex h-[58px] w-[380px] -translate-x-1/2 items-center rounded-[12px] bg-[rgba(0,88,100,0.06)] px-6 gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-[#181818]">No {tab} jobs found.</p>
        <p className="mt-1 text-sm text-[rgba(24,24,24,0.5)]">Your {tab} services will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <ServiceCard
            key={job._id}
            id={job._id}
            serviceName={job.title}
            description={job.description}
            status={tab === 'ongoing' ? 'Ongoing' : 'Completed'}
            postedDate={new Date(job.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
            actionText={job.applyCount > 0 ? job.userDisplayTag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Awaiting Response'}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <div className="flex items-center">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={cn(
                'inline-flex h-12 w-12 z-20 items-center justify-center rounded-full transition-colors',
                page === 1
                  ? 'bg-[#0058640F] text-[#005864]/40 cursor-not-allowed'
                  : 'bg-[#005864] text-white hover:bg-[#004d57]'
              )}
            >
              <ChevronLeft size={30} strokeWidth={2.5} />
            </button>
            <div className="inline-flex h-12 items-center justify-center bg-[#F9FAFA] px-6 text-base -mx-4 font-bold text-[#181818] border border-slate-100 min-w-[54px]">
              {page.toString().padStart(2, '0')}
            </div>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={cn(
                'inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                page === totalPages
                  ? 'bg-[#005864]/5 text-[#005864]/40 cursor-not-allowed'
                  : 'bg-[#005864] text-white hover:bg-[#004d57]'
              )}
            >
              <ChevronRight size={30} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
