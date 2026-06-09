// features/notifications/notification-item.tsx
import { Notification } from '@/features/notifications/hooks'
import { formatDistanceToNow } from 'date-fns'


interface NotificationItemProps {
  item: Notification
  hasRoute: boolean
  onClick: (item: Notification) => void
}

export function NotificationItem({ item, hasRoute, onClick }: NotificationItemProps) {
  return (
    <div
      onClick={() => onClick(item)}
      className={`relative border-b border-[#E4E4E4] py-4 ${
        hasRoute ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="mb-2 flex justify-between">
        <h3 className="text-[13px] font-bold text-[#787F8C]">
          {item.title}
        </h3>
        <span className="ml-4 shrink-0 text-[12px] font-medium text-[#717171]">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </span>
      </div>

      <p className="max-w-[400px] text-[13px] leading-4 text-[rgba(24,24,24,0.5)]">
        {item.description}
      </p>

      {!item.isRead && (
        <div className="absolute right-0 top-[50px] flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#FF0000] text-[11px] text-white">
          1
        </div>
      )}
    </div>
  )
}