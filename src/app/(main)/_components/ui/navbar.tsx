"use client"

import Image from "next/image"
import Link from "next/link"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    active: true,
  },
]

const menuItems = [
  {
    icon: User,
    label: "View Profile",
    href: "#",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
  },
  {
    icon: LogOut,
    label: "Log Out",
    href: "#",
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="w-full ">
      <div className=" flex min-h-[100px] bg-white w-full  items-center justify-between rounded-b-[32px]  px-6 py-5 relative z-30 sm:px-8 md:rounded-b-[45px] md:px-10 lg:px-20">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center"
          aria-label="NexaHome dashboard"
        >
          <Image
            src="/images/nav-logo.png"
            alt="NexaHome"
            width={180}
            height={45}
            priority
            className="h-auto w-[150px] sm:w-[170px] md:w-[180px]"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 md:gap-7">
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex h-11 items-center text-sm font-semibold transition-colors sm:text-base",
                      item.active ? "text-[#005864]" : "text-[#5C6F72] hover:text-[#005864]"
                    )}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {item.label}
                    {item.active ? (
                      <span className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-[#005864]" />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full text-[#005864] hover:bg-[#EAF0F0] hover:text-[#005864]"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.8} />
          </Button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="group flex items-center gap-3 rounded-full pr-1 text-left transition-colors hover:bg-slate-50"
            >
              <span className="flex size-[46px] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#9C623D_0%,#E8C39C_48%,#70452A_100%)] text-sm font-semibold text-white shadow-sm">
                RC
              </span>
              <span className="hidden text-base font-medium tracking-[-0.018em] text-[#181818] sm:inline">
                Rayan Cooper
              </span>
              <ChevronDown className="hidden size-4 text-[#181818] transition-transform duration-200 group-hover:rotate-180 sm:inline" strokeWidth={1.8} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-slate-50",
                        item.label === "Log Out" ? "border-t border-slate-200 text-red-600 hover:bg-red-50" : "text-[#181818]"
                      )}
                    >
                      <Icon className="size-4" strokeWidth={1.8} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

