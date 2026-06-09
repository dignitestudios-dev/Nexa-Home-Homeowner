"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import {
  useGetNotifications,
  useGetNotificationsCount,
  useMarkNotificationRead,
  useClearAllNotifications,
  type Notification,
} from "@/features/notifications/hooks";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { NotificationItem } from "./notification-item";

function getNotificationRoute(notification: Notification): string | null {
  const { type, _id } = notification.metadata;
  if (type === "job") return `/service-details/${_id}`;
  return null;
}

export default function NotificationsPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetNotifications();

  const { data: countData } = useGetNotificationsCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: clearAll, isPending: isClearing } = useClearAllNotifications();

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = countData?.data?.count ?? 0;

  // Returns an onScroll handler — fires fetchNextPage when near the bottom
  const handleScroll = useInfiniteScroll({ hasNextPage: !!hasNextPage, isFetchingNextPage, fetchNextPage })

  const handleNotificationClick = (item: Notification) => {
    if (!item.isRead) markRead({ id: item.id });
    setOpen(false);
    const route = getNotificationRoute(item);
    if (route) router.push(route);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              className="text-[13px] font-semibold text-[#005864] underline disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </button>
          </div>

          {/* Scrollable list — onScroll drives pagination */}
          <div
            onScroll={handleScroll}
            className="max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Initial load */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="size-5 animate-spin text-[#005864]" />
              </div>
            )}

            {/* Empty state */}
            {!isLoading && notifications.length === 0 && (
              <p className="py-8 text-center text-[13px] text-[rgba(24,24,24,0.4)]">
                No notifications
              </p>
            )}

            {/* Notification rows */}
            {notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                hasRoute={!!getNotificationRoute(item)}
                onClick={handleNotificationClick}
              />
            ))}

            {/* Next page loading indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Loader2 className="size-4 animate-spin text-[#005864]" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage && notifications.length > 0 && (
              <p className="py-3 text-center text-[12px] text-[rgba(24,24,24,0.3)]">
                You're all caught up
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}