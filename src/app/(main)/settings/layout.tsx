"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  MapPin,
  Mail,
  Phone,
  Shield,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetOwnUser } from "@/features/user/hooks";

const menuItems = [
  { label: "Notifications", icon: Bell, href: "/settings/notifications" },
  { label: "Email Address", icon: Mail, href: "/settings/email" },
  { label: "Change Phone Number", icon: Phone, href: "/settings/change-phone" },
  { label: "Address", icon: MapPin, href: "/settings/address" },
  { label: "Report An Issue", icon: AlertTriangle, href: "/settings/report-issue" },
  // { label: "Report An Issue - 2", icon: AlertTriangle, href: "/settings/report-issue-2" },
  { label: "Delete Account", icon: Trash2, href: "/settings/delete-account" },
  { label: "Terms And Conditions", icon: FileText, href: "/settings/terms" },
  { label: "Privacy Policy", icon: Shield, href: "/settings/privacy" },
  { label: "Refund Policy", icon: CreditCard, href: "/settings/refund" },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data , isLoading } = useGetOwnUser()
  const filteredMenuItems = menuItems.filter((item) => {
  if (
    item.href === "/settings/email" &&
    data?.data?.authType !== "jwt"
  ) {
    return false
  }

  return true
})

  return (
    <div className="min-h-screen bg-[#EFF4F4] px-6 pb-16 pt-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Settings</h1>
        </div>

        <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-[24px] bg-white p-4 shadow-sm">
            <nav className="space-y-4">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}  
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-base font-medium transition-colors",
                      isActive
                        ? "bg-[#005864] text-white"
                        : "bg-[#F9F9F9] text-[#181818] hover:bg-[#eef4f4]"
                    )}
                  >
                    <Icon
                      className={cn("size-5 shrink-0", isActive ? "text-white" : "text-[#181818]")}
                      strokeWidth={1.8}
                    />
                    {item.label}
                    <ChevronRight className="size-4 ml-auto " strokeWidth={1.8} />
                  </Link>
                )
              })}
            </nav>
          </aside>

          <section className="rounded-[24px] bg-white p-6 shadow-sm">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
