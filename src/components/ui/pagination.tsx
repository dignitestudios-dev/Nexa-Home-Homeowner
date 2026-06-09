// components/ui/pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
//   if (totalPages <= 1) return null

  return (
    <div className="flex justify-end pt-2">
      <div className="flex items-center">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
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
       disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
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
  )
}