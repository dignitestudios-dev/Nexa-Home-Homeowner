// hooks/use-infinite-scroll.ts
import { useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  // how close to the bottom (in px) before triggering — default 100
  threshold?: number
}

/**
 * Returns an onScroll handler to attach to a scrollable container.
 * When the user scrolls within `threshold` px of the bottom, fetches the next page.
 *
 * Usage:
 *   const handleScroll = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage })
 *   <div onScroll={handleScroll} style={{ overflowY: 'auto' }}>...</div>
 */
export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 100,
}: UseInfiniteScrollOptions) {
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      if (distanceFromBottom < threshold && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]
  )

  return handleScroll
}