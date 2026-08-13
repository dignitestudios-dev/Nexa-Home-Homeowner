"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleSettingsVars, useGetSettings, useToggleSettings } from "@/features/settings/hooks"
import { toast } from "sonner"

interface SettingItemConfig {
  id: "job" | "review" | "engagement"
  label: string
  description: string
  apiKeys: string[]
  patchKey: string
}

const SETTING_ITEMS: SettingItemConfig[] = [
  {
    id: "job",
    label: "Job Notifications",
    description:
      "Receive notifications when an expert purchases your job request or when it's time to confirm an expert.",
    apiKeys: ["job", "jobNotifications", "newJobPosted"],
    patchKey: "job",
  },
  {
    id: "review",
    label: "Review Notifications",
    description:
      "Get reminders to leave a review—your feedback helps other homeowners make informed decisions.",
    apiKeys: ["review", "reviewNotifications", "newReviewReceived"],
    patchKey: "review",
  },
  {
    id: "engagement",
    label: "Engagement Notifications",
    description:
      "Stay up to date with the latest news, features, and important updates.",
    apiKeys: ["engagement", "engagementNotifications"],
    patchKey: "engagement",
  },
]

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={
        "relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none " +
        (checked ? "bg-[#005864]" : "bg-[#D9D9D9]") +
        (disabled ? " opacity-50 cursor-not-allowed" : "")
      }
    >
      <span
        className={
          "inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out " +
          (checked ? "translate-x-[24px]" : "translate-x-[4px]")
        }
      />
    </button>
  )
}

function SettingRowSkeleton() {
  return (
    <div className="flex items-start justify-between gap-6 py-6">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-44 rounded-md" />
        <Skeleton className="h-4 w-full max-w-[500px] rounded-md" />
      </div>
      <Skeleton className="h-8 w-[52px] rounded-full shrink-0" />
    </div>
  )
}

export default function Notifications() {
  const { data, isLoading, isError, refetch } = useGetSettings()
  const { mutate: toggleSetting, isPending } = useToggleSettings()

  const rawNotifications = data?.data?.notifications as Record<string, unknown> | undefined

  const isItemChecked = (item: SettingItemConfig): boolean => {
    if (!rawNotifications) return true
    for (const key of item.apiKeys) {
      if (rawNotifications[key] !== undefined) {
        const val = rawNotifications[key]
        if (typeof val === "boolean") return val
        if (typeof val === "string") return val.toLowerCase() === "true" || val === "1"
        if (typeof val === "number") return val === 1
      }
    }
    return true
  }

  const handleToggle = (item: SettingItemConfig) => {
    const current = isItemChecked(item)
    const next = !current
    const payload: ToggleSettingsVars = {
      [item.patchKey]: next,
      ...(item.id === "job" ? { jobNotifications: next, newJobPosted: next } : {}),
      ...(item.id === "review" ? { reviewNotifications: next, newReviewReceived: next } : {}),
      ...(item.id === "engagement" ? { engagementNotifications: next } : {}),
    }

    toggleSetting(payload, {
      onError: () => {
        toast.error("Failed to update notification settings. Please try again.")
      },
    })
  }

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-[#181818]">
        Notifications
      </h2>

      <div className="divide-y divide-[#EFEFEF]">
        {isLoading ? (
          SETTING_ITEMS.map((item) => <SettingRowSkeleton key={item.id} />)
        ) : isError ? (
          <div className="py-6">
            <p className="text-sm text-[rgba(24,24,24,0.6)]">
              Failed to load notification settings.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-semibold text-[#005864] underline hover:opacity-80"
            >
              Try again
            </button>
          </div>
        ) : (
          SETTING_ITEMS.map((item) => {
            const checked = isItemChecked(item)
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-6 py-6 first:pt-2"
              >
                <div className="max-w-[620px]">
                  <h3 className="text-[18px] font-bold text-[#181818] leading-[24px]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-[15px] font-normal leading-[22px] text-[#565656]">
                    {item.description}
                  </p>
                </div>
                <div className="pt-0.5 shrink-0">
                  <Toggle
                    checked={checked}
                    onChange={() => handleToggle(item)}
                    disabled={isPending}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}