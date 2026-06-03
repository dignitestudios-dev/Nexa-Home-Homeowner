"use client";

import React from "react";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { removeToken } from "@/lib/cookies";
import { useGetOwnUser } from "@/features/user/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [{ href: "/dashboard", label: "Home" }];
const notifications = [
  {
    id: 1,
    title: "Title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique viverra blandit.",
    time: "7:30 PM",
    unread: true,
  },
  {
    id: 2,
    title: "Title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique viverra blandit.",
    time: "7:30 PM",
    unread: true,
  },
  {
    id: 3,
    title: "Title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique viverra blandit.",
    time: "7:30 PM",
  },
  {
    id: 4,
    title: "Title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique viverra blandit.",
    time: "7:30 PM",
  },
];
const menuItems = [
  { label: "View Profile", href: "/my-profile" },
  { label: "Settings", href: "/settings" },
  { label: "Log Out", href: "#" },
];

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const { data, isLoading } = useGetOwnUser();
  const user = data?.data;
  const displayName = user?.name || user?.email || "Profile";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full">
      <div className=" flex min-h-25 bg-white w-full  items-center justify-between rounded-b-4xl  px-6 py-5 relative z-30 sm:px-8 md:rounded-b-[45px] md:px-10 lg:px-20">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center"
          aria-label="NexaHome dashboard"
        >
          <img
            src="/images/nav-logo.png"
            alt="NexaHome"
            className="h-auto w-37.5 sm:w-42.5 md:w-45"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 md:gap-7">
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative inline-flex h-11 items-center text-sm font-semibold transition-colors sm:text-base",
                        isActive
                          ? "text-[#005864]"
                          : "text-[#5C6F72] hover:text-[#005864]",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                      {isActive ? (
                        <span className="absolute inset-x-0 -bottom-0.5 h-0.75 rounded-full bg-[#005864]" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#005864] transition hover:bg-[#EAF0F0]"
                aria-label="Notifications"
              >
                <Bell className="size-5" strokeWidth={1.8} />

                <span className="absolute right-[8px] top-[8px] flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-medium text-white">
                  2
                </span>
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

                  <button className="text-[13px] font-semibold text-[#005864] underline">
                    Clear All
                  </button>
                </div>

                {/* List */}
                <div className="max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="relative border-b border-[#E4E4E4] py-4"
                    >
                      <div className="mb-2 flex justify-between">
                        <h3 className="text-[13px] font-bold text-[#787F8C]">
                          {item.title}
                        </h3>

                        <span className="text-[12px] font-medium text-[#717171]">
                          {item.time}
                        </span>
                      </div>

                      <p className="max-w-[400px] text-[13px] leading-4 text-[rgba(24,24,24,0.5)]">
                        {item.description}
                      </p>

                      {item.unread && (
                        <div className="absolute right-0 top-[50px] flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#FF0000] text-[11px] text-white">
                          1
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {isLoading ? (
            <div className="flex items-center gap-3 h-11 pr-1 select-none animate-pulse">
              <div className="h-11 w-11 rounded-full bg-slate-200" />
              <div className="hidden h-5 w-20 rounded bg-slate-200 sm:inline-block" />
              <div className="hidden h-4 w-4 rounded bg-slate-200 sm:inline-block" />
            </div>
          ) : (
            <DropdownMenu onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-3 rounded-full pr-1 text-left transition-colors hover:bg-slate-50 outline-none"
                >
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#DDEDEF] text-sm font-semibold text-[#16484D] shadow-sm">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture?.location}
                        alt={displayName}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </span>
                  <span className="hidden text-base truncate font-medium tracking-[-0.018em] text-[#181818] sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown
                    className="hidden size-4 text-[#181818] transition-transform duration-200 group-data-[state=open]:rotate-180 sm:inline"
                    strokeWidth={1.8}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                {menuItems.map((item, index) => {
                  if (item.label === "Log Out") {
                    return (
                      <React.Fragment key={item.label}>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          {item.label}
                        </DropdownMenuItem>
                      </React.Fragment>
                    );
                  }
                  return (
                    <React.Fragment key={item.label}>
                      {index > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuItem asChild>
                        <Link href={item.href} className="cursor-pointer">
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    </React.Fragment>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
