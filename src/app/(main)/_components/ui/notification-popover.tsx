"use client";

import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import {
  useGetNotifications,
  useGetNotificationsCount,
  useMarkNotificationRead,
  useClearAllNotifications,
} from "@/features/notifcations/hooks";

export default function NotificationsPopover() {
  const { data: notificationsData } = useGetNotifications();
  const { data: countData } = useGetNotificationsCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: clearAll, isPending: isClearing } = useClearAllNotifications();

  const notifications = notificationsData?.data?.notifications ?? [];
  const unreadCount = countData?.data?.count ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#005864] transition hover:bg-[#EAF0F0]"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="absolute right-[4px] top-[2px] flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[508px] rounded-[8px] border-0 outline-none bg-white p-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="px-[23px] py-[19px]">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#181818]">
              Notifications
            </h2>
            <button
              onClick={() => clearAll()}
              disabled={isClearing || notifications.length === 0}
              className="text-[13px] font-semibold text-[#005864] underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </button>
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[rgba(24,24,24,0.4)]">
                No notifications
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    if (!item.isRead) markRead({ id: item._id });
                  }}
                  className="relative border-b border-[#E4E4E4] py-4 cursor-pointer"
                >
                  <div className="mb-2 flex justify-between">
                    <h3 className="text-[13px] font-bold text-[#787F8C]">
                      {item.title}
                    </h3>
                    <span className="text-[12px] font-medium text-[#717171]">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="max-w-[400px] text-[13px] leading-4 text-[rgba(24,24,24,0.5)]">
                    {item.body}
                  </p>

                  {!item.isRead && (
                    <div className="absolute right-0 top-[50px] flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#FF0000] text-[11px] text-white">
                      1
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}